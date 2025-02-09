import { geometries, measurements, transforms, booleans, colors } from '@jscad/modeling';
import type { Centroid, Geom3, Vec3, Mat4, RGB, RGBA, BoundingBox, CenterOptions, MirrorOptions } from './types';

const { geom3 } = geometries;

export class FluentGeom3 implements Geom3 {
  readonly type: 'geom3' = 'geom3';
  polygons!: Array<any>;
  transforms!: Mat4;

  constructor(geometry: Geom3) {
    Object.assign(this, geometry ?? geom3.create());
  }

  translate(offset: Vec3): this {
    Object.assign(this, transforms.translate(offset, this));
    return this;
  }
  translateX(offset: number): this {
    Object.assign(this, transforms.translateX(offset, this));
    return this;
  }
  translateY(offset: number): this {
    Object.assign(this, transforms.translateY(offset, this));
    return this;
  }
  translateZ(offset: number): this {
    Object.assign(this, transforms.translateZ(offset, this));
    return this;
  }
  rotate(angle: Vec3): this {
    Object.assign(this, transforms.rotate(angle, this));
    return this;
  }
  rotateX(angle: number): this {
    Object.assign(this, transforms.rotateX(angle, this));
    return this;
  }
  rotateY(angle: number): this {
    Object.assign(this, transforms.rotateY(angle, this));
    return this;
  }
  rotateZ(angle: number): this {
    Object.assign(this, transforms.rotateZ(angle, this));
    return this;
  }
  scale(factor: Vec3): this {
    Object.assign(this, transforms.scale(factor, this));
    return this;
  }
  scaleX(factor: number): this {
    Object.assign(this, transforms.scaleX(factor, this));
    return this;
  }
  scaleY(factor: number): this {
    Object.assign(this, transforms.scaleY(factor, this));
    return this;
  }
  scaleZ(factor: number): this {
    Object.assign(this, transforms.scaleZ(factor, this));
    return this;
  }
  mirror(options: MirrorOptions): this {
    Object.assign(this, transforms.mirror(options, this));
    return this;
  }
  mirrorX(): this {
    Object.assign(this, transforms.mirrorX( this));
    return this;
  }
  mirrorY(): this {
    Object.assign(this, transforms.mirrorY( this));
    return this;
  }
  mirrorZ(): this {
    Object.assign(this, transforms.mirrorZ( this));
    return this;
  }
  center(axes: CenterOptions): this {
    Object.assign(this, transforms.center(axes, this));
    return this;
  }
  centerX(): this {
    Object.assign(this, transforms.centerX( this));
    return this;
  }
  centerY(): this {
    Object.assign(this, transforms.centerY( this));
    return this;
  }
  centerZ(): this {
    Object.assign(this, transforms.centerZ( this));
    return this;
  }
  transform(matrix: Mat4): this {
    Object.assign(this, transforms.transform(matrix, this));
    return this;
  }
  colorize(color: RGB | RGBA): this {
    Object.assign(this, colors.colorize(color, this));
    return this;
  }

  union(others: this[]): this {
    Object.assign(this, booleans.union([this, others]));
    return this;
  }
  subtract(others: this[]): this {
    Object.assign(this, booleans.subtract([this, others]));
    return this;
  }
  intersect(others: this[]): this {
    Object.assign(this, booleans.intersect([this, others]));
    return this;
  }
  
  measureBoundingBox(): BoundingBox {
    return measurements.measureBoundingBox(this);
  }

  measureBoundingSphere(): [Centroid, number] {
    return measurements.measureBoundingSphere(this);
  }

  measureCenter(): Vec3 {
    return measurements.measureCenter(this);
  }

  measureDimensions(): Vec3 {
    return measurements.measureDimensions(this);
  }


  measureVolume(): number {
    return measurements.measureVolume(this);
  }

  toPolygons(): Array<{vertices: Vec3[]}> {
    return geom3.toPolygons(this);
  }

  validate(): void {
    return geom3.validate(this);
  }

  toString(): string {
    return geom3.toString(this);
  }


  clone(): FluentGeom3 {
    return new FluentGeom3(geom3.clone(this));
  }
}
