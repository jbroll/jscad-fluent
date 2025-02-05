import { measurements, transforms } from '@jscad/modeling';
import type { RGB, RGBA, Centroid, GeometryLike } from './types';
import TransformWrapper from './TransformWrapper';
import type { BoundingBox } from '@jscad/modeling/src/measurements/types';

export default abstract class GeometryWrapper<T extends GeometryLike> extends TransformWrapper<T> {
  constructor(geometry: T) {
    super(geometry);
  }

  measureBoundingBox(): BoundingBox {
    return measurements.measureBoundingBox(this.geometry);
  }

  measureBoundingSphere(others?: GeometryWrapper<T>[]): [Centroid, number] | [Centroid, number][] {
    if (!others) {
      return measurements.measureBoundingSphere(this.geometry);
    }
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    return measurements.measureBoundingSphere(geometries);
  }

  measureCenter(): [number, number, number] | [number, number, number][] {
    return measurements.measureCenter(this.geometry);
  }

  measureDimensions(): [number, number, number] | [number, number, number][] {
    return measurements.measureDimensions(this.geometry);
  }

  setColor(color: RGB | RGBA): this {
    const colorSpec = color.length === 3 ? [...color, 1] : color;
    this.geometry = { ...this.geometry, color: colorSpec } as T;
    return this;
  }

  center(axes: [boolean, boolean, boolean]): this {
    this.geometry = transforms.center({ axes }, this.geometry) as T;
    return this;
  }

  centerX(): this {
    this.geometry = transforms.centerX(this.geometry) as T;
    return this;
  }

  centerY(): this {
    this.geometry = transforms.centerY(this.geometry) as T;
    return this;
  }

  centerZ(): this {
    this.geometry = transforms.centerZ(this.geometry) as T;
    return this;
  }

  abstract clone(): this;
  abstract validate(): void;
  abstract toString(): string;
}
