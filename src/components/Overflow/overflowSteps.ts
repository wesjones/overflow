export interface Step {
  menuId: string;
  step: 'min' | 'hidden';
}

export interface AppliedStep extends Step {
  width: number;
}

/**
 * Build the ordered collapse sequence.
 * All min steps come first (in menuId order), then all hidden steps (in menuId order).
 * A menuId only gets a min step if it has a minStateWidth.
 * A menuId only gets a hidden step if it's represented in the menu.
 */
export function buildOrderedSteps(
  menuIds: string[],
  inMenuIds: Set<string>,
  minWidthMenuIds: Set<string>,
): Step[] {
  const steps: Step[] = [];
  for (const menuId of menuIds) {
    if (minWidthMenuIds.has(menuId)) {
      steps.push({ menuId, step: 'min' });
    }
  }
  for (const menuId of menuIds) {
    if (inMenuIds.has(menuId)) {
      steps.push({ menuId, step: 'hidden' });
    }
  }
  return steps;
}

/**
 * Compute the next appliedSteps state given a resize event.
 * On overflow: push the next step from orderedSteps.
 * On space available: pop the last step if the container is wider than when it was applied.
 */
export function computeNextSteps(
  prev: AppliedStep[],
  scrollWidth: number,
  clientWidth: number,
  orderedSteps: Step[],
): AppliedStep[] {
  if (scrollWidth > clientWidth) {
    const nextStep = orderedSteps[prev.length];
    if (!nextStep) return prev;
    return [...prev, { ...nextStep, width: clientWidth }];
  }

  if (prev.length > 0) {
    const lastStep = prev[prev.length - 1];
    if (clientWidth > lastStep.width) {
      return prev.slice(0, -1);
    }
  }

  return prev;
}

/**
 * Derive the hiddenMap from appliedSteps.
 * Later steps for the same menuId overwrite earlier ones (e.g., min → hidden).
 *
 * When `snap` is true, states are expanded:
 * - If any item is 'min', all items in `minWidthMenuIds` are set to 'min'.
 * - If any item is 'hidden', all items in `inMenuIds` are set to 'hidden'.
 */
export function deriveHiddenMap(
  appliedSteps: AppliedStep[],
  snap?: boolean,
  inMenuIds?: Set<string>,
  minWidthMenuIds?: Set<string>,
): Map<string, 'min' | 'hidden'> {
  const map = new Map<string, 'min' | 'hidden'>();
  for (const { menuId, step } of appliedSteps) {
    map.set(menuId, step);
  }
  if (snap) {
    let hasMin = false;
    let hasHidden = false;
    for (const v of map.values()) {
      if (v === 'min') hasMin = true;
      if (v === 'hidden') hasHidden = true;
    }
    if (hasMin && minWidthMenuIds) {
      for (const id of minWidthMenuIds) {
        if (!map.has(id)) map.set(id, 'min');
      }
    }
    if (hasHidden && inMenuIds) {
      for (const id of inMenuIds) {
        map.set(id, 'hidden');
      }
    }
  }
  return map;
}
