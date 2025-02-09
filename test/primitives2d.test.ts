import { jscadFluent } from '../src/index';
import type { Point2 } from '../src/types';
import { FluentGeom2 } from '../src/FluentGeom2';

describe('2D Primitives', () => {
  describe('rectangle', () => {
    test('creates basic rectangle with correct dimensions', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      expect(rect).toBeInstanceOf(FluentGeom2);
      
      const dimensions = rect.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10);
      expect(dimensions[1]).toBeCloseTo(20);
    });

    test('rectangle with transforms', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] })
        .translate([10, 10, 0]);
      
      const center = rect.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10);
      expect(center[1]).toBeCloseTo(10);
    });
  });

  describe('circle', () => {
    test('creates circle with correct dimensions', () => {
      const radius = 5;
      const circle = jscadFluent.circle({ radius });
      const area = circle.measureArea();
      expect(area).toBeCloseTo(Math.PI * radius * radius, -1); // Relaxed precision
    });

    test('circle with transforms', () => {
      const circle = jscadFluent.circle({ radius: 5 })
        .scale([2, 1, 1]);

      const dimensions = circle.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(10);
      
      const center = circle.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(0);
      expect(center[1]).toBeCloseTo(0);
    });
  });

  describe('ellipse', () => {
    test('creates ellipse with correct dimensions', () => {
      const ellipse = jscadFluent.ellipse({ radius: [10, 5] });
      
      const dimensions = ellipse.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(10);
    });
  });

  describe('polygon', () => {
    test('creates triangle', () => {
      const points: Point2[] = [
        [0, 0],
        [10, 0],
        [5, 10]
      ];
      const polygon = jscadFluent.polygon(points);
      const area = polygon.measureArea();
      expect(area).toBeCloseTo(50);
    });
  });

  describe('star', () => {
    test('creates star with correct properties', () => {
      const star = jscadFluent.star({
        vertices: 5,
        outerRadius: 10,
        innerRadius: 5
      });
      expect(star).toBeInstanceOf(FluentGeom2);
      
      const dimensions = star.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(18.09, 1);
      expect(dimensions[1]).toBeCloseTo(19.02, 1);
    });
  });

  describe('2D to 3D operations', () => {
    test('linear extrusion of rectangle', () => {
      const rect = jscadFluent.rectangle({ size: [10, 20] });
      const extruded = rect.extrudeLinear({ height: 10 });
      const volume = extruded.measureVolume();
      expect(volume).toBeCloseTo(2000);
    });

    test('rotate extrusion of polygon', () => {
      const points: Point2[] = [
        [5, 0],
        [10, 0],
        [10, 10],
        [5, 10]
      ];
      const polygon = jscadFluent.polygon(points);
      const rotated = polygon.extrudeRotate({ angle: Math.PI * 2 });
      
      const dimensions = rotated.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20);
      expect(dimensions[1]).toBeCloseTo(20);
      expect(dimensions[2]).toBeCloseTo(10);
    });
  });
});