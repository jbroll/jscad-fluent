import { geometries, measurements, transforms, extrusions, booleans } from '@jscad/modeling';
import type { Geom2, Vec2, Vec3, Mat4, BoundingBox, ExtrudeLinearOptions, ExtrudeRotateOptions } from '../fluent-types';

const { geom2 } = geometries;

import { FluentGeom3 } from './FluentGeom3';

export class FluentGeom2 implements Geom2 {
  readonly type: 'geom2' = 'geom2';
  sides!: Array<any>;
  transforms!: Mat4;

  constructor(geometry: Geom2) {
    Object.assign(this, geometry ?? geom2.create());
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
  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3 {
    const extruded = extrusions.extrudeLinear(options, this);
    return new FluentGeom3(extruded);
  }}