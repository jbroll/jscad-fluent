import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom2Array } from '../src/gen/FluentGeom2Array';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentGeom3Array } from '../src/gen/FluentGeom3Array';
import jf from '../src/index';

const TAU = Math.PI * 2;
const { mat4 } = jf.maths;

describe('extrudeHelical', () => {
  test('coils a geom2 about Z, rising one pitch per turn', () => {
    const coil = jf
      .circle({ radius: 1, center: [5, 0], segments: 16 })
      .extrudeHelical({ angle: TAU * 2, pitch: 4, segmentsPerRotation: 16 });
    expect(coil).toBeInstanceOf(FluentGeom3);
    const [min, max] = coil.measureBoundingBox();
    expect(max[2] - min[2]).toBeCloseTo(10, 1);
    expect(max[0]).toBeCloseTo(6, 1);
    expect(coil.measureVolume()).toBeGreaterThan(0);
  });

  test('works on a geom2 array', () => {
    const coils = jf
      .array(jf.circle({ radius: 1, center: [5, 0] }), jf.circle({ radius: 1, center: [8, 0] }))
      .extrudeHelical({ angle: TAU, pitch: 4 });
    expect(coils).toBeInstanceOf(FluentGeom3Array);
    expect(coils.length).toBe(2);
  });
});

describe('extrudeRectangular', () => {
  test('follows an open path with a rectangle', () => {
    const wall = jf.line([
      [0, 0],
      [10, 0],
    ]);
    const solid = wall.extrudeRectangular({ size: 1, height: 3 });
    expect(solid).toBeInstanceOf(FluentGeom3);
    const [min, max] = solid.measureBoundingBox();
    expect(max[2] - min[2]).toBeCloseTo(3);
    expect(max[1] - min[1]).toBeCloseTo(2);
  });

  test('follows an arc', () => {
    const solid = jf
      .arc({ radius: 10, startAngle: 0, endAngle: Math.PI / 2, segments: 32 })
      .extrudeRectangular({ size: 0.5, height: 2 });
    expect(solid).toBeInstanceOf(FluentGeom3);
    expect(solid.measureVolume()).toBeGreaterThan(0);
  });

  test('follows the outline of a geom2', () => {
    const walls = jf.square({ size: 10 }).extrudeRectangular({ size: 1, height: 5 });
    expect(walls).toBeInstanceOf(FluentGeom3);
    const [min, max] = walls.measureBoundingBox();
    expect(max[2] - min[2]).toBeCloseTo(5);
    expect(walls.measureVolume()).toBeLessThan(10 * 10 * 5);
    expect(walls.measureVolume()).toBeGreaterThan(0);
  });

  test('leaves the caller options unchanged', () => {
    const options = { size: 1, height: 2 };
    jf.square({ size: 10 }).extrudeRectangular(options);
    jf.line([
      [0, 0],
      [5, 0],
    ]).extrudeRectangular(options);
    expect(options).toEqual({ size: 1, height: 2 });
  });

  test('works on geom2 and path2 arrays', () => {
    const fromShapes = jf
      .array(jf.square({ size: 4 }), jf.square({ size: 4 }).translate([10, 0, 0]))
      .extrudeRectangular({ size: 0.5, height: 1 });
    expect(fromShapes).toBeInstanceOf(FluentGeom3Array);
    expect(fromShapes.length).toBe(2);

    const fromPaths = jf
      .path2Array(
        jf.line([
          [0, 0],
          [5, 0],
        ]),
        jf.line([
          [0, 5],
          [5, 5],
        ]),
      )
      .extrudeRectangular({ size: 0.5, height: 1 });
    expect(fromPaths).toBeInstanceOf(FluentGeom3Array);
    expect(fromPaths.length).toBe(2);
    expect(fromPaths[0]).toBeInstanceOf(FluentGeom3);
  });
});

describe('FluentPath2.expand', () => {
  test('returns a FluentGeom2, since an expanded path is an area', () => {
    const band = jf
      .line([
        [0, 0],
        [10, 0],
      ])
      .expand({ delta: 1 });
    expect(band).toBeInstanceOf(FluentGeom2);
    expect(band.measureArea()).toBeCloseTo(20);
    expect(band.extrudeLinear({ height: 2 }).measureVolume()).toBeCloseTo(40);
  });

  test('expands every path of a path array into a FluentGeom2Array', () => {
    const bands = jf
      .path2Array(
        jf.line([
          [0, 0],
          [10, 0],
        ]),
        jf.line([
          [0, 5],
          [10, 5],
        ]),
      )
      .expand({ delta: 1 });
    expect(bands).toBeInstanceOf(FluentGeom2Array);
    expect(bands.length).toBe(2);
    expect(bands[0]).toBeInstanceOf(FluentGeom2);
  });
});

describe('extrudeFromSlices', () => {
  test('extrudes a geom2 with the default callback, one unit high', () => {
    const solid = jf.square({ size: 2 }).extrudeFromSlices({});
    expect(solid).toBeInstanceOf(FluentGeom3);
    expect(solid.measureVolume()).toBeCloseTo(4);
  });

  test('uses the callback to place each slice', () => {
    const solid = jf.square({ size: 2 }).extrudeFromSlices({
      numberOfSlices: 3,
      callback: (progress, _index, base) =>
        jf.slice.transform(
          mat4.fromTranslation(mat4.create(), [0, 0, progress * 5]),
          jf.slice.fromSides(base.toSides()),
        ),
    });
    const [min, max] = solid.measureBoundingBox();
    expect(max[2] - min[2]).toBeCloseTo(5);
    expect(solid.measureVolume()).toBeCloseTo(20);
  });

  test('jf.extrudeFromSlices lofts from a slice', () => {
    const base = jf.slice.fromPoints([
      [0, 0, 0],
      [2, 0, 0],
      [2, 2, 0],
      [0, 2, 0],
    ]);
    const solid = jf.extrudeFromSlices(
      {
        numberOfSlices: 2,
        callback: (progress, _index, slice) =>
          jf.slice.transform(mat4.fromTranslation(mat4.create(), [0, 0, progress * 3]), slice),
      },
      base,
    );
    expect(solid).toBeInstanceOf(FluentGeom3);
    expect(solid.measureVolume()).toBeCloseTo(12);
  });
});

describe('project', () => {
  test('projects a geom3 onto the XY plane by default', () => {
    const shadow = jf.cuboid({ size: [2, 4, 6] }).project({});
    expect(shadow).toBeInstanceOf(FluentGeom2);
    expect(shadow.measureArea()).toBeCloseTo(8);
  });

  test('projects along another axis', () => {
    const shadow = jf.cuboid({ size: [2, 4, 6] }).project({ axis: [1, 0, 0] });
    expect(shadow.measureArea()).toBeCloseTo(24);
  });
});
