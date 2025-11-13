import { jscadFluent } from '../src/index';

describe('Hull Operations', () => {
  describe('2D Hull Operations', () => {
    test('hull of two rectangles using append', () => {
      const rect1 = jscadFluent.rectangle({ size: [10, 10] });
      const rect2 = jscadFluent.rectangle({ size: [10, 10] }).translate([20, 0, 0]);

      const result = rect1.append(rect2).hull();
      const area = result.measureArea();

      // Area should be greater than individual rectangles
      expect(area).toBeGreaterThan(200);

      const dimensions = result.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(30); // Full width including translation
      expect(dimensions[1]).toBeCloseTo(10); // Height remains same
    });

    test('hull chain of three circles using append', () => {
      const circle1 = jscadFluent.circle({ radius: 5 });
      const circle2 = jscadFluent.circle({ radius: 5 }).translate([15, 0, 0]);
      const circle3 = jscadFluent.circle({ radius: 5 }).translate([15, 15, 0]);

      const result = circle1.append(circle2).append(circle3).hullChain();
      const area = result.measureArea();

      // Area should be greater than individual circles
      const singleCircleArea = Math.PI * 25;
      expect(area).toBeGreaterThan(singleCircleArea * 2);

      const bbox = result.measureBoundingBox();
      expect(bbox[1][0] - bbox[0][0]).toBeCloseTo(25); // X span
      expect(bbox[1][1] - bbox[0][1]).toBeCloseTo(25); // Y span
    });
  });

  describe('3D Hull Operations', () => {
    test('hull of two cubes using append', () => {
      const cube1 = jscadFluent.cube({ size: 10 });
      const cube2 = jscadFluent.cube({ size: 10 }).translate([20, 0, 0]);

      const result = cube1.append(cube2).hull();
      const volume = result.measureVolume();

      // Volume should be greater than individual cubes
      expect(volume).toBeGreaterThan(2000);

      const dimensions = result.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(30); // Full width including translation
      expect(dimensions[1]).toBeCloseTo(10); // Depth remains same
      expect(dimensions[2]).toBeCloseTo(10); // Height remains same
    });

    test('hull chain of three spheres using append', () => {
      const sphere1 = jscadFluent.sphere({ radius: 5 });
      const sphere2 = jscadFluent.sphere({ radius: 5 }).translate([15, 0, 0]);
      const sphere3 = jscadFluent.sphere({ radius: 5 }).translate([15, 15, 15]);

      const result = sphere1.append(sphere2).append(sphere3).hullChain();
      const volume = result.measureVolume();

      // Volume should be greater than individual spheres
      const singleSphereVolume = (4 / 3) * Math.PI * 125;
      expect(volume).toBeGreaterThan(singleSphereVolume * 2);

      const bbox = result.measureBoundingBox();
      expect(bbox[1][0] - bbox[0][0]).toBeCloseTo(25); // X span
      expect(bbox[1][1] - bbox[0][1]).toBeCloseTo(25); // Y span
      expect(bbox[1][2] - bbox[0][2]).toBeCloseTo(25); // Z span
    });
  });

  describe('Mixed Operations', () => {
    test('hull chain with mixed transformations', () => {
      const cube1 = jscadFluent.cube({ size: 10 });
      const cube2 = jscadFluent
        .cube({ size: 10 })
        .translate([15, 0, 0])
        .rotateZ(Math.PI / 4);
      const cube3 = jscadFluent.cube({ size: 10 }).translate([15, 15, 15]).scale([1.5, 1.5, 1.5]);

      const result = cube1.append(cube2).append(cube3).hullChain();
      const volume = result.measureVolume();

      // Volume should be greater than individual cubes
      expect(volume).toBeGreaterThan(3000);

      const center = result.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeGreaterThan(0);
      expect(center[1]).toBeGreaterThan(0);
      expect(center[2]).toBeGreaterThan(0);
    });
  });
});
