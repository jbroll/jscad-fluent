import { transforms, colors } from '@jscad/modeling';
import type { Geometry, Vec3, Mat4, RGB, RGBA, CenterOptions, MirrorOptions } from '../fluent-types';
import { FluentGeometry } from '../fluent-geometry';

export class FluentGeometryArray<T extends Geometry> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, FluentGeometryArray.prototype);
  }


  translate(offset: Vec3): this {
    return new FluentGeometryArray(
      ...transforms.translate(offset, this)
    ) as this;
  }

  translateX(offset: number): this {
    return new FluentGeometryArray(
      ...transforms.translateX(offset, this)
    ) as this;
  }

  translateY(offset: number): this {
    return new FluentGeometryArray(
      ...transforms.translateY(offset, this)
    ) as this;
  }

  translateZ(offset: number): this {
    return new FluentGeometryArray(
      ...transforms.translateZ(offset, this)
    ) as this;
  }

  rotate(angle: Vec3): this {
    return new FluentGeometryArray(
      ...transforms.rotate(angle, this)
    ) as this;
  }

  rotateX(angle: number): this {
    return new FluentGeometryArray(
      ...transforms.rotateX(angle, this)
    ) as this;
  }

  rotateY(angle: number): this {
    return new FluentGeometryArray(
      ...transforms.rotateY(angle, this)
    ) as this;
  }

  rotateZ(angle: number): this {
    return new FluentGeometryArray(
      ...transforms.rotateZ(angle, this)
    ) as this;
  }

  scale(factor: Vec3): this {
    return new FluentGeometryArray(
      ...transforms.scale(factor, this)
    ) as this;
  }

  scaleX(factor: number): this {
    return new FluentGeometryArray(
      ...transforms.scaleX(factor, this)
    ) as this;
  }

  scaleY(factor: number): this {
    return new FluentGeometryArray(
      ...transforms.scaleY(factor, this)
    ) as this;
  }

  scaleZ(factor: number): this {
    return new FluentGeometryArray(
      ...transforms.scaleZ(factor, this)
    ) as this;
  }

  mirror(options: MirrorOptions): this {
    return new FluentGeometryArray(
      ...transforms.mirror(options, this)
    ) as this;
  }

  mirrorX(): this {
    return new FluentGeometryArray(
      ...transforms.mirrorX( this)
    ) as this;
  }

  mirrorY(): this {
    return new FluentGeometryArray(
      ...transforms.mirrorY( this)
    ) as this;
  }

  mirrorZ(): this {
    return new FluentGeometryArray(
      ...transforms.mirrorZ( this)
    ) as this;
  }

  center(axes: CenterOptions): this {
    return new FluentGeometryArray(
      ...transforms.center(axes, this)
    ) as this;
  }

  centerX(): this {
    return new FluentGeometryArray(
      ...transforms.centerX( this)
    ) as this;
  }

  centerY(): this {
    return new FluentGeometryArray(
      ...transforms.centerY( this)
    ) as this;
  }

  centerZ(): this {
    return new FluentGeometryArray(
      ...transforms.centerZ( this)
    ) as this;
  }

  transform(matrix: Mat4): this {
    return new FluentGeometryArray(
      ...transforms.transform(matrix, this)
    ) as this;
  }

  colorize(color: RGB | RGBA): this {
    return new FluentGeometryArray(
      ...colors.colorize(color, this)
    ) as this;
  }



  clone(): this {
    return new FluentGeometryArray(...this.map(item => 
      (item instanceof FluentGeometry) ? item.clone() : item
    )) as this;
  }

  toString(): string {
    return `FluentGeometryArray(${this.length})[${
      this.map(item => item.toString()).join(', ')
    }]`;
  }
}