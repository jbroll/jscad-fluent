import { measurements, expansions, extrusions, geometries, hulls, booleans } from '@jscad/modeling';
import GeometryWrapper from './GeometryWrapper';
import Geom3Wrapper from './Geom3Wrapper';
import type { Corners, Geom2Like, Vec2, ExtrudeLinearOptions, ExtrudeRotateOptions } from './types';

const { geom2 } = geometries;

export default class Geom2Wrapper extends GeometryWrapper<Geom2Like> {
  constructor(geometry: Geom2Like) {
    super(geometry);
  }

  measureArea(): number {
    return measurements.measureArea(this.geometry);
  }

  extrudeLinear(options: ExtrudeLinearOptions): Geom3Wrapper {
    const extruded = extrusions.extrudeLinear(options, this.geometry);
    return new Geom3Wrapper(extruded);
  }

  extrudeRotate(options: ExtrudeRotateOptions): Geom3Wrapper {
    const extruded = extrusions.extrudeRotate(options, this.geometry);
    return new Geom3Wrapper(extruded);
  }

  union(...others: Geom2Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.union(geometries as Geom2Like[]) as Geom2Like;
    return this;
  }

  subtract(...others: Geom2Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.subtract(geometries as Geom2Like[]) as Geom2Like;
    return this;
  }

  intersect(...others: Geom2Wrapper[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = booleans.intersect(geometries as Geom2Like[]) as Geom2Like;
    return this;
  }

  expand(delta: number, corners?: Corners): this {
    this.geometry = expansions.expand({ delta, corners }, this.geometry) as Geom2Like;
    return this;
  }

  offset(delta: number): this {
    this.geometry = expansions.offset({ delta }, this.geometry) as Geom2Like;
    return this;
  }

  hull(...others: GeometryWrapper<Geom2Like>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hull(geometries) as Geom2Like;
    return this;
  }

  hullChain(...others: GeometryWrapper<Geom2Like>[]): this {
    const geometries = [this.geometry, ...others.map(o => o.geometry)];
    this.geometry = hulls.hullChain(geometries) as Geom2Like;
    return this;
  }

  toPoints(): Vec2[] {
    return geom2.toPoints(this.geometry);
  }

  toString(): string {
    return geom2.toString(this.geometry);
  }

  clone(): this {
    return new Geom2Wrapper(geom2.clone(this.geometry)) as this;
  }

  validate(): void {
    geom2.validate(this.geometry);
  }

  toOutlines(): Vec2[][] {
    return geom2.toOutlines(this.geometry);
  }
}
