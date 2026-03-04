import type { CSSProperties, ReactNode } from 'react';
import { useOverflow } from './OverflowContext';

export interface OverflowItemProps {
  children: ReactNode;
  menuid?: string;
  minStateWidth?: string;
}

function OverflowItem({ children, menuid, minStateWidth }: OverflowItemProps) {
  const { hiddenMap } = useOverflow();

  let style: CSSProperties | undefined;
  let className: string | undefined;
  if (menuid !== undefined) {
    const state = hiddenMap.get(menuid);
    if (state === 'hidden') {
      style = { display: 'none' };
    } else if (state === 'min' && minStateWidth !== undefined) {
      style = { minWidth: minStateWidth, width: minStateWidth, maxWidth: minStateWidth, overflow: 'hidden' };
      className = 'overflow-item-min';
    }
  }

  const dataState = menuid !== undefined ? (hiddenMap.get(menuid) ?? 'visible') : undefined;

  return (
    <li style={style} className={className} data-state={dataState}>
      {children}
    </li>
  );
}

export default Object.assign(OverflowItem, { overflowRole: 'item' as const });
