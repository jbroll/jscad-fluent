import { geometries } from '@jscad/modeling'
import TransformWrapper from './TransformWrapper'
import Geom2Wrapper from './Geom2Wrapper'

const { path2 } = geometries

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

export default Path2Wrapper