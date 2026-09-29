import { geometries } from '@jbroll/jscad-anchors';
import type { Geom2, Vec2 } from './types';

const { geom2 } = geometries;

const signedArea = (outline: Vec2[]): number =>
  outline.reduce((sum, [x0, y0], i) => {
    const [x1, y1] = outline[(i + 1) % outline.length] as Vec2;
    return sum + x0 * y1 - x1 * y0;
  }, 0) / 2;

const inside = (outline: Vec2[], [x, y]: Vec2): boolean => {
  let result = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, yi] = outline[i] as Vec2;
    const [xj, yj] = outline[j] as Vec2;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) result = !result;
  }
  return result;
};

// A majority of vertices, because a hole may touch its outline at a point.
const contains = (outer: Vec2[], hole: Vec2[]): boolean =>
  hole.filter((point) => inside(outer, point)).length * 2 > hole.length;

const toSides = (loops: Vec2[][]): [Vec2, Vec2][] =>
  loops.flatMap((loop) =>
    loop.map((point, i): [Vec2, Vec2] => [point, loop[(i + 1) % loop.length] as Vec2]),
  );

/**
 * Split a geom2 into one geom2 per counter-clockwise (outer) outline, each with
 * the clockwise (hole) outlines whose smallest containing outer it is. A hole
 * with no outer around it becomes a shape of its own.
 */
export function scission2(geometry: Geom2): Geom2[] {
  const outlines = (geom2.toOutlines(geometry) as Vec2[][]).map((points) => ({
    points,
    area: signedArea(points),
  }));
  const outers = outlines.filter(({ area }) => area > 0);
  const pieces = outers.map(({ points }) => [points]);
  for (const hole of outlines.filter(({ area }) => area < 0)) {
    let best: number | undefined;
    outers.forEach((outer, i) => {
      if (!contains(outer.points, hole.points)) return;
      if (best === undefined || outer.area < (outers[best]?.area ?? Number.POSITIVE_INFINITY))
        best = i;
    });
    if (best === undefined) pieces.push([hole.points]);
    else pieces[best]?.push(hole.points);
  }
  return pieces.map((loops) => {
    const piece = geom2.create(toSides(loops));
    return geometry.color ? { ...piece, color: geometry.color } : piece;
  });
}
