import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { OverflowItem } from '../Overflow';

interface MuiOverflowItemProps {
  children: ReactNode;
  menuId?: string;
  minStateWidth?: number;
}

function MuiOverflowItem({ children, menuId, minStateWidth }: MuiOverflowItemProps) {
  const theme = useTheme();
  const cssWidth = minStateWidth !== undefined ? theme.spacing(minStateWidth) : undefined;

  return (
    <OverflowItem menuId={menuId} minStateWidth={cssWidth}>
      {children}
    </OverflowItem>
  );
}

MuiOverflowItem.overflowRole = 'item' as const;
export default MuiOverflowItem;
