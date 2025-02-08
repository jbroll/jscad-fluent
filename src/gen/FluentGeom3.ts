import { geometries, measurements, transforms, booleans } from '@jscad/modeling';
import type { Geom3, Vec3, BoundingBox } from './types';

const { geom3 } = geometries;

export class FluentGeom3 implements Geom3 {
  readonly type: 'geom3' = 'geom3';
  polygons: Array<any>;
  transforms: Mat4;

  constructor(geometry: Geom3) {
    Object.assign(this, geometry);
    this.polygons = geometry.polygons;
    this.transforms = mat4.create();
  }

  translate(offset: Vec3): this {
    Object.assign(this, transforms.translate(offset, this));
    return this;
  }

  rotate(angle: Vec3): this {
    Object.assign(this, transforms.rotate(angle, this));
    return this;
  }



  union(others: this[]): this {
    const geometries = [this, ...others];
    Object.assign(this, booleans.union(geometries));
    return this;
  }
}
