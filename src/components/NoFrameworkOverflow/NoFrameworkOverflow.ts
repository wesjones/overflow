import {
  OverflowController,
  type OverflowHost,
  type ScanResult,
  type ScannedItem,
  type ScannedMenu,
} from '../Overflow/OverflowController';

export interface OverflowToolbarOptions {
  compact?: boolean;
  reverse?: boolean;
  snap?: boolean;
}

export class OverflowToolbar implements OverflowHost {
  private ul: HTMLUListElement;
  private compact: boolean;
  private reverse: boolean;
  private snap: boolean;
  private controller: OverflowController;

  constructor(ul: HTMLUListElement, opts: OverflowToolbarOptions = {}) {
    this.ul = ul;
    this.compact = opts.compact ?? false;
    this.reverse = opts.reverse ?? false;
    this.snap = opts.snap ?? false;

    this.ul.classList.add('overflow');
    if (this.compact) this.ul.classList.add('overflow-compact');
    if (this.reverse) this.ul.classList.add('overflow-reverse');
    if (this.snap) this.ul.classList.add('overflow-snap');

    this.controller = new OverflowController(this);
    this.controller.connect();
  }

  /** Re-scan after external DOM changes and restart the observer. */
  update(): void {
    this.controller.update();
  }

  /** Tear down ResizeObserver and clean up DOM state. */
  destroy(): void {
    this.controller.disconnect();
    this.ul.classList.remove('overflow', 'overflow-compact', 'overflow-reverse', 'overflow-snap');
  }

  /* ── OverflowHost ─────────────────────────────────────── */

  getContainerEl(): HTMLElement {
    return this.ul;
  }

  isCompact(): boolean {
    return this.compact;
  }

  isReverse(): boolean {
    return this.reverse;
  }

  isSnap(): boolean {
    return this.snap;
  }

  scanChildren(): ScanResult {
    const items: ScannedItem[] = [];
    let menu: ScannedMenu | null = null;
    let menuIndex = -1;
    let firstItemIndex = -1;
    let index = 0;

    for (const child of Array.from(this.ul.children) as HTMLElement[]) {
      const role = child.dataset.overflowRole as 'item' | 'menu' | undefined;
      if (!role) continue;

      if (role === 'item') {
        if (firstItemIndex === -1) firstItemIndex = index;
        items.push({
          el: child,
          buttonEl: child.querySelector('button'),
          menuId: child.dataset.menuId || undefined,
          minStateWidth: child.dataset.minStateWidth || undefined,
        });
      }

      if (role === 'menu') {
        menuIndex = index;
        const trigger = child.querySelector<HTMLElement>('[data-menu-trigger]');
        const panel = child.querySelector<HTMLElement>('[data-menu-panel]');

        if (trigger && panel) {
          child.classList.add('overflow-opener');
          panel.setAttribute('popover', '');
          this.setupPopover(trigger, panel);

          const menuItemEls = Array.from(panel.children) as HTMLElement[];
          const inMenuIds = new Set<string>();
          let hasMenuOnlyItems = false;
          for (const mi of menuItemEls) {
            const mid = mi.dataset.menuId;
            if (mid) {
              inMenuIds.add(mid);
            } else {
              hasMenuOnlyItems = true;
            }
          }

          menu = {
            el: child,
            triggerEl: trigger,
            menuItemEls,
            inMenuIds,
            hasMenuOnlyItems,
          };
        }
      }

      index++;
    }

    const menuFirst =
      menuIndex !== -1 && (firstItemIndex === -1 || menuIndex < firstItemIndex);

    return { items, menu, menuFirst };
  }

  private setupPopover(trigger: HTMLElement, panel: HTMLElement): void {
    trigger.addEventListener('click', () => {
      if (panel.matches(':popover-open')) {
        panel.hidePopover();
      } else {
        const rect = trigger.getBoundingClientRect();
        panel.style.position = 'fixed';
        panel.style.top = `${rect.bottom + 4}px`;
        panel.style.left = `${rect.left}px`;
        panel.style.margin = '0';
        panel.showPopover();
      }
    });
  }
}
