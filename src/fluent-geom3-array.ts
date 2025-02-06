import { measurements } from '@jscad/modeling';
import type { Geom3 } from './fluent-types';
import { FluentBoundedGeometryArray } from './fluent-bounded-array';

export class FluentGeom3Array extends FluentBoundedGeometryArray<Geom3> {

  constructor(...geometries: Geom3[]) {
    super(...geometries);
  }

  measureVolume(): number[] {
    return this.map(geom => measurements.measureVolume(geom));
  }
}