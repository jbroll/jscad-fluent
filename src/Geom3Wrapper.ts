import { expansions, measurements, geometries, hulls, booleans } from '@jscad/modeling';
import GeometryWrapper from './GeometryWrapper';
import type { Corners, Geom3Like, Vec3 } from './types';

const { geom3 } = geometries;

export default class Geom3Wrapper extends GeometryWrapper<Geom3Like> {
  constructor(geometry: Geom3Like) {
    super(geometry);
  }

  measureVolume(): number {
    return measurements.measureVolume(this.geometry);
  }

  union(...others: Geom3Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.union(geometries as Geom3Like[]) as Geom3Like;
    return this;
  }

  subtract(...others: Geom3Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.subtract(geometries as Geom3Like[]) as Geom3Like;
    return this;
  }

  intersect(...others: Geom3Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.intersect(geometries as Geom3Like[]) as Geom3Like;
    return this;
  }

 
  expand(delta: number, corners: Corners = 'round'): this {
    this.geometry = expansions.expand({ delta, corners }, this.geometry) as Geom3Like;
    return this;
  }

  offset(delta: number): this {
    const actualDelta = delta + (delta > 0 ? 0.01 : -0.01);
    this.geometry = expansions.offset({ delta: actualDelta }, this.geometry) as Geom3Like;
    return this;
  }

  hull(...others: GeometryWrapper<Geom3Like>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hull(geometries) as Geom3Like;
    return this;
  }

  hullChain(...others: GeometryWrapper<Geom3Like>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hullChain(geometries) as Geom3Like;
    return this;
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
