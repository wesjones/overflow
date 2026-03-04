import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { OverflowItem } from '../Overflow';

interface MuiOverflowItemProps {
  children: ReactNode;
  menuid?: string;
  minStateWidth?: number;
}

function MuiOverflowItem({ children, menuid, minStateWidth }: MuiOverflowItemProps) {
  const theme = useTheme();
  const cssWidth = minStateWidth !== undefined ? theme.spacing(minStateWidth) : undefined;

  return (
    <OverflowItem menuid={menuid} minStateWidth={cssWidth}>
      {children}
    </OverflowItem>
  );
}

export default Object.assign(MuiOverflowItem, { overflowRole: 'item' as const });
