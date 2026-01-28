import jscadFluent from '../src/index';

describe('Minkowski Operations', () => {
  describe('Basic minkowski sum', () => {
    test('minkowski with single argument', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const sphere = jscadFluent.sphere({ radius: 1, segments: 8 });

      const result = cube.minkowski(sphere);
      const dimensions = result.measureDimensions();

      // Cube 10x10x10 + sphere radius 1 on each side = 12x12x12
      expect(dimensions[0]).toBeCloseTo(12, 0);
      expect(dimensions[1]).toBeCloseTo(12, 0);
      expect(dimensions[2]).toBeCloseTo(12, 0);
    });

    test('minkowski creates rounded edges on cube', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const roundingBall = jscadFluent.sphere({ radius: 2, segments: 8 });

      const result = cube.minkowski(roundingBall);
      const dimensions = result.measureDimensions();

      // Rounded cube should be original size + 2*radius in each dimension
      expect(dimensions[0]).toBeCloseTo(14, 0);
      expect(dimensions[1]).toBeCloseTo(14, 0);
      expect(dimensions[2]).toBeCloseTo(14, 0);

      // Volume should be larger than original cube
      const volume = result.measureVolume();
      expect(volume).toBeGreaterThan(1000); // Original cube is 10^3 = 1000
    });

    test('minkowski with small sphere for subtle rounding', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const smallSphere = jscadFluent.sphere({ radius: 0.5, segments: 8 });

      const result = cube.minkowski(smallSphere);
      const dimensions = result.measureDimensions();

      // Cube + 0.5 radius on each side = 11x11x11
      expect(dimensions[0]).toBeCloseTo(11, 0);
      expect(dimensions[1]).toBeCloseTo(11, 0);
      expect(dimensions[2]).toBeCloseTo(11, 0);
    });
  });

  describe('Array argument support', () => {
    test('minkowski with array containing single element', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const spheres = [jscadFluent.sphere({ radius: 1, segments: 8 })];

      const result = cube.minkowski(spheres);
      const dimensions = result.measureDimensions();

      expect(dimensions[0]).toBeCloseTo(12, 0);
    });
  });

  describe('Chaining minkowski with other operations', () => {
    test('minkowski followed by translate', () => {
      const result = jscadFluent
        .cube({ size: 10 })
        .minkowski(jscadFluent.sphere({ radius: 1, segments: 8 }))
        .translate([10, 0, 0]);

      const center = result.measureCenter();
      expect(center[0]).toBeCloseTo(10, 0);
      expect(center[1]).toBeCloseTo(0, 0);
      expect(center[2]).toBeCloseTo(0, 0);
    });

    test('minkowski followed by boolean operations', () => {
      const rounded = jscadFluent
        .cube({ size: 10 })
        .minkowski(jscadFluent.sphere({ radius: 1, segments: 8 }));

      const hole = jscadFluent.cylinder({ radius: 3, height: 20 });
      const result = rounded.subtract(hole);

      const volume = result.measureVolume();
      // Should have volume less than the rounded cube
      expect(volume).toBeGreaterThan(0);
      expect(volume).toBeLessThan(rounded.measureVolume());
    });

    test('boolean followed by minkowski', () => {
      const base = jscadFluent.cube({ size: 10 });
      const hole = jscadFluent.cylinder({ radius: 2, height: 12 });
      const withHole = base.subtract(hole);

      const result = withHole.minkowski(jscadFluent.sphere({ radius: 0.5, segments: 8 }));

      const dimensions = result.measureDimensions();
      // Should be slightly larger due to minkowski
      expect(dimensions[0]).toBeCloseTo(11, 0);
    });

    test('chained minkowski operations', () => {
      const result = jscadFluent
        .cube({ size: 10 })
        .minkowski(jscadFluent.sphere({ radius: 1, segments: 8 }))
        .minkowski(jscadFluent.sphere({ radius: 1, segments: 8 }));

      const dimensions = result.measureDimensions();
      // Two minkowski sums: 10 + 2 + 2 = 14
      expect(dimensions[0]).toBeCloseTo(14, 0);
    });
  });
});
