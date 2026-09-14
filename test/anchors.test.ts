import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import jf from '../src/index';
import type { FrameInput } from '../src/types';

const expectVec = (actual: readonly number[], expected: number[]) => {
  expected.forEach((v, i) => expect(actual[i]).toBeCloseTo(v));
};

const axisFrame: FrameInput = { origin: [0, 0, 0], z: [0, 0, 1] };

describe('anchors', () => {
  test('withAnchors keeps the fluent class and stores local frames', () => {
    const part = jf.cube({ size: 10 }).withAnchors({ axis: axisFrame });
    expect(part).toBeInstanceOf(FluentGeom3);
    expect(Object.keys(part.anchors?.frames ?? {})).toEqual(['axis']);
  });

  test('anchor returns the world frame after transforms', () => {
    const part = jf
      .cube({ size: 10 })
      .withAnchors({ axis: axisFrame })
      .rotateX(Math.PI / 2)
      .translate([5, 0, 0]);
    const f = part.anchor('axis');
    expectVec(f.origin, [5, 0, 0]);
    expectVec(f.z, [0, -1, 0]);
  });

  test('anchor resolves bounding-box defaults', () => {
    const f = jf.cube({ size: 10 }).translate([0, 0, 5]).anchor('top');
    expectVec(f.origin, [0, 0, 10]);
    expectVec(f.z, [0, 0, 1]);
  });

  test('attachTo puts the child anchor on the parent anchor', () => {
    const base = jf.cube({ size: 10 });
    const post = jf.cylinder({ radius: 1, height: 4 }).attachTo(base, 'top', 'bottom');
    expect(post).toBeInstanceOf(FluentGeom3);
    const [min, max] = post.measureBoundingBox();
    expect(min[2]).toBeCloseTo(5);
    expect(max[2]).toBeCloseTo(9);
  });

  test('attachTo passes overlap through', () => {
    const base = jf.cube({ size: 10 });
    const post = jf.cube({ size: 2 }).attachTo(base, 'top', 'bottom', { overlap: 1 });
    expect(post.measureBoundingBox()[0][2]).toBeCloseTo(4);
  });

  test('alignTo places the child against the parent bounding box', () => {
    const base = jf.cube({ size: 10 });
    const block = jf.cube({ size: 2 }).alignTo(base, 'right');
    const [min, max] = block.measureBoundingBox();
    expect(min[0]).toBeCloseTo(5);
    expect(max[0]).toBeCloseTo(7);
    expect(min[2]).toBeCloseTo(-1);
  });

  test('alignTo passes inside through', () => {
    const base = jf.cube({ size: 10 });
    const block = jf.cube({ size: 2 }).alignTo(base, 'right', { inside: true });
    expect(block.measureBoundingBox()[1][0]).toBeCloseTo(5);
  });

  test('subtract carries tool anchors under a prefix', () => {
    const plate = jf.cuboid({ size: [20, 20, 2] }).withAnchors({ face: axisFrame });
    const hole = jf
      .cylinder({ radius: 1, height: 4 })
      .withAnchors({ axis: axisFrame })
      .translate([5, 0, 0]);
    const result = plate.subtract(hole, { carry: { bolt1: hole } });
    expect(result).toBeInstanceOf(FluentGeom3);
    expect(Object.keys(result.anchors?.frames ?? {}).sort()).toEqual(['bolt1.axis', 'face']);
    expectVec(result.anchor('bolt1.axis').origin, [5, 0, 0]);
    expect(result.measureVolume()).toBeLessThan(800);
  });

  test('subtract drops tool anchors without carry', () => {
    const plate = jf.cuboid({ size: [20, 20, 2] });
    const hole = jf.cylinder({ radius: 1, height: 4 }).withAnchors({ axis: axisFrame });
    expect(plate.subtract(hole).anchors?.frames ?? {}).toEqual({});
  });

  test('union merges anchors, earlier operands winning', () => {
    const a = jf.cube({ size: 2 }).withAnchors({ tip: axisFrame, a: axisFrame });
    const b = jf
      .cube({ size: 2 })
      .withAnchors({ tip: axisFrame, b: axisFrame })
      .translate([1, 0, 0]);
    const result = a.union(b);
    expect(Object.keys(result.anchors?.frames ?? {}).sort()).toEqual(['a', 'b', 'tip']);
    expectVec(result.anchor('tip').origin, [0, 0, 0]);
    expectVec(result.anchor('b').origin, [1, 0, 0]);
  });

  test('intersect keeps only the first operand anchors', () => {
    const a = jf.cube({ size: 2 }).withAnchors({ a: axisFrame });
    const b = jf.cube({ size: 2 }).withAnchors({ b: axisFrame }).translate([1, 0, 0]);
    expect(Object.keys(a.intersect(b).anchors?.frames ?? {})).toEqual(['a']);
  });

  test('top-level subtract accepts carry', () => {
    const plate = jf.cuboid({ size: [20, 20, 2] });
    const hole = jf.cylinder({ radius: 1, height: 4 }).withAnchors({ axis: axisFrame });
    const result = jf.subtract(plate, hole, { carry: { bolt1: hole } });
    expect(result).toBeInstanceOf(FluentGeom3);
    expectVec(result.anchor('bolt1.axis').z, [0, 0, 1]);
  });

  test('top-level union keeps anchors', () => {
    const a = jf.cube({ size: 2 }).withAnchors({ a: axisFrame });
    const b = jf.cube({ size: 2 }).translate([1, 0, 0]);
    expect(Object.keys(jf.union(a, b).anchors?.frames ?? {})).toEqual(['a']);
  });

  test('geom2 anchors follow a mirror', () => {
    const shape = jf
      .rectangle({ size: [4, 2] })
      .withAnchors({ edge: { origin: [2, 0, 0], z: [1, 0, 0] } })
      .mirrorX();
    expect(shape).toBeInstanceOf(FluentGeom2);
    const f = shape.anchor('edge');
    expectVec(f.origin, [-2, 0, 0]);
    expectVec(f.z, [-1, 0, 0]);
  });

  test('geom2 subtract carries anchors', () => {
    const plate = jf.rectangle({ size: [20, 20] });
    const hole = jf.circle({ radius: 2 }).withAnchors({ center: axisFrame }).translate([5, 5, 0]);
    const result = plate.subtract(hole, { carry: { h: hole } });
    expectVec(result.anchor('h.center').origin, [5, 5, 0]);
  });

  test('anchors survive measurements on a transformed part', () => {
    const part = jf
      .cube({ size: 10 })
      .withAnchors({ axis: axisFrame })
      .translate([0, 0, 3])
      .rotateZ(1);
    part.measureVolume();
    expectVec(part.anchor('axis').origin, [0, 0, 3]);
  });
});
