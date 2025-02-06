import { geometries, measurements, extrusions } from '@jscad/modeling';
import type { Geom2, Vec2, ExtrudeLinearOptions, ExtrudeRotateOptions, Mat4 } from './fluent-types';
import { mat4 } from './fluent-types';
import { FluentBoundedGeometry } from './fluent-bounded-geometry';
import { FluentGeom3 } from './fluent-geom3';

const { geom2 } = geometries;

export class FluentGeom2 extends FluentBoundedGeometry<Geom2> implements Geom2 {
  sides: Array<any>;
  transforms: Mat4;

  constructor(geometry: Geom2) {
    super(geometry);
    this.sides = geometry.sides;
    this.transforms = mat4.create();
  }

  measureArea(): number {
    return measurements.measureArea(this);
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3 {
    const extruded = extrusions.extrudeLinear(options, this);
    return new FluentGeom3(extruded);
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3 {
    const extruded = extrusions.extrudeRotate(options, this);
    return new FluentGeom3(extruded);
  }

  toPoints(): Vec2[] {
    return geom2.toPoints(this);
  }

  toOutlines(): Vec2[][] {
    return geom2.toOutlines(this);
  }

  // ===== Required Implementations =====

  clone(): this {
    return new FluentGeom2(geom2.clone(this)) as this;
  }

  validate(): void {
    geom2.validate(this);
  }

  toString(): string {
    return geom2.toString(this);
  }
}
