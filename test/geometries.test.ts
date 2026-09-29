import { geometries } from '@jbroll/jscad-anchors';
import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

// Faces wound clockwise seen from outside, as a hand-built polyhedron often is.
const insideOut = () =>
  jf.polyhedron({
    points: [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    faces: [
      [0, 1, 2],
      [0, 3, 1],
      [0, 2, 3],
      [1, 3, 2],
    ],
  });

describe('invert', () => {
  test('turns an inside-out solid right side out', () => {
    const solid = insideOut();
    expect(solid.measureVolume()).toBeCloseTo(-1 / 6);
    const fixed = solid.invert();
    expect(fixed).toBeInstanceOf(FluentGeom3);
    expect(fixed.measureVolume()).toBeCloseTo(1 / 6);
  });

  test('reverses a 2D shape, flipping the sign of its area', () => {
    const flipped = jf.square({ size: 2 }).invert();
    expect(flipped).toBeInstanceOf(FluentGeom2);
    expect(flipped.measureArea()).toBeCloseTo(-4);
    expect(flipped.invert().measureArea()).toBeCloseTo(4);
  });

  test('keeps anchors', () => {
    const part = jf
      .cube({ size: 2 })
      .withAnchors({ axis: { origin: [0, 0, 1], z: [0, 0, 1] } })
      .invert();
    expect(part.anchor('axis').origin).toEqual([0, 0, 1]);
  });
});

describe('clone', () => {
  test('returns a separate copy of the same class for every geometry type', () => {
    const cube = jf.cube({ size: 2 }).colorize([1, 0, 0]);
    const copy = cube.clone();
    expect(copy).toBeInstanceOf(FluentGeom3);
    expect(copy).not.toBe(cube);
    expect(copy.measureVolume()).toBeCloseTo(8);
    copy.color = [0, 0, 1, 1];
    expect(cube.color).toEqual([1, 0, 0, 1]);

    expect(jf.square({ size: 2 }).clone().measureArea()).toBeCloseTo(4);
    const path = jf.line([
      [0, 0],
      [1, 0],
    ]);
    expect(path.clone()).toBeInstanceOf(FluentPath2);
    expect(path.clone().toPoints()).toEqual(path.toPoints());
  });

  test('keeps anchors', () => {
    const part = jf
      .cube({ size: 2 })
      .withAnchors({ axis: { origin: [0, 0, 1], z: [0, 0, 1] } })
      .translate([5, 0, 0])
      .clone();
    expect(part.anchor('axis').origin).toEqual([5, 0, 1]);
  });
});

describe('jf.isGeom2, jf.isGeom3, jf.isPath2', () => {
  test('tell geometry types apart, fluent or raw', () => {
    const shapes = [
      jf.square({ size: 1 }),
      jf.cube({ size: 1 }),
      jf.line([
        [0, 0],
        [1, 0],
      ]),
    ];
    expect(shapes.map(jf.isGeom2)).toEqual([true, false, false]);
    expect(shapes.map(jf.isGeom3)).toEqual([false, true, false]);
    expect(shapes.map(jf.isPath2)).toEqual([false, false, true]);
    expect(jf.isGeom3(geometries.geom3.create())).toBe(true);
    expect(jf.isGeom2(null)).toBe(false);
    expect(jf.isGeom3([1, 2, 3])).toBe(false);
  });
});
