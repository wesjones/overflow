import { Children, Fragment, forwardRef, isValidElement, type ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import OverflowContext from './OverflowContext';
import { type AppliedStep, buildOrderedSteps, computeNextSteps, deriveHiddenMap } from './overflowSteps';
import { useResizer } from './useResizer';

/** Shared type for components that declare an overflowRole ('item' | 'menu'). */
interface OverflowRoleComponent {
  overflowRole?: 'item' | 'menu';
}

/** Props for the Overflow container component. */
export interface OverflowProps {
  /** OverflowItem and OverflowMenu components. Must be direct children (no wrapper elements). */
  children: ReactNode;
  /** CSS class name for the container `<ul>`. */
  className?: string;
  /** Inline styles for the container `<ul>`. */
  style?: React.CSSProperties;
  /** When true, items collapse one at a time with tight spacing and grouped corners. */
  compact?: boolean;
  /** When true, items collapse from the right instead of the left. */
  reverse?: boolean;
  /** When true, all items with a `minStateWidth` snap to min state together, and all hideable items snap to hidden together. */
  snap?: boolean;
}

const Overflow = forwardRef<HTMLUListElement, OverflowProps>(function Overflow({ children, className, style, compact, reverse, snap }, ref) {
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
  const { orderedSteps, inMenuIds, minWidthMenuIds } = useMemo(() => {
    const menuIds: string[] = [];
    const inMenuIds = new Set<string>();
    const minWidthMenuIds = new Set<string>();

    // Scan resolved children: collect menuIds, detect which are in an OverflowMenu
    Children.forEach(resolvedChildren, (child) => {
      if (!isValidElement<{ menuId?: string; children?: ReactNode; minStateWidth?: string }>(child)) return;

      const role = (child.type as OverflowRoleComponent).overflowRole;

      if (role === 'menu') {
        // Scan OverflowMenu children for menuIds that have menu representation
        Children.forEach(child.props.children, (menuChild) => {
          if (!isValidElement<{ menuId?: string }>(menuChild)) return;
          if (menuChild.props.menuId) {
            inMenuIds.add(menuChild.props.menuId);
            if (!menuIds.includes(menuChild.props.menuId)) {
              menuIds.push(menuChild.props.menuId);
            }
          }
        });
      } else if (role === 'item' && child.props.menuId) {
        if (!menuIds.includes(child.props.menuId)) {
          menuIds.push(child.props.menuId);
        }
        if (child.props.minStateWidth !== undefined) {
          minWidthMenuIds.add(child.props.menuId);
        }
      }
    });

    const orderedIds = menuIds;
    return {
      orderedSteps: buildOrderedSteps(orderedIds, inMenuIds, minWidthMenuIds),
      inMenuIds,
      minWidthMenuIds,
    };
  }, [resolvedChildren]);

  // Measure and collapse/expand after each render until stable.
  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // so all collapsing settles in one frame — no intermediate flicker.
  useLayoutEffect(() => {
    const element = listRef.current;
    if (!element) return;
    setAppliedSteps(prev =>
      computeNextSteps(prev, element.scrollWidth, element.clientWidth, orderedSteps)
    );
  }, [appliedSteps, orderedSteps, listRef]);

  // Re-measure when the container is externally resized (window resize, parent layout change)
  const onResize = () => {
    const element = listRef.current;
    if (!element) return;
    setAppliedSteps(prev =>
      computeNextSteps(prev, element.scrollWidth, element.clientWidth, orderedSteps)
    );
  };

  useResizer(listRef, onResize);

  const hiddenMap = useMemo(() => deriveHiddenMap(appliedSteps, snap, inMenuIds, minWidthMenuIds), [appliedSteps, snap, inMenuIds, minWidthMenuIds]);

  const ctxValue = useMemo(
    () => ({ hiddenMap }),
    [hiddenMap],
  );

  const classNames = ['overflow', compact && 'overflow-compact', reverse && 'overflow-reverse', snap && 'overflow-snap', className].filter(Boolean).join(' ');

  return (
    <OverflowContext value={ctxValue}>
      <ul ref={listRef} className={classNames} style={{ ...style, '--hiddenCount': appliedSteps.length } as React.CSSProperties}>
        {resolvedChildren}
      </ul>
    </OverflowContext>
  );
});

export default Overflow;
