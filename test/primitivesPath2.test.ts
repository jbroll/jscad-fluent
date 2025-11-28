import { FluentPath2 } from '../src/gen/FluentPath2';
import jscadFluent from '../src/index';
import type { Point2 } from '../src/types';

describe('Path2 Primitives', () => {
  describe('arc', () => {
    test('creates basic arc with correct properties', () => {
      const arc = jscadFluent.arc({
        center: [0, 0],
        radius: 10,
        startAngle: 0,
        endAngle: Math.PI,
      });
      expect(arc).toBeInstanceOf(FluentPath2);

      const dimensions = arc.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20, 1); // diameter
      expect(dimensions[1]).toBeCloseTo(10, 1); // radius (half-circle)
    });

    test('arc with transforms', () => {
      const arc = jscadFluent
        .arc({
          center: [0, 0],
          radius: 10,
          startAngle: 0,
          endAngle: Math.PI * 2,
        })
        .translate([5, 5, 0]);

      const center = arc.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(5, 1);
      expect(center[1]).toBeCloseTo(5, 1);
    });
  });

  describe('line', () => {
    test('creates line with correct length', () => {
      const points: Point2[] = [
        [0, 0],
        [10, 0],
      ];
      const line = jscadFluent.line(points);
      expect(line).toBeInstanceOf(FluentPath2);

      const dimensions = line.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10, 1);
      expect(dimensions[1]).toBeCloseTo(0, 1);
    });

    test('line with multiple segments', () => {
      const points: Point2[] = [
        [0, 0],
        [10, 0],
        [10, 10],
      ];
      const line = jscadFluent.line(points);

      const bbox = line.measureBoundingBox();
      expect(bbox[1][0] - bbox[0][0]).toBeCloseTo(10, 1); // X span
      expect(bbox[1][1] - bbox[0][1]).toBeCloseTo(10, 1); // Y span
    });
  });
});
