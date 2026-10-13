import type { TreeNode } from './types';

export type GeometryKind = 'geom2' | 'geom3';

const kindDim: Record<GeometryKind, 2 | 3> = { geom2: 2, geom3: 3 };

const member: Record<GeometryKind, string> = { geom2: 'sides', geom3: 'polygons' };

// `in`, not isA: isA reads polygons, which makes lazy (manifold) geometry build its mesh.
function isKind(value: unknown, kind: GeometryKind): value is object {
  return (
    typeof value === 'object' && value !== null && member[kind] in value && 'transforms' in value
  );
}

// Duck-check only: a node is whatever carries the marker, never an instanceof.
export function isTreeNode(value: unknown): value is TreeNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { isTreeNode?: unknown }).isTreeNode === true
  );
}

// A node's dim maps to a kind: 2 is a geom2, 3 a geom3. Other dims do not match.
function treeNodeDim(value: unknown): 2 | 3 | undefined {
  if (!isTreeNode(value)) return undefined;
  const dim = value.dim;
  return dim === 2 || dim === 3 ? dim : undefined;
}

function kindOf(value: unknown): GeometryKind | undefined {
  if (isKind(value, 'geom2')) return 'geom2';
  if (isKind(value, 'geom3')) return 'geom3';
  const dim = treeNodeDim(value);
  return dim === 2 ? 'geom2' : dim === 3 ? 'geom3' : undefined;
}

function isPolyhedronData(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'points' in value && 'faces' in value;
}

function isSubtractOptions(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !isKind(value, 'geom2') &&
    !isKind(value, 'geom3') &&
    Object.keys(value).every((key) => key === 'carry')
  );
}

function describe(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (Array.isArray(value)) return 'an array';
  if (isKind(value, 'geom2')) return 'a geom2';
  if (isKind(value, 'geom3')) return 'a geom3';
  if (isTreeNode(value)) {
    const dim = treeNodeDim(value);
    return dim ? `a dim-${dim} tree node` : 'a tree node';
  }
  if (typeof value === 'object') {
    if ('points' in value && 'transforms' in value) return 'a path2';
    const keys = Object.keys(value);
    return keys.length ? `an object with { ${keys.join(', ')} }` : 'an empty object';
  }
  if (typeof value === 'string') return `a string (${JSON.stringify(value)})`;
  return `a ${typeof value} (${String(value)})`;
}

export function checkGeometry(value: unknown, kind: GeometryKind, where: string): void {
  if (isKind(value, kind)) return;
  const dim = treeNodeDim(value);
  if (dim !== undefined) {
    if (dim === kindDim[kind]) return;
    throw new TypeError(`${where} expected a ${kind} (fluent or raw), got a dim-${dim} tree node`);
  }
  if (isPolyhedronData(value)) {
    throw new TypeError(
      `${where} got { points, faces } data, not a ${kind}; build it with jf.polyhedron({ points, faces })`,
    );
  }
  throw new TypeError(`${where} expected a ${kind} (fluent or raw), got ${describe(value)}`);
}

// Fluent arrays are native Array subclasses today, but the tree accepts any
// object duck-typed with isFluentArray, so match that contract here too.
function isFluentArray(value: unknown): value is Iterable<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { isFluentArray?: unknown }).isFluentArray === true
  );
}

function flattenOperands(values: unknown[]): unknown[] {
  const out: unknown[] = [];
  for (const value of values) {
    if (Array.isArray(value)) out.push(...flattenOperands(value));
    else if (isFluentArray(value)) out.push(...flattenOperands([...value]));
    else out.push(value);
  }
  return out;
}

// With allowOptions, a trailing `{ carry }` is subtract's options, not an operand.
export function checkOperands(
  where: string,
  operands: unknown[],
  allowOptions: boolean,
  kind?: GeometryKind,
): GeometryKind {
  const last = operands.length - 1;
  const hasOptions = allowOptions && last >= 0 && isSubtractOptions(operands[last]);
  const items = flattenOperands(hasOptions ? operands.slice(0, last) : operands);
  const expected = kind ?? kindOf(items[0]) ?? 'geom3';
  for (const item of items) checkGeometry(item, expected, where);
  return expected;
}
