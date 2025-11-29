import { booleans, colors, primitives } from '@jscad/modeling';
import { FluentGeom2 } from './gen/FluentGeom2';
import { FluentGeom3 } from './gen/FluentGeom3';
import { FluentPath2 } from './gen/FluentPath2';
import type {
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderEllipticOptions,
  CylinderOptions,
  EllipseOptions,
  Point2,
  RectangleOptions,
  SphereOptions,
  SquareOptions,
  StarOptions,
  TorusOptions,
} from './types';

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

  cylinder(options: CylinderOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cylinder(options));
  },

  cylinderElliptic(options: CylinderEllipticOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cylinderElliptic(options));
  },

  torus(options: TorusOptions): FluentGeom3 {
    return new FluentGeom3(primitives.torus(options));
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

  // Boolean operations (top-level)
  /**
   * Union multiple 2D or 3D geometries together.
   * @param geometries - Geometries to union (must all be same type). Accepts individual args, arrays, or mixed.
   * @returns A new fluent geometry containing the union
   * @example
   * jf.union(cube1, cube2, cube3)
   * jf.union([cube1, cube2, cube3])
   * jf.union(circle1, circle2)
   */
  union(
    ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
  ): FluentGeom2 | FluentGeom3 {
    if (geometries.length === 0) {
      throw new Error('union requires at least one geometry');
    }
    // JSCAD's booleans.union has built-in flatten
    const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
    if (first instanceof FluentGeom2) {
      return new FluentGeom2(booleans.union(geometries as FluentGeom2[]));
    }
    return new FluentGeom3(booleans.union(geometries as FluentGeom3[]));
  },

  /**
   * Subtract geometries from the first geometry.
   * @param geometries - First geometry is the base, rest are subtracted from it. Accepts individual args, arrays, or mixed.
   * @returns A new fluent geometry with the subtractions applied
   * @example
   * jf.subtract(block, hole1, hole2)
   * jf.subtract(block, [hole1, hole2])
   */
  subtract(
    ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
  ): FluentGeom2 | FluentGeom3 {
    if (geometries.length === 0) {
      throw new Error('subtract requires at least one geometry');
    }
    // JSCAD's booleans.subtract has built-in flatten
    const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
    if (first instanceof FluentGeom2) {
      return new FluentGeom2(booleans.subtract(geometries as FluentGeom2[]));
    }
    return new FluentGeom3(booleans.subtract(geometries as FluentGeom3[]));
  },

  /**
   * Intersect multiple geometries, keeping only overlapping regions.
   * @param geometries - Geometries to intersect (must all be same type). Accepts individual args, arrays, or mixed.
   * @returns A new fluent geometry containing only the intersection
   * @example
   * jf.intersect(cube1, cube2)
   * jf.intersect([cube1, cube2, cube3])
   */
  intersect(
    ...geometries: (FluentGeom2 | FluentGeom3 | FluentGeom2[] | FluentGeom3[])[]
  ): FluentGeom2 | FluentGeom3 {
    if (geometries.length === 0) {
      throw new Error('intersect requires at least one geometry');
    }
    // JSCAD's booleans.intersect has built-in flatten
    const first = Array.isArray(geometries[0]) ? geometries[0][0] : geometries[0];
    if (first instanceof FluentGeom2) {
      return new FluentGeom2(booleans.intersect(geometries as FluentGeom2[]));
    }
    return new FluentGeom3(booleans.intersect(geometries as FluentGeom3[]));
  },

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
