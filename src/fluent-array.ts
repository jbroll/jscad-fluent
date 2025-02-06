import { transforms } from '@jscad/modeling';
import type { Geometry, Point3, Vec3, Mat4 } from './fluent-types';
import { FluentGeometry } from './fluent-geometry';
import { MirrorOptions } from '@jscad/modeling/src/operations/transforms';

/**
 * Base array class for collections of geometries.
 * Extends Array while adding geometry operations.
 */
export class FluentGeometryArray<T extends Geometry> extends Array<T> {
  static create<T extends Geometry>(...items: T[]): FluentGeometryArray<T> {
    return new FluentGeometryArray(...items);
  }

  // Override array methods to maintain proper typing
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): FluentGeometryArray<U> {
    const mapped = super.map(callbackfn);
    // Check first item to determine if we should wrap in FluentGeometryArray
    if (mapped.length > 0 && mapped[0] instanceof FluentGeometry) {
      return FluentGeometryArray.create(...mapped);
    }
    return mapped as any; // Return plain array for non-geometry types
  }

  filter(predicate: (value: T, index: number, array: T[]) => boolean): FluentGeometryArray<T> {
    const filtered = super.filter(predicate);
    // Check first item to determine if we should wrap in FluentGeometryArray
    if (filtered.length > 0 && filtered[0] instanceof FluentGeometry) {
      return FluentGeometryArray.create(...filtered);
    }
    return filtered as any; // Return plain array for non-geometry types
  }

  // ===== Transform Operations =====

  translate(offset: Point3): this {
    return FluentGeometryArray.create(...transforms.translate(offset, this)) as this;
  }

  rotate(angle: Vec3): this {
    return FluentGeometryArray.create(...transforms.rotate(angle, this)) as this;
  }

  scale(factor: Vec3): this {
    return FluentGeometryArray.create(...transforms.scale(factor, this)) as this;
  }

  mirror(options: MirrorOptions): this {
    return FluentGeometryArray.create(...(transforms.mirror(options, this) as unknown as Array<Geometry>)) as this;
  }

  transform(matrix: Mat4): this {
    return FluentGeometryArray.create(...transforms.transform(matrix, this)) as this;
  }

  center(axes: [boolean, boolean, boolean]): this {
    return FluentGeometryArray.create(...transforms.center({ axes }, this)) as this;
  }
}