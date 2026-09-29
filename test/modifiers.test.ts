import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentGeom3Array } from '../src/gen/FluentGeom3Array';
import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

describe('scission', () => {
  test('splits a solid into its disconnected pieces', () => {
    const pair = jf.union(jf.cube({ size: 2 }), jf.cube({ size: 2 }).translate([5, 0, 0]));
    const pieces = pair.scission();
    expect(pieces).toBeInstanceOf(FluentGeom3Array);
    expect(pieces.length).toBe(2);
    for (const piece of pieces) {
      expect(piece).toBeInstanceOf(FluentGeom3);
      expect(piece.measureVolume()).toBeCloseTo(8);
    }
  });

  test('returns one piece for a connected solid', () => {
    const pieces = jf.cube({ size: 2 }).scission();
    expect(pieces.length).toBe(1);
    expect(pieces[0]?.measureVolume()).toBeCloseTo(8);
  });
});

describe('generalize', () => {
  test('triangulates a solid without changing its volume', () => {
    const cube = jf.cube({ size: 2 }).generalize({ triangulate: true });
    expect(cube).toBeInstanceOf(FluentGeom3);
    expect(cube.toPolygons().every((p) => p.vertices.length === 3)).toBe(true);
    expect(cube.measureVolume()).toBeCloseTo(8);
  });

  test('returns the same class for 2D shapes and paths', () => {
    expect(jf.square({ size: 2 }).generalize({ snap: true })).toBeInstanceOf(FluentGeom2);
    expect(
      jf
        .line([
          [0, 0],
          [1, 1],
        ])
        .generalize({}),
    ).toBeInstanceOf(FluentPath2);
  });
});

describe('snap', () => {
  test('snaps each geometry type to its precision', () => {
    expect(jf.cube({ size: 2 }).snap().measureVolume()).toBeCloseTo(8);
    expect(jf.square({ size: 2 }).snap().measureArea()).toBeCloseTo(4);
    expect(
      jf
        .line([
          [0, 0],
          [1, 1],
        ])
        .snap(),
    ).toBeInstanceOf(FluentPath2);
  });
});

describe('retessellate', () => {
  test('merges coplanar polygons back together', () => {
    const triangulated = jf.cube({ size: 2 }).generalize({ triangulate: true });
    const merged = triangulated.retessellate();
    expect(merged).toBeInstanceOf(FluentGeom3);
    expect(merged.toPolygons().length).toBeLessThan(triangulated.toPolygons().length);
    expect(merged.measureVolume()).toBeCloseTo(8);
  });

  test('keeps anchors', () => {
    const part = jf
      .cube({ size: 2 })
      .withAnchors({ tip: { origin: [0, 0, 1], z: [0, 0, 1] } })
      .retessellate();
    expect(part.anchor('tip').origin).toEqual([0, 0, 1]);
  });
});
