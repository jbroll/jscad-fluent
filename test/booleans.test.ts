import jscadFluent from '../src/index';

describe('Boolean Operations', () => {
  describe('Method chaining with spread parameters', () => {
    describe('3D operations', () => {
      test('union with single argument', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);

        const result = cube1.union(cube2);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(15);
      });

      test('union with multiple arguments', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);
        const cube3 = jscadFluent.cube({ size: 10 }).translate([10, 0, 0]);

        const result = cube1.union(cube2, cube3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(20);
      });

      test('subtract with single argument', () => {
        const outer = jscadFluent.cylinder({ radius: 10, height: 10 });
        const inner = jscadFluent.cylinder({ radius: 5, height: 12 });

        const result = outer.subtract(inner);
        const volume = result.measureVolume();
        const expectedVolume = Math.PI * (100 - 25) * 10;
        expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
      });

      test('subtract with multiple arguments', () => {
        const block = jscadFluent.cube({ size: 20 });
        const hole1 = jscadFluent.cylinder({ radius: 3, height: 22 }).translate([5, 5, 0]);
        const hole2 = jscadFluent.cylinder({ radius: 3, height: 22 }).translate([-5, -5, 0]);

        const result = block.subtract(hole1, hole2);
        const volume = result.measureVolume();
        expect(volume).toBeLessThan(8000); // Less than solid cube
        expect(volume).toBeGreaterThan(6800); // But not too much removed
      });

      test('intersect with single argument', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);

        const result = cube1.intersect(cube2);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(5);
      });

      test('intersect with multiple arguments', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([4, 0, 0]);
        const cube3 = jscadFluent.cube({ size: 10 }).translate([6, 0, 0]);

        const result = cube1.intersect(cube2, cube3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        // Intersection of overlapping cubes
        expect(dimensions[0]).toBeLessThan(5);
        expect(dimensions[0]).toBeGreaterThan(0);
      });
    });

    describe('2D operations', () => {
      test('union with multiple arguments', () => {
        const rect1 = jscadFluent.rectangle({ size: [10, 10] });
        const rect2 = jscadFluent.rectangle({ size: [10, 10] }).translate([5, 0, 0]);
        const rect3 = jscadFluent.rectangle({ size: [10, 10] }).translate([10, 0, 0]);

        const result = rect1.union(rect2, rect3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(20);
      });

      test('subtract with multiple arguments', () => {
        const base = jscadFluent.rectangle({ size: [20, 20] });
        const hole1 = jscadFluent.circle({ radius: 2 }).translate([5, 5, 0]);
        const hole2 = jscadFluent.circle({ radius: 2 }).translate([-5, -5, 0]);

        const result = base.subtract(hole1, hole2);
        const area = result.measureArea();
        const expectedArea = 400 - 2 * Math.PI * 4;
        expect(Math.abs(area - expectedArea)).toBeLessThan(5);
      });

      test('intersect with multiple arguments', () => {
        const rect1 = jscadFluent.rectangle({ size: [10, 10] });
        const rect2 = jscadFluent.rectangle({ size: [10, 10] }).translate([4, 0, 0]);
        const rect3 = jscadFluent.rectangle({ size: [10, 10] }).translate([6, 0, 0]);

        const result = rect1.intersect(rect2, rect3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        // Intersection of overlapping rectangles
        expect(dimensions[0]).toBeLessThan(5);
        expect(dimensions[0]).toBeGreaterThan(0);
      });
    });
  });

  describe('Top-level boolean functions', () => {
    describe('jf.union()', () => {
      test('union of 3D geometries', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);
        const cube3 = jscadFluent.cube({ size: 10 }).translate([10, 0, 0]);

        const result = jscadFluent.union(cube1, cube2, cube3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(20);
      });

      test('union of 2D geometries', () => {
        const rect1 = jscadFluent.rectangle({ size: [10, 10] });
        const rect2 = jscadFluent.rectangle({ size: [10, 10] }).translate([5, 0, 0]);

        const result = jscadFluent.union(rect1, rect2);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(15);
      });

      test('union throws with no arguments', () => {
        expect(() => jscadFluent.union()).toThrow('union requires at least one geometry');
      });
    });

    describe('jf.subtract()', () => {
      test('subtract 3D geometries', () => {
        const outer = jscadFluent.cylinder({ radius: 10, height: 10 });
        const inner = jscadFluent.cylinder({ radius: 5, height: 12 });

        const result = jscadFluent.subtract(outer, inner);
        const volume = result.measureVolume();
        const expectedVolume = Math.PI * (100 - 25) * 10;
        expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
      });

      test('subtract multiple 3D geometries', () => {
        const block = jscadFluent.cube({ size: 20 });
        const hole1 = jscadFluent.cylinder({ radius: 3, height: 22 }).translate([5, 5, 0]);
        const hole2 = jscadFluent.cylinder({ radius: 3, height: 22 }).translate([-5, -5, 0]);

        const result = jscadFluent.subtract(block, hole1, hole2);
        const volume = result.measureVolume();
        expect(volume).toBeLessThan(8000);
      });

      test('subtract 2D geometries', () => {
        const base = jscadFluent.rectangle({ size: [20, 20] });
        const hole = jscadFluent.circle({ radius: 5 });

        const result = jscadFluent.subtract(base, hole);
        const area = result.measureArea();
        const expectedArea = 400 - Math.PI * 25;
        expect(Math.abs(area - expectedArea)).toBeLessThan(5);
      });

      test('subtract throws with no arguments', () => {
        expect(() => jscadFluent.subtract()).toThrow('subtract requires at least one geometry');
      });
    });

    describe('jf.intersect()', () => {
      test('intersect 3D geometries', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);

        const result = jscadFluent.intersect(cube1, cube2);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(5);
      });

      test('intersect multiple 3D geometries', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([4, 0, 0]);
        const cube3 = jscadFluent.cube({ size: 10 }).translate([6, 0, 0]);

        const result = jscadFluent.intersect(cube1, cube2, cube3);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeLessThan(5);
        expect(dimensions[0]).toBeGreaterThan(0);
      });

      test('intersect 2D geometries', () => {
        const rect1 = jscadFluent.rectangle({ size: [10, 10] });
        const rect2 = jscadFluent.rectangle({ size: [10, 10] }).translate([5, 0, 0]);

        const result = jscadFluent.intersect(rect1, rect2);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(5);
      });

      test('intersect throws with no arguments', () => {
        expect(() => jscadFluent.intersect()).toThrow('intersect requires at least one geometry');
      });
    });
  });

  describe('Array argument support', () => {
    describe('Method chaining with arrays', () => {
      test('union accepts array argument', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);
        const cube3 = jscadFluent.cube({ size: 10 }).translate([10, 0, 0]);

        const result = cube1.union([cube2, cube3]);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(20);
      });

      test('subtract accepts array argument', () => {
        const block = jscadFluent.cube({ size: 20 });
        const holes = [
          jscadFluent.cylinder({ radius: 3, height: 22 }).translate([5, 5, 0]),
          jscadFluent.cylinder({ radius: 3, height: 22 }).translate([-5, -5, 0]),
        ];

        const result = block.subtract(holes);
        const volume = result.measureVolume();
        expect(volume).toBeLessThan(8000);
      });

      test('intersect accepts array argument', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cubes = [
          jscadFluent.cube({ size: 10 }).translate([4, 0, 0]),
          jscadFluent.cube({ size: 10 }).translate([6, 0, 0]),
        ];

        const result = cube1.intersect(cubes);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeLessThan(5);
        expect(dimensions[0]).toBeGreaterThan(0);
      });

      test('mixed spread and array arguments', () => {
        const cube1 = jscadFluent.cube({ size: 10 });
        const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);
        const moreCubes = [
          jscadFluent.cube({ size: 10 }).translate([10, 0, 0]),
          jscadFluent.cube({ size: 10 }).translate([15, 0, 0]),
        ];

        const result = cube1.union(cube2, moreCubes);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(25);
      });
    });

    describe('Top-level functions with arrays', () => {
      test('jf.union accepts array', () => {
        const cubes = [
          jscadFluent.cube({ size: 10 }),
          jscadFluent.cube({ size: 10 }).translate([5, 0, 0]),
          jscadFluent.cube({ size: 10 }).translate([10, 0, 0]),
        ];

        const result = jscadFluent.union(cubes);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(20);
      });

      test('jf.subtract accepts array', () => {
        const block = jscadFluent.cube({ size: 20 });
        const holes = [
          jscadFluent.cylinder({ radius: 3, height: 22 }).translate([5, 5, 0]),
          jscadFluent.cylinder({ radius: 3, height: 22 }).translate([-5, -5, 0]),
        ];

        const result = jscadFluent.subtract(block, holes);
        const volume = result.measureVolume();
        expect(volume).toBeLessThan(8000);
      });

      test('jf.intersect accepts array', () => {
        const cubes = [
          jscadFluent.cube({ size: 10 }),
          jscadFluent.cube({ size: 10 }).translate([5, 0, 0]),
        ];

        const result = jscadFluent.intersect(cubes);
        const dimensions = result.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(5);
      });
    });
  });

  describe('Chaining booleans', () => {
    test('complex boolean chain', () => {
      const base = jscadFluent.cube({ size: 20 });
      const addition = jscadFluent.sphere({ radius: 12 });
      const hole = jscadFluent.cylinder({ radius: 5, height: 30 });

      const result = base.union(addition).subtract(hole);
      const volume = result.measureVolume();
      expect(volume).toBeGreaterThan(0);
    });

    test('top-level followed by method chain', () => {
      const cube1 = jscadFluent.cube({ size: 10 });
      const cube2 = jscadFluent.cube({ size: 10 }).translate([5, 0, 0]);
      const hole = jscadFluent.cylinder({ radius: 2, height: 15 });

      const result = jscadFluent.union(cube1, cube2).subtract(hole);
      const volume = result.measureVolume();
      expect(volume).toBeGreaterThan(0);
    });
  });
});
