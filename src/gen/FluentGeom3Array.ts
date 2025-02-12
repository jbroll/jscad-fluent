import { hulls } from '@jscad/modeling';
import type { Geom3 } from '../types';
import { FluentGeometryArray } from './FluentGeometryArray';
import { FluentGeom3 as ThisScalar } from './FluentGeom3';

export class FluentGeom3Array extends FluentGeometryArray<Geom3> {
  constructor(...geometries: Geom3[]) {
    super(...geometries);
    Object.setPrototypeOf(this, FluentGeom3Array.prototype);
  }

  static create(...items: Geom3[]): FluentGeom3Array {
    return new FluentGeom3Array(...items);
  }
  
  append(geometry: Geom3): this {
    super.push(geometry);
    return this;
  }

  hull(): ThisScalar {
    return new ThisScalar(hulls.hull(this));
  }

  hullChain(): ThisScalar {
    return new ThisScalar(hulls.hullChain(this));
  }

}