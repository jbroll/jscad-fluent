import { transforms } from '@jscad/modeling';
import type { Point3 } from './types';

export default abstract class TransformWrapper<T> {
  protected geometry: T;

  constructor(geometry: T) {
    this.geometry = geometry;
  }

  translate(vec: Point3): this {
    this.geometry = transforms.translate(vec, this.geometry) as T;
    return this;
  }

  translateX(offset: number): this {
    this.geometry = transforms.translateX(offset, this.geometry) as T;
    return this;
  }

  translateY(offset: number): this {
    this.geometry = transforms.translateY(offset, this.geometry) as T;
    return this;
  }

  translateZ(offset: number): this {
    this.geometry = transforms.translateZ(offset, this.geometry) as T;
    return this;
  }

  rotate(angle: number, axis?: Point3): this {
    this.geometry = transforms.rotate(angle, axis || [0, 0, 1], this.geometry) as T;
    return this;
  }

  rotateX(angle: number): this {
    this.geometry = transforms.rotateX(angle, this.geometry) as T;
    return this;
  }

  rotateY(angle: number): this {
    this.geometry = transforms.rotateY(angle, this.geometry) as T;
    return this;
  }

  rotateZ(angle: number): this {
    this.geometry = transforms.rotateZ(angle, this.geometry) as T;
    return this;
  }

  scale(vec: Point3 | number): this {
    this.geometry = transforms.scale(vec, this.geometry) as T;
    return this;
  }

  scaleX(factor: number): this {
    this.geometry = transforms.scaleX(factor, this.geometry) as T;
    return this;
  }

  scaleY(factor: number): this {
    this.geometry = transforms.scaleY(factor, this.geometry) as T;
    return this;
  }

  scaleZ(factor: number): this {
    this.geometry = transforms.scaleZ(factor, this.geometry) as T;
    return this;
  }

  mirror(vec: Point3): this {
    this.geometry = transforms.mirror(vec, this.geometry) as T;
    return this;
  }

  mirrorX(): this {
    this.geometry = transforms.mirrorX(this.geometry) as T;
    return this;
  }

  mirrorY(): this {
    this.geometry = transforms.mirrorY(this.geometry) as T;
    return this;
  }

  mirrorZ(): this {
    this.geometry = transforms.mirrorZ(this.geometry) as T;
    return this;
  }

  transform(matrix: number[]): this {
    this.geometry = transforms.transform(matrix, this.geometry) as T;
    return this;
  }
}
