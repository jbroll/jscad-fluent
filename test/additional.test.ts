import jscadFluent from '../src/index';

describe('Extended Coverage Tests', () => {
  describe('2D Operations', () => {
    test('offset operations', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      const expanded = rect.offset({ delta: 2 });
      const dimensions = expanded.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(14);
      expect(dimensions[1]).toBeCloseTo(24);
    });

    test('complex boolean operations', () => {
      const base = jscadFluent.rectangle({ size: [20, 20] });
      const hole1 = jscadFluent.circle({ radius: 4 }).translate([5, 5, 0]);
      const hole2 = jscadFluent.circle({ radius: 4 }).translate([15, 15, 0]);
      const result = base.subtract([hole1, hole2]);
      const area = result.measureArea();
      expect(area).toBeCloseTo(350, 0);
    });
  });

  describe('3D Operations', () => {
    test('complex transforms', () => {
      const cube = jscadFluent
        .cube({ size: 10 })
        .rotateX(Math.PI / 4)
        .rotateY(Math.PI / 4)
        .scale([2, 1, 1])
        .translate([5, 5, 5]);

      const volume = cube.measureVolume();
      expect(volume).toBeCloseTo(2000);
    });

    test('expansion with different corner types', () => {
      const square = jscadFluent.square({ size: 100 });

      const roundExpansion = square.expand({ delta: 5, corners: 'round' });
      const roundArea = roundExpansion.measureArea();

      const chamferExpansion = square.expand({ delta: 5, corners: 'chamfer' });
      const chamferArea = chamferExpansion.measureArea();

      // expect(roundArea).not.toEqual(chamferArea);
      expect(roundArea).toBeGreaterThan(10000);
      expect(chamferArea).toBeGreaterThan(10000);
    });
  });

  describe('Array Operations', () => {
    test('2D array transformations', () => {
      const rect1 = jscadFluent.rectangle({ size: [10, 10] });
      const rect2 = jscadFluent.rectangle({ size: [20, 20] });
      const array = [rect1, rect2];

      const transformed = array.map((geom) => geom.translate([10, 0, 0]).scale([2, 2, 1]));

      expect(transformed[0]?.measureArea()).toBeCloseTo(400);
      expect(transformed[1]?.measureArea()).toBeCloseTo(1600);
    });

    test('3D array boolean operations', () => {
      const sphere1 = jscadFluent.sphere({ radius: 5 });
      const sphere2 = jscadFluent.sphere({ radius: 10 });
      const array = [sphere1, sphere2];

      const volumes = array.map((item) => item.measureVolume());
      if (volumes[0] !== undefined && volumes[1] !== undefined) {
        expect(volumes[0]).toBeLessThan(volumes[1]);
      }
    });
  });

  describe('Utility Operations', () => {
    test('toString implementations', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      expect(rect.toString()).toContain('geom2');

      const cube = jscadFluent.cube({ size: 10 });
      expect(cube.toString()).toContain('geom3');
    });

    test('clone operations', () => {
      const original = jscadFluent.cube({ size: 10 }).translate([5, 5, 5]).colorize([1, 0, 0]);

      const clone = original.clone();
      expect(clone.measureVolume()).toEqual(original.measureVolume());

      const center = clone.measureCenter();
      const originalCenter = original.measureCenter();
      if (typeof center === 'number' || typeof originalCenter === 'number') return;
      expect(center).toEqual(originalCenter);
    });

    test('validation operations', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      expect(() => rect.validate()).not.toThrow();

      const cube = jscadFluent.cube({ size: 10 });
      expect(() => cube.validate()).not.toThrow();
    });
  });

  describe('Color Operations', () => {
    test('RGB color assignment', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] }).colorize([1, 0, 0]);
      expect(rect).toBeDefined();
    });

    test('RGBA color assignment', () => {
      const cube = jscadFluent.cube({ size: 10 }).colorize([1, 0, 0, 0.5]);
      expect(cube).toBeDefined();
    });
  });

  describe('Measurement Operations', () => {
    test('bounding sphere calculations', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const [center, radius] = cube.measureBoundingSphere();
      if (!Array.isArray(center)) return;
      expect(center).toEqual([0, 0, 0]);
      expect(radius).toBeCloseTo(8.66, 1); // Diagonal/2
    });

    test('2D point and outline extraction', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      const points = rect.toPoints();
      expect(points.length).toBeGreaterThan(0);

      const outlines = rect.toOutlines();
      expect(outlines.length).toBeGreaterThan(0);
    });

    test('3D polygon extraction', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const polygons = cube.toPolygons();
      expect(polygons.length).toBe(6); // A cube has 6 faces
    });
  });
});
