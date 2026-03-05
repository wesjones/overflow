// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  OverflowController,
  type OverflowHost,
  type ScanResult,
  type ScannedItem,
  type ScannedMenu,
} from './OverflowController';

/* ── Helpers ─────────────────────────────────────────────── */

/** Minimal element-like object that satisfies the controller's DOM API. */
function el(tag = 'li'): HTMLElement {
  const element = document.createElement(tag);
  return element;
}

function mockItem(
  menuid?: string,
  minStateWidth?: string,
): ScannedItem {
  const itemEl = el('li');
  const buttonEl = el('button');
  itemEl.appendChild(buttonEl);
  return { el: itemEl, buttonEl, menuid, minStateWidth };
}

function mockMenu(
  inMenuIds: string[],
  hasMenuOnlyItems = false,
): ScannedMenu {
  const menuEl = el('li');
  const triggerEl = el('button');
  const menuItemEls = inMenuIds.map((id) => {
    const mi = el('div');
    mi.dataset.menuid = id;
    return mi;
  });
  if (hasMenuOnlyItems) {
    menuItemEls.push(el('div')); // no menuid = menu-only
  }
  return {
    el: menuEl,
    triggerEl,
    menuItemEls,
    inMenuIds: new Set(inMenuIds),
    hasMenuOnlyItems,
  };
}

/** Create a mock OverflowHost with controllable container dimensions. */
function createHost(opts: {
  items?: ScannedItem[];
  menu?: ScannedMenu | null;
  menuFirst?: boolean;
  compact?: boolean;
  reverse?: boolean;
  scrollWidth?: number | (() => number);
  clientWidth?: number;
}): OverflowHost & {
  container: HTMLElement;
  setDimensions(sw: number | (() => number), cw: number): void;
  scanResult: ScanResult;
} {
  const container = el('ul');
  let scrollWidth = opts.scrollWidth ?? 500;
  let clientWidth = opts.clientWidth ?? 500;

  // Override readonly properties
  Object.defineProperty(container, 'scrollWidth', {
    get: () => typeof scrollWidth === 'function' ? scrollWidth() : scrollWidth,
    configurable: true,
  });
  Object.defineProperty(container, 'clientWidth', {
    get: () => clientWidth,
    configurable: true,
  });

  const scanResult: ScanResult = {
    items: opts.items ?? [],
    menu: opts.menu ?? null,
    menuFirst: opts.menuFirst ?? false,
  };

  return {
    container,
    scanResult,
    getContainerEl: () => container,
    scanChildren: () => scanResult,
    isCompact: () => opts.compact ?? false,
    isReverse: () => opts.reverse ?? false,
    setDimensions(sw: number | (() => number), cw: number) {
      scrollWidth = sw;
      clientWidth = cw;
    },
  };
}

/* ── Mock ResizeObserver ─────────────────────────────────── */

let observedElements: Set<Element>;

class MockResizeObserver {
  constructor(_cb: ResizeObserverCallback) {
    // callback stored but not used — controller calls onResize() internally
  }
  observe(target: Element) {
    observedElements.add(target);
  }
  unobserve(target: Element) {
    observedElements.delete(target);
  }
  disconnect() {
    observedElements.clear();
  }
}

/* ── Tests ───────────────────────────────────────────────── */

describe('OverflowController', () => {
  beforeEach(() => {
    observedElements = new Set();
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('connect()', () => {
    it('starts ResizeObserver on the container', () => {
      const host = createHost({});
      const ctrl = new OverflowController(host);

      ctrl.connect();

      expect(observedElements.has(host.container)).toBe(true);

      ctrl.disconnect();
    });

    it('sets --hiddenCount on the container', () => {
      const host = createHost({});
      const ctrl = new OverflowController(host);

      ctrl.connect();

      expect(host.container.style.getPropertyValue('--hiddenCount')).toBe('0');

      ctrl.disconnect();
    });
  });

  describe('item data-state attributes', () => {
    it('sets data-state="visible" when no overflow', () => {
      const item1 = mockItem('btn1');
      const item2 = mockItem('btn2');
      const menu = mockMenu(['btn1', 'btn2']);
      const host = createHost({
        items: [item1, item2],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.getAttribute('data-state')).toBe('visible');
      expect(item2.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });

    it('sets data-state="min" for items with minStateWidth on first overflow', () => {
      const item1 = mockItem('btn1', '2.25rem');
      const item2 = mockItem('btn2', '2.25rem');
      const menu = mockMenu(['btn1', 'btn2']);
      // Each item is 100px wide, min state saves 60px.
      // 550 - 60 = 490 < 500 → stops after one min step.
      const host = createHost({
        items: [item1, item2],
        menu,
        scrollWidth: () => {
          const minCount = [item1, item2].filter(
            i => i.el.getAttribute('data-state') === 'min'
          ).length;
          const hiddenCount = [item1, item2].filter(
            i => i.el.style.display === 'none'
          ).length;
          return 550 - minCount * 60 - hiddenCount * 100;
        },
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      // First step: btn1 goes to min, overflow resolves
      expect(item1.el.getAttribute('data-state')).toBe('min');
      expect(item2.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });

    it('sets data-state="hidden" when fully overflowed', () => {
      const item1 = mockItem('btn1');
      const item2 = mockItem('btn2');
      const menu = mockMenu(['btn1', 'btn2']);
      // Hiding one item (100px) resolves overflow: 550 - 100 = 450 < 500
      const host = createHost({
        items: [item1, item2],
        menu,
        scrollWidth: () => {
          const hiddenCount = [item1, item2].filter(
            i => i.el.style.display === 'none'
          ).length;
          return 550 - hiddenCount * 100;
        },
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      // No minStateWidth, so first step is hidden
      expect(item1.el.getAttribute('data-state')).toBe('hidden');
      expect(item1.el.style.display).toBe('none');
      // Only one item hidden — overflow resolved
      expect(item2.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });
  });

  describe('menu visibility', () => {
    it('hides menu when no items are hidden', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(menu.el.getAttribute('data-state')).toBe('hidden');
      expect(menu.el.style.display).toBe('none');

      ctrl.disconnect();
    });

    it('shows menu when items are hidden', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: () => item1.el.style.display === 'none' ? 400 : 550,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(menu.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });

    it('shows menu when hasMenuOnlyItems even if nothing overflows', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1'], true);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(menu.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });
  });

  describe('disconnect()', () => {
    it('clears data-state attributes from items', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();
      expect(item1.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
      expect(item1.el.getAttribute('data-state')).toBeNull();
    });

    it('clears inline styles from items', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: () => item1.el.style.display === 'none' ? 400 : 550,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();
      expect(item1.el.style.display).toBe('none');

      ctrl.disconnect();
      expect(item1.el.style.display).toBe('');
    });

    it('clears --hiddenCount from container', () => {
      const host = createHost({});
      const ctrl = new OverflowController(host);

      ctrl.connect();
      expect(host.container.style.getPropertyValue('--hiddenCount')).toBe('0');

      ctrl.disconnect();
      expect(host.container.style.getPropertyValue('--hiddenCount')).toBe('');
    });

    it('stops the ResizeObserver', () => {
      const host = createHost({});
      const ctrl = new OverflowController(host);

      ctrl.connect();
      expect(observedElements.size).toBeGreaterThan(0);

      ctrl.disconnect();
      expect(observedElements.size).toBe(0);
    });
  });

  describe('update()', () => {
    it('re-scans and re-applies state', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();
      expect(item1.el.getAttribute('data-state')).toBe('visible');

      // Simulate container shrinking
      host.setDimensions(550, 500);
      ctrl.update();
      expect(item1.el.getAttribute('data-state')).toBe('hidden');

      ctrl.disconnect();
    });
  });

  describe('min-state styles', () => {
    function dynamicScrollWidth(items: ScannedItem[], base: number) {
      return () => {
        const minCount = items.filter(
          i => i.el.getAttribute('data-state') === 'min'
        ).length;
        const hiddenCount = items.filter(
          i => i.el.style.display === 'none'
        ).length;
        return base - minCount * 60 - hiddenCount * 100;
      };
    }

    it('applies min-state styles to button when item is in min state', () => {
      const item1 = mockItem('btn1', '2.25rem');
      const menu = mockMenu(['btn1']);
      // 550 - 60 (min) = 490 < 500 → stops at min
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: dynamicScrollWidth([item1], 550),
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.getAttribute('data-state')).toBe('min');
      // jsdom normalizes '0' to '0px' for font-size
      expect(item1.buttonEl!.style.fontSize).toBe('0px');
      expect(item1.buttonEl!.style.getPropertyValue('min-width')).toBe('100%');

      ctrl.disconnect();
    });

    it('clears min-state styles after disconnect', () => {
      const item1 = mockItem('btn1', '2.25rem');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: dynamicScrollWidth([item1], 550),
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();
      expect(item1.buttonEl!.style.fontSize).toBe('0px');

      ctrl.disconnect();
      expect(item1.buttonEl!.style.getPropertyValue('font-size')).toBe('');
    });

    it('sets max-width and overflow on item element in min state', () => {
      const item1 = mockItem('btn1', '3rem');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: dynamicScrollWidth([item1], 550),
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.style.getPropertyValue('max-width')).toBe('3rem');
      expect(item1.el.style.getPropertyValue('overflow')).toBe('hidden');

      ctrl.disconnect();
    });
  });

  describe('onResize loop', () => {
    it('collapses multiple items in a single connect when all overflow', () => {
      const item1 = mockItem('btn1');
      const item2 = mockItem('btn2');
      const item3 = mockItem('btn3');
      const items = [item1, item2, item3];
      const menu = mockMenu(['btn1', 'btn2', 'btn3']);

      // Each hidden item reduces scrollWidth by 150px
      // 950 → 800 → 650 → 500. All three steps fire (950,800,650 all > 500).
      const host = createHost({
        items,
        menu,
        scrollWidth: () => {
          const hiddenCount = items.filter(i => i.el.style.display === 'none').length;
          return 950 - hiddenCount * 150;
        },
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.getAttribute('data-state')).toBe('hidden');
      expect(item2.el.getAttribute('data-state')).toBe('hidden');
      expect(item3.el.getAttribute('data-state')).toBe('hidden');

      ctrl.disconnect();
    });

    it('stops collapsing when overflow is resolved', () => {
      const item1 = mockItem('btn1');
      const item2 = mockItem('btn2');
      const items = [item1, item2];
      const menu = mockMenu(['btn1', 'btn2']);

      // Hiding one item is enough (600 - 150 = 450 < 500)
      const host = createHost({
        items,
        menu,
        scrollWidth: () => {
          const hiddenCount = items.filter(i => i.el.style.display === 'none').length;
          return 600 - hiddenCount * 150;
        },
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.getAttribute('data-state')).toBe('hidden');
      expect(item2.el.getAttribute('data-state')).toBe('visible');

      ctrl.disconnect();
    });
  });

  describe('menu item visibility', () => {
    it('hides menu items whose toolbar counterpart is visible', () => {
      const item1 = mockItem('btn1');
      const item2 = mockItem('btn2');
      const menu = mockMenu(['btn1', 'btn2']);
      const host = createHost({
        items: [item1, item2],
        menu,
        scrollWidth: 400,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      // Both visible in toolbar, so menu items should be hidden
      for (const mi of menu.menuItemEls) {
        expect(mi.style.display).toBe('none');
      }

      ctrl.disconnect();
    });

    it('shows menu items whose toolbar counterpart is hidden', () => {
      const item1 = mockItem('btn1');
      const menu = mockMenu(['btn1']);
      const host = createHost({
        items: [item1],
        menu,
        scrollWidth: () => item1.el.style.display === 'none' ? 400 : 550,
        clientWidth: 500,
      });

      const ctrl = new OverflowController(host);
      ctrl.connect();

      expect(item1.el.getAttribute('data-state')).toBe('hidden');
      // Menu item for btn1 should be visible (display removed)
      const menuItem = menu.menuItemEls[0];
      expect(menuItem.style.display).toBe('');

      ctrl.disconnect();
    });
  });
});
