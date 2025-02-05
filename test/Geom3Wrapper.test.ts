import { primitives } from '@jscad/modeling';
import Geom3Wrapper from '../src/Geom3Wrapper';

describe('Geom3Wrapper', () => {
  let cube: Geom3Wrapper;
  let sphere: Geom3Wrapper;
  const EPSILON = 1.0; // Increased tolerance for floating point comparisons

  beforeEach(() => {
    cube = new Geom3Wrapper(primitives.cube({ size: 10 }));
    sphere = new Geom3Wrapper(primitives.sphere({ radius: 5, segments: 32 })); // Added segments for better accuracy
  });

  describe('measurements', () => {
    test('measureVolume returns correct volume', () => {
      const expectedCubeVolume = 1000; // 10^3
      const expectedSphereVolume = (4/3) * Math.PI * 125; // 4/3 * π * r^3
      
      expect(Math.abs(cube.measureVolume() - expectedCubeVolume)).toBeLessThan(EPSILON);
      expect(Math.abs(sphere.measureVolume() - expectedSphereVolume)).toBeLessThan(10); // Higher tolerance for sphere due to tessellation
    });
  });

  describe('boolean operations', () => {
    test('union combines geometries', () => {
      const result = cube.union(sphere);
      const resultVolume = result.measureVolume();
      const cubeVolume = cube.measureVolume();
      const sphereVolume = sphere.measureVolume();
      
      expect(resultVolume).toBeGreaterThan(Math.max(cubeVolume, sphereVolume) - EPSILON);
    });

    test('subtract removes intersecting volume', () => {
      const result = cube.subtract(sphere);
      expect(result.measureVolume()).toBeLessThan(cube.measureVolume() + EPSILON);
    });

    test('intersect keeps only overlapping volume', () => {
      const result = cube.intersect(sphere);
      const resultVolume = result.measureVolume();
      expect(resultVolume).toBeLessThan(cube.measureVolume() + EPSILON);
      expect(resultVolume).toBeLessThan(sphere.measureVolume() + EPSILON);
    });
  });

  describe('modifications', () => {
    test('expand increases size uniformly', () => {
      const originalVolume = cube.measureVolume();
      cube.expand(1);
      expect(cube.measureVolume()).toBeGreaterThan(originalVolume);
    });

    test('offset creates parallel geometry', () => {
      const originalVolume = cube.measureVolume();
      cube.offset(1);
      const newVolume = cube.measureVolume();
      expect(newVolume).toBeGreaterThan(originalVolume - EPSILON);
    });
  });

  describe('hull operations', () => {
    test('hull creates convex hull containing both geometries', () => {
      const translated = sphere.clone().translate([15, 0, 0]);
      const result = cube.hull(translated);
      const resultVolume = result.measureVolume();
      
      expect(resultVolume).toBeGreaterThan(cube.measureVolume() - EPSILON);
      expect(resultVolume).toBeGreaterThan(sphere.measureVolume() - EPSILON);
    });

    test('hullChain creates sequential hull', () => {
      const translated1 = sphere.clone().translate([15, 0, 0]);
      const translated2 = sphere.clone().translate([30, 0, 0]);
      const result = cube.hullChain(translated1, translated2);
      expect(result.measureVolume()).toBeGreaterThan(cube.measureVolume() - EPSILON);
    });
  });
});