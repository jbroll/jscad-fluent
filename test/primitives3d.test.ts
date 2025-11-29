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

  describe('ellipsoid', () => {
    test('creates ellipsoid with correct dimensions', () => {
      const ellipsoid = jscadFluent.ellipsoid({ radius: [10, 5, 3] });

      const dimensions = ellipsoid.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(6);
    });

    test('ellipsoid with transforms', () => {
      const ellipsoid = jscadFluent.ellipsoid({ radius: [5, 5, 5] }).scale([2, 1, 1]);

      const dimensions = ellipsoid.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(10);
    });
  });

  describe('geodesicSphere', () => {
    test('creates geodesic sphere with positive volume', () => {
      const sphere = jscadFluent.geodesicSphere({ radius: 10 });
      expect(sphere.measureVolume()).toBeGreaterThan(0);
    });

    test('geodesic sphere volume increases with radius', () => {
      const small = jscadFluent.geodesicSphere({ radius: 5 });
      const large = jscadFluent.geodesicSphere({ radius: 10 });

      expect(large.measureVolume()).toBeGreaterThan(small.measureVolume());
    });

    test('geodesic sphere with transforms', () => {
      const sphere = jscadFluent.geodesicSphere({ radius: 5 }).translate([10, 0, 0]);

      const center = sphere.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10, 0);
    });
  });

  describe('roundedCuboid', () => {
    test('creates rounded cuboid with correct dimensions', () => {
      const cuboid = jscadFluent.roundedCuboid({
        size: [10, 20, 30],
        roundRadius: 1,
      });

      const dimensions = cuboid.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(20);
      expect(dimensions[2]).toBeCloseTo(30);
    });

    test('rounded cuboid with transforms', () => {
      const cuboid = jscadFluent
        .roundedCuboid({ size: [10, 10, 10], roundRadius: 1 })
        .translate([5, 5, 5]);

      const center = cuboid.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(5);
      expect(center[1]).toBeCloseTo(5);
      expect(center[2]).toBeCloseTo(5);
    });
  });

  describe('roundedCylinder', () => {
    test('creates rounded cylinder with correct dimensions', () => {
      const cylinder = jscadFluent.roundedCylinder({
        radius: 5,
        height: 10,
        roundRadius: 1,
      });

      const dimensions = cylinder.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(10);
      expect(dimensions[2]).toBeCloseTo(10);
    });

    test('rounded cylinder with boolean operations', () => {
      const outer = jscadFluent.roundedCylinder({
        radius: 10,
        height: 20,
        roundRadius: 2,
      });
      const inner = jscadFluent.cylinder({ radius: 5, height: 25 });

      const result = outer.subtract(inner);
      expect(result.measureVolume()).toBeGreaterThan(0);
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

  describe('cylinder (enhanced)', () => {
    describe('solid cylinders', () => {
      test('creates solid cylinder with uniform radius', () => {
        const cyl = jscadFluent.cylinder({ radius: 5, height: 10 });

        const dimensions = cyl.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(10); // diameter
        expect(dimensions[1]).toBeCloseTo(10);
        expect(dimensions[2]).toBeCloseTo(10); // height
      });

      test('creates tapered cylinder', () => {
        const cyl = jscadFluent.cylinder({ radius: [5, 3], height: 10 });

        const volume = cyl.measureVolume();
        expect(volume).toBeGreaterThan(0);
        // Tapered cylinder should have less volume than uniform
        const uniformVolume = Math.PI * 5 * 5 * 10;
        expect(volume).toBeLessThan(uniformVolume);
      });

      test('creates elliptical cylinder', () => {
        const cyl = jscadFluent.cylinder({
          radius: [
            [5, 3],
            [5, 3],
          ],
          height: 10,
        });

        const dimensions = cyl.measureDimensions();
        if (typeof dimensions === 'number') return;
        expect(dimensions[0]).toBeCloseTo(10); // 2 * 5
        expect(dimensions[1]).toBeCloseTo(6); // 2 * 3
      });

      test('creates partial arc cylinder', () => {
        const fullCyl = jscadFluent.cylinder({ radius: 5, height: 10 });
        const halfCyl = jscadFluent.cylinder({
          radius: 5,
          height: 10,
          angle: [0, Math.PI],
        });

        const fullVolume = fullCyl.measureVolume();
        const halfVolume = halfCyl.measureVolume();
        expect(halfVolume).toBeCloseTo(fullVolume / 2, 0);
      });
    });

    describe('hollow cylinders', () => {
      test('creates hollow cylinder with inner/outer radii', () => {
        const cyl = jscadFluent.cylinder({ outer: 6, inner: 4, height: 10 });

        const volume = cyl.measureVolume();
        const expectedVolume = Math.PI * (36 - 16) * 10; // pi * (R^2 - r^2) * h
        expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
      });

      test('creates tapered hollow cylinder', () => {
        const cyl = jscadFluent.cylinder({
          outer: [6, 4],
          inner: [4, 2.5],
          height: 10,
        });

        expect(cyl.measureVolume()).toBeGreaterThan(0);
      });
    });

    describe('cylinder with wall thickness', () => {
      test('creates cylinder with uniform wall', () => {
        const cyl = jscadFluent.cylinder({ outer: 6, wall: 1, height: 10 });

        // Wall of 1 means inner radius is 5
        const volume = cyl.measureVolume();
        const expectedVolume = Math.PI * (36 - 25) * 10;
        expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
      });

      test('creates cylinder with tapered wall', () => {
        const cyl = jscadFluent.cylinder({
          outer: [6, 4],
          wall: [1, 0.8],
          height: 10,
        });

        expect(cyl.measureVolume()).toBeGreaterThan(0);
      });
    });

    test('cylinder supports fluent transforms', () => {
      const cyl = jscadFluent
        .cylinder({ outer: 5, inner: 3, height: 10 })
        .translate([10, 0, 0])
        .rotate([Math.PI / 2, 0, 0]);

      const center = cyl.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10);
    });
  });
});
