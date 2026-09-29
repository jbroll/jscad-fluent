import { extrusions, hulls } from '@jbroll/jscad-anchors';
import type {
  ExtrudeHelicalOptions,
  ExtrudeLinearOptions,
  ExtrudeRectangularOptions,
  ExtrudeRotateOptions,
  Geom2,
} from '../types';
import { FluentGeom2 as ThisScalar } from './FluentGeom2';
import { FluentGeom3 } from './FluentGeom3';
import { FluentGeom3Array } from './FluentGeom3Array';
import { FluentGeometryArray } from './FluentGeometryArray';

export class FluentGeom2Array extends FluentGeometryArray<Geom2> {
  constructor(...geometries: Geom2[]) {
    super(...geometries);
    Object.setPrototypeOf(this, FluentGeom2Array.prototype);
  }

  static create(...items: Geom2[]): FluentGeom2Array {
    return new FluentGeom2Array(...items);
  }

  append(geometry: Geom2): this {
    super.push(geometry);
    return this;
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3Array {
    return FluentGeom3Array.create(
      ...Array.from(
        this,
        (geom) => new FluentGeom3(extrusions.extrudeLinear({ ...options }, geom)),
      ),
    );
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3Array {
    return FluentGeom3Array.create(
      ...Array.from(
        this,
        (geom) => new FluentGeom3(extrusions.extrudeRotate({ ...options }, geom)),
      ),
    );
  }

  /**
   * Extrude the shape along a helix about the Z axis, for threads, springs and coils.
   * The shape's X is its distance from the axis and its Y becomes Z, so place it at positive X.
   * @param {Object} options - helix options
   * @param {Number} [options.angle=TAU] - total rotation in radians; positive turns right-handed, negative left-handed
   * @param {Number} [options.startAngle=0] - rotation of the first slice in radians
   * @param {Number} [options.pitch=10] - rise per full turn
   * @param {Number} [options.height=0] - total rise; when nonzero it sets the pitch from angle
   * @param {Number} [options.endOffset=0] - change in distance from the axis by the last slice, for a taper or spiral
   * @param {Number} [options.segmentsPerRotation=32] - slices per full turn; at least 3
   * @returns {FluentGeom3} the extruded solid
   * @example
   * jf.circle({ radius: 1, center: [5, 0] }).extrudeHelical({ angle: Math.PI * 4, pitch: 3 })
   */
  extrudeHelical(options: ExtrudeHelicalOptions): FluentGeom3Array {
    return FluentGeom3Array.create(
      ...Array.from(
        this,
        (geom) => new FluentGeom3(extrusions.extrudeHelical({ ...options }, geom)),
      ),
    );
  }

  /**
   * Extrude a wall that follows the shape's outlines: expand them by `size`, then extrude `height`.
   * @param {Object} options - wall options; also takes expand's corners and segments and extrudeLinear's twistAngle and twistSteps
   * @param {Number} [options.size=1] - wall thickness on each side of the outline
   * @param {Number} [options.height=1] - wall height
   * @param {String} [options.corners='edge'] - corner style: 'edge', 'chamfer' or 'round'
   * @param {Number} [options.segments=16] - segments per full circle for round corners
   * @returns {FluentGeom3} the extruded walls
   * @example
   * jf.square({ size: 20 }).extrudeRectangular({ size: 1, height: 10 })
   */
  extrudeRectangular(options: ExtrudeRectangularOptions): FluentGeom3Array {
    return FluentGeom3Array.create(
      ...Array.from(
        this,
        (geom) => new FluentGeom3(extrusions.extrudeRectangular({ ...options }, geom)),
      ),
    );
  }

  hull(): ThisScalar {
    return new ThisScalar(hulls.hull(this));
  }

  hullChain(): ThisScalar {
    return new ThisScalar(hulls.hullChain(this));
  }
}
