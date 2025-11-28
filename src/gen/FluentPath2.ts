import { colors, expansions, geometries, hulls, measurements, transforms } from '@jscad/modeling';
import type {
  BoundingBox,
  CenterOptions,
  Centroid,
  ExpandOptions,
  Mat4,
  MirrorOptions,
  OffsetOptions,
  Path2,
  RGB,
  RGBA,
  Vec2,
  Vec3,
} from '../types';

const { path2 } = geometries;

import { FluentPath2Array } from './FluentPath2Array';

export class FluentPath2 implements Path2 {
  readonly type: 'path2' = 'path2';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  points!: Array<any>;
  transforms!: Mat4;
  isClosed!: boolean;

  constructor(geometry: Path2) {
    Object.assign(this, geometry ?? path2.create());
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    return new (this.constructor as new (g: Path2) => this)(geometry);
  }

  append(geometry: Path2): FluentPath2Array {
    return FluentPath2Array.create(this, geometry);
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

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
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
    return path2.toPoints(this);
  }

  validate(): void {
    path2.validate(this);
  }

  toString(): string {
    return path2.toString(this);
  }
}
