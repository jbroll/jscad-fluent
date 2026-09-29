import jf from '../src/index';

describe('jf.utils', () => {
  test('converts between degrees and radians', () => {
    expect(jf.utils.degToRad(180)).toBeCloseTo(Math.PI);
    expect(jf.utils.radToDeg(Math.PI / 2)).toBeCloseTo(90);
  });

  test('radiusToSegments picks a segment count from length or angle', () => {
    expect(jf.utils.radiusToSegments(10, 1, 0)).toBe(Math.ceil(10 * Math.PI * 2));
    expect(jf.utils.radiusToSegments(10, 0, Math.PI / 8)).toBe(16);
  });

  test('flatten flattens nested arrays', () => {
    expect(jf.utils.flatten([1, [2, [3]]])).toEqual([1, 2, 3]);
  });
});

describe('jf.maths', () => {
  test('constants include TAU and EPS', () => {
    expect(jf.maths.constants.TAU).toBeCloseTo(Math.PI * 2);
    expect(jf.maths.constants.EPS).toBeGreaterThan(0);
  });

  test('vec2 and vec3 do vector arithmetic', () => {
    expect(jf.maths.vec3.add(jf.maths.vec3.create(), [1, 2, 3], [1, 1, 1])).toEqual([2, 3, 4]);
    expect(jf.maths.vec2.length([3, 4])).toBeCloseTo(5);
  });

  test('mat4 builds matrices for transform()', () => {
    const { mat4 } = jf.maths;
    const matrix = mat4.fromTranslation(mat4.create(), [5, 0, 0]);
    const [min] = jf.cube({ size: 2 }).transform(matrix).measureBoundingBox();
    expect(min[0]).toBeCloseTo(4);
  });

  test('constants are listed one by one', () => {
    const { TAU, EPS, NEPS, spatialResolution } = jf.maths.constants;
    expect(TAU).toBeCloseTo(Math.PI * 2);
    expect(EPS).toBeGreaterThan(0);
    expect(NEPS).toBeGreaterThan(0);
    expect(spatialResolution).toBeGreaterThan(0);
  });

  test('vec4, line2, line3 and plane', () => {
    const { vec4, line2, line3, plane } = jf.maths;
    expect(vec4.dot([1, 2, 3, 4], [1, 1, 1, 1])).toBe(10);
    const xAxis = line2.fromPoints(line2.create(), [0, 0], [10, 0]);
    expect(line2.distanceToPoint(xAxis, [5, 3])).toBeCloseTo(3);
    const zAxis = line3.fromPoints(line3.create(), [0, 0, 0], [0, 0, 10]);
    expect(line3.distanceToPoint(zAxis, [3, 4, 7])).toBeCloseTo(5);
    const ground = plane.fromPoints(plane.create(), [0, 0, 0], [1, 0, 0], [0, 1, 0]);
    expect(plane.signedDistanceToPoint(ground, [2, 2, 5])).toBeCloseTo(5);
  });

  test('utils', () => {
    const { utils } = jf.maths;
    expect(
      utils.area([
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 2],
      ]),
    ).toBeCloseTo(4);
    expect(utils.sin(Math.PI)).toBe(0);
    expect(utils.solve2Linear(1, 0, 0, 1, 3, 4)).toEqual([3, 4]);
  });
});
