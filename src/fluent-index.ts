import { primitives, maths, utils } from '@jscad/modeling';
import { FluentGeom2 } from './fluent-geom2';
import type {
  Point2,
} from './fluent-types';

interface RectangleOptions {
  center?: Point2;
  size: Point2;
}

interface CircleOptions {
  center?: Point2;
  radius: number;
  segments?: number;
}

interface EllipseOptions {
  center?: Point2;
  radius: Point2;
  segments?: number;
}

interface SquareOptions {
  center?: Point2;
  size: number;
}

interface StarOptions {
  center?: Point2;
  vertices: number;
  outerRadius: number;
  innerRadius: number;
}

export const jscadFluent = {
  // 2D primitives
  rectangle: (options: RectangleOptions): FluentGeom2 => 
    new FluentGeom2(primitives.rectangle(options)),
  
  circle: (options: CircleOptions): FluentGeom2 => 
    new FluentGeom2(primitives.circle(options)),
  
  ellipse: (options: EllipseOptions): FluentGeom2 => 
    new FluentGeom2(primitives.ellipse(options)),
  
  polygon: (points: Point2[]): FluentGeom2 => 
    new FluentGeom2(primitives.polygon({ points })),
  
  square: (options: SquareOptions): FluentGeom2 => 
    new FluentGeom2(primitives.square(options)),
  
  star: (options: StarOptions): FluentGeom2 => 
    new FluentGeom2(primitives.star(options)),

  // Utility functions
  vec2: maths.vec2,
  vec3: maths.vec3,
  mat4: maths.mat4,
  degToRad: utils.degToRad,
  radToDeg: utils.radToDeg
};

export default jscadFluent;
