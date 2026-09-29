import {
  anchors,
  booleans,
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
  AlignToOptions,
  Anchorable,
  AnchorRef,
  AttachOptions,
  BoundingBox,
  CenterOptions,
  Centroid,
  ExpandOptions,
  ExtrudeFromSlicesOptions,
  ExtrudeHelicalOptions,
  ExtrudeLinearOptions,
  ExtrudeRectangularOptions,
  ExtrudeRotateOptions,
  Frame,
  FrameInput,
  Frames,
  GeneralizeOptions,
  Geom2,
  Mat4,
  MirrorOptions,
  OffsetOptions,
  RGB,
  RGBA,
  SubtractOptions,
  Vec2,
  Vec3,
} from '../types';

const { geom2 } = geometries;
const KIND = 'geom2';
const NAME = 'FluentGeom2';
let wrapping = false;

import { checkGeometry, checkOperands } from '../checkGeometry';
import { copyGeometry } from '../copyGeometry';
import { scission2 } from '../scission2';
import { FluentGeom2Array } from './FluentGeom2Array';
import { FluentGeom3 } from './FluentGeom3';

export class FluentGeom2 implements Geom2 {
  readonly type: 'geom2' = 'geom2';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  sides!: Array<any>;
  transforms!: Mat4;
  color?: RGBA;
  anchors?: { frames: Frames; basis: unknown };

  constructor(geometry: Geom2) {
    if (!wrapping) checkGeometry(geometry, KIND, NAME);
    copyGeometry(this, geometry);
  }

  // Only caller input is checked: an operation's result is the backend's own geometry.
  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    wrapping = true;
    try {
      return new (this.constructor as new (g: Geom2) => this)(geometry);
    } finally {
      wrapping = false;
    }
  }

  append(geometry: Geom2): FluentGeom2Array {
    return FluentGeom2Array.create(this, geometry);
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

  expand(options: ExpandOptions): this {
    return this._wrap(expansions.expand(options, this));
  }

  offset(options: OffsetOptions): this {
    return this._wrap(expansions.offset(options, this));
  }

  union(...others: (this | this[])[]): this {
    checkOperands(`${NAME}.union`, others, false, KIND);
    return this._wrap(booleans.union(this, ...others));
  }
  subtract(...others: (this | this[] | SubtractOptions)[]): this {
    checkOperands(`${NAME}.subtract`, others, true, KIND);
    return this._wrap(booleans.subtract(this, ...others));
  }
  intersect(...others: (this | this[])[]): this {
    checkOperands(`${NAME}.intersect`, others, false, KIND);
    return this._wrap(booleans.intersect(this, ...others));
  }

  withAnchors(frames: { [name: string]: FrameInput }): this {
    return this._wrap(anchors.withAnchors(this, frames as Frames));
  }

  anchor(ref: AnchorRef): Frame {
    return anchors.anchor(this, ref);
  }

  attachTo(
    parent: Anchorable,
    parentAnchor: AnchorRef,
    childAnchor: AnchorRef,
    options?: AttachOptions,
  ): this {
    return this._wrap(anchors.attach(this, childAnchor, parent, parentAnchor, options));
  }

  alignTo(parent: Anchorable, direction: AnchorRef, options?: AlignToOptions): this {
    return this._wrap(anchors.alignTo(this, parent, direction, options));
  }

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeLinear({ ...options }, this));
  }

  extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeRotate({ ...options }, this));
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
  extrudeHelical(options: ExtrudeHelicalOptions): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeHelical({ ...options }, this));
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
  extrudeRectangular(options: ExtrudeRectangularOptions): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeRectangular({ ...options }, this));
  }

  /**
   * Extrude a solid from slices that a callback places along the way; the default
   * callback extrudes the shape one unit up Z.
   * @param {Object} options - slice options
   * @param {Integer} [options.numberOfSlices=2] - number of times the callback is called; at least 2
   * @param {Boolean} [options.capStart=true] - close the start of the solid
   * @param {Boolean} [options.capEnd=true] - close the end of the solid
   * @param {Boolean} [options.close=false] - join the last slice back to the first, for a ring
   * @param {Boolean} [options.repair=true] - repair gaps in the base slice
   * @param {Function} [options.callback] - (progress, index, base) => slice or null to skip; progress runs 0 to 1, base is this shape
   * @returns {FluentGeom3} the extruded solid
   * @example
   * const { mat4 } = jf.maths
   * jf.square({ size: 10 }).extrudeFromSlices({
   *   numberOfSlices: 10,
   *   callback: (t, i, base) => jf.slice.transform(
   *     mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), [0, 0, t * 20]), mat4.fromZRotation(mat4.create(), t)),
   *     jf.slice.fromSides(base.toSides())),
   * })
   */
  extrudeFromSlices(options: ExtrudeFromSlicesOptions<FluentGeom2>): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeFromSlices(options, this));
  }

  /**
   * Split the shape into its separate areas: one shape per outer outline, with the holes inside it.
   * A hole goes to the smallest outline around it, so an island inside a hole is a shape of its own.
   * @returns {FluentGeom2Array} one shape per area
   * @example
   * const [left, right] = jf.union(a, b).scission()
   */
  scission(): FluentGeom2Array {
    return FluentGeom2Array.create(...scission2(this));
  }

  /**
   * Reverse the direction of every side, so outlines become holes and holes outlines; the area changes sign.
   * @returns the reversed shape
   */
  invert(): this {
    return this._wrap(geom2.reverse(this));
  }

  /**
   * A separate copy of the geometry, keeping its color and anchors.
   * @returns the copy
   */
  clone(): this {
    // A zero move, as jscad-anchors does: a field copy of manifold geometry would share its mesh handle.
    return this._wrap(transforms.translate([0, 0, 0], this));
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

  /**
   * The center of mass, treating the geometry as uniformly dense; Z is 0 for a 2D shape.
   * @returns {Vec3} the center of mass
   */
  measureCenterOfMass(): Vec3 {
    return measurements.measureCenterOfMass(this);
  }

  measureArea(): number {
    return measurements.measureArea(this);
  }

  toPoints(): Vec2[] {
    return geom2.toPoints(this);
  }

  toOutlines(): Vec2[][] {
    return geom2.toOutlines(this);
  }

  /**
   * The shape's edges as [start, end] point pairs with transforms applied, for jf.slice.fromSides().
   * @returns {Array} list of sides
   */
  toSides(): Array<[Vec2, Vec2]> {
    return geom2.toSides(this);
  }

  validate(): void {
    geom2.validate(this);
  }

  toString(): string {
    return geom2.toString(this);
  }
}
