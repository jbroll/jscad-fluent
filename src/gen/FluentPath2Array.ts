import { hulls } from '@jscad/modeling';
import type { Path2 } from '../types';
import { FluentGeometryArray } from './FluentGeometryArray';
import { FluentPath2 as ThisScalar } from './FluentPath2';

export class FluentPath2Array extends FluentGeometryArray<Path2> {
  constructor(...geometries: Path2[]) {
    super(...geometries);
    Object.setPrototypeOf(this, FluentPath2Array.prototype);
  }

  static create(...items: Path2[]): FluentPath2Array {
    return new FluentPath2Array(...items);
  }

  append(geometry: Path2): this {
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
