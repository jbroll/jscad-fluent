import { geometries, primitives, maths } from '@jscad/modeling';
import type { Geometry } from '@jscad/modeling/src/geometries/types';
import type { ExtrudeLinearOptions, ExtrudeRotateOptions } from '@jscad/modeling/src/operations/extrusions/types';

export type { JSCADGeom2, JSCADGeom3 } from '@jscad/modeling/src/geometries/types';
export type { ExtrudeLinearOptions, ExtrudeRotateOptions } from '@jscad/modeling/src/operations/extrusions';
export type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

export type Geom2Like = JSCADGeom2 | RecursiveArray<JSCADGeom2>;
export type Geom3Like = JSCADGeom3 | RecursiveArray<JSCADGeom3>;
export type GeometryLike = Geometry | RecursiveArray<Geometry>;

// Re-export vector and matrix types from JSCAD
export type Vec2 = maths.vec2.Vec2;
export type Vec3 = maths.vec3.Vec3;
export type Mat4 = maths.mat4.Mat4;

// Export base geometry type
export type { Geometry };

// Re-export extrusion types
export type { ExtrudeLinearOptions, ExtrudeRotateOptions };

export type Centroid = [number, number, number]

// Custom types for our wrapper classes
export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type AlignOptions = ['min' | 'center' | 'max', 'min' | 'center' | 'max', 'min' | 'center' | 'max'];

// Re-export JSCAD's option types
export type { 
  RectangleOptions,
  CircleOptions,
  EllipseOptions,
  CubeOptions,
  SphereOptions
} from '@jscad/modeling/src/primitives/types';

// Type guard functions
export function isGeom2(geom: Geometry): geom is JSCADGeom2 {
  return geom.type === 'geom2';
}

export function isGeom3(geom: Geometry): geom is JSCADGeom3 {
  return geom.type === 'geom3';
}
