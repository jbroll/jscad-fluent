import { extrusions, hulls } from '@jscad/modeling';
import type { Geom2, ExtrudeLinearOptions, ExtrudeRotateOptions } from '../types';
import { FluentGeom3Array } from './FluentGeom3Array';
import { FluentGeometryArray } from './FluentGeometryArray';
import { FluentGeom2 as ThisScalar } from './FluentGeom2';

export class FluentGeom2Array extends FluentGeometryArray<Geom2> {
  constructor(...geometries: Geom2[]) {
    super(...geometries);
    Object.setPrototypeOf(this, FluentGeom2Array.prototype);
  }

  static create(...items: Geom2[]): FluentGeom2Array {
    return new FluentGeom2Array(...items);
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3Array {
    return FluentGeom3Array.create(...this.map(geom => extrusions.extrudeLinear(options, geom)));
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3Array {
    return FluentGeom3Array.create(...this.map(geom => extrusions.extrudeRotate(options, geom)));
  }

  
  hull(others: this[]): ThisScalar {
    return new ThisScalar(hulls.hull(others, this));
  }

  hullChain(others: this[]): ThisScalar {
    return new ThisScalar(hulls.hullChain(others, this));
  }


}