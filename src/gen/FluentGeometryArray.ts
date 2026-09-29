import { colors, measurements, transforms } from '@jbroll/jscad-anchors';
import type {
  AlignOptions,
  BoundingBox,
  CenterOptions,
  Centroid,
  Geometry,
  Mat4,
  MirrorOptions,
  RGB,
  RGBA,
  Vec3,
} from '../types';

export class FluentGeometryArray<T extends Geometry> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, FluentGeometryArray.prototype);
  }

  // Array's own map would build the callback's results into this class.
  map<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[] {
    return Array.from(this, (value, index) => callback.call(thisArg, value, index, this));
  }

  translate(offset: Vec3): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.translate(offset, this)].flat() as T[]),
    );
  }

  translateX(offset: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.translateX(offset, this)].flat() as T[]),
    );
  }

  translateY(offset: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.translateY(offset, this)].flat() as T[]),
    );
  }

  translateZ(offset: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.translateZ(offset, this)].flat() as T[]),
    );
  }

  rotate(angle: Vec3): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.rotate(angle, this)].flat() as T[]),
    );
  }

  rotateX(angle: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.rotateX(angle, this)].flat() as T[]),
    );
  }

  rotateY(angle: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.rotateY(angle, this)].flat() as T[]),
    );
  }

  rotateZ(angle: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.rotateZ(angle, this)].flat() as T[]),
    );
  }

  scale(factor: Vec3): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.scale(factor, this)].flat() as T[]),
    );
  }

  scaleX(factor: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.scaleX(factor, this)].flat() as T[]),
    );
  }

  scaleY(factor: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.scaleY(factor, this)].flat() as T[]),
    );
  }

  scaleZ(factor: number): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.scaleZ(factor, this)].flat() as T[]),
    );
  }

  mirror(options: MirrorOptions): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.mirror(options, this)].flat() as T[]),
    );
  }

  mirrorX(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.mirrorX(this)].flat() as T[]),
    );
  }

  mirrorY(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.mirrorY(this)].flat() as T[]),
    );
  }

  mirrorZ(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.mirrorZ(this)].flat() as T[]),
    );
  }

  center(axes: CenterOptions): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.center(axes, this)].flat() as T[]),
    );
  }

  centerX(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.centerX(this)].flat() as T[]),
    );
  }

  centerY(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.centerY(this)].flat() as T[]),
    );
  }

  centerZ(): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.centerZ(this)].flat() as T[]),
    );
  }

  /**
   * Translate so the bounding box meets a point, per axis: its min, max or center lands on relativeTo.
   * On an array, each item moves on its own unless grouped is true.
   * @param {Object} options - alignment options
   * @param {Array} [options.modes=['center','center','min']] - per axis 'min', 'max', 'center' or 'none' (leave that axis alone)
   * @param {Array} [options.relativeTo=[0,0,0]] - per axis target coordinate; null uses the group's own bounds
   * @param {Boolean} [options.grouped=false] - move an array's items together, keeping their spacing
   * @returns the moved geometry
   * @example
   * part.align({ modes: ['min', 'center', 'min'], relativeTo: [0, 0, 0] })
   */
  align(options: AlignOptions): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.align(options, this)].flat() as T[]),
    );
  }

  transform(matrix: Mat4): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([transforms.transform(matrix, this)].flat() as T[]),
    );
  }

  colorize(color: RGB | RGBA): this {
    return new (this.constructor as new (...items: T[]) => this)(
      ...([colors.colorize(color, this)].flat() as T[]),
    );
  }

  /**
   * One bounding box per item, in order. For one box around them all, jf.measureAggregateBoundingBox(array).
   * @returns {Array} [[minX, minY, minZ], [maxX, maxY, maxZ]] for each item
   */
  measureBoundingBox(): BoundingBox[] {
    return Array.from(this, (item) => measurements.measureBoundingBox(item));
  }

  /**
   * One bounding sphere per item, in order.
   * @returns {Array} [center, radius] for each item
   */
  measureBoundingSphere(): [Centroid, number][] {
    return Array.from(this, (item) => measurements.measureBoundingSphere(item));
  }

  /**
   * The center of each item's bounding box, in order.
   * @returns {Array} one Vec3 per item
   */
  measureCenter(): Vec3[] {
    return Array.from(this, (item) => measurements.measureCenter(item));
  }

  /**
   * The size of each item's bounding box, in order.
   * @returns {Array} [width, depth, height] for each item
   */
  measureDimensions(): Vec3[] {
    return Array.from(this, (item) => measurements.measureDimensions(item));
  }

  /**
   * Each item's precision, in order. For one value for the group, jf.measureAggregateEpsilon(array).
   * @returns {Array} one number per item
   */
  measureEpsilon(): number[] {
    return Array.from(this, (item) => measurements.measureEpsilon(item));
  }

  /**
   * Each item's area, in order: geom2 area, geom3 surface area, 0 for a path. For the total, jf.measureAggregateArea(array).
   * @returns {Array} one number per item
   */
  measureArea(): number[] {
    return Array.from(this, (item) => measurements.measureArea(item));
  }

  toString(): string {
    return `FluentGeometryArray(${this.length})[${this.map((item) => item.toString()).join(', ')}]`;
  }
}
