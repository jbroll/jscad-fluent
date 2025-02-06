import { jscadFluent } from '../src/fluent-index';
import { FluentGeom2 } from '../src/fluent-geom2';
import type { Point2 } from '../src/fluent-types';

describe('2D Primitives', () => {
  describe('rectangle', () => {
    test('creates basic rectangle with correct dimensions', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      expect(rect).toBeInstanceOf(FluentGeom2);
      
      const dimensions = rect.measureDimensions();
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(20);
    });

    test('rectangle with transforms', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] })
        .translate([5, 10, 0])
        .rotate([0, 0, Math.PI/4])
        .scale([2, 1, 1]);
      
      const center = rect.measureCenter();
      expect(center[0]).toBeCloseTo(5);
      expect(center[1]).toBeCloseTo(10);
      
      const dimensions = rect.measureDimensions();
      expect(dimensions[0]).toBeCloseTo(20);  // Width doubled by scale
    });
  });

  describe('circle', () => {
    test('creates circle with correct dimensions', () => {
      const radius = 5;
      const circle = jscadFluent.circle({ radius });
      expect(circle).toBeInstanceOf(FluentGeom2);
      
      const area = circle.measureArea();
      expect(area).toBeCloseTo(Math.PI * radius * radius);
      
      const dimensions = circle.measureDimensions();
      expect(dimensions[0]).toBeCloseTo(radius * 2);
      expect(dimensions[1]).toBeCloseTo(radius * 2);
    });

    test('circle with transforms', () => {
      const circle = jscadFluent.circle({ radius: 5 })
        .translate([10, 0, 0])
        .scale([2, 1, 1]);

      const dimensions = circle.measureDimensions();
      expect(dimensions[0]).toBeCloseTo(20);  // Diameter doubled by scale
      expect(dimensions[1]).toBeCloseTo(10);  // Original diameter
      
      const center = circle.measureCenter();
      expect(center[0]).toBeCloseTo(10);
      expect(center[1]).toBeCloseTo(0);
    });
  });

  describe('polygon', () => {
    test('creates triangle with correct area', () => {
      const points: Point2[] = [
        [0, 0],
        [10, 0],
        [5, 10]
      ];
      const triangle = jscadFluent.polygon(points);
      expect(triangle).toBeInstanceOf(FluentGeom2);
      
      const area = triangle.measureArea();
      expect(area).toBeCloseTo(50);  // Base * Height / 2
    });

    test('polygon with boolean operations', () => {
      const poly1 = jscadFluent.polygon([
        [0, 0], [10, 0], [10, 10], [0, 10]
      ]);
      const poly2 = jscadFluent.polygon([
        [5, 5], [15, 5], [15, 15], [5, 15]
      ]);
      
      const union = poly1.union(poly2);
      expect(union.measureArea()).toBeGreaterThan(100);  // Original square area
      
      const intersection = poly1.intersect(poly2);
      expect(intersection.measureArea()).toBeCloseTo(25);  // 5x5 overlap
      
      const difference = poly1.subtract(poly2);
      expect(difference.measureArea()).toBeLessThan(100);  // Less than original
    });
  });

  describe('star', () => {
    test('creates star with correct points', () => {
      const star = jscadFluent.star({
        vertices: 5,
        outerRadius: 10,
        innerRadius: 5
      });
      expect(star).toBeInstanceOf(FluentGeom2);
      
      const points = star.toPoints();
      expect(points.length).toBe(10);  // 5 vertices * 2 points per vertex
    });
  });

  describe('2D boolean operations', () => {
    test('union combines shapes', () => {
      const rect = jscadFluent.rectangle({ size: [10, 10] });
      const circle = jscadFluent.circle({ radius: 5 })
        .translate([10, 0, 0]);
      
      const combined = rect.union(circle);
      expect(combined.measureArea()).toBeGreaterThan(100);  // Square area
    });
    
    test('subtract removes overlap', () => {
      const rect = jscadFluent.rectangle({ size: [10, 10] });
      const circle = jscadFluent.circle({ radius: 3 });
      
      const result = rect.subtract(circle);
      expect(result.measureArea()).toBeLessThan(100);  // Less than square area
    });
  });

  describe('2D to 3D operations', () => {
    test('linear extrusion creates 3D geometry', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      const extruded = rect.extrudeLinear({ height: 10 });
      
      const volume = extruded.measureVolume();
      expect(volume).toBeCloseTo(2000);  // 10 * 20 * 10
      
      const dimensions = extruded.measureDimensions();
      expect(dimensions[2]).toBeCloseTo(10);  // Height
    });
  });
});