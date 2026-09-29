import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

describe('jf.path', () => {
  test('makes an open or closed path from points', () => {
    const open = jf.path({}, [
      [0, 0],
      [10, 0],
      [10, 10],
    ]);
    expect(open).toBeInstanceOf(FluentPath2);
    expect(open.isClosed).toBe(false);
    const closed = jf.path({ closed: true }, [
      [0, 0],
      [10, 0],
      [10, 10],
    ]);
    expect(closed.isClosed).toBe(true);
    expect(closed.toPoints().length).toBe(3);
  });
});

describe('path building', () => {
  const start = () =>
    jf.line([
      [0, 0],
      [10, 0],
    ]);

  test('appendPoints adds points to the end', () => {
    const path = start().appendPoints([
      [10, 10],
      [0, 10],
    ]);
    expect(path).toBeInstanceOf(FluentPath2);
    expect(path.toPoints()).toEqual([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ]);
  });

  test('appendArc adds an arc to an endpoint', () => {
    const path = start().appendArc({ endpoint: [10, 10], radius: [5, 5], segments: 16 });
    const points = path.toPoints();
    expect(points.length).toBeGreaterThan(3);
    expect(points[points.length - 1]).toEqual([10, 10]);
  });

  test('appendBezier adds a curve through control points', () => {
    const path = start().appendBezier({
      controlPoints: [
        [15, 0],
        [15, 10],
        [10, 10],
      ],
      segments: 16,
    });
    const points = path.toPoints();
    expect(points.length).toBeGreaterThan(3);
    expect(points[points.length - 1]?.[0]).toBeCloseTo(10);
    expect(points[points.length - 1]?.[1]).toBeCloseTo(10);
  });

  test('close closes the path, and a closed path can become a polygon', () => {
    const path = start()
      .appendPoints([
        [10, 10],
        [0, 10],
      ])
      .close();
    expect(path.isClosed).toBe(true);
    expect(jf.polygon(path.toPoints()).measureArea()).toBeCloseTo(100);
  });

  test('concat joins paths end to start', () => {
    const joined = start().concat(
      jf.line([
        [10, 0],
        [10, 10],
      ]),
    );
    expect(joined.toPoints()).toEqual([
      [0, 0],
      [10, 0],
      [10, 10],
    ]);
  });

  test('reverse reverses the point order', () => {
    expect(start().reverse().toPoints()).toEqual([
      [10, 0],
      [0, 0],
    ]);
  });
});

describe('jf.curves.bezier', () => {
  const curve = jf.curves.bezier.create([
    [0, 0],
    [5, 10],
    [10, 0],
  ]);

  test('valueAt and tangentAt sample the curve', () => {
    expect(jf.curves.bezier.valueAt(0.5, curve)).toEqual([5, 5]);
    const tangent = jf.curves.bezier.tangentAt(0, curve) as number[];
    expect(tangent[0]).toBeGreaterThan(0);
    expect(tangent[1]).toBeGreaterThan(0);
  });

  test('length, lengths and arcLengthToT measure the curve', () => {
    const length = jf.curves.bezier.length(100, curve);
    expect(length).toBeGreaterThan(10);
    expect(jf.curves.bezier.lengths(10, curve).length).toBe(11);
    expect(jf.curves.bezier.arcLengthToT({ distance: length / 2 }, curve)).toBeCloseTo(0.5, 1);
  });

  test('sampled points feed jf.polygon, counter-clockwise for positive area', () => {
    const points = Array.from(
      { length: 17 },
      (_, i) => jf.curves.bezier.valueAt(i / 16, curve) as [number, number],
    );
    expect(jf.polygon(points).measureArea()).toBeLessThan(0);
    expect(jf.polygon(points.reverse()).measureArea()).toBeCloseTo(33.2, 1);
  });
});

describe('hull points', () => {
  test('hullPoints2 returns the hull points for jf.polygon', () => {
    const hull = jf.hullPoints2([
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [1, 1],
    ]);
    expect(hull.length).toBe(4);
    expect(jf.polygon(hull as [number, number][]).measureArea()).toBeCloseTo(4);
  });

  test('hullPoints3 returns points and faces for jf.polyhedron', () => {
    const corners: [number, number, number][] = [];
    for (const x of [0, 2]) for (const y of [0, 2]) for (const z of [0, 2]) corners.push([x, y, z]);
    const hull = jf.hullPoints3([...corners, [1, 1, 1]]);
    expect(hull.points.length).toBe(8);
    const solid = jf.polyhedron(hull);
    expect(solid.measureVolume()).toBeCloseTo(8);
  });
});
