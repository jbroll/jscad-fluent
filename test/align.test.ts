import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentGeom3Array } from '../src/gen/FluentGeom3Array';
import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

describe('align method', () => {
  test('moves a solid so its bounds meet relativeTo', () => {
    const cube = jf
      .cube({ size: 2 })
      .align({ modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0] });
    expect(cube).toBeInstanceOf(FluentGeom3);
    expect(cube.measureBoundingBox()).toEqual([
      [0, 0, 0],
      [2, 2, 2],
    ]);
  });

  test('defaults to centering X and Y and resting on Z = 0', () => {
    const [min, max] = jf.cube({ size: 2 }).translate([7, 7, 7]).align({}).measureBoundingBox();
    expect(min).toEqual([-1, -1, 0]);
    expect(max).toEqual([1, 1, 2]);
  });

  test('aligns 2D shapes and paths', () => {
    const square = jf.square({ size: 2 }).align({ modes: ['max', 'none'], relativeTo: [10] });
    expect(square).toBeInstanceOf(FluentGeom2);
    expect(square.measureBoundingBox()[1][0]).toBeCloseTo(10);
    const line = jf
      .line([
        [0, 0],
        [4, 0],
      ])
      .align({ modes: ['center'] });
    expect(line).toBeInstanceOf(FluentPath2);
    expect(line.measureBoundingBox()[0][0]).toBeCloseTo(-2);
  });

  test('carries anchors along', () => {
    const part = jf
      .cube({ size: 2 })
      .withAnchors({ tip: { origin: [0, 0, 1], z: [0, 0, 1] } })
      .align({ modes: ['none', 'none', 'min'], relativeTo: [0, 0, 0] });
    expect(part.anchor('tip').origin).toEqual([0, 0, 2]);
  });
});

describe('jf.align', () => {
  test('aligns shapes one by one', () => {
    const [a, b] = jf.align(
      { modes: ['min', 'none', 'none'], relativeTo: [0, null, null] },
      jf.cube({ size: 2 }),
      jf.cube({ size: 4 }).translate([10, 0, 0]),
    );
    expect(a).toBeInstanceOf(FluentGeom3);
    expect(b).toBeInstanceOf(FluentGeom3);
    expect(a?.measureBoundingBox()[0][0]).toBeCloseTo(0);
    expect(b?.measureBoundingBox()[0][0]).toBeCloseTo(0);
  });

  test('aligns a group as one with grouped: true', () => {
    const [a, b] = jf.align(
      { modes: ['min', 'none', 'none'], relativeTo: [0, null, null], grouped: true },
      [jf.cube({ size: 2 }).translate([5, 0, 0]), jf.cube({ size: 2 }).translate([15, 0, 0])],
    );
    expect(a?.measureBoundingBox()[0][0]).toBeCloseTo(0);
    expect(b?.measureBoundingBox()[0][0]).toBeCloseTo(10);
  });

  test('wraps each result by its type', () => {
    const [shape, path] = jf.align(
      { modes: ['center', 'center', 'none'] },
      jf.square({ size: 2 }),
      jf.line([
        [0, 0],
        [4, 0],
      ]),
    );
    expect(shape).toBeInstanceOf(FluentGeom2);
    expect(path).toBeInstanceOf(FluentPath2);
  });
});

describe('array align and transforms', () => {
  test('aligns an array as a group and keeps its class', () => {
    const arr = jf
      .array(jf.cube({ size: 2 }).translate([5, 0, 0]), jf.cube({ size: 2 }).translate([15, 0, 0]))
      .align({ modes: ['min', 'none', 'none'], relativeTo: [0, null, null], grouped: true });
    expect(arr).toBeInstanceOf(FluentGeom3Array);
    expect(jf.measureAggregateBoundingBox(arr)[0][0]).toBeCloseTo(0);
    expect(arr.hull().measureVolume()).toBeCloseTo(12 * 2 * 2);
  });

  test('transforms a one-element array', () => {
    const arr = jf.array(jf.cube({ size: 2 })).translate([5, 0, 0]);
    expect(arr.length).toBe(1);
    expect(jf.measureAggregateBoundingBox(arr)[0][0]).toBeCloseTo(4);
  });
});
