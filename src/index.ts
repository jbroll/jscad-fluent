import { primitives, maths, utils } from '@jscad/modeling';
import Geom2Wrapper from './Geom2Wrapper';
import Geom3Wrapper from './Geom3Wrapper';
import type {
  RectangleOptions,
  CircleOptions,
  EllipseOptions,
  CubeOptions,
  SphereOptions,
  Point2,
  Point3
} from './types';

interface StarOptions {
  vertices: number;
  outerRadius: number;
  innerRadius: number;
}

interface PolyhedronOptions {
  points: Point3[];
  faces: number[][];
  orientation?: 'inward' | 'outward';
}

export const jscadFluent = {
  // 2D primitives
  rectangle: (options: RectangleOptions): Geom2Wrapper => 
    new Geom2Wrapper(primitives.rectangle(options)),
  
  circle: (options: CircleOptions): Geom2Wrapper => 
    new Geom2Wrapper(primitives.circle(options)),
  
  ellipse: (options: EllipseOptions): Geom2Wrapper => 
    new Geom2Wrapper(primitives.ellipse(options)),
  
  polygon: (points: Point2[]): Geom2Wrapper => 
    new Geom2Wrapper(primitives.polygon({ points })),
  
  square: (options: RectangleOptions): Geom2Wrapper => 
    new Geom2Wrapper(primitives.square(options)),
  
  star: (options: StarOptions): Geom2Wrapper => 
    new Geom2Wrapper(primitives.star(options)),

  // 3D primitives
  cube: (options: CubeOptions): Geom3Wrapper => 
    new Geom3Wrapper(primitives.cube(options)),
  
  cuboid: (options: CubeOptions): Geom3Wrapper => 
    new Geom3Wrapper(primitives.cuboid(options)),
  
  sphere: (options: SphereOptions): Geom3Wrapper => 
    new Geom3Wrapper(primitives.sphere(options)),
  
  cylinder: (options: { radius: number; height: number }): Geom3Wrapper => 
    new Geom3Wrapper(primitives.cylinder(options)),
  
  cylinderElliptic: (options: { height: number; startRadius: [number, number]; endRadius?: [number, number] }): Geom3Wrapper => 
    new Geom3Wrapper(primitives.cylinderElliptic(options)),
  
  torus: (options: { innerRadius: number; outerRadius: number }): Geom3Wrapper => 
    new Geom3Wrapper(primitives.torus(options)),
  
  polyhedron: (options: PolyhedronOptions): Geom3Wrapper => 
    new Geom3Wrapper(primitives.polyhedron(options)),

  // Utility functions
  vec2: maths.vec2,
  vec3: maths.vec3,
  mat4: maths.mat4,
  degToRad: utils.degToRad,
  radToDeg: utils.radToDeg
};

export default jscadFluent;