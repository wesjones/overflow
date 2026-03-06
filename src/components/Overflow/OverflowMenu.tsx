import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { useOverflow } from './OverflowContext';
import type { OverflowItemProps } from './OverflowItem';

/** Props passed to the `renderMenu` callback to render a framework-specific dropdown. */
export interface RenderMenuProps {
  /** The DOM element to anchor the menu to (null when closed). */
  anchorEl: HTMLElement | null;
  /** Whether the menu is currently open. */
  open: boolean;
  /** Call to close the menu. */
  onClose: () => void;
  /** The menu item elements to render inside the dropdown. */
  children: ReactNode;
}

/** Props for controlling the menu open/close state externally. */
export interface OverflowMenuControlProps {
  /** Controlled open state. When provided, you manage open/close. */
  open?: boolean;
  /** Called when the menu opens or closes. Use alone for notifications, or with `open` for full control. */
  onOpenChange?: (open: boolean) => void;
}

interface OverflowMenuProps extends OverflowMenuControlProps {
  opener: ReactNode;
  children: ReactNode;
  renderMenu: (props: RenderMenuProps) => ReactNode;
}

function OverflowMenu({ opener, children, renderMenu, open: controlledOpen, onOpenChange }: OverflowMenuProps) {
  const { hiddenMap } = useOverflow();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openerRef = useRef<HTMLLIElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : Boolean(anchorEl);

  const hasHiddenItems = [...hiddenMap.values()].some(s => s === 'hidden');
  const prevHasHidden = useRef(hasHiddenItems);

  // Auto-close when no items are fully hidden
  useEffect(() => {
    if (prevHasHidden.current && !hasHiddenItems && open) {
      // Use a microtask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setAnchorEl(null);
        onOpenChange?.(false);
      });
    }
    prevHasHidden.current = hasHiddenItems;
  }, [hasHiddenItems, open, onOpenChange]);

  // Sync anchorEl when controlled open changes to false
  useEffect(() => {
    if (isControlled && !controlledOpen) {
      queueMicrotask(() => setAnchorEl(null));
    }
  }, [isControlled, controlledOpen]);

  // Return focus to opener when menu closes
  useEffect(() => {
    if (!open && openerRef.current) {
      const button = openerRef.current.querySelector('button, [role="button"]') as HTMLElement | null;
      button?.focus();
    }
  }, [open]);

  const handleOpen = () => {
    const button = openerRef.current?.firstElementChild as HTMLElement | null;
    setAnchorEl(button ?? openerRef.current);
    if (!open) {
      onOpenChange?.(true);
    }
  };

  const handleClose = () => {
    if (!isControlled) {
      setAnchorEl(null);
    }
    onOpenChange?.(false);
  };

  // Collect menuId set from children to determine which are "menu-only"
  const menuItems: { menuId: string | undefined; content: ReactNode }[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<OverflowItemProps>(child)) return;
    menuItems.push({ menuId: child.props.menuId, content: child.props.children });
  });

  // Determine visible menu items: show when fully hidden or menu-only
  const visibleItems = menuItems.filter(({ menuId }) => {
    if (menuId === undefined) return true; // no menuId = always shown in menu
    return hiddenMap.get(menuId) === 'hidden'; // shown when fully hidden in toolbar
  });

  const hasMenuOnlyItems = menuItems.some(({ menuId }) => menuId === undefined);
  const hidden = !hasHiddenItems && !hasMenuOnlyItems;

  const menuChildren = Children.toArray(
    visibleItems.map(({ content }) => content)
  );

  // Clone opener to inject ARIA attributes
  const openerWithAria = isValidElement(opener)
    ? cloneElement(opener as ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : opener;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- the opener child is an interactive button; the li is a structural wrapper */}
      <li
        ref={openerRef}
        className="overflow-opener"
        data-state={hidden ? 'hidden' : undefined}
        style={hidden ? { display: 'none' } : undefined}
        onClick={handleOpen}
      >
        {openerWithAria}
      </li>
      {renderMenu({ anchorEl, open, onClose: handleClose, children: menuChildren })}
    </>
  );
}

OverflowMenu.overflowRole = 'menu' as const;
export default OverflowMenu;
