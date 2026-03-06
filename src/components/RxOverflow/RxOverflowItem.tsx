import type { ReactNode } from 'react';
import { OverflowItem } from '../Overflow';

interface RxOverflowItemProps {
  children: ReactNode;
  menuId?: string;
  minStateWidth?: string;
}

function RxOverflowItem({ children, menuId, minStateWidth }: RxOverflowItemProps) {
  return (
    <OverflowItem menuId={menuId} minStateWidth={minStateWidth}>
      {children}
    </OverflowItem>
  );
}

RxOverflowItem.overflowRole = 'item' as const;
export default RxOverflowItem;
