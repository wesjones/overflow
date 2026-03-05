import {
  type AppliedStep,
  type Step,
  buildOrderedSteps,
  computeNextSteps,
  deriveHiddenMap,
} from './overflowSteps';

/* ── Public types ───────────────────────────────────────── */

export interface ScannedItem {
  el: HTMLElement;
  buttonEl: HTMLElement | null;
  menuid: string | undefined;
  minStateWidth: string | undefined;
}

export interface ScannedMenu {
  el: HTMLElement;
  triggerEl: HTMLElement;
  menuItemEls: HTMLElement[];
  inMenuIds: Set<string>;
  hasMenuOnlyItems: boolean;
}

export interface ScanResult {
  items: ScannedItem[];
  menu: ScannedMenu | null;
  /** true when the menu appears before items in DOM order */
  menuFirst: boolean;
}

export interface OverflowHost {
  getContainerEl(): HTMLElement;
  scanChildren(): ScanResult;
  isCompact(): boolean;
  isReverse(): boolean;
}

/* ── Shared style constants (kebab-case for setProperty) ── */

const MIN_STATE_STYLES: Record<string, string> = {
  'font-size': '0',
  'min-width': '100%',
  'width': '100%',
  'max-width': '100%',
  'align-items': 'center',
  'justify-content': 'center',
  'gap': '0',
};

const MIN_STATE_KEYS = Object.keys(MIN_STATE_STYLES);

const CORNER_PROPS = [
  'border-top-left-radius',
  'border-bottom-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
] as const;

/* ── Controller ─────────────────────────────────────────── */

export class OverflowController {
  private host: OverflowHost;
  private orderedSteps: Step[] = [];
  private appliedSteps: AppliedStep[] = [];
  private ro: ResizeObserver | null = null;
  private lastScan: ScanResult = { items: [], menu: null, menuFirst: false };

  constructor(host: OverflowHost) {
    this.host = host;
  }

  /** Start observing (call after DOM is ready). */
  connect(): void {
    this.scan();
    this.startObserver();
  }

  /** Stop observing and clear all applied state. */
  disconnect(): void {
    this.ro?.disconnect();
    this.ro = null;
    this.clearState();
  }

  /** Re-scan children + restart (call after external DOM changes). */
  update(): void {
    this.appliedSteps = [];
    this.scan();
    this.startObserver();
  }

  /* ── Private ──────────────────────────────────────────── */

  private scan(): void {
    this.lastScan = this.host.scanChildren();

    const menuIds: string[] = [];
    const minWidthMenuIds = new Set<string>();

    for (const item of this.lastScan.items) {
      if (item.menuid) {
        menuIds.push(item.menuid);
        if (item.minStateWidth) minWidthMenuIds.add(item.menuid);
      }
    }

    const inMenuIds = this.lastScan.menu?.inMenuIds ?? new Set<string>();
    const isReverse = this.host.isReverse();
    const ids = isReverse ? [...menuIds].reverse() : menuIds;
    this.orderedSteps = buildOrderedSteps(ids, inMenuIds, minWidthMenuIds);
  }

  private startObserver(): void {
    this.ro?.disconnect();
    const container = this.host.getContainerEl();
    this.ro = new ResizeObserver(() => this.onResize());
    this.ro.observe(container);
    this.onResize();
    this.applyState();
  }

  private onResize(): void {
    const container = this.host.getContainerEl();

    // Loop until stable — each applyState() mutates the DOM synchronously,
    // so the next iteration gets updated dimensions.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { scrollWidth, clientWidth } = container;
      const next = computeNextSteps(
        this.appliedSteps,
        scrollWidth,
        clientWidth,
        this.orderedSteps,
      );
      if (next === this.appliedSteps) break;
      this.appliedSteps = next;
      this.applyState();
    }
  }

  private applyState(): void {
    const hiddenMap = deriveHiddenMap(this.appliedSteps);
    const container = this.host.getContainerEl();
    container.style.setProperty('--hiddenCount', String(this.appliedSteps.length));

    const isCompact = this.host.isCompact();
    const isReverse = this.host.isReverse();

    let anyFullyHidden = false;
    const visibleItems: ScannedItem[] = [];

    // Apply item states
    for (const item of this.lastScan.items) {
      const state = item.menuid
        ? (hiddenMap.get(item.menuid) ?? 'visible')
        : 'visible';

      item.el.setAttribute('data-state', state);

      if (state === 'visible') {
        item.el.style.removeProperty('display');
        item.el.style.removeProperty('max-width');
        item.el.style.removeProperty('overflow');
        this.clearMinStyles(item.buttonEl);
        visibleItems.push(item);
      } else if (state === 'min') {
        item.el.style.removeProperty('display');
        item.el.style.setProperty('max-width', item.minStateWidth ?? '2.25rem');
        item.el.style.setProperty('overflow', 'hidden');
        this.applyMinStyles(item.buttonEl);
        visibleItems.push(item);
      } else {
        // hidden
        item.el.style.setProperty('display', 'none');
        item.el.style.removeProperty('max-width');
        item.el.style.removeProperty('overflow');
        this.clearMinStyles(item.buttonEl);
        anyFullyHidden = true;
      }
    }

    // Menu
    const { menu, menuFirst } = this.lastScan;
    const menuVisible = this.applyMenuState(menu, hiddenMap, anyFullyHidden);

    // Compact corners
    this.applyCompactCorners(
      visibleItems, menu, menuFirst, menuVisible, isCompact, isReverse,
    );
  }

  private applyMenuState(
    menu: ScannedMenu | null,
    hiddenMap: Map<string, 'min' | 'hidden'>,
    anyFullyHidden: boolean,
  ): boolean {
    if (!menu) return false;

    const showOpener = anyFullyHidden || menu.hasMenuOnlyItems;
    menu.el.style.setProperty('display', showOpener ? '' : 'none');
    menu.el.setAttribute('data-state', showOpener ? 'visible' : 'hidden');

    // Opener trigger styles (icon-only display)
    if (showOpener) {
      this.applyMinStyles(menu.triggerEl);
    } else {
      this.clearMinStyles(menu.triggerEl);
    }

    // Show/hide individual menu items
    for (const mi of menu.menuItemEls) {
      const mid = mi.getAttribute('menuid') ?? mi.dataset.menuid;
      if (!mid) {
        // Menu-only item — always visible
        mi.style.removeProperty('display');
      } else if (hiddenMap.get(mid) === 'hidden') {
        mi.style.removeProperty('display');
      } else {
        mi.style.setProperty('display', 'none');
      }
    }

    return showOpener;
  }

  private applyCompactCorners(
    visibleItems: ScannedItem[],
    menu: ScannedMenu | null,
    menuFirst: boolean,
    menuVisible: boolean,
    isCompact: boolean,
    isReverse: boolean,
  ): void {
    for (let i = 0; i < visibleItems.length; i++) {
      const btn = visibleItems[i].buttonEl;
      if (!btn) continue;

      const isFirst = i === 0;
      const isLast = i === visibleItems.length - 1;

      // Determine adjacency based on menu position
      const hasPrev = menuFirst
        ? (!isFirst || menuVisible)
        : !isFirst;
      const hasNext = menuFirst
        ? !isLast
        : (!isLast || menuVisible);

      // Normal (row): prev = left, next = right
      // Reverse (row-reverse): prev = right, next = left
      this.setCorners(btn,
        isCompact && (isReverse ? hasNext : hasPrev),
        isCompact && (isReverse ? hasPrev : hasNext),
      );
    }

    // Menu trigger corners
    if (menu?.triggerEl) {
      const hasAdjacentItem = menuVisible && visibleItems.length > 0;

      if (menuFirst) {
        // Menu first in DOM → left in normal, right in reverse
        this.setCorners(menu.triggerEl,
          isCompact && hasAdjacentItem && isReverse,
          isCompact && hasAdjacentItem && !isReverse,
        );
      } else {
        // Menu last in DOM → right in normal, left in reverse
        this.setCorners(menu.triggerEl,
          isCompact && hasAdjacentItem && !isReverse,
          isCompact && hasAdjacentItem && isReverse,
        );
      }
    }
  }

  private setCorners(
    el: HTMLElement,
    squareLeft: boolean,
    squareRight: boolean,
  ): void {
    el.style.borderTopLeftRadius = squareLeft ? '0' : '';
    el.style.borderBottomLeftRadius = squareLeft ? '0' : '';
    el.style.borderTopRightRadius = squareRight ? '0' : '';
    el.style.borderBottomRightRadius = squareRight ? '0' : '';
  }

  private applyMinStyles(el: HTMLElement | null): void {
    if (!el) return;
    for (const key of MIN_STATE_KEYS) {
      el.style.setProperty(key, MIN_STATE_STYLES[key]);
    }
  }

  private clearMinStyles(el: HTMLElement | null): void {
    if (!el) return;
    for (const key of MIN_STATE_KEYS) {
      el.style.removeProperty(key);
    }
  }

  private clearState(): void {
    const container = this.host.getContainerEl();
    container.style.removeProperty('--hiddenCount');

    for (const item of this.lastScan.items) {
      item.el.removeAttribute('data-state');
      item.el.style.removeProperty('display');
      item.el.style.removeProperty('max-width');
      item.el.style.removeProperty('overflow');
      this.clearMinStyles(item.buttonEl);
      if (item.buttonEl) {
        for (const prop of CORNER_PROPS) {
          item.buttonEl.style.removeProperty(prop);
        }
      }
    }

    const menu = this.lastScan.menu;
    if (menu) {
      menu.el.removeAttribute('data-state');
      menu.el.style.removeProperty('display');
      this.clearMinStyles(menu.triggerEl);
      for (const prop of CORNER_PROPS) {
        menu.triggerEl.style.removeProperty(prop);
      }
      for (const mi of menu.menuItemEls) {
        mi.style.removeProperty('display');
      }
    }
  }
}
