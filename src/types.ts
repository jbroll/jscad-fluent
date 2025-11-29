import type { maths } from '@jscad/modeling';
import type { Geom2, Geom3, Geometry, Path2 } from '@jscad/modeling/src/geometries/types';
import { mat4 } from '@jscad/modeling/src/maths';
import type { BoundingBox } from '@jscad/modeling/src/measurements/types';
import type { ExpandOptions, OffsetOptions } from '@jscad/modeling/src/operations/expansions';
import type {
  ExtrudeLinearOptions,
  ExtrudeRotateOptions,
} from '@jscad/modeling/src/operations/extrusions';
import type { CenterOptions, MirrorOptions } from '@jscad/modeling/src/operations/transforms';
import type {
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderEllipticOptions,
  CylinderOptions,
  EllipseOptions,
  EllipsoidOptions,
  GeodesicSphereOptions,
  RectangleOptions,
  RoundedCuboidOptions,
  RoundedCylinderOptions,
  SphereOptions,
  SquareOptions,
  StarOptions,
  TorusOptions,
  TriangleOptions,
} from '@jscad/modeling/src/primitives';
export { mat4 };

// Re-export JSCAD types that we need
export type {
  Geometry,
  Geom2,
  Geom3,
  Path2,
  BoundingBox,
  CenterOptions,
  CircleOptions,
  CubeOptions,
  CuboidOptions,
  CylinderOptions,
  CylinderEllipticOptions,
  EllipseOptions,
  EllipsoidOptions,
  ExpandOptions,
  ExtrudeLinearOptions,
  ExtrudeRotateOptions,
  GeodesicSphereOptions,
  MirrorOptions,
  OffsetOptions,
  RectangleOptions,
  RoundedCuboidOptions,
  RoundedCylinderOptions,
  SphereOptions,
  SquareOptions,
  StarOptions,
  TorusOptions,
  TriangleOptions,
};

// Re-export vector and matrix types from JSCAD
export type Vec2 = maths.vec2.Vec2;
export type Vec3 = maths.vec3.Vec3;
export type Mat4 = maths.mat4.Mat4;

// Common types used throughout the fluent API
export type Point2 = [number, number];
export type Point3 = [number, number, number];
export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type HSL = [number, number, number];
export type HSLA = [number, number, number, number];
export type HSV = [number, number, number];
export type HSVA = [number, number, number, number];
export type Centroid = Point3;
export type Corners = 'edge' | 'chamfer' | 'round';

// Array type for collections
export type GeometryArray<T extends Geometry> = T[];
