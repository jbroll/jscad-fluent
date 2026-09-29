import { primitives } from '@jbroll/jscad-anchors';
import jf from '../src/index';

const polyData = {
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  faces: [
    [0, 2, 1],
    [0, 1, 3],
    [0, 3, 2],
    [1, 2, 3],
  ],
};
const fix = 'jf.polyhedron({ points, faces })';

const junk: [string, unknown][] = [
  ['a number', 5],
  ['a string', 'cube'],
  ['a plain object', { size: 10 }],
  ['null', null],
  ['undefined', undefined],
];

function rejects(fn: () => unknown, message: string | RegExp): void {
  expect(fn).toThrowError(TypeError);
  expect(fn).toThrowError(message);
}

describe('constructors reject non-geometry', () => {
  test('FluentGeom3 names jf.polyhedron for { points, faces } data', () => {
    rejects(() => new jf.FluentGeom3(polyData as any), fix);
    rejects(() => new jf.FluentGeom3(polyData as any), /^FluentGeom3 got \{ points, faces \} data/);
  });

  test('FluentGeom2 names jf.polyhedron for { points, faces } data', () => {
    rejects(() => new jf.FluentGeom2(polyData as any), fix);
  });

  test.each(junk)('FluentGeom3 rejects %s', (_, value) => {
    rejects(() => new jf.FluentGeom3(value as any), /FluentGeom3 expected a geom3/);
  });

  test.each(junk)('FluentGeom2 rejects %s', (_, value) => {
    rejects(() => new jf.FluentGeom2(value as any), /FluentGeom2 expected a geom2/);
  });

  test('FluentGeom3 rejects a geom2 and FluentGeom2 rejects a geom3', () => {
    rejects(() => new jf.FluentGeom3(primitives.square({ size: 1 }) as any), /got a geom2/);
    rejects(() => new jf.FluentGeom2(primitives.cube({ size: 1 }) as any), /got a geom3/);
  });

  test('accept raw modeling geometry and fluent shapes', () => {
    expect(new jf.FluentGeom3(primitives.cube({ size: 2 })).measureVolume()).toBeCloseTo(8);
    expect(new jf.FluentGeom3(jf.cube({ size: 2 })).measureVolume()).toBeCloseTo(8);
    expect(new jf.FluentGeom2(primitives.square({ size: 2 })).measureArea()).toBeCloseTo(4);
    expect(new jf.FluentGeom2(jf.square({ size: 2 })).measureArea()).toBeCloseTo(4);
  });
});

describe('boolean methods reject non-geometry', () => {
  const ops = ['union', 'subtract', 'intersect'] as const;

  test.each(ops)('FluentGeom3.%s names jf.polyhedron for { points, faces } data', (op) => {
    const cube: any = jf.cube({ size: 2 });
    rejects(() => cube[op](polyData), fix);
    rejects(() => cube[op](polyData), new RegExp(`^FluentGeom3.${op} got`));
    rejects(() => cube[op]([jf.cube({ size: 1 }), polyData]), fix);
  });

  test.each(ops)('FluentGeom2.%s names jf.polyhedron for { points, faces } data', (op) => {
    const square: any = jf.square({ size: 2 });
    rejects(() => square[op](polyData), fix);
  });

  for (const op of ops) {
    test.each(junk)(`FluentGeom3.${op} rejects %s`, (_, value) => {
      const cube: any = jf.cube({ size: 2 });
      rejects(() => cube[op](jf.cube({ size: 1 }), value), `FluentGeom3.${op} expected a geom3`);
    });

    test.each(junk)(`FluentGeom2.${op} rejects %s`, (_, value) => {
      const square: any = jf.square({ size: 2 });
      rejects(() => square[op](value), `FluentGeom2.${op} expected a geom2`);
    });
  }

  test('a geom3 method rejects a geom2 operand', () => {
    const cube: any = jf.cube({ size: 2 });
    rejects(() => cube.union(jf.square({ size: 1 })), /FluentGeom3.union expected a geom3/);
  });

  test('subtract still takes { carry } options last', () => {
    const hole = jf.cylinder({ radius: 1, height: 20 }).withAnchors({
      top: { origin: [0, 0, 10], z: [0, 0, 1] },
    });
    const plate = jf.cuboid({ size: [10, 10, 2] }).subtract(hole, { carry: { bolt: hole } });
    expect(Object.keys(plate.anchors?.frames ?? {})).toContain('bolt.top');
  });

  test('methods accept raw modeling geometry', () => {
    const raw: any = primitives.cube({ size: 10, center: [5, 0, 0] });
    const result = jf.cube({ size: 10 }).union(raw);
    const [x] = result.measureDimensions() as number[];
    expect(x).toBeCloseTo(15);
  });
});

describe('top-level booleans reject non-geometry', () => {
  const ops = ['union', 'subtract', 'intersect'] as const;

  test.each(ops)('jf.%s names jf.polyhedron for { points, faces } data', (op) => {
    const fn = jf[op] as any;
    rejects(() => fn(jf.cube({ size: 2 }), polyData), fix);
    rejects(() => fn(polyData, jf.cube({ size: 2 })), fix);
    rejects(() => fn([jf.cube({ size: 2 }), polyData]), new RegExp(`^jf.${op} got`));
  });

  for (const op of ops) {
    test.each(junk)(`jf.${op} rejects %s`, (_, value) => {
      const fn = jf[op] as any;
      rejects(() => fn(jf.cube({ size: 2 }), value), `jf.${op} expected a geom3`);
      rejects(() => fn(jf.square({ size: 2 }), value), `jf.${op} expected a geom2`);
    });
  }

  test('jf.union wraps raw geom2 as FluentGeom2', () => {
    const result = jf.union(
      primitives.square({ size: 2 }) as any,
      primitives.square({ size: 2, center: [1, 0] }) as any,
    );
    expect(result).toBeInstanceOf(jf.FluentGeom2);
    expect(result.measureArea()).toBeCloseTo(6);
  });

  test('jf.subtract still takes { carry } options last', () => {
    const hole = jf.cylinder({ radius: 1, height: 20 }).withAnchors({
      top: { origin: [0, 0, 10], z: [0, 0, 1] },
    });
    const plate = jf.subtract(jf.cuboid({ size: [10, 10, 2] }), hole, { carry: { bolt: hole } });
    expect(Object.keys(plate.anchors?.frames ?? {})).toContain('bolt.top');
  });
});
