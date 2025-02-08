import { measurements, transforms } from '@jscad/modeling';
import type { 
  Geometry,
  Vec3,
  Mat4,
  BoundingBox,
  RGB,
  RGBA,
  Centroid
} from './fluent-types';
import { MirrorOptions } from '@jscad/modeling/src/operations/transforms';

/**
 * Base class for all fluent geometry types.
 * Implements core JSCAD Geometry interface and provides universal operations.
 */
export abstract class FluentGeometry<T extends Geometry> {

  constructor(geometry: T) {
    Object.assign(this, geometry);
  }

  // ===== Universal Transform Operations =====

  translate(offset: Vec3): this {
    Object.assign(this, transforms.translate(offset, this as any));
    return this;
  }

  translateX(offset: number): this {
    Object.assign(this, transforms.translateX(offset, this as any));
    return this;
  }

  translateY(offset: number): this {
    Object.assign(this, transforms.translateY(offset, this as any));
    return this;
  }

  translateZ(offset: number): this {
    Object.assign(this, transforms.translateZ(offset, this as any));
    return this;
  }

  rotate(angle: Vec3): this {
    Object.assign(this, transforms.rotate(angle, this as any));
    return this;
  }

  rotateX(angle: number): this {
    Object.assign(this, transforms.rotateX(angle, this as any));
    return this;
  }

  rotateY(angle: number): this {
    Object.assign(this, transforms.rotateY(angle, this as any));
    return this;
  }

  rotateZ(angle: number): this {
    Object.assign(this, transforms.rotateZ(angle, this as any));
    return this;
  }

  scale(factor: Vec3): this {
    Object.assign(this, transforms.scale(factor, this as any));
    return this;
  }

  scaleX(factor: number): this {
    Object.assign(this, transforms.scaleX(factor, this as any));
    return this;
  }

  scaleY(factor: number): this {
    Object.assign(this, transforms.scaleY(factor, this as any));
    return this;
  }

  scaleZ(factor: number): this {
    Object.assign(this, transforms.scaleZ(factor, this as any));
    return this;
  }

  mirror(options: MirrorOptions): this {
    Object.assign(this, transforms.mirror(options, this as any));
    return this;
  }

  mirrorX(): this {
    Object.assign(this, transforms.mirrorX(this as any));
    return this;
  }

  mirrorY(): this {
    Object.assign(this, transforms.mirrorY(this as any));
    return this;
  }

  mirrorZ(): this {
    Object.assign(this, transforms.mirrorZ(this as any));
    return this;
  }

  transform(matrix: Mat4): this {
    Object.assign(this, transforms.transform(matrix, this as any));
    return this;
  }

  center(axes: [boolean, boolean, boolean]): this {
    Object.assign(this, transforms.center({ axes }, this as any));
    return this;
  }

  centerX(): this {
    Object.assign(this, transforms.centerX(this as any));
    return this;
  }

  centerY(): this {
    Object.assign(this, transforms.centerY(this as any));
    return this;
  }

  centerZ(): this {
    Object.assign(this, transforms.centerZ(this as any));
    return this;
  }

  // ===== Measurement Operations =====

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

  // ===== Color Operations =====

  setColor(color: RGB | RGBA): this {
    const colorSpec = color.length === 3 ? [...color, 1] : color;
    Object.assign(this, { color: colorSpec });
    return this;
  }

  // ===== Required by Subclasses =====

  abstract clone(): this;
  abstract validate(): void;
  abstract toString(): string;
}