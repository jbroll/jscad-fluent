import {
  booleans,
  colors,
  curves,
  extrusions,
  geometries,
  hulls,
  maths,
  measurements,
  primitives,
  text as textModule,
  transforms,
  utils,
} from '@jbroll/jscad-anchors';
import { checkOperands } from './checkGeometry';
import { cylinder } from './cylinder';
import { FluentGeom2 } from './gen/FluentGeom2';
import { FluentGeom2Array } from './gen/FluentGeom2Array';
import { FluentGeom3 } from './gen/FluentGeom3';
import { FluentGeom3Array } from './gen/FluentGeom3Array';
import { FluentPath2 } from './gen/FluentPath2';
import { FluentPath2Array } from './gen/FluentPath2Array';
import type {
  AlignOptions,
  ArcOptions,
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderEllipticOptions,
  EllipseOptions,
  EllipsoidOptions,
  ExtrudeFromSlicesOptions,
  GeodesicSphereOptions,
  Geom2,
  Geom3,
  Geometry,
  Path2,
  Point2,
  Point3,
  RectangleOptions,
  RoundedCuboidOptions,
  RoundedCylinderOptions,
  Slice,
  SphereOptions,
  SquareOptions,
  StarOptions,
  SubtractOptions,
  TorusOptions,
  TriangleOptions,
  Vec2,
  VectorCharOptions,
  VectorTextOptions,
} from './types';

// Modeling's declarations leave out TAU.
const constants = maths.constants as typeof maths.constants & { TAU: number };

function wrapShape(geometry: Geometry): FluentGeom2 | FluentGeom3 | FluentPath2 {
  if (geometries.geom2.isA(geometry)) return new FluentGeom2(geometry);
  if (geometries.path2.isA(geometry)) return new FluentPath2(geometry);
  return new FluentGeom3(geometry as Geom3);
}

function strokesToPaths(strokes: Vec2[][]): FluentPath2Array {
  return FluentPath2Array.create(
    ...strokes.map((stroke) => new FluentPath2(geometries.path2.fromPoints({}, stroke))),
  );
}

// Overloaded boolean functions for type-safe returns
function union(...geometries: (FluentGeom2 | FluentGeom2[] | FluentGeom2Array)[]): FluentGeom2;
function union(...geometries: (FluentGeom3 | FluentGeom3[] | FluentGeom3Array)[]): FluentGeom3;
function union(
  ...geometries: (
    | FluentGeom2
    | FluentGeom3
    | FluentGeom2[]
    | FluentGeom3[]
    | FluentGeom2Array
    | FluentGeom3Array
  )[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('union requires at least one geometry');
  }
  if (checkOperands('jf.union', geometries, false) === 'geom2') {
    return new FluentGeom2(booleans.union(geometries as FluentGeom2[]));
  }
  return new FluentGeom3(booleans.union(geometries as FluentGeom3[]));
}

function subtract(
  ...geometries: (FluentGeom2 | FluentGeom2[] | FluentGeom2Array | SubtractOptions)[]
): FluentGeom2;
function subtract(
  ...geometries: (FluentGeom3 | FluentGeom3[] | FluentGeom3Array | SubtractOptions)[]
): FluentGeom3;
function subtract(
  ...geometries: (
    | FluentGeom2
    | FluentGeom3
    | FluentGeom2[]
    | FluentGeom3[]
    | FluentGeom2Array
    | FluentGeom3Array
    | SubtractOptions
  )[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('subtract requires at least one geometry');
  }
  // Spread, not one array: subtractAnchored only reads { carry } from its last argument.
  if (checkOperands('jf.subtract', geometries, true) === 'geom2') {
    return new FluentGeom2(booleans.subtract(...(geometries as FluentGeom2[])));
  }
  return new FluentGeom3(booleans.subtract(...(geometries as FluentGeom3[])));
}

function intersect(...geometries: (FluentGeom2 | FluentGeom2[] | FluentGeom2Array)[]): FluentGeom2;
function intersect(...geometries: (FluentGeom3 | FluentGeom3[] | FluentGeom3Array)[]): FluentGeom3;
function intersect(
  ...geometries: (
    | FluentGeom2
    | FluentGeom3
    | FluentGeom2[]
    | FluentGeom3[]
    | FluentGeom2Array
    | FluentGeom3Array
  )[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('intersect requires at least one geometry');
  }
  if (checkOperands('jf.intersect', geometries, false) === 'geom2') {
    return new FluentGeom2(booleans.intersect(geometries as FluentGeom2[]));
  }
  return new FluentGeom3(booleans.intersect(geometries as FluentGeom3[]));
}

// Array constructors - infers type from first argument
function array(...items: FluentGeom2[]): FluentGeom2Array;
function array(...items: FluentGeom3[]): FluentGeom3Array;
function array(...items: FluentPath2[]): FluentPath2Array;
function array(
  ...items: (FluentGeom2 | FluentGeom3 | FluentPath2)[]
): FluentGeom2Array | FluentGeom3Array | FluentPath2Array {
  if (items.length === 0) {
    throw new Error(
      'array() requires at least one item. Use geom2Array(), geom3Array(), or path2Array() for empty arrays.',
    );
  }
  const first = items[0];
  if (first instanceof FluentGeom2) {
    return new FluentGeom2Array(...(items as FluentGeom2[]));
  }
  if (first instanceof FluentGeom3) {
    return new FluentGeom3Array(...(items as FluentGeom3[]));
  }
  return new FluentPath2Array(...(items as FluentPath2[]));
}

// Typed array constructors for empty arrays (use in loops)
function geom2Array(...items: FluentGeom2[]): FluentGeom2Array {
  return new FluentGeom2Array(...items);
}

function geom3Array(...items: FluentGeom3[]): FluentGeom3Array {
  return new FluentGeom3Array(...items);
}

function path2Array(...items: FluentPath2[]): FluentPath2Array {
  return new FluentPath2Array(...items);
}

/**
 * Main entry point for the JSCAD Fluent API.
 * Provides factory functions for creating fluent geometry objects.
 */
const jscadFluent = {
  // Path2 Primitives
  arc(options: ArcOptions): FluentPath2 {
    return new FluentPath2(primitives.arc(options));
  },

  line(points: Point2[]): FluentPath2 {
    return new FluentPath2(primitives.line(points));
  },

  /**
   * Make a path from points, open or closed.
   * @param {Object} options - path options
   * @param {Boolean} [options.closed=false] - join the last point back to the first
   * @param {Array} points - 2D points in order
   * @returns {FluentPath2} the path
   * @example
   * jf.path({ closed: true }, [[0, 0], [10, 0], [5, 8]])
   */
  path({ closed = false }: { closed?: boolean }, points: Point2[]): FluentPath2 {
    return new FluentPath2(geometries.path2.fromPoints({ closed }, points));
  },

  // 2D Primitives
  rectangle(options: RectangleOptions): FluentGeom2 {
    return new FluentGeom2(primitives.rectangle(options));
  },

  roundedRectangle(options: { size: Point2; roundRadius: number }): FluentGeom2 {
    return new FluentGeom2(primitives.roundedRectangle(options));
  },

  circle(options: CircleOptions): FluentGeom2 {
    return new FluentGeom2(primitives.circle(options));
  },

  ellipse(options: EllipseOptions): FluentGeom2 {
    return new FluentGeom2(primitives.ellipse(options));
  },

  polygon(points: Point2[]): FluentGeom2 {
    return new FluentGeom2(primitives.polygon({ points }));
  },

  square(options: SquareOptions): FluentGeom2 {
    return new FluentGeom2(primitives.square(options));
  },

  star(options: StarOptions): FluentGeom2 {
    return new FluentGeom2(primitives.star(options));
  },

  triangle(options: TriangleOptions): FluentGeom2 {
    return new FluentGeom2(primitives.triangle(options));
  },

  // 3D Primitives
  cube(options: CubeOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cube(options));
  },

  cuboid(options: CuboidOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cuboid(options));
  },

  sphere(options: SphereOptions): FluentGeom3 {
    return new FluentGeom3(primitives.sphere(options));
  },

  cylinder,

  cylinderElliptic(options: CylinderEllipticOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cylinderElliptic(options));
  },

  torus(options: TorusOptions): FluentGeom3 {
    return new FluentGeom3(primitives.torus(options));
  },

  ellipsoid(options: EllipsoidOptions): FluentGeom3 {
    return new FluentGeom3(primitives.ellipsoid(options));
  },

  geodesicSphere(options: GeodesicSphereOptions): FluentGeom3 {
    return new FluentGeom3(primitives.geodesicSphere(options));
  },

  roundedCuboid(options: RoundedCuboidOptions): FluentGeom3 {
    return new FluentGeom3(primitives.roundedCuboid(options));
  },

  roundedCylinder(options: RoundedCylinderOptions): FluentGeom3 {
    return new FluentGeom3(primitives.roundedCylinder(options));
  },

  polyhedron({
    points,
    faces,
  }: {
    points: [number, number, number][];
    faces: number[][];
  }): FluentGeom3 {
    return new FluentGeom3(primitives.polyhedron({ points, faces }));
  },

  /**
   * Extrude a solid from slices that a callback places along the way, starting
   * from a slice (see `jf.slice`). For a 2D shape, `shape.extrudeFromSlices()`.
   * @param {Object} options - slice options
   * @param {Integer} [options.numberOfSlices=2] - number of times the callback is called; at least 2
   * @param {Boolean} [options.capStart=true] - close the start of the solid
   * @param {Boolean} [options.capEnd=true] - close the end of the solid
   * @param {Boolean} [options.close=false] - join the last slice back to the first, for a ring
   * @param {Boolean} [options.repair=true] - repair gaps in the base slice
   * @param {Function} [options.callback] - (progress, index, base) => slice or null to skip; progress runs 0 to 1
   * @param {Slice} base - the slice handed to the callback
   * @returns {FluentGeom3} the extruded solid
   * @example
   * const { mat4 } = jf.maths
   * const base = jf.slice.fromPoints([[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0]])
   * jf.extrudeFromSlices({
   *   numberOfSlices: 8,
   *   callback: (t, i, s) => jf.slice.transform(mat4.fromTranslation(mat4.create(), [0, 0, t * 30]), s),
   * }, base)
   */
  extrudeFromSlices(options: ExtrudeFromSlicesOptions<Slice>, base: Slice): FluentGeom3 {
    return new FluentGeom3(extrusions.extrudeFromSlices(options, base));
  },

  /**
   * Slices for extrudeFromSlices: a slice is a closed loop of 3D edges.
   */
  slice: {
    /**
     * Create a slice from a closed loop of 2D or 3D points.
     * @param points - the loop's points
     * @returns a new slice
     */
    fromPoints: extrusions.slice.fromPoints,

    /**
     * Create a slice from geom2 sides, as returned by `shape.toSides()`.
     * @param sides - list of [start, end] point pairs
     * @returns a new slice
     */
    fromSides: extrusions.slice.fromSides,

    /**
     * Transform a slice by a matrix from `jf.maths.mat4`.
     * @param matrix - the transform
     * @param slice - the slice to transform
     * @returns a new slice
     */
    transform: extrusions.slice.transform,

    /**
     * Reverse the edges of a slice, flipping which way it faces.
     * @param slice - the slice to reverse
     * @returns a new slice
     */
    reverse: extrusions.slice.reverse,

    /**
     * Create a slice from a list of edges, or an empty slice.
     * @param edges - list of [start, end] 3D point pairs
     * @returns a new slice
     */
    create: extrusions.slice.create,

    /**
     * Copy a slice.
     * @param slice - the slice to copy
     * @returns a new slice
     */
    clone: extrusions.slice.clone,

    /**
     * The plane that a slice lies in.
     * @param slice - the slice
     * @returns plane as [nx, ny, nz, distance]
     */
    calculatePlane: extrusions.slice.calculatePlane,

    /**
     * The edges of a slice as [start, end] 3D point pairs.
     * @param slice - the slice
     * @returns list of edges
     */
    toEdges: extrusions.slice.toEdges,

    /**
     * The slice as polygons, one per edge fan.
     * @param slice - the slice
     * @returns list of polygons
     */
    toPolygons: extrusions.slice.toPolygons,

    /**
     * Whether two slices have the same edges.
     * @param a - first slice
     * @param b - second slice
     * @returns true when equal
     */
    equals: extrusions.slice.equals,

    /**
     * Whether a value is a slice.
     * @param object - the value to test
     * @returns true for a slice
     */
    isA: extrusions.slice.isA,
  },

  // Boolean operations (top-level) - reference overloaded functions
  union,
  subtract,
  intersect,

  /**
   * Total area of several shapes: geom2 area, or geom3 surface area.
   * @param {...Object} geometries - shapes, or arrays of shapes
   * @returns {Number} the summed area
   * @example
   * jf.measureAggregateArea(a, b, c)
   */
  measureAggregateArea: measurements.measureAggregateArea,

  /**
   * Total volume of several solids.
   * @param {...Object} geometries - solids, or arrays of solids
   * @returns {Number} the summed volume
   */
  measureAggregateVolume: measurements.measureAggregateVolume,

  /**
   * One bounding box around several shapes.
   * @param {...Object} geometries - shapes, or arrays of shapes
   * @returns {Array} [[minX, minY, minZ], [maxX, maxY, maxZ]]
   */
  measureAggregateBoundingBox: measurements.measureAggregateBoundingBox,

  /**
   * One precision (epsilon) for several shapes, from their combined bounds.
   * @param {...Object} geometries - shapes, or arrays of shapes
   * @returns {Number} the epsilon
   */
  measureAggregateEpsilon: measurements.measureAggregateEpsilon,

  /**
   * Align several shapes: translate each so its bounding box meets a point,
   * per axis. With grouped: true they move together and keep their spacing.
   * @param {Object} options - alignment options
   * @param {Array} [options.modes=['center','center','min']] - per axis 'min', 'max', 'center' or 'none' (leave that axis alone)
   * @param {Array} [options.relativeTo=[0,0,0]] - per axis target coordinate; null uses the group's own bounds
   * @param {Boolean} [options.grouped=false] - move all shapes by the same amount
   * @param {...Object} geometries - shapes, or arrays of shapes, of any type
   * @returns {Array} the moved shapes in order, each wrapped in its fluent class
   * @example
   * const [base, lid] = jf.align({ modes: ['center', 'center', 'min'], grouped: true }, base0, lid0)
   */
  align(
    options: AlignOptions,
    ...geometries: (
      | FluentGeom2
      | FluentGeom3
      | FluentPath2
      | (FluentGeom2 | FluentGeom3 | FluentPath2)[]
    )[]
  ): (FluentGeom2 | FluentGeom3 | FluentPath2)[] {
    return ([transforms.align(options, ...geometries)].flat() as Geometry[]).map(wrapShape);
  },

  /**
   * Convex hull of 2D points, for jf.polygon.
   * @param {Array} points - 2D points
   * @returns {Array} the hull's points, counter-clockwise
   * @example
   * jf.polygon(jf.hullPoints2(points))
   */
  hullPoints2: hulls.hullPoints2,

  /**
   * Convex hull of 3D points as the points and faces jf.polyhedron takes.
   * @param {Array} points - 3D points
   * @returns {Object} { points, faces }: the hull's points, and faces as index lists wound outward
   * @example
   * jf.polyhedron(jf.hullPoints3(points))
   */
  hullPoints3(points: Point3[]): { points: Point3[]; faces: number[][] } {
    const index = new Map<string, number>();
    const hullPoints: Point3[] = [];
    const faces = hulls.hullPoints3(points).map((polygon) =>
      polygon.vertices.map((vertex) => {
        const key = vertex.join(',');
        let at = index.get(key);
        if (at === undefined) {
          at = hullPoints.length;
          index.set(key, at);
          hullPoints.push([vertex[0], vertex[1], vertex[2]]);
        }
        return at;
      }),
    );
    return { points: hullPoints, faces };
  },

  /**
   * Curves as data. Sample one with `valueAt` for jf.polygon or jf.line, or
   * add one to a path with `path.appendBezier()`.
   */
  curves: {
    /**
     * Bezier curves of any order and dimension. `create` takes the control
     * points; the other functions take the curve it returns.
     */
    bezier: {
      /**
       * Create a Bezier curve from its control points: numbers for a 1D easing
       * curve, or 2D or 3D points.
       * @param points - control points; the first and last are the ends
       * @returns the curve
       * @example
       * const curve = jf.curves.bezier.create([[0, 0], [5, 10], [10, 0]])
       */
      create: curves.bezier.create,

      /**
       * The point on a curve at t.
       * @param t - position along the curve, 0 to 1
       * @param bezier - the curve
       * @returns a number or point, matching the control points
       * @example
       * const points = Array.from({ length: 17 }, (_, i) => jf.curves.bezier.valueAt(i / 16, curve))
       */
      valueAt: curves.bezier.valueAt,

      /**
       * The tangent (derivative) of a curve at t.
       * @param t - position along the curve, 0 to 1
       * @param bezier - the curve
       * @returns a number or vector, matching the control points
       */
      tangentAt: curves.bezier.tangentAt,

      /**
       * Approximate length of a curve.
       * @param segments - number of straight segments to measure along
       * @param bezier - the curve
       * @returns the length
       */
      length: curves.bezier.length,

      /**
       * Cumulative lengths along a curve, one per segment end, starting at 0.
       * @param segments - number of straight segments to measure along
       * @param bezier - the curve
       * @returns segments + 1 lengths
       */
      lengths: curves.bezier.lengths,

      /**
       * The t at which a curve has run a given distance, for even spacing.
       * @param {Object} options - options
       * @param {Number} [options.distance=0] - distance along the curve
       * @param {Number} [options.segments=100] - number of segments used to measure
       * @param bezier - the curve
       * @returns t, 0 to 1
       */
      arcLengthToT: curves.bezier.arcLengthToT,
    },
  },

  /**
   * Text in a single-stroke (Hershey simplex) font, as one open path per
   * stroke. Expand or extrudeRectangular the paths to give them width.
   * @param {Object|String} options - text options, or the text itself
   * @param {Number} [options.xOffset=0] - X of the first character's left edge
   * @param {Number} [options.yOffset=0] - Y of the first line's baseline
   * @param {Number} [options.height=14] - height of a lowercase letter; uppercase letters are 1.5 times taller
   * @param {Number} [options.lineSpacing=2.142857] - distance between baselines, as a multiple of height
   * @param {Number} [options.letterSpacing=1] - extra space between letters, as a multiple of height
   * @param {String} [options.align='left'] - alignment of multi-line text: 'left', 'center' or 'right'
   * @param {Number} [options.extrudeOffset=0] - planned stroke width; shrinks the letters so they keep their height once expanded
   * @param {String} [options.input='?'] - the text, when not given as the second argument
   * @param {String} [text] - the text; lines split on newlines
   * @returns {FluentPath2Array} the strokes
   * @example
   * jf.union(jf.vectorText({ height: 10 }, 'JSCAD').expand({ delta: 1, corners: 'round' })).extrudeLinear({ height: 2 })
   */
  vectorText(options: VectorTextOptions | string, text?: string): FluentPath2Array {
    const strokes =
      text === undefined
        ? textModule.vectorText(options as VectorTextOptions)
        : textModule.vectorText(options as Omit<VectorTextOptions, 'input'>, text);
    return strokesToPaths(strokes);
  },

  /**
   * One character in the single-stroke font, with its size for placing the next.
   * @param {Object|String} options - character options, or the character itself
   * @param {Number} [options.xOffset=0] - X of the character's left edge
   * @param {Number} [options.yOffset=0] - Y of the baseline
   * @param {Number} [options.height=14] - height of a lowercase letter; uppercase letters are 1.5 times taller
   * @param {Number} [options.extrudeOffset=0] - planned stroke width; shrinks the character so it keeps its height once expanded
   * @param {String} [options.input='?'] - the character, when not given as the second argument
   * @param {String} [char] - the character
   * @returns {Object} { width, height, segments }: the advance width, the height, and the strokes as a FluentPath2Array
   * @example
   * const { width, segments } = jf.vectorChar({ height: 10 }, 'A')
   */
  vectorChar(
    options: VectorCharOptions | string,
    char?: string,
  ): { width: number; height: number; segments: FluentPath2Array } {
    const { width, height, segments } =
      char === undefined
        ? textModule.vectorChar(options as VectorCharOptions)
        : textModule.vectorChar(options as Omit<VectorCharOptions, 'input'>, char);
    return { width, height, segments: strokesToPaths(segments) };
  },

  /**
   * Whether a value is 2D geometry, fluent or raw.
   * @param {Object} value - the value to test
   * @returns {Boolean} true for a geom2
   * @example
   * const solid = jf.isGeom2(part) ? part.extrudeLinear({ height: 1 }) : part
   */
  isGeom2(value: unknown): value is Geom2 {
    return geometries.geom2.isA(value);
  },

  /**
   * Whether a value is a solid (3D geometry), fluent or raw.
   * @param {Object} value - the value to test
   * @returns {Boolean} true for a geom3
   */
  isGeom3(value: unknown): value is Geom3 {
    return geometries.geom3.isA(value);
  },

  /**
   * Whether a value is a path, fluent or raw.
   * @param {Object} value - the value to test
   * @returns {Boolean} true for a path2
   */
  isPath2(value: unknown): value is Path2 {
    return geometries.path2.isA(value);
  },

  // Array constructors
  array,
  geom2Array,
  geom3Array,
  path2Array,

  // Wrapper classes - attached to default object for CJS/UMD consumers
  FluentGeom2,
  FluentGeom3,

  /**
   * Color utilities for converting between color formats.
   * All color values are normalized to 0-1 range for use with colorize().
   */
  colors: {
    /**
     * Convert hex color notation to RGB or RGBA.
     * @param hex - Hex color string (e.g., '#FF0000', '#F00', '#FF000080')
     * @returns RGB or RGBA tuple with values 0-1
     * @example
     * jscadFluent.colors.hexToRgb('#FF0000')  // [1, 0, 0]
     * jscadFluent.colors.hexToRgb('#FF000080')  // [1, 0, 0, 0.5]
     */
    hexToRgb: colors.hexToRgb,

    /**
     * Convert CSS color name to RGB.
     * @param name - CSS color name (e.g., 'red', 'lightblue', 'cornflowerblue')
     * @returns RGB tuple with values 0-1
     * @example
     * jscadFluent.colors.colorNameToRgb('red')  // [1, 0, 0]
     * jscadFluent.colors.colorNameToRgb('lightblue')  // [0.68, 0.85, 0.9]
     */
    colorNameToRgb: colors.colorNameToRgb,

    /**
     * Convert HSL to RGB. All values use 0-1 range.
     * @param hsl - HSL or HSLA tuple (all values 0-1)
     * @returns RGB or RGBA tuple with values 0-1
     * @example
     * jscadFluent.colors.hslToRgb([0, 1, 0.5])  // Red: [1, 0, 0]
     * jscadFluent.colors.hslToRgb([0.33, 1, 0.5])  // Green
     */
    hslToRgb: colors.hslToRgb,

    /**
     * Convert HSV to RGB. All values use 0-1 range.
     * @param hsv - HSV or HSVA tuple (all values 0-1)
     * @returns RGB or RGBA tuple with values 0-1
     * @example
     * jscadFluent.colors.hsvToRgb([0, 1, 1])  // Red: [1, 0, 0]
     * jscadFluent.colors.hsvToRgb([0.33, 1, 1])  // Green
     */
    hsvToRgb: colors.hsvToRgb,

    /**
     * Convert RGB to hex notation.
     * @param rgb - RGB or RGBA tuple with values 0-1
     * @returns Hex color string
     * @example
     * jscadFluent.colors.rgbToHex([1, 0, 0])  // '#FF0000'
     */
    rgbToHex: colors.rgbToHex,

    /**
     * Convert RGB to HSL.
     * @param rgb - RGB or RGBA tuple with values 0-1
     * @returns HSL or HSLA tuple
     */
    rgbToHsl: colors.rgbToHsl,

    /**
     * Convert RGB to HSV.
     * @param rgb - RGB or RGBA tuple with values 0-1
     * @returns HSV or HSVA tuple
     */
    rgbToHsv: colors.rgbToHsv,

    /**
     * CSS color constants (150+ named colors).
     * All values are RGB tuples with values 0-1.
     * @example
     * jscadFluent.colors.css.red  // [1, 0, 0]
     * jscadFluent.colors.css.lightblue  // [0.68, 0.85, 0.9]
     */
    css: colors.cssColors,
  },

  /**
   * Unit conversions and helpers from `@jscad/modeling`'s utils.
   */
  utils: {
    /**
     * Convert degrees to radians.
     * @param degrees - angle in degrees
     * @returns angle in radians
     * @example
     * jf.utils.degToRad(90)  // Math.PI / 2
     */
    degToRad: utils.degToRad,

    /**
     * Convert radians to degrees.
     * @param radians - angle in radians
     * @returns angle in degrees
     */
    radToDeg: utils.radToDeg,

    /**
     * Number of segments for a round shape of the given radius, from a minimum
     * segment length or a minimum angle between segments; at least 4.
     * @param radius - radius of the shape
     * @param minimumLength - minimum segment length; 0 to ignore
     * @param minimumAngle - minimum angle between segments in radians; 0 to ignore
     * @returns segment count
     * @example
     * jf.circle({ radius: 10, segments: jf.utils.radiusToSegments(10, 0.5, 0) })
     */
    radiusToSegments: utils.radiusToSegments,

    /**
     * Flatten nested arrays into one array.
     * @param arr - array of values or nested arrays
     * @returns flat array
     */
    flatten: utils.flatten,
  },

  /**
   * Vector, matrix, line and plane math from `@jscad/modeling`'s maths. The
   * functions that build a value take the output first: `vec3.add(vec3.create(), a, b)`.
   */
  maths: {
    /**
     * Numeric constants.
     */
    // `as typeof` makes the declarations name each constant, so a docs index can list it as a value.
    constants: {
      /**
       * 2 * PI, a full turn in radians.
       */
      TAU: constants.TAU as typeof constants.TAU,

      /**
       * The tolerance modeling uses when comparing points and planes, 1e-5.
       */
      EPS: constants.EPS as typeof constants.EPS,

      /**
       * A smaller tolerance for near-zero distances, 1e-13, used to compare coplanar polygons.
       */
      NEPS: constants.NEPS as typeof constants.NEPS,

      /**
       * The resolution of space, 1e5 steps per unit; 1 / EPS.
       */
      spatialResolution: constants.spatialResolution as typeof constants.spatialResolution,
    },

    /**
     * 2D vector functions (`add`, `subtract`, `scale`, `length`, `normalize`,
     * `rotate`, `fromAngleRadians`, ...), each taking the output vector first.
     */
    vec2: maths.vec2,

    /**
     * 3D vector functions (`add`, `subtract`, `scale`, `cross`, `dot`,
     * `length`, `normalize`, ...), each taking the output vector first.
     */
    vec3: maths.vec3,

    /**
     * 4x4 matrix functions (`create`, `fromTranslation`, `fromXRotation`,
     * `fromScaling`, `multiply`, ...) for `.transform(matrix)`.
     */
    mat4: maths.mat4,

    /**
     * 4D vector functions (`create`, `fromValues`, `add`, `scale`, `dot`,
     * `transform`, ...), each taking the output vector first. A plane is a vec4.
     */
    vec4: maths.vec4,

    /**
     * 2D infinite lines as [nx, ny, distance] (`create`, `fromPoints`, `direction`,
     * `distanceToPoint`, `closestPoint`, `intersectPointOfLines`, ...).
     */
    line2: maths.line2,

    /**
     * 3D infinite lines as [origin, direction] (`create`, `fromPoints`,
     * `distanceToPoint`, `closestPoint`, `intersectPointOfLineAndPlane`, ...).
     */
    line3: maths.line3,

    /**
     * Planes as [nx, ny, nz, distance] (`create`, `fromPoints`, `fromNormalAndPoint`,
     * `signedDistanceToPoint`, `projectionOfPoint`, `flip`, ...).
     */
    plane: maths.plane,

    /**
     * Helpers: `area(points)` of a 2D polygon, `sin` and `cos` that return exact
     * 0 and 1 at quarter turns, `solve2Linear`, `intersect` of 2D segments,
     * `interpolateBetween2DPointsForY` and `aboutEqualNormals`.
     */
    utils: maths.utils,
  },
};

// Default export for simple usage: const jf = require('@jbroll/jscad-fluent')
export default jscadFluent;
