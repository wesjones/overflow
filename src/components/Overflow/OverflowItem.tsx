import type { CSSProperties, ReactNode } from 'react';
import { useOverflow } from './OverflowContext';

/** Props for the OverflowItem component. */
export interface OverflowItemProps {
  /** The item content (typically a button or link). */
  children: ReactNode;
  /** Links this toolbar item to its menu counterpart. Items with matching menuIds are shown/hidden together. */
  menuId?: string;
  /** CSS width value for the min (icon-only) state. When set, the item shrinks to this width before being fully hidden. */
  minStateWidth?: string;
}

function OverflowItem({ children, menuId, minStateWidth }: OverflowItemProps) {
  const { hiddenMap } = useOverflow();

  let style: CSSProperties | undefined;
  let className: string | undefined;
  if (menuId !== undefined) {
    const state = hiddenMap.get(menuId);
    if (state === 'hidden') {
      style = { display: 'none' };
    } else if (state === 'min' && minStateWidth !== undefined) {
      style = { minWidth: minStateWidth, width: minStateWidth, maxWidth: minStateWidth, overflow: 'hidden' };
      className = 'overflow-item-min';
    }
  }

  const dataState = menuId !== undefined ? (hiddenMap.get(menuId) ?? 'visible') : undefined;

  const snapStyle = minStateWidth !== undefined
    ? { '--min-state-width': minStateWidth } as CSSProperties
    : undefined;

  return (
    <li
      style={{ ...snapStyle, ...style }}
      className={className}
      data-state={dataState}
      data-can-min={minStateWidth !== undefined || undefined}
    >
      {children}
    </li>
  );
}

OverflowItem.overflowRole = 'item' as const;
export default OverflowItem;
