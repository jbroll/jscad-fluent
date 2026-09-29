import { colors, transforms } from '@jbroll/jscad-anchors';
import type {
  AlignOptions,
  CenterOptions,
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

  toString(): string {
    return `FluentGeometryArray(${this.length})[${this.map((item) => item.toString()).join(', ')}]`;
  }
}
