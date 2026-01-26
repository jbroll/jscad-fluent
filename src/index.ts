import { booleans, colors, primitives } from '@jscad/modeling';
import { cylinder } from './cylinder';
import { FluentGeom2 } from './gen/FluentGeom2';
import { FluentGeom2Array } from './gen/FluentGeom2Array';
import { FluentGeom3 } from './gen/FluentGeom3';
import { FluentGeom3Array } from './gen/FluentGeom3Array';
import { FluentPath2 } from './gen/FluentPath2';
import { FluentPath2Array } from './gen/FluentPath2Array';
import type {
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderEllipticOptions,
  EllipseOptions,
  EllipsoidOptions,
  GeodesicSphereOptions,
  Point2,
  RectangleOptions,
  RoundedCuboidOptions,
  RoundedCylinderOptions,
  SphereOptions,
  SquareOptions,
  StarOptions,
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

function subtract(...geometries: (FluentGeom2 | FluentGeom2[])[]): FluentGeom2;
function subtract(...geometries: (FluentGeom3 | FluentGeom3[])[]): FluentGeom3;
function subtract(
  ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
): FluentGeom2 | FluentGeom3 {
  if (geometries.length === 0) {
    throw new Error('subtract requires at least one geometry');
  }
  const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
  if (first instanceof FluentGeom2) {
    return new FluentGeom2(booleans.subtract(geometries as FluentGeom2[]));
  }
  return new FluentGeom3(booleans.subtract(geometries as FluentGeom3[]));
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
  arc(options: {
    center: Point2;
    radius: number;
    startAngle: number;
    endAngle: number;
  }): FluentPath2 {
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

  // Boolean operations (top-level) - reference overloaded functions
  union,
  subtract,
  intersect,

  // Array constructors
  array,
  geom2Array,
  geom3Array,
  path2Array,

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
};

// Default export for simple usage: const jf = require('@jbroll/jscad-fluent')
export default jscadFluent;
