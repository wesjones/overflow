export interface Step {
  menuid: string;
  step: 'min' | 'hidden';
}

export interface AppliedStep extends Step {
  width: number;
}

/**
 * Build the ordered collapse sequence.
 * All min steps come first (in menuid order), then all hidden steps (in menuid order).
 * A menuid only gets a min step if it has a minStateWidth.
 * A menuid only gets a hidden step if it's represented in the menu.
 */
export function buildOrderedSteps(
  menuIds: string[],
  inMenuIds: Set<string>,
  minWidthMenuIds: Set<string>,
): Step[] {
  const steps: Step[] = [];
  for (const menuid of menuIds) {
    if (minWidthMenuIds.has(menuid)) {
      steps.push({ menuid, step: 'min' });
    }
  }
  for (const menuid of menuIds) {
    if (inMenuIds.has(menuid)) {
      steps.push({ menuid, step: 'hidden' });
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
 * Later steps for the same menuid overwrite earlier ones (e.g., min → hidden).
 */
export function deriveHiddenMap(appliedSteps: AppliedStep[]): Map<string, 'min' | 'hidden'> {
  const map = new Map<string, 'min' | 'hidden'>();
  for (const { menuid, step } of appliedSteps) {
    map.set(menuid, step);
  }
  return map;
}
