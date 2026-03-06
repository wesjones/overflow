import { describe, expect, it } from 'vitest';
import { type AppliedStep, buildOrderedSteps, computeNextSteps, deriveHiddenMap } from './overflowSteps';

describe('buildOrderedSteps', () => {
  it('puts all min steps before all hidden steps', () => {
    const menuIds = ['btn1', 'btn2', 'btn3'];
    const inMenuIds = new Set(['btn1', 'btn2', 'btn3']);
    const minWidthMenuIds = new Set(['btn1', 'btn3']);

    const steps = buildOrderedSteps(menuIds, inMenuIds, minWidthMenuIds);

    expect(steps).toEqual([
      { menuId: 'btn1', step: 'min' },
      { menuId: 'btn3', step: 'min' },
      { menuId: 'btn1', step: 'hidden' },
      { menuId: 'btn2', step: 'hidden' },
      { menuId: 'btn3', step: 'hidden' },
    ]);
  });

  it('skips min step for items without minStateWidth', () => {
    const menuIds = ['btn1', 'btn2'];
    const inMenuIds = new Set(['btn1', 'btn2']);
    const minWidthMenuIds = new Set<string>();

    const steps = buildOrderedSteps(menuIds, inMenuIds, minWidthMenuIds);

    expect(steps).toEqual([
      { menuId: 'btn1', step: 'hidden' },
      { menuId: 'btn2', step: 'hidden' },
    ]);
  });

  it('skips hidden step for items not in the menu', () => {
    const menuIds = ['btn1', 'btn2'];
    const inMenuIds = new Set(['btn1']); // btn2 has no menu representation
    const minWidthMenuIds = new Set(['btn1', 'btn2']);

    const steps = buildOrderedSteps(menuIds, inMenuIds, minWidthMenuIds);

    expect(steps).toEqual([
      { menuId: 'btn1', step: 'min' },
      { menuId: 'btn2', step: 'min' },
      { menuId: 'btn1', step: 'hidden' },
    ]);
  });

  it('item with minStateWidth but not in menu can only min, never hide', () => {
    const menuIds = ['btn1'];
    const inMenuIds = new Set<string>();
    const minWidthMenuIds = new Set(['btn1']);

    const steps = buildOrderedSteps(menuIds, inMenuIds, minWidthMenuIds);

    expect(steps).toEqual([
      { menuId: 'btn1', step: 'min' },
    ]);
  });

  it('returns empty array when there are no menuIds', () => {
    expect(buildOrderedSteps([], new Set(), new Set())).toEqual([]);
  });
});

describe('computeNextSteps', () => {
  const orderedSteps = [
    { menuId: 'btn1', step: 'min' as const },
    { menuId: 'btn2', step: 'min' as const },
    { menuId: 'btn1', step: 'hidden' as const },
    { menuId: 'btn2', step: 'hidden' as const },
  ];

  it('pushes next step on overflow', () => {
    const result = computeNextSteps([], 500, 400, orderedSteps);

    expect(result).toEqual([
      { menuId: 'btn1', step: 'min', width: 400 },
    ]);
  });

  it('pushes successive steps on repeated overflow', () => {
    const prev: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
    ];
    const result = computeNextSteps(prev, 450, 380, orderedSteps);

    expect(result).toEqual([
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn2', step: 'min', width: 380 },
    ]);
  });

  it('returns prev unchanged when overflowing but no more steps', () => {
    const prev: AppliedStep[] = orderedSteps.map((s, i) => ({ ...s, width: 400 - i * 20 }));
    const result = computeNextSteps(prev, 500, 300, orderedSteps);

    expect(result).toBe(prev);
  });

  it('pops last step when container grows past recorded width', () => {
    const prev: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn2', step: 'min', width: 380 },
    ];
    const result = computeNextSteps(prev, 370, 390, orderedSteps);

    expect(result).toEqual([
      { menuId: 'btn1', step: 'min', width: 400 },
    ]);
  });

  it('does not pop when container has not grown past recorded width', () => {
    const prev: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
    ];
    const result = computeNextSteps(prev, 390, 395, orderedSteps);

    expect(result).toBe(prev);
  });

  it('returns prev unchanged when not overflowing and no steps applied', () => {
    const result = computeNextSteps([], 300, 400, orderedSteps);

    expect(result).toBe(result);
  });
});

describe('deriveHiddenMap', () => {
  it('returns empty map for no steps', () => {
    expect(deriveHiddenMap([])).toEqual(new Map());
  });

  it('maps each menuId to its step', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn2', step: 'min', width: 380 },
    ];

    expect(deriveHiddenMap(steps)).toEqual(new Map([
      ['btn1', 'min'],
      ['btn2', 'min'],
    ]));
  });

  it('later step overwrites earlier step for same menuId', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn1', step: 'hidden', width: 350 },
    ];

    expect(deriveHiddenMap(steps)).toEqual(new Map([
      ['btn1', 'hidden'],
    ]));
  });
});

describe('deriveHiddenMap with snap', () => {
  it('does not expand when snap is false', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'hidden', width: 400 },
    ];

    const result = deriveHiddenMap(steps, false, new Set(['btn1', 'btn2', 'btn3']));

    expect(result).toEqual(new Map([
      ['btn1', 'hidden'],
    ]));
  });

  it('expands hidden to all inMenuIds when snap is true and any step is hidden', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'hidden', width: 400 },
    ];

    const result = deriveHiddenMap(steps, true, new Set(['btn1', 'btn2', 'btn3']));

    expect(result).toEqual(new Map([
      ['btn1', 'hidden'],
      ['btn2', 'hidden'],
      ['btn3', 'hidden'],
    ]));
  });

  it('does not expand min state (CSS handles min snap)', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
    ];

    const result = deriveHiddenMap(steps, true, new Set(['btn1', 'btn2']));

    expect(result).toEqual(new Map([
      ['btn1', 'min'],
    ]));
  });

  it('snap hidden expansion overwrites existing min state', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn2', step: 'min', width: 380 },
      { menuId: 'btn1', step: 'hidden', width: 350 },
    ];

    const result = deriveHiddenMap(steps, true, new Set(['btn1', 'btn2', 'btn3']));

    expect(result).toEqual(new Map([
      ['btn1', 'hidden'],
      ['btn2', 'hidden'],
      ['btn3', 'hidden'],
    ]));
  });

  it('does not expand hidden when no step is hidden', () => {
    const steps: AppliedStep[] = [
      { menuId: 'btn1', step: 'min', width: 400 },
      { menuId: 'btn2', step: 'min', width: 380 },
    ];

    const result = deriveHiddenMap(steps, true, new Set(['btn1', 'btn2']));

    expect(result).toEqual(new Map([
      ['btn1', 'min'],
      ['btn2', 'min'],
    ]));
  });
});
