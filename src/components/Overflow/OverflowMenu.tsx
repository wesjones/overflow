import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { useOverflow } from './OverflowContext';
import type { OverflowItemProps } from './OverflowItem';

export interface RenderMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface OverflowMenuControlProps {
  open?: boolean;
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
      setAnchorEl(null);
      onOpenChange?.(false);
    }
    prevHasHidden.current = hasHiddenItems;
  }, [hasHiddenItems, open, onOpenChange]);

  // Sync anchorEl when controlled open changes to false
  useEffect(() => {
    if (isControlled && !controlledOpen) {
      setAnchorEl(null);
    }
  }, [isControlled, controlledOpen]);

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

  // Collect menuid set from children to determine which are "menu-only"
  const menuItems: { menuid: string | undefined; content: ReactNode }[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<OverflowItemProps>(child)) return;
    menuItems.push({ menuid: child.props.menuid, content: child.props.children });
  });

  // Determine visible menu items: show when fully hidden or menu-only
  const visibleItems = menuItems.filter(({ menuid }) => {
    if (menuid === undefined) return true; // no menuid = always shown in menu
    return hiddenMap.get(menuid) === 'hidden'; // shown when fully hidden in toolbar
  });

  const hasMenuOnlyItems = menuItems.some(({ menuid }) => menuid === undefined);
  const hidden = !hasHiddenItems && !hasMenuOnlyItems;

  const menuChildren = Children.toArray(
    visibleItems.map(({ content }) => content)
  );

  return (
    <>
      <li
        ref={openerRef}
        className="overflow-opener"
        data-state={hidden ? 'hidden' : undefined}
        style={hidden ? { display: 'none' } : undefined}
        onClick={handleOpen}
      >
        {opener}
      </li>
      {renderMenu({ anchorEl, open, onClose: handleClose, children: menuChildren })}
    </>
  );
}

export default Object.assign(OverflowMenu, { overflowRole: 'menu' as const });
