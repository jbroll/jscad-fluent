import { hulls, measurements } from '@jbroll/jscad-anchors';
import type { Geom3, Vec3 } from '../types';
import { FluentGeom3 as ThisScalar } from './FluentGeom3';
import { FluentGeometryArray } from './FluentGeometryArray';

// A lone number is the length that Array's filter and slice construct with.
const wrap = (item: Geom3): ThisScalar =>
  item instanceof ThisScalar || typeof item === 'number' ? item : new ThisScalar(item);

export class FluentGeom3Array extends FluentGeometryArray<ThisScalar> {
  constructor(...geometries: Geom3[]) {
    super(...geometries.map(wrap));
    Object.setPrototypeOf(this, FluentGeom3Array.prototype);
  }

  static create(...items: Geom3[]): FluentGeom3Array {
    return new FluentGeom3Array(...items);
  }

  push(...geometries: Geom3[]): number {
    return super.push(...geometries.map(wrap));
  }

  append(geometry: Geom3): this {
    this.push(geometry);
    return this;
  }

  /**
   * Each item's center of mass, in order; Z is 0 for 2D shapes.
   * @returns {Array} one Vec3 per item
   */
  measureCenterOfMass(): Vec3[] {
    return Array.from(this, (item) => measurements.measureCenterOfMass(item));
  }

  /**
   * Each solid's volume, in order. For the total, jf.measureAggregateVolume(array).
   * @returns {Array} one number per item
   */
  measureVolume(): number[] {
    return Array.from(this, (item) => measurements.measureVolume(item));
  }

  hull(): ThisScalar {
    return new ThisScalar(hulls.hull(this));
  }

  hullChain(): ThisScalar {
    return new ThisScalar(hulls.hullChain(this));
  }
}
