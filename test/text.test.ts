import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3Array } from '../src/gen/FluentGeom3Array';
import { FluentPath2 } from '../src/gen/FluentPath2';
import { FluentPath2Array } from '../src/gen/FluentPath2Array';
import jf from '../src/index';

describe('jf.vectorText', () => {
  test('returns one open path per stroke', () => {
    const strokes = jf.vectorText({ height: 10 }, 'HI');
    expect(strokes).toBeInstanceOf(FluentPath2Array);
    expect(strokes.length).toBe(4);
    for (const stroke of strokes) {
      expect(stroke).toBeInstanceOf(FluentPath2);
      expect((stroke as FluentPath2).isClosed).toBe(false);
    }
  });

  test('takes the text alone, or in options.input', () => {
    expect(jf.vectorText('HI').length).toBe(4);
    expect(jf.vectorText({ input: 'HI' }).length).toBe(4);
  });

  test('height sets lowercase height; uppercase is 1.5 times taller', () => {
    const [min, max] = jf.measureAggregateBoundingBox(jf.vectorText({ height: 20 }, 'H'));
    expect(max[1] - min[1]).toBeCloseTo(30);
    const [xMin, xMax] = jf.measureAggregateBoundingBox(jf.vectorText({ height: 20 }, 'x'));
    expect(xMax[1] - xMin[1]).toBeCloseTo(20);
  });

  test('strokes expand into areas and extrude into solids', () => {
    const area = jf.union(jf.vectorText({ height: 10 }, 'HI').expand({ delta: 1 }));
    expect(area).toBeInstanceOf(FluentGeom2);
    expect(area.measureArea()).toBeGreaterThan(0);
    const solids = jf.vectorText({ height: 10 }, 'HI').extrudeRectangular({ size: 1, height: 2 });
    expect(solids).toBeInstanceOf(FluentGeom3Array);
    expect(jf.measureAggregateVolume(solids)).toBeGreaterThan(0);
  });
});

describe('jf.vectorChar', () => {
  test('returns the width, height and strokes of one character', () => {
    const char = jf.vectorChar({ height: 10 }, 'A');
    expect(char.width).toBeGreaterThan(0);
    expect(char.height).toBeCloseTo(10);
    expect(char.segments).toBeInstanceOf(FluentPath2Array);
    expect(char.segments.length).toBe(3);
  });

  test('takes the character alone', () => {
    expect(jf.vectorChar('A').segments.length).toBe(3);
  });
});
