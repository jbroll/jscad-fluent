import { booleans, expansions, hulls } from '@jscad/modeling';
import type { Geom2, Geom3, Path2, Corners } from './fluent-types';
import { FluentGeometryArray } from './fluent-array';
import { ExpandOptions, OffsetOptions } from '@jscad/modeling/src/operations/expansions';

/**
 * Array class for bounded geometries (Geom2 or Geom3).
 * Implements shared operations that work on collections.
 */
export class FluentBoundedGeometryArray<T extends Geom2 | Geom3> extends FluentGeometryArray<T> {

  union(): T {
    return booleans.union(this as T);
  }

  subtract(): T {
    return booleans.subtract(this);
  }

  intersect(): T {
    return booleans.intersect(this);
  }

  hull(): T {
    return hulls.hull(this);
  }

  hullChain(): T {
    return hulls.hullChain(this);
  }

  expand(options: ExpandOptions, corners: Corners = 'round'): this {
    return FluentBoundedGeometryArray.create(...expansions.expand({ ...options, corners }, this)) as this;
  }

  offset(options: OffsetOptions): this {
    return new FluentBoundedGeometryArray<T>(expansions.offset(options, this));
  }
}