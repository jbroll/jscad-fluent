import jf from '../src/index';

describe('measureCenterOfMass', () => {
  test('finds the center of mass of a solid', () => {
    const [x, y, z] = jf.cube({ size: 2 }).translate([1, 2, 3]).measureCenterOfMass();
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(2);
    expect(z).toBeCloseTo(3);
  });

  test('finds the center of mass of a 2D shape', () => {
    const [x, y, z] = jf.square({ size: 2 }).translate([4, -1, 0]).measureCenterOfMass();
    expect(x).toBeCloseTo(4);
    expect(y).toBeCloseTo(-1);
    expect(z).toBe(0);
  });
});

describe('measureEpsilon', () => {
  test('gives a positive precision for every geometry type', () => {
    expect(jf.cube({ size: 2 }).measureEpsilon()).toBeGreaterThan(0);
    expect(jf.square({ size: 2 }).measureEpsilon()).toBeGreaterThan(0);
    expect(
      jf
        .line([
          [0, 0],
          [10, 0],
        ])
        .measureEpsilon(),
    ).toBeGreaterThan(0);
  });
});

describe('FluentGeom3.measureArea', () => {
  test('measures surface area', () => {
    expect(jf.cube({ size: 2 }).measureArea()).toBeCloseTo(24);
  });
});

describe('aggregate measurements', () => {
  const a = jf.cube({ size: 2 });
  const b = jf.cube({ size: 2 }).translate([10, 0, 0]);

  test('measureAggregateVolume sums volumes', () => {
    expect(jf.measureAggregateVolume(a, b)).toBeCloseTo(16);
  });

  test('measureAggregateArea sums areas', () => {
    expect(jf.measureAggregateArea(a, b)).toBeCloseTo(48);
    expect(jf.measureAggregateArea([jf.square({ size: 2 }), jf.square({ size: 1 })])).toBeCloseTo(
      5,
    );
  });

  test('measureAggregateBoundingBox bounds every shape', () => {
    const [min, max] = jf.measureAggregateBoundingBox(a, b);
    expect(min).toEqual([-1, -1, -1]);
    expect(max).toEqual([11, 1, 1]);
  });

  test('measureAggregateEpsilon gives one precision for the group', () => {
    expect(jf.measureAggregateEpsilon(a, b)).toBeGreaterThan(a.measureEpsilon());
  });
});
