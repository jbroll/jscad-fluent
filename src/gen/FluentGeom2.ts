import { expansions, geometries, hulls, measurements, transforms, extrusions, booleans, colors } from '@jscad/modeling';
import type { 
  Centroid, 
  Geom2, 
  Vec2, 
  Vec3, 
  Mat4, 
  RGB, 
  RGBA, 
  BoundingBox, 
  CenterOptions, 
  ExpandOptions,
  ExtrudeLinearOptions, 
  ExtrudeRotateOptions, 
  MirrorOptions,
  OffsetOptions
} from '../types';

const { geom2 } = geometries;

import { FluentGeom2Array } from './FluentGeom2Array';
import { FluentGeom3 } from './FluentGeom3';

export class FluentGeom2 implements Geom2 {
  readonly type: 'geom2' = 'geom2';
  sides!: Array<any>;
  transforms!: Mat4;

  constructor(geometry: Geom2) {
    Object.assign(this, geometry ?? geom2.create());
  }
  
  clone(): FluentGeom2 {
    return new FluentGeom2(geom2.clone(this));
  }

  append(geometry: Geom2): FluentGeom2Array {
    return FluentGeom2Array.create(this, geometry);
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
    Object.assign(this, transforms.mirrorX(this));
    return this;
  }
  mirrorY(): this {
    Object.assign(this, transforms.mirrorY(this));
    return this;
  }
  mirrorZ(): this {
    Object.assign(this, transforms.mirrorZ(this));
    return this;
  }
  center(axes: CenterOptions): this {
    Object.assign(this, transforms.center(axes, this));
    return this;
  }
  centerX(): this {
    Object.assign(this, transforms.centerX(this));
    return this;
  }
  centerY(): this {
    Object.assign(this, transforms.centerY(this));
    return this;
  }
  centerZ(): this {
    Object.assign(this, transforms.centerZ(this));
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
  
  expand(options: ExpandOptions): this {
    Object.assign(this, expansions.expand(options, this));
    return this;
  }

  offset(options: OffsetOptions): this {
    Object.assign(this, expansions.offset(options, this));
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
  
  hull(): this {
    Object.assign(this, hulls.hull(this));
    return this;
  }
  hullChain(): this {
    Object.assign(this, hulls.hullChain(this));
    return this;
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3 {
    const extruded = extrusions.extrudeLinear(options, this);
    return new FluentGeom3(extruded);
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3 {
    const extruded = extrusions.extrudeRotate(options, this);
    return new FluentGeom3(extruded);
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


  measureArea(): number {
    return measurements.measureArea(this);
  }

  toPoints(): Vec2[] {
    return geom2.toPoints(this);
  }

  toOutlines(): Vec2[][] {
    return geom2.toOutlines(this);
  }

  validate(): void {
    return geom2.validate(this);
  }

  toString(): string {
    return geom2.toString(this);
  }


}
