import { geometries } from '@jbroll/jscad-anchors';
import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom2Array } from '../src/gen/FluentGeom2Array';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentGeom3Array } from '../src/gen/FluentGeom3Array';
import { FluentPath2 } from '../src/gen/FluentPath2';
import { FluentPath2Array } from '../src/gen/FluentPath2Array';
import jf from '../src/index';

describe('array items are fluent', () => {
  test('constructors wrap raw geometry', () => {
    const solids = new FluentGeom3Array(geometries.geom3.create(), jf.cube({ size: 2 }));
    expect(solids[0]).toBeInstanceOf(FluentGeom3);
    expect(solids[1]).toBeInstanceOf(FluentGeom3);

    const shapes = FluentGeom2Array.create(geometries.geom2.create());
    expect(shapes[0]).toBeInstanceOf(FluentGeom2);

    const paths = FluentPath2Array.create(
      geometries.path2.fromPoints({}, [
        [0, 0],
        [1, 0],
      ]),
    );
    expect(paths[0]).toBeInstanceOf(FluentPath2);
  });

  test('append and push wrap raw geometry', () => {
    const solids = jf.geom3Array().append(geometries.geom3.create());
    solids.push(geometries.geom3.create());
    expect(solids.every((item) => item instanceof FluentGeom3)).toBe(true);
  });

  test('transforms keep items fluent, so their methods chain without a cast', () => {
    const moved = jf.array(jf.cube({ size: 2 }), jf.cube({ size: 2 })).translate([5, 0, 0]);
    expect(moved[0]).toBeInstanceOf(FluentGeom3);
    expect(moved[0]?.measureVolume()).toBeCloseTo(8);

    const flat = jf.array(jf.square({ size: 2 })).rotateZ(1);
    expect(flat[0]?.extrudeLinear({ height: 1 }).measureVolume()).toBeCloseTo(4);
  });

  test('scission pieces are typed as FluentGeom3', () => {
    const pair = jf.union(jf.cube({ size: 2 }), jf.cube({ size: 2 }).translate([5, 0, 0]));
    const [left] = pair.scission();
    expect(left?.translateZ(1).measureVolume()).toBeCloseTo(8);
  });

  test('filter and slice keep the class; map returns plain values', () => {
    const solids = jf.array(jf.cube({ size: 2 }), jf.cube({ size: 4 }));
    const big = solids.filter((item) => item.measureVolume() > 10);
    expect(big).toBeInstanceOf(FluentGeom3Array);
    expect(big.length).toBe(1);
    expect(solids.slice(1)).toBeInstanceOf(FluentGeom3Array);
    const volumes = solids.map((item) => item.measureVolume());
    expect(Object.getPrototypeOf(volumes)).toBe(Array.prototype);
    expect(volumes[0]).toBeCloseTo(8);
    expect(volumes[1]).toBeCloseTo(64);
  });
});
