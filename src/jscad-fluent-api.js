const jscad = require('@jscad/modeling')
const { primitives, booleans, transforms, colors, measurements,
        hulls, extrusions, expansions, text, utils,
        geometries, maths, curves } = jscad
const { path2, geom2, geom3 } = geometries;


class TransformWrapper {
  constructor(object) {
    Object.assign(this, object)
  }

  translate(vec) {
    return this.wrap(transforms.translate(vec, this))
  }

  translateX(offset) {
    return this.wrap(transforms.translateX(offset, this))
  }

  translateY(offset) {
    return this.wrap(transforms.translateY(offset, this))
  }

  translateZ(offset) {
    return this.wrap(transforms.translateZ(offset, this))
  }

  rotate(angle, axis) {
    return this.wrap(transforms.rotate(angle, axis || [0, 0, 1], this))
  }

  rotateX(angle) {
    return this.wrap(transforms.rotateX(angle, this))
  }

  rotateY(angle) {
    return this.wrap(transforms.rotateY(angle, this))
  }

  rotateZ(angle) {
    return this.wrap(transforms.rotateZ(angle, this))
  }

  scale(vec) {
    return this.wrap(transforms.scale(vec, this))
  }

  scaleX(factor) {
    return this.wrap(transforms.scaleX(factor, this))
  }

  scaleY(factor) {
    return this.wrap(transforms.scaleY(factor, this))
  }

  scaleZ(factor) {
    return this.wrap(transforms.scaleZ(factor, this))
  }

  mirror(vec) {
    return this.wrap(transforms.mirror(vec, this))
  }

  mirrorX() {
    return this.wrap(transforms.mirrorX(this))
  }

  mirrorY() {
    return this.wrap(transforms.mirrorY(this))
  }

  mirrorZ() {
    return this.wrap(transforms.mirrorZ(this))
  }

  transform(matrix) {
    return this.wrap(transforms.transform(matrix, this))
  }

  wrap(object) {
    return new this.constructor(object)
  }
}

class Path2Wrapper extends TransformWrapper {
  appendPoints(points) {
    return this.wrap(path2.appendPoints(points, this))
  }

  appendBezier(bezier) {
    return this.wrap(path2.appendBezier(bezier, this))
  }

  appendArc(point, radius, options) {
    return this.wrap(path2.appendArc(point, radius, options, this))
  }

  close() {
    return this.wrap(path2.close(this))
  }

  reverse() {
    return this.wrap(path2.reverse(this))
  }

  toPoints() {
    return path2.toPoints(this)
  }

  toGeom2() {
    return new Geom2Wrapper(path2.toGeom2(this))
  }
}

class GeometryWrapper extends TransformWrapper {
  union(...others) {
    return this.wrap(booleans.union(this, ...others))
  }

  subtract(...others) {
    return this.wrap(booleans.subtract(this, ...others))
  }

  intersect(...others) {
    return this.wrap(booleans.intersect(this, ...others))
  }

  expand(delta, corners) {
    const options = this instanceof Geom2Wrapper && corners
      ? { delta, corners }
      : { delta }
    return this.wrap(expansions.expand(this, options))
  }

  offset(delta) {
    return this.wrap(expansions.offset(this, delta))
  }

  hull(...others) {
    return this.wrap(hulls.hull(this, ...others))
  }

  hullChain(...others) {
    return this.wrap(hulls.hullChain([this, ...others]))
  }

  setColor(color) {
    return this.wrap(colors.setColor(color, this))
  }

  center(axes) {
    return this.wrap(transforms.center(axes, this))
  }

  centerX() {
    return this.wrap(transforms.center([true, false, false], this))
  }

  centerY() {
    return this.wrap(transforms.center([false, true, false], this))
  }

  centerZ() {
    return this.wrap(transforms.center([false, false, true], this))
  }

  align(align, other) {
    return this.wrap(transforms.align(this, align, other))
  }

  measureBounds() {
    return measurements.measureBoundingBox(this)
  }

  measureBoundingSphere() {
    return measurements.measureBoundingSphere(this)
  }

  measureCenter() {
    return measurements.measureCenter(this)
  }

  measureDimensions() {
    return measurements.measureDimensions(this)
  }

  measureEpsilon() {
    return measurements.measureEpsilon(this)
  }

  toOutlines() {
    return utils.toOutlines(this)
  }
}

class Geom2Wrapper extends GeometryWrapper {
  measureArea() {
    return measurements.measureArea(this)
  }

  measureHeights() {
    return measurements.measureHeights(this)
  }

  extrudeLinear(options) {
    return new Geom3Wrapper(extrusions.extrudeLinear(options, this))
  }

  extrudeRotate(options) {
    return new Geom3Wrapper(extrusions.extrudeRotate(options, this))
  }

  toPolygons() {
    return geom2.toPolygons(this)
  }
}

class Geom3Wrapper extends GeometryWrapper {
  measureVolume() {
    return measurements.measureVolume(this)
  }

  measureSurface() {
    return measurements.measureSurface(this)
  }

  measureSignedVolume() {
    return measurements.measureSignedVolume(this)
  }

  triangulate() {
    return utils.triangulate(this)
  }

  toPolygons() {
    return geom3.toPolygons(this)
  }
}

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
