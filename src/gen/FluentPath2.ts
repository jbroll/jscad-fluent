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
  AlignOptions,
  AppendArcOptions,
  AppendBezierOptions,
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
    return this._wrap(transforms.align(options, this));
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
   * Add points to the end of the path.
   * @param {Array} points - 2D points to append
   * @returns the longer path
   * @example
   * jf.line([[0, 0], [10, 0]]).appendPoints([[10, 10], [0, 10]]).close()
   */
  appendPoints(points: Vec2[]): this {
    return this._wrap(path2.appendPoints(points, this));
  }
  /**
   * Add an elliptical arc from the path's last point to an endpoint, as in SVG's arc command.
   * @param {Object} options - arc options
   * @param {Array} options.endpoint - 2D end point of the arc (required)
   * @param {Array} [options.radius=[0,0]] - X and Y radius; [0,0] draws a straight line
   * @param {Number} [options.xaxisrotation=0] - rotation of the ellipse's X axis in radians
   * @param {Boolean} [options.clockwise=false] - draw the arc clockwise
   * @param {Boolean} [options.large=false] - take the arc longer than half a turn
   * @param {Number} [options.segments=16] - segments per full rotation
   * @returns the longer path
   * @example
   * jf.line([[0, 0], [10, 0]]).appendArc({ endpoint: [10, 10], radius: [5, 5] })
   */
  appendArc(options: AppendArcOptions): this {
    return this._wrap(path2.appendArc(options, this));
  }
  /**
   * Add a Bezier curve from the path's last point through the control points; the last control point is the end.
   * @param {Object} options - curve options
   * @param {Array} options.controlPoints - 2D control points (required); a null first entry mirrors the previous curve's last control point, for a smooth join
   * @param {Number} [options.segments=16] - segments per full rotation of the curve's direction
   * @returns the longer path
   * @example
   * jf.line([[0, 0], [10, 0]]).appendBezier({ controlPoints: [[15, 0], [15, 10], [10, 10]] })
   */
  appendBezier(options: AppendBezierOptions): this {
    return this._wrap(path2.appendBezier(options, this));
  }
  /**
   * Close the path, joining its last point to its first.
   * @returns the closed path
   */
  close(): this {
    return this._wrap(path2.close(this));
  }
  /**
   * Reverse the order of the path's points.
   * @returns the reversed path
   */
  reverse(): this {
    return this._wrap(path2.reverse(this));
  }

  /**
   * Join paths to the end of this one; a shared point at a junction is kept once.
   * Only the last path may be closed.
   * @param {...Object} paths - paths to append, in order
   * @returns the joined path
   * @example
   * jf.line([[0, 0], [10, 0]]).concat(jf.line([[10, 0], [10, 10]]), jf.line([[10, 10], [0, 10]]))
   */
  concat(...paths: Path2[]): this {
    return this._wrap(path2.concat(this, ...paths));
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
