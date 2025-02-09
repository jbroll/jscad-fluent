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

  hull(others: this[]): ThisScalar {
    return new ThisScalar(hulls.hull(others, this));
  }

  hullChain(others: this[]): ThisScalar {
    return new ThisScalar(hulls.hullChain(others, this));
  }

}