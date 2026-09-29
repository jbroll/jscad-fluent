import {
  anchors,
  booleans,
  colors,
  expansions,
  extrusions,
  geometries,
  hulls,
  measurements,
  minkowski,
  modifiers,
  transforms,
} from '@jbroll/jscad-anchors';
import { copyGeometry } from '../copyGeometry';
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
  Frame,
  FrameInput,
  Frames,
  GeneralizeOptions,
  Geom3,
  Mat4,
  MirrorOptions,
  ProjectOptions,
  RGB,
  RGBA,
  SubtractOptions,
  Vec3,
} from '../types';
import { FluentGeom2 } from './FluentGeom2';
import { FluentGeom3Array } from './FluentGeom3Array';

const { geom3 } = geometries;

export class FluentGeom3 implements Geom3 {
  readonly type: 'geom3' = 'geom3';
  // biome-ignore lint/suspicious/noExplicitAny: Required by JSCAD geometry type
  polygons!: Array<any>;
  transforms!: Mat4;
  color?: RGBA;
  anchors?: { frames: Frames; basis: unknown };

  constructor(geometry: Geom3) {
    copyGeometry(this, geometry ?? geom3.create());
  }

  // biome-ignore lint/suspicious/noExplicitAny: Required for polymorphic wrapper
  private _wrap(geometry: any): this {
    return new (this.constructor as new (g: Geom3) => this)(geometry);
  }

  append(geometry: Geom3): FluentGeom3Array {
    return FluentGeom3Array.create(this, geometry);
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

  hull(): this {
    return this._wrap(hulls.hull(this));
  }
  hullChain(): this {
    return this._wrap(hulls.hullChain(this));
  }

  expand(options: ExpandOptions): this {
    return this._wrap(expansions.expand(options, this));
  }

  union(...others: (this | this[])[]): this {
    return this._wrap(booleans.union(this, ...others));
  }
  subtract(...others: (this | this[] | SubtractOptions)[]): this {
    return this._wrap(booleans.subtract(this, ...others));
  }
  intersect(...others: (this | this[])[]): this {
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

  minkowski(...others: (this | this[])[]): this {
    return this._wrap(minkowski.minkowskiSum(this, ...others.flat()));
  }

  /**
   * Project the solid onto a plane, giving its 2D shadow as seen along the plane's axis.
   * @param {Object} options - plane options
   * @param {Array} [options.axis=[0,0,1]] - normal of the plane
   * @param {Array} [options.origin=[0,0,0]] - a point on the plane
   * @returns {FluentGeom2} the projected shape, rotated to lie in XY
   * @example
   * jf.sphere({ radius: 10 }).project({})
   */
  project(options: ProjectOptions): FluentGeom2 {
    return new FluentGeom2(extrusions.project(options, this as Geom3));
  }

  /**
   * Split the solid into its disconnected pieces.
   * @returns {FluentGeom3Array} one solid per piece
   * @example
   * const [left, right] = jf.union(a, b).scission()
   */
  scission(): FluentGeom3Array {
    return FluentGeom3Array.create(
      ...[booleans.scission(this)].flat().map((piece) => new FluentGeom3(piece)),
    );
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

  /**
   * Merge coplanar polygons into larger convex ones, as booleans do.
   * @returns the retessellated solid
   */
  retessellate(): this {
    return this._wrap(modifiers.retessellate(this));
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

  /**
   * The total surface area of the solid.
   * @returns {Number} the area
   */
  measureArea(): number {
    return measurements.measureArea(this);
  }

  measureVolume(): number {
    return measurements.measureVolume(this);
  }

  toPolygons(): Array<{ vertices: Vec3[] }> {
    return geom3.toPolygons(this);
  }

  validate(): void {
    geom3.validate(this);
  }

  toString(): string {
    return geom3.toString(this);
  }
}
