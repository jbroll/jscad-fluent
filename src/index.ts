import { primitives, curves } from '@jscad/modeling';
import { FluentGeom2 } from './gen/FluentGeom2';
import { FluentPath2 } from './gen/FluentPath2';
import { FluentGeom3 } from './gen/FluentGeom3';
import type { 
  Point2,
  StarOptions, 
  RectangleOptions, 
  CircleOptions,
  EllipseOptions,
  CubeOptions,
  SphereOptions,
  CylinderOptions,
  CylinderEllipticOptions,
  TorusOptions,
  SquareOptions
} from './types';

/**
 * Main entry point for the JSCAD Fluent API.
 * Provides factory functions for creating fluent geometry objects.
 */
export const jscadFluent = {
  // Path2 Primitives
  arc(options: { center: Point2; radius: number; startAngle: number; endAngle: number; }): FluentPath2 {
    return new FluentPath2(primitives.arc(options));
  },

  line(points: Point2[]): FluentPath2 {
    return new FluentPath2(primitives.line(points));
  },

  // 2D Primitives
  rectangle(options: RectangleOptions): FluentGeom2 {
    return new FluentGeom2(primitives.rectangle(options));
  },

  roundedRectangle(options: { size: Point2; roundRadius: number; }): FluentGeom2 {
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

  polyhedron({ points, faces }: { points: [number, number, number][], faces: number[][] }): FluentGeom3 {
    return new FluentGeom3(primitives.polyhedron({ points, faces }));
  }
};

// Export classes for advanced usage
export { FluentGeom2 } from './gen/FluentGeom2';
export { FluentPath2 } from './gen/FluentPath2';
export { FluentGeom3 } from './gen/FluentGeom3';
export { FluentGeom2Array } from './gen/FluentGeom2Array';
export { FluentPath2Array } from './gen/FluentPath2Array';
export { FluentGeom3Array } from './gen/FluentGeom3Array';
