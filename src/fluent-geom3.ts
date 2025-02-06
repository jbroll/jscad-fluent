import { geometries, measurements } from '@jscad/modeling';
import type { Geom3, Mat4, Vec3 } from './fluent-types';
import { mat4 } from './fluent-types';
import { FluentBoundedGeometry } from './fluent-bounded-geometry';

const { geom3 } = geometries;

/**
 * Concrete implementation for 3D geometries.
 * Implements JSCADGeom3 interface and 3D-specific operations.
 */
export class FluentGeom3 extends FluentBoundedGeometry<Geom3> implements Geom3 {
  readonly type: 'geom3' = 'geom3';
  polygons: Array<any>;
  transforms: Mat4;

  constructor(geometry: Geom3) {
    super(geometry);
    this.polygons = geometry.polygons;
    this.transforms = mat4.create();
  }

  // ===== Measurements =====

  measureVolume(): number {
    return measurements.measureVolume(this);
  }

  // ===== Conversions =====

  toPolygons(): Array<{ vertices: Vec3[] }> {
    return geom3.toPolygons(this);
  }

  // ===== Required Implementations =====

  clone(): this {
    return new FluentGeom3(geom3.clone(this)) as this;
  }

  validate(): void {
    geom3.validate(this);
  }

  toString(): string {
    return geom3.toString(this);
  }
}