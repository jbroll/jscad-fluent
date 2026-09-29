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
});
