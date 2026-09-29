export type GeometryKind = 'geom2' | 'geom3';

const member: Record<GeometryKind, string> = { geom2: 'sides', geom3: 'polygons' };

// `in`, not isA: isA reads polygons, which makes lazy (manifold) geometry build its mesh.
function isKind(value: unknown, kind: GeometryKind): value is object {
  return (
    typeof value === 'object' && value !== null && member[kind] in value && 'transforms' in value
  );
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
  if (isPolyhedronData(value)) {
    throw new TypeError(
      `${where} got { points, faces } data, not a ${kind}; build it with jf.polyhedron({ points, faces })`,
    );
  }
  throw new TypeError(`${where} expected a ${kind} (fluent or raw), got ${describe(value)}`);
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
  const items = (hasOptions ? operands.slice(0, last) : operands).flat(Infinity) as unknown[];
  const expected = kind ?? (isKind(items[0], 'geom2') ? 'geom2' : 'geom3');
  for (const item of items) checkGeometry(item, expected, where);
  return expected;
}
