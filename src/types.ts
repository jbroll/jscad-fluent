import { maths } from '@jscad/modeling';
import type { Geometry } from '@jscad/modeling/src/geometries/types';
import type { Geom2, Geom3, Path2 } from '@jscad/modeling/src/geometries/types';
import type { ExtrudeLinearOptions, ExtrudeRotateOptions } from '@jscad/modeling/src/operations/extrusions';
import type { BoundingBox } from '@jscad/modeling/src/measurements/types';

import mat4 from '@jscad/modeling/src/maths/mat4';
import { CenterOptions, MirrorOptions } from '@jscad/modeling/src/operations/transforms';
export { mat4 };

// Re-export JSCAD types that we need
export type { 
  Geometry,
  Geom2,
  Geom3,
  Path2,
  ExtrudeLinearOptions, 
  ExtrudeRotateOptions,
  BoundingBox,
  MirrorOptions,
  CenterOptions
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
export type Centroid = Point3;
export type Corners = 'edge' | 'chamfer' | 'round';


// Array type for collections
export type GeometryArray<T extends Geometry> = T[];