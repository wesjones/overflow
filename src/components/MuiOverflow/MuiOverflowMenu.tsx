import Menu from '@mui/material/Menu';
import type { ReactNode } from 'react';
import { OverflowMenu, type RenderMenuProps } from '../Overflow';

interface MuiOverflowMenuProps {
  opener: ReactNode;
  children: ReactNode;
}

function MuiOverflowMenu({ opener, children }: MuiOverflowMenuProps) {
  const renderMenu = ({ anchorEl, open, onClose, children: menuChildren }: RenderMenuProps) => (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {menuChildren}
    </Menu>
  );

  return (
    <OverflowMenu opener={opener} renderMenu={renderMenu}>
      {children}
    </OverflowMenu>
  );
}

export default Object.assign(MuiOverflowMenu, { overflowRole: 'menu' as const });
