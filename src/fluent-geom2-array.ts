import { measurements, extrusions } from '@jscad/modeling';
import type { Geom2, ExtrudeLinearOptions, ExtrudeRotateOptions } from './fluent-types';
import { FluentBoundedGeometryArray } from './fluent-bounded-array';
import { FluentGeom3Array } from './fluent-geom3-array';

/**
 * Array class for 2D geometries.
 * Implements 2D-specific operations for collections.
 */
export class FluentGeom2Array extends FluentBoundedGeometryArray<Geom2> {

  constructor(...geometries: Geom2[]) {
    super(...geometries);
  }

  measureArea(): number[] {
    return this.map(geom => measurements.measureArea(geom));
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3Array {
    const extruded = this.map(geom => extrusions.extrudeLinear(options, geom));
    return new FluentGeom3Array(...extruded);
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3Array {
    const extruded = this.map(geom => extrusions.extrudeRotate(options, geom));
    return new FluentGeom3Array(...extruded);
  }
}