import { Children, Fragment, forwardRef, isValidElement, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import './Overflow.css';
import OverflowContext from './OverflowContext';
import { type AppliedStep, buildOrderedSteps, computeNextSteps, deriveHiddenMap } from './overflowSteps';
import { useResizer } from './useResizer';

export interface OverflowProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  reverse?: boolean;
}

const Overflow = forwardRef<HTMLUListElement, OverflowProps>(function Overflow({ children, className, style, compact, reverse }, ref) {
  const [appliedSteps, setAppliedSteps] = useState<AppliedStep[]>([]);
  const internalRef = useRef<HTMLUListElement | null>(null);
  const listRef = (ref ?? internalRef) as React.RefObject<HTMLUListElement | null>;

  // Unwrap a single top-level Fragment so items work in Storybook args, etc.
  const resolvedChildren = useMemo(() => Children.toArray(
    Children.count(children) === 1 && isValidElement<{ children: ReactNode }>(children) && children.type === Fragment
      ? children.props.children
      : children,
  ), [children]);

  // Build ordered steps by scanning resolved children using overflowRole markers
  const orderedSteps = useMemo(() => {
    const menuIds: string[] = [];
    const inMenuIds = new Set<string>();
    const minWidthMenuIds = new Set<string>();

    // Scan resolved children: collect menuids, detect which are in an OverflowMenu
    Children.forEach(resolvedChildren, (child) => {
      if (!isValidElement<{ menuid?: string; children?: ReactNode; minStateWidth?: string }>(child)) return;

      const role = (child.type as { overflowRole?: string }).overflowRole;

      if (role === 'menu') {
        // Scan OverflowMenu children for menuids that have menu representation
        Children.forEach(child.props.children, (menuChild) => {
          if (!isValidElement<{ menuid?: string }>(menuChild)) return;
          if (menuChild.props.menuid) {
            inMenuIds.add(menuChild.props.menuid);
            if (!menuIds.includes(menuChild.props.menuid)) {
              menuIds.push(menuChild.props.menuid);
            }
          }
        });
      } else if (role === 'item' && child.props.menuid) {
        if (!menuIds.includes(child.props.menuid)) {
          menuIds.push(child.props.menuid);
        }
        if (child.props.minStateWidth !== undefined) {
          minWidthMenuIds.add(child.props.menuid);
        }
      }
    });

    const orderedIds = reverse ? [...menuIds].reverse() : menuIds;
    return buildOrderedSteps(orderedIds, inMenuIds, minWidthMenuIds);
  }, [resolvedChildren, reverse]);

  const onResize = useCallback((scrollWidth: number, clientWidth: number) => {
    setAppliedSteps(prev => computeNextSteps(prev, scrollWidth, clientWidth, orderedSteps));
  }, [orderedSteps]);

  useResizer(listRef, onResize);

  const hiddenMap = useMemo(() => deriveHiddenMap(appliedSteps), [appliedSteps]);

  const ctxValue = useMemo(
    () => ({ hiddenMap }),
    [hiddenMap],
  );

  const classNames = ['overflow', compact && 'overflow-compact', reverse && 'overflow-reverse', className].filter(Boolean).join(' ');

  return (
    <OverflowContext value={ctxValue}>
      <ul ref={listRef} className={classNames} style={{ ...style, '--hiddenCount': appliedSteps.length } as React.CSSProperties}>
        {resolvedChildren}
      </ul>
    </OverflowContext>
  );
});

export default Overflow;
