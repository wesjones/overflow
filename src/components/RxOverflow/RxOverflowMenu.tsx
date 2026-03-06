import * as Popover from '@radix-ui/react-popover';
import { type ReactNode, useEffect, useRef } from 'react';
import { OverflowMenu, type OverflowMenuControlProps, type RenderMenuProps } from '../Overflow';

interface RxOverflowMenuProps extends OverflowMenuControlProps {
  opener: ReactNode;
  children: ReactNode;
}

function RxOverflowMenu({ opener, children, open, onOpenChange }: RxOverflowMenuProps) {
  const renderMenu = ({ anchorEl, open, onClose, children: menuChildren }: RenderMenuProps) => (
    <RxPopoverMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {menuChildren}
    </RxPopoverMenu>
  );

  return (
    <OverflowMenu opener={opener} renderMenu={renderMenu} open={open} onOpenChange={onOpenChange}>
      {children}
    </OverflowMenu>
  );
}

RxOverflowMenu.overflowRole = 'menu' as const;
export default RxOverflowMenu;

function RxPopoverMenu({ anchorEl, open, onClose, children }: RenderMenuProps) {
  const virtualRef = useRef<{ getBoundingClientRect: () => DOMRect }>({
    getBoundingClientRect: () => new DOMRect(),
  });

  useEffect(() => {
    if (anchorEl) {
      virtualRef.current = {
        getBoundingClientRect: () => anchorEl.getBoundingClientRect(),
      };
    }
  }, [anchorEl]);

  return (
    <Popover.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Popover.Anchor virtualRef={virtualRef} />
      <Popover.Portal>
        <Popover.Content
          className="rx-menu-panel"
          sideOffset={4}
          align="start"
          onClick={onClose}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
