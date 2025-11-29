import {
  booleans,
  colors,
  expansions,
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
  Geom3,
  Mat4,
  MirrorOptions,
  RGB,
  RGBA,
  Vec3,
} from '../types';
import { FluentGeom3Array } from './FluentGeom3Array';

const { geom3 } = geometries;

export class FluentGeom3 implements Geom3 {
  readonly type: 'geom3' = 'geom3';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  polygons!: Array<any>;
  transforms!: Mat4;

  constructor(geometry: Geom3) {
    Object.assign(this, geometry ?? geom3.create());
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    return new (this.constructor as new (g: Geom3) => this)(geometry);
  }

  append(geometry: Geom3): FluentGeom3Array {
    return FluentGeom3Array.create(this, geometry);
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

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
  }

  expand(options: ExpandOptions): this {
    return this._wrap(expansions.expand(options, this));
  }

  union(...others: (this | this[])[]): this {
    return this._wrap(booleans.union([this, ...others]));
  }
  subtract(...others: (this | this[])[]): this {
    return this._wrap(booleans.subtract([this, ...others]));
  }
  intersect(...others: (this | this[])[]): this {
    return this._wrap(booleans.intersect([this, ...others]));
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

  toPolygons(): Array<{ vertices: Vec3[] }> {
    return geom3.toPolygons(this);
  }

  validate(): void {
    geom3.validate(this);
  }

  toString(): string {
    return geom3.toString(this);
  }
}
