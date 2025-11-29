import jscadFluent from '../src/index';

describe('3D Primitives', () => {
  describe('cube', () => {
    test('creates cube with correct dimensions', () => {
      const cube = jscadFluent.cube({ size: 10 });
      const dimensions = cube.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(10);
    });

    test('cube with transforms', () => {
      const cube = jscadFluent.cube({ size: 10 }).translate([5, 5, 5]);

      const center = cube.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(5);
      expect(center[1]).toBeCloseTo(5);
      expect(center[2]).toBeCloseTo(5);

      const volume = cube.measureVolume();
      expect(volume).toBeCloseTo(1000); // 10^3
    });
  });

  describe('sphere', () => {
    test('creates sphere with correct dimensions', () => {
      const radius = 5;
      const sphere = jscadFluent.sphere({ radius });
      const volume = sphere.measureVolume();
      const expectedVolume = (4 / 3) * Math.PI * radius ** 3;
      // Increase tolerance due to tessellation approximation
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(10);
    });

    test('sphere with transforms', () => {
      const sphere = jscadFluent.sphere({ radius: 5 }).scale([2, 1, 1]);

      const dimensions = sphere.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(10);
    });
  });

  describe('cylinder', () => {
    test('creates cylinder with correct dimensions', () => {
      const cylinder = jscadFluent.cylinder({ radius: 5, height: 10 });
      const volume = cylinder.measureVolume();
      const expectedVolume = Math.PI * 25 * 10;
      // Increase tolerance due to tessellation approximation
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(10);
    });

    test('cylinder with boolean operations', () => {
      const cylinder1 = jscadFluent.cylinder({ radius: 5, height: 10 });
      const cylinder2 = jscadFluent.cylinder({ radius: 3, height: 12 });

      const result = cylinder1.subtract(cylinder2);
      const volume = result.measureVolume();
      const expectedVolume = Math.PI * (25 - 9) * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(10);
    });
  });

  describe('cylinderElliptic', () => {
    test('creates elliptic cylinder with correct dimensions', () => {
      const cylinder = jscadFluent.cylinderElliptic({
        height: 10,
        startRadius: [5, 3],
        endRadius: [5, 3],
      });

      const dimensions = cylinder.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(6);
    });

    test('elliptic cylinder with transforms', () => {
      const cylinder = jscadFluent
        .cylinderElliptic({
          height: 10,
          startRadius: [5, 3],
          endRadius: [3, 2],
        })
        .rotate([0, Math.PI / 2, 0]);

      const dimensions = cylinder.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(10);
    });
  });

  describe('torus', () => {
    test('creates torus with correct dimensions', () => {
      const torus = jscadFluent.torus({
        innerRadius: 5,
        outerRadius: 15,
      });

      const dimensions = torus.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(40);
      expect(dimensions[1]).toBeCloseTo(40);
      expect(dimensions[2]).toBeCloseTo(10); // Height is twice the inner radius
    });

    test('torus with transformations', () => {
      const torus = jscadFluent
        .torus({
          innerRadius: 5,
          outerRadius: 15,
        })
        .rotate([Math.PI / 2, 0, 0]);

      const dimensions = torus.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(40);
      expect(dimensions[2]).toBeCloseTo(40);
      expect(dimensions[1]).toBeCloseTo(10); // Height is twice the inner radius
    });
  });

  describe('polyhedron', () => {
    test('creates tetrahedron', () => {
      const points: [number, number, number][] = [
        [0, 0, 0],
        [10, 0, 0],
        [5, 10, 0],
        [5, 5, 10],
      ];
      // Fixed face orientation for positive volume
      const faces = [
        [0, 2, 1],
        [0, 3, 2],
        [0, 1, 3],
        [1, 2, 3],
      ];

      const tetra = jscadFluent.polyhedron({ points, faces });
      expect(tetra.measureVolume()).toBeGreaterThan(0);
    });

    test('polyhedron with expansions', () => {
      const points: [number, number, number][] = [
        [0, 0, 0],
        [10, 0, 0],
        [5, 10, 0],
        [5, 5, 10],
      ];
      const faces = [
        [0, 2, 1],
        [0, 3, 2],
        [0, 1, 3],
        [1, 2, 3],
      ];

      const tetra = jscadFluent
        .polyhedron({ points, faces })
        .expand({ delta: 1, corners: 'round' });

      const expanded = tetra.measureVolume();
      expect(expanded).toBeGreaterThan(0);
    });
  });
});
