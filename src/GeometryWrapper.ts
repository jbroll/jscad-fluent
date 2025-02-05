import { measurements, booleans, expansions, hulls, transforms } from '@jscad/modeling';
import type { RGB, RGBA, Centroid, GeometryLike } from './types';
import TransformWrapper from './TransformWrapper';
import type { BoundingBox } from '@jscad/modeling/src/measurements/types';

export default abstract class GeometryWrapper<T extends GeometryLike> extends TransformWrapper<T> {
  constructor(protected geometry: T) {
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
    return measurements.measureBoundingSphere(...geometries);
  }

  measureCenter(): [number, number, number] | [number, number, number][] {
    return measurements.measureCenter(this.geometry);
  }

  measureDimensions(): [number, number, number] | [number, number, number][] {
    return measurements.measureBoundingBox(this.geometry);
  }

  union(...others: GeometryWrapper<T>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.union(geometries) as T;
    return this;
  }

  subtract(...others: GeometryWrapper<T>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.subtract(geometries) as T;
    return this;
  }

  intersect(...others: GeometryWrapper<T>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.intersect(geometries) as T;
    return this;
  }

  expand(delta: number, corners?: 'round' | 'sharp'): this {
    this.geometry = expansions.expand({ delta, corners }, this.geometry) as T;
    return this;
  }

  offset(delta: number): this {
    this.geometry = expansions.offset({ delta }, this.geometry) as T;
    return this;
  }

  hull(...others: GeometryWrapper<T>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hull(geometries) as T;
    return this;
  }

  hullChain(...others: GeometryWrapper<T>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hullChain(geometries) as T;
    return this;
  }

  setColor(color: RGB | RGBA): this {
    const colorSpec = color.length === 3 ? [...color, 1] : color;
    this.geometry = { ...this.geometry, color: colorSpec } as T;
    return this;
  }

  center(axes: boolean[]): this {
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
