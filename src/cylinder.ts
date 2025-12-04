import { booleans, primitives } from '@jscad/modeling';
import { FluentGeom3 } from './gen/FluentGeom3';
import type { Point2, Point3 } from './types';

const TAU = Math.PI * 2;

/** Flexible radius: number | [start, end] | [[x1,y1], [x2,y2]] */
export type FlexRadius = number | [number, number] | [Point2, Point2];

/** Options for the enhanced cylinder function */
export interface FlexCylinderOptions {
  /** Height of the cylinder */
  height?: number;
  /** Number of segments for circular approximation */
  segments?: number;
  /** Center position [x, y, z] */
  center?: Point3;
  /** Start and end angles in radians [start, end], default [0, 2*PI] */
  angle?: [number, number];
  /** Outer radius - for solid cylinder or as outer radius for hollow */
  radius?: FlexRadius;
  /** Outer radius - alias for hollow cylinders */
  outer?: FlexRadius;
  /** Inner radius - creates hollow cylinder */
  inner?: FlexRadius;
  /** Wall thickness - alternative to inner, calculates inner from outer - wall */
  wall?: FlexRadius;
}

/**
 * Normalizes radius input into [startRadius, endRadius] format for cylinderElliptic.
 *
 * @param radius - Single value, [start, end], or [[x1,y1], [x2,y2]]
 * @param defaultValue - Fallback value if radius is undefined
 * @returns Normalized start and end radii as [Point2, Point2]
 *
 * @example
 * // Single number: uniform cylinder
 * normalizeRadius(5) // [[5, 5], [5, 5]]
 *
 * // [start, end]: tapered cylinder
 * normalizeRadius([5, 3]) // [[5, 5], [3, 3]]
 *
 * // [[x1, y1], [x2, y2]]: elliptical cylinder
 * normalizeRadius([[5, 3], [4, 2]]) // [[5, 3], [4, 2]]
 */
function normalizeRadius(radius: FlexRadius | undefined, defaultValue = 1): [Point2, Point2] {
  if (radius === undefined) {
    return [
      [defaultValue, defaultValue],
      [defaultValue, defaultValue],
    ];
  }
  if (typeof radius === 'number') {
    return [
      [radius, radius],
      [radius, radius],
    ];
  }
  const [start, end] = radius;
  return [Array.isArray(start) ? start : [start, start], Array.isArray(end) ? end : [end, end]];
}

/**
 * Creates a solid or hollow cylinder with optional elliptical cross-sections.
 *
 * This is an enhanced version of the basic cylinder primitive that supports:
 * - Solid cylinders with uniform, tapered, or elliptical cross-sections
 * - Hollow cylinders with inner/outer radii
 * - Pipes with wall thickness (inner calculated from outer - wall)
 * - Partial arc cylinders
 *
 * @param options - Cylinder configuration options
 * @returns A FluentGeom3 cylinder geometry
 *
 * @example
 * // Simple solid cylinder
 * cylinder({ radius: 5, height: 10 })
 *
 * // Tapered cylinder (cone-like)
 * cylinder({ radius: [5, 3], height: 10 })
 *
 * // Elliptical cylinder
 * cylinder({ radius: [[5, 3], [5, 3]], height: 10 })
 *
 * // Hollow cylinder (tube)
 * cylinder({ outer: 6, inner: 4, height: 10 })
 *
 * // Pipe with wall thickness
 * cylinder({ outer: 6, wall: 1, height: 10 })
 *
 * // Partial arc (quarter cylinder)
 * cylinder({ radius: 5, height: 10, angle: [0, Math.PI / 2] })
 */
export function cylinder(options: FlexCylinderOptions): FluentGeom3 {
  const config = {
    height: 1,
    segments: 32,
    center: [0, 0, 0] as [number, number, number],
    ...options,
  };

  const [startAngle, endAngle] = config.angle ?? [0, TAU];

  // Handle wall thickness - calculate inner from outer - wall
  let innerRadius = options.inner;
  if (options.wall !== undefined) {
    const [outerStart, outerEnd] = normalizeRadius(options.outer ?? options.radius);
    const [wallStart, wallEnd] = normalizeRadius(options.wall);

    innerRadius = [
      [outerStart[0] - wallStart[0], outerStart[1] - wallStart[1]] as Point2,
      [outerEnd[0] - wallEnd[0], outerEnd[1] - wallEnd[1]] as Point2,
    ];
  }

  // Hollow cylinder (with inner radius)
  if (innerRadius !== undefined) {
    const [outerStartRadius, outerEndRadius] = normalizeRadius(options.outer ?? options.radius);
    const [innerStartRadius, innerEndRadius] = normalizeRadius(innerRadius);

    const outer = primitives.cylinderElliptic({
      height: config.height,
      segments: config.segments,
      center: config.center,
      startRadius: outerStartRadius,
      endRadius: outerEndRadius,
      startAngle,
      endAngle,
    });

    const inner = primitives.cylinderElliptic({
      height: config.height,
      segments: config.segments,
      center: config.center,
      startRadius: innerStartRadius,
      endRadius: innerEndRadius,
      startAngle,
      endAngle,
    });

    return new FluentGeom3(booleans.subtract(outer, inner));
  }

  // Solid cylinder
  const [startRadius, endRadius] = normalizeRadius(options.radius);
  return new FluentGeom3(
    primitives.cylinderElliptic({
      height: config.height,
      segments: config.segments,
      center: config.center,
      startRadius,
      endRadius,
      startAngle,
      endAngle,
    }),
  );
}
