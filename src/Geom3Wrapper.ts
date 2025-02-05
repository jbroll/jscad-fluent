import { measurements, geometries } from '@jscad/modeling';
import GeometryWrapper from './GeometryWrapper';
import type { Geom3Like, Vec3 } from './types';

const { geom3 } = geometries;

export default class Geom3Wrapper extends GeometryWrapper<Geom3Like> {
  constructor(geometry: Geom3Like) {
    super(geometry);
  }

  measureVolume(): number {
    return measurements.measureVolume(this.geometry);
  }

  toPolygons(): Array<{ vertices: Vec3[] }> {
    return geom3.toPolygons(this.geometry);
  }

  toString(): string {
    return geom3.toString(this.geometry);
  }

  clone(): this {
    return new Geom3Wrapper(geom3.clone(this.geometry)) as this;
  }

  validate(): void {
    geom3.validate(this.geometry);
  }
}
