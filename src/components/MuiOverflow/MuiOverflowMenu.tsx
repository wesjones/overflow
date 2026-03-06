import Menu from '@mui/material/Menu';
import type { ReactNode } from 'react';
import { OverflowMenu, type OverflowMenuControlProps, type RenderMenuProps } from '../Overflow';

interface MuiOverflowMenuProps extends OverflowMenuControlProps {
  opener: ReactNode;
  children: ReactNode;
}

function MuiOverflowMenu({ opener, children, open, onOpenChange }: MuiOverflowMenuProps) {
  const renderMenu = ({ anchorEl, open, onClose, children: menuChildren }: RenderMenuProps) => (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose} onClick={onClose}>
      {menuChildren}
    </Menu>
  );

  return (
    <OverflowMenu opener={opener} renderMenu={renderMenu} open={open} onOpenChange={onOpenChange}>
      {children}
    </OverflowMenu>
  );
}

MuiOverflowMenu.overflowRole = 'menu' as const;
export default MuiOverflowMenu;
