import { geometries, primitives } from '@jbroll/jscad-anchors';
import { checkGeometry, checkOperands } from '../src/checkGeometry';
import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

const node2 = {
  op: 'primitives.square',
  params: { size: 4 },
  children: [],
  isTreeNode: true,
  dim: 2,
  overlay: null,
  anchors: null,
  color: null,
};
const node3 = {
  op: 'primitives.cube',
  params: { size: 4 },
  children: [],
  isTreeNode: true,
  dim: 3,
  overlay: null,
  anchors: null,
  color: null,
};

describe('checkGeometry accepts tree nodes', () => {
  test('a dim-3 node is a geom3 and a dim-2 node is a geom2', () => {
    expect(() => checkGeometry(node3, 'geom3', 'FluentGeom3')).not.toThrow();
    expect(() => checkGeometry(node2, 'geom2', 'FluentGeom2')).not.toThrow();
  });

  test('a node of the wrong dim names the dim in the error', () => {
    expect(() => checkGeometry(node2, 'geom3', 'FluentGeom3')).toThrowError(/dim-2 tree node/);
    expect(() => checkGeometry(node3, 'geom2', 'FluentGeom2')).toThrowError(/dim-3 tree node/);
  });
});

describe('constructors accept tree nodes', () => {
  test('FluentGeom3 accepts a dim-3 node and copies its node props', () => {
    const wrapped: any = new FluentGeom3(node3 as any);
    expect(wrapped.isTreeNode).toBe(true);
    expect(wrapped.op).toBe('primitives.cube');
    expect(wrapped.dim).toBe(3);
  });

  test('FluentGeom2 accepts a dim-2 node', () => {
    const wrapped: any = new FluentGeom2(node2 as any);
    expect(wrapped.isTreeNode).toBe(true);
    expect(wrapped.dim).toBe(2);
  });

  test('constructors still reject a node of the wrong dim', () => {
    expect(() => new FluentGeom3(node2 as any)).toThrowError(TypeError);
    expect(() => new FluentGeom2(node3 as any)).toThrowError(TypeError);
  });
});

describe('wrapShape keeps its real-geometry dispatch', () => {
  test('a real geom2, geom3 or path2 is unchanged', () => {
    expect(jf.align({}, primitives.square({ size: 2 }) as any)[0]).toBeInstanceOf(FluentGeom2);
    expect(jf.align({}, primitives.cube({ size: 2 }) as any)[0]).toBeInstanceOf(FluentGeom3);
    expect(
      jf.align(
        {},
        geometries.path2.fromPoints({}, [
          [0, 0],
          [1, 0],
        ]) as any,
      )[0],
    ).toBeInstanceOf(FluentPath2);
  });
});

describe('checkOperands flattens fluent arrays and validates nodes', () => {
  test('a fluent geom3 array of nodes flattens and reports geom3', () => {
    const others = jf.geom3Array(node3 as any, { ...node3, params: { size: 2 } } as any);
    expect(checkOperands('jf.union', [others], false)).toBe('geom3');
  });

  test('a nested mix of arrays of dim-2 nodes reports geom2', () => {
    const others = jf.geom2Array(node2 as any);
    expect(checkOperands('jf.union', [others, [node2]], false)).toBe('geom2');
  });

  test('a wrong-dim node in an operand list throws', () => {
    expect(() =>
      checkOperands('jf.union', [jf.geom3Array(node3 as any), node2], false),
    ).toThrowError(/dim-2 tree node/);
  });

  test('a trailing { carry } is still options, not an operand', () => {
    expect(checkOperands('jf.subtract', [node3, { carry: { bolt: node3 } }], true)).toBe('geom3');
  });
});
