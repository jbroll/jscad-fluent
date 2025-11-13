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

  clone(): FluentPath2 {
    return new FluentPath2(path2.clone(this));
  }

  append(geometry: Path2): FluentPath2Array {
    return FluentPath2Array.create(this, geometry);
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

  hull(): this {
    Object.assign(this, hulls.hull(this));
    return this;
  }
  hullChain(): this {
    Object.assign(this, hulls.hullChain(this));
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
