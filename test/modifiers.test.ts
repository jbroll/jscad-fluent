import { geometries } from '@jbroll/jscad-anchors';
import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom2Array } from '../src/gen/FluentGeom2Array';
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

describe('geom2 scission', () => {
  const areas = (pieces: FluentGeom2Array) => pieces.measureArea().sort((a, b) => a - b);

  test('splits two separate squares into two shapes', () => {
    const pair = jf.union(jf.square({ size: 2 }), jf.square({ size: 2 }).translate([5, 0, 0]));
    const pieces = pair.scission();
    expect(pieces).toBeInstanceOf(FluentGeom2Array);
    expect(pieces.length).toBe(2);
    expect(pieces[0]).toBeInstanceOf(FluentGeom2);
    expect(areas(pieces)[0]).toBeCloseTo(4);
    expect(areas(pieces)[1]).toBeCloseTo(4);
    const centers = pieces
      .measureCenter()
      .map(([x]) => x)
      .sort((a, b) => a - b);
    expect(centers[0]).toBeCloseTo(0);
    expect(centers[1]).toBeCloseTo(5);
  });

  test('keeps a hole with the outline around it', () => {
    const ring = jf.square({ size: 10 }).subtract(jf.square({ size: 4 }));
    const pieces = ring.scission();
    expect(pieces.length).toBe(1);
    expect(pieces[0]?.toOutlines().length).toBe(2);
    expect(pieces[0]?.measureArea()).toBeCloseTo(84);
  });

  test('gives a hole to the smallest outline that contains it, for nested islands', () => {
    const ring = jf.square({ size: 20 }).subtract(jf.square({ size: 12 }));
    const island = jf.square({ size: 6 }).subtract(jf.square({ size: 2 }));
    const pieces = jf.union(ring, island).scission();
    expect(pieces.length).toBe(2);
    expect(areas(pieces)[0]).toBeCloseTo(32);
    expect(areas(pieces)[1]).toBeCloseTo(256);
    for (const piece of pieces) expect(piece.toOutlines().length).toBe(2);
  });

  test('keeps the color and returns an empty array for an empty shape', () => {
    const red = jf
      .union(jf.square({ size: 2 }), jf.square({ size: 2 }).translate([5, 0, 0]))
      .colorize([1, 0, 0]);
    for (const piece of red.scission()) expect(piece.color).toEqual([1, 0, 0, 1]);
    expect(new FluentGeom2(geometries.geom2.create()).scission().length).toBe(0);
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
