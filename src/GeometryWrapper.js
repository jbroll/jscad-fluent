import { booleans, transforms, colors, measurements, hulls, expansions, utils } from '@jscad/modeling'
import TransformWrapper from './TransformWrapper'

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

export default GeometryWrapper