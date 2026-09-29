import {
  colors,
  expansions,
  extrusions,
  geometries,
  hulls,
  measurements,
  modifiers,
  transforms,
} from '@jbroll/jscad-anchors';
import type {
  BoundingBox,
  CenterOptions,
  Centroid,
  ExpandOptions,
  ExtrudeRectangularOptions,
  GeneralizeOptions,
  Mat4,
  MirrorOptions,
  OffsetOptions,
  Path2,
  RGB,
  RGBA,
  Vec2,
  Vec3,
} from '../types';

const { path2 } = geometries;

import { copyGeometry } from '../copyGeometry';
import { FluentGeom2 } from './FluentGeom2';
import { FluentGeom3 } from './FluentGeom3';
import { FluentPath2Array } from './FluentPath2Array';

export class FluentPath2 implements Path2 {
  readonly type: 'path2' = 'path2';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  points!: Array<any>;
  transforms!: Mat4;
  isClosed!: boolean;

  constructor(geometry: Path2) {
    copyGeometry(this, geometry ?? path2.create());
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    return new (this.constructor as new (g: Path2) => this)(geometry);
  }

  append(geometry: Path2): FluentPath2Array {
    return FluentPath2Array.create(this, geometry);
  }

  translate(offset: Vec3): this {
    return this._wrap(transforms.translate(offset, this));
  }
  translateX(offset: number): this {
    return this._wrap(transforms.translateX(offset, this));
  }
  translateY(offset: number): this {
    return this._wrap(transforms.translateY(offset, this));
  }
  translateZ(offset: number): this {
    return this._wrap(transforms.translateZ(offset, this));
  }
  rotate(angle: Vec3): this {
    return this._wrap(transforms.rotate(angle, this));
  }
  rotateX(angle: number): this {
    return this._wrap(transforms.rotateX(angle, this));
  }
  rotateY(angle: number): this {
    return this._wrap(transforms.rotateY(angle, this));
  }
  rotateZ(angle: number): this {
    return this._wrap(transforms.rotateZ(angle, this));
  }
  scale(factor: Vec3): this {
    return this._wrap(transforms.scale(factor, this));
  }
  scaleX(factor: number): this {
    return this._wrap(transforms.scaleX(factor, this));
  }
  scaleY(factor: number): this {
    return this._wrap(transforms.scaleY(factor, this));
  }
  scaleZ(factor: number): this {
    return this._wrap(transforms.scaleZ(factor, this));
  }
  mirror(options: MirrorOptions): this {
    return this._wrap(transforms.mirror(options, this));
  }
  mirrorX(): this {
    return this._wrap(transforms.mirrorX(this));
  }
  mirrorY(): this {
    return this._wrap(transforms.mirrorY(this));
  }
  mirrorZ(): this {
    return this._wrap(transforms.mirrorZ(this));
  }
  center(axes: CenterOptions): this {
    return this._wrap(transforms.center(axes, this));
  }
  centerX(): this {
    return this._wrap(transforms.centerX(this));
  }
  centerY(): this {
    return this._wrap(transforms.centerY(this));
  }
  centerZ(): this {
    return this._wrap(transforms.centerZ(this));
  }
  transform(matrix: Mat4): this {
    return this._wrap(transforms.transform(matrix, this));
  }
  colorize(color: RGB | RGBA): this {
    return this._wrap(colors.colorize(color, this));
  }

  /**
   * Expand the path by `delta` on each side into an area; a closed path grows outward and inward.
   * @param {Object} options - expand options
   * @param {Number} [options.delta=1] - distance to expand on each side of the path
   * @param {String} [options.corners='edge'] - corner style: 'edge', 'chamfer' or 'round'
   * @param {Integer} [options.segments=16] - segments per full circle for round corners
   * @returns {FluentGeom2} the expanded area
   * @example
   * jf.line([[0, 0], [10, 0], [10, 10]]).expand({ delta: 1, corners: 'round' }).extrudeLinear({ height: 2 })
   */
  expand(options: ExpandOptions): FluentGeom2 {
    return new FluentGeom2(expansions.expand(options, this as Path2));
  }

  /**
   * Extrude a wall that follows the path: expand it by `size`, then extrude `height`.
   * @param {Object} options - wall options; also takes expand's corners and segments and extrudeLinear's twistAngle and twistSteps
   * @param {Number} [options.size=1] - wall thickness on each side of the path
   * @param {Number} [options.height=1] - wall height
   * @param {String} [options.corners='edge'] - corner style: 'edge', 'chamfer' or 'round'
   * @param {Number} [options.segments=16] - segments per full circle for round corners
   * @returns {FluentGeom3} the extruded wall
   * @example
   * jf.arc({ radius: 20, endAngle: Math.PI }).extrudeRectangular({ size: 1, height: 5 })
   */
  extrudeRectangular(options: ExtrudeRectangularOptions): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeRectangular({ ...options }, this));
  }

  offset(options: OffsetOptions): this {
    return this._wrap(expansions.offset(options, this));
  }

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
  }

  /**
   * Clean up the geometry: snap, simplify and triangulate, in that order. On geom2 and path2 it returns an unchanged copy.
   * @param {Object} options - which steps to run
   * @param {Boolean} [options.snap=false] - snap vertices to the geometry's precision (measureEpsilon)
   * @param {Boolean} [options.simplify=false] - merge coplanar polygons
   * @param {Boolean} [options.triangulate=false] - split polygons into triangles
   * @returns the cleaned geometry
   * @example
   * part.generalize({ snap: true, triangulate: true })
   */
  generalize(options: GeneralizeOptions): this {
    return this._wrap(modifiers.generalize(options, this));
  }
  /**
   * Snap every vertex to the geometry's precision (measureEpsilon), dropping edges that collapse.
   * @returns the snapped geometry
   */
  snap(): this {
    return this._wrap(modifiers.snap(this));
  }

  measureBoundingBox(): BoundingBox {
    return measurements.measureBoundingBox(this);
  }

  measureBoundingSphere(): [Centroid, number] {
    return measurements.measureBoundingSphere(this);
  }

  measureCenter(): Vec3 {
    return measurements.measureCenter(this);
  }

  measureDimensions(): Vec3 {
    return measurements.measureDimensions(this);
  }

  /**
   * The geometry's precision: the tolerance modeling uses when comparing its points, scaled from its size.
   * @returns {Number} the epsilon
   */
  measureEpsilon(): number {
    return measurements.measureEpsilon(this);
  }

  measureArea(): number {
    return measurements.measureArea(this);
  }

  toPoints(): Vec2[] {
    return path2.toPoints(this);
  }

  validate(): void {
    path2.validate(this);
  }

  toString(): string {
    return path2.toString(this);
  }
}
