import { primitives, text, geometries, maths, curves } from '@jscad/modeling'
import Path2Wrapper from './classes/Path2Wrapper'
import Geom2Wrapper from './classes/Geom2Wrapper'
import Geom3Wrapper from './classes/Geom3Wrapper'

const { path2 } = geometries

const jscadFluent = {
  // 2D primitives
  rectangle: (options) => new Geom2Wrapper(primitives.rectangle(options)),
  circle: (options) => new Geom2Wrapper(primitives.circle(options)),
  ellipse: (options) => new Geom2Wrapper(primitives.ellipse(options)),
  polygon: (points) => new Geom2Wrapper(primitives.polygon({ points })),
  square: (options) => new Geom2Wrapper(primitives.square(options)),
  star: (options) => new Geom2Wrapper(primitives.star(options)),

  // 3D primitives
  cube: (options) => new Geom3Wrapper(primitives.cube(options)),
  cuboid: (options) => new Geom3Wrapper(primitives.cuboid(options)),
  sphere: (options) => new Geom3Wrapper(primitives.sphere(options)),
  cylinder: (options) => new Geom3Wrapper(primitives.cylinder(options)),
  cylinderElliptic: (options) => new Geom3Wrapper(primitives.cylinderElliptic(options)),
  torus: (options) => new Geom3Wrapper(primitives.torus(options)),
  polyhedron: (options) => new Geom3Wrapper(primitives.polyhedron(options)),

  // Text primitives
  text: (options) => new Geom2Wrapper(text.vector(options)),
  loadFont: text.loadFont,

  // Path creation
  path: {
    fromPoints: (points) => new Path2Wrapper(path2.fromPoints(points)),
    fromBezierCurves: (curves) => new Path2Wrapper(path2.fromBezierCurves(curves)),
    fromArc: (options) => new Path2Wrapper(path2.fromArc(options))
  },

  // Utilities remain unchanged
  curves: {
    bezier: curves.bezier,
    catmullRom: curves.catmullRom
  },

  vec2: maths.vec2,
  vec3: maths.vec3,
  mat4: maths.mat4,
  degToRad: maths.degToRad,
  radToDeg: maths.radToDeg
}

export { jscadFluent }