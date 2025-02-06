import { booleans, expansions, hulls } from '@jscad/modeling';
import type { Geom2, Geom3, Corners } from './fluent-types';
import { FluentGeometry } from './fluent-geometry';

/**
 * Intermediate class for operations shared between Geom2 and Geom3.
 * Implements boolean operations, hulls, and expansions.
 */
export abstract class FluentBoundedGeometry<T extends Geom2 | Geom3> extends FluentGeometry<T> {
  // ===== Boolean Operations =====

  union(...others: T[]): this {
    const geometries = [this, ...others];
    Object.assign(this, booleans.union(geometries));
    return this;
  }

  subtract(...others: FluentBoundedGeometry<T>[]): this {
    const geometries = [this, ...others];
    Object.assign(this, booleans.subtract(geometries));
    return this;
  }

  intersect(...others: FluentBoundedGeometry<T>[]): this {
    const geometries = [this, ...others];
    Object.assign(this, booleans.intersect(geometries));
    return this;
  }

  // ===== Hull Operations =====

  hull(...others: FluentBoundedGeometry<T>[]): this {
    const geometries = [this, ...others];
    Object.assign(this, hulls.hull(geometries));
    return this;
  }

  hullChain(...others: FluentBoundedGeometry<T>[]): this {
    const geometries = [this, ...others];
    Object.assign(this, hulls.hullChain(geometries));
    return this;
  }

  // ===== Expansion Operations =====

  expand(delta: number, corners: Corners = 'round'): this {
    Object.assign(this, expansions.expand({ delta, corners }, this));
    return this;
  }

  offset(delta: number): this {
    Object.assign(this, expansions.offset({ delta }, this));
    return this;
  }
}