import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { useOverflow } from './OverflowContext';
import type { OverflowItemProps } from './OverflowItem';

export interface RenderMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface OverflowMenuProps {
  opener: ReactNode;
  children: ReactNode;
  renderMenu: (props: RenderMenuProps) => ReactNode;
}

function OverflowMenu({ opener, children, renderMenu }: OverflowMenuProps) {
  const { hiddenMap } = useOverflow();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const hasHiddenItems = [...hiddenMap.values()].some(s => s === 'hidden');
  const prevHasHidden = useRef(hasHiddenItems);

  // Auto-close when no items are fully hidden
  useEffect(() => {
    if (prevHasHidden.current && !hasHiddenItems) {
      setAnchorEl(null);
    }
    prevHasHidden.current = hasHiddenItems;
  }, [hasHiddenItems]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  // Clone opener to attach click handler
  const openerElement = isValidElement<Record<string, unknown>>(opener)
    ? cloneElement(opener as ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>, { onClick: handleOpen })
    : opener;

  const menuChildren = visibleItems.map(({ menuid, content }, i) => {
    // Wrap each menu item's content and attach close-on-click
    const key = menuid ?? `menu-item-${i}`;
    if (isValidElement<{ onClick?: () => void }>(content)) {
      return cloneElement(content as ReactElement<{ onClick?: () => void }>, {
        key,
        onClick: (...args: unknown[]) => {
          const original = (content as ReactElement<{ onClick?: (...a: unknown[]) => void }>).props.onClick;
          original?.(...args);
          handleClose();
        },
      });
    }
    return content;
  });

  return (
    <>
      <li className="overflow-opener" data-state={hidden ? 'hidden' : undefined} style={hidden ? { display: 'none' } : undefined}>
        {openerElement}
      </li>
      {renderMenu({ anchorEl, open, onClose: handleClose, children: menuChildren })}
    </>
  );
}

export default Object.assign(OverflowMenu, { overflowRole: 'menu' as const });
