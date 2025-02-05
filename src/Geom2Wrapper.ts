import { measurements, extrusions, geometries } from '@jscad/modeling';
import GeometryWrapper from './GeometryWrapper';
import Geom3Wrapper from './Geom3Wrapper';
import type { Geom2Like, Vec2, ExtrudeLinearOptions, ExtrudeRotateOptions } from './types';

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
