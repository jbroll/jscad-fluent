import {
  booleans,
  colors,
  extrusions,
  maths,
  measurements,
  primitives,
  utils,
} from '@jbroll/jscad-anchors';
import { cylinder } from './cylinder';
import { FluentGeom2 } from './gen/FluentGeom2';
import { FluentGeom2Array } from './gen/FluentGeom2Array';
import { FluentGeom3 } from './gen/FluentGeom3';
import { FluentGeom3Array } from './gen/FluentGeom3Array';
import { FluentPath2 } from './gen/FluentPath2';
import { FluentPath2Array } from './gen/FluentPath2Array';
import type {
  ArcOptions,
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderEllipticOptions,
  EllipseOptions,
  EllipsoidOptions,
  ExtrudeFromSlicesOptions,
  GeodesicSphereOptions,
  Point2,
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
} from './types';

// Overloaded boolean functions for type-safe returns
function union(...geometries: (FluentGeom2 | FluentGeom2[])[]): FluentGeom2;
function union(...geometries: (FluentGeom3 | FluentGeom3[])[]): FluentGeom3;
function union(
  ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('union requires at least one geometry');
  }
  const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
  if (first instanceof FluentGeom2) {
    return new FluentGeom2(booleans.union(geometries as FluentGeom2[]));
  }
  return new FluentGeom3(booleans.union(geometries as FluentGeom3[]));
}

function subtract(...geometries: (FluentGeom2 | FluentGeom2[] | SubtractOptions)[]): FluentGeom2;
function subtract(...geometries: (FluentGeom3 | FluentGeom3[] | SubtractOptions)[]): FluentGeom3;
function subtract(
  ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[] | SubtractOptions)[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('subtract requires at least one geometry');
  }
  const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
  // Spread, not one array: subtractAnchored only reads { carry } from its last argument.
  if (first instanceof FluentGeom2) {
    return new FluentGeom2(booleans.subtract(...(geometries as FluentGeom2[])));
  }
  return new FluentGeom3(booleans.subtract(...(geometries as FluentGeom3[])));
}

function intersect(...geometries: (FluentGeom2 | FluentGeom2[])[]): FluentGeom2;
function intersect(...geometries: (FluentGeom3 | FluentGeom3[])[]): FluentGeom3;
function intersect(
  ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('intersect requires at least one geometry');
  }
  const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
  if (first instanceof FluentGeom2) {
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
   * Vector and matrix math from `@jscad/modeling`'s maths. The vec2, vec3 and
   * mat4 functions take the output first: `vec3.add(vec3.create(), a, b)`.
   */
  maths: {
    /**
     * Numeric constants: `TAU` (2 * PI), `EPS` (geometry tolerance), `NEPS`
     * and `spatialResolution`.
     */
    constants: maths.constants as {
      TAU: number;
      EPS: number;
      NEPS: number;
      spatialResolution: number;
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
  },
};

// Default export for simple usage: const jf = require('@jbroll/jscad-fluent')
export default jscadFluent;
