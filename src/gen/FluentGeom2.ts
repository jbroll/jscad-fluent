import {
  booleans,
  colors,
  expansions,
  extrusions,
  geometries,
  hulls,
  measurements,
  transforms,
} from '@jscad/modeling';
import type {
  BoundingBox,
  CenterOptions,
  Centroid,
  ExpandOptions,
  ExtrudeLinearOptions,
  ExtrudeRotateOptions,
  Geom2,
  Mat4,
  MirrorOptions,
  OffsetOptions,
  RGB,
  RGBA,
  Vec2,
  Vec3,
} from '../types';

const { geom2 } = geometries;

import { FluentGeom2Array } from './FluentGeom2Array';
import { FluentGeom3 } from './FluentGeom3';

export class FluentGeom2 implements Geom2 {
  readonly type: 'geom2' = 'geom2';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  sides!: Array<any>;
  transforms!: Mat4;

  constructor(geometry: Geom2) {
    Object.assign(this, geometry ?? geom2.create());
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    return new (this.constructor as new (g: Geom2) => this)(geometry);
  }

  append(geometry: Geom2): FluentGeom2Array {
    return FluentGeom2Array.create(this, geometry);
  }

  translate(offset: Vec3): this {
    return this._wrap(transforms.translate(offset, this));
  }
  translateX(offset: number): this {
    return this._wrap(transforms.translateX(offset, this));
  }
  translateY(offset: number): this {
    return this._wrap(transforms.translateY(offset, this));
  }
  translateZ(offset: number): this {
    return this._wrap(transforms.translateZ(offset, this));
  }
  rotate(angle: Vec3): this {
    return this._wrap(transforms.rotate(angle, this));
  }
  rotateX(angle: number): this {
    return this._wrap(transforms.rotateX(angle, this));
  }
  rotateY(angle: number): this {
    return this._wrap(transforms.rotateY(angle, this));
  }
  rotateZ(angle: number): this {
    return this._wrap(transforms.rotateZ(angle, this));
  }
  scale(factor: Vec3): this {
    return this._wrap(transforms.scale(factor, this));
  }
  scaleX(factor: number): this {
    return this._wrap(transforms.scaleX(factor, this));
  }
  scaleY(factor: number): this {
    return this._wrap(transforms.scaleY(factor, this));
  }
  scaleZ(factor: number): this {
    return this._wrap(transforms.scaleZ(factor, this));
  }
  mirror(options: MirrorOptions): this {
    return this._wrap(transforms.mirror(options, this));
  }
  mirrorX(): this {
    return this._wrap(transforms.mirrorX(this));
  }
  mirrorY(): this {
    return this._wrap(transforms.mirrorY(this));
  }
  mirrorZ(): this {
    return this._wrap(transforms.mirrorZ(this));
  }
  center(axes: CenterOptions): this {
    return this._wrap(transforms.center(axes, this));
  }
  centerX(): this {
    return this._wrap(transforms.centerX(this));
  }
  centerY(): this {
    return this._wrap(transforms.centerY(this));
  }
  centerZ(): this {
    return this._wrap(transforms.centerZ(this));
  }
  transform(matrix: Mat4): this {
    return this._wrap(transforms.transform(matrix, this));
  }
  colorize(color: RGB | RGBA): this {
    return this._wrap(colors.colorize(color, this));
  }

  expand(options: ExpandOptions): this {
    return this._wrap(expansions.expand(options, this));
  }

  offset(options: OffsetOptions): this {
    return this._wrap(expansions.offset(options, this));
  }

  union(others: this[]): this {
    return this._wrap(booleans.union([this, ...others]));
  }
  subtract(others: this[]): this {
    return this._wrap(booleans.subtract([this, ...others]));
  }
  intersect(others: this[]): this {
    return this._wrap(booleans.intersect([this, ...others]));
  }

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
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
    geom2.validate(this);
  }

  toString(): string {
    return geom2.toString(this);
  }
}
