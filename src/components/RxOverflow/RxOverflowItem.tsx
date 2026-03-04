import type { ReactNode } from 'react';
import { OverflowItem } from '../Overflow';

interface RxOverflowItemProps {
  children: ReactNode;
  menuid?: string;
  minStateWidth?: string;
}

function RxOverflowItem({ children, menuid, minStateWidth }: RxOverflowItemProps) {
  return (
    <OverflowItem menuid={menuid} minStateWidth={minStateWidth}>
      {children}
    </OverflowItem>
  );
}

export default Object.assign(RxOverflowItem, { overflowRole: 'item' as const });
