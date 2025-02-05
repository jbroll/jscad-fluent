import { measurements, extrusions, geometries } from '@jscad/modeling'
import GeometryWrapper from './GeometryWrapper'
import Geom3Wrapper from './Geom3Wrapper'

const { geom2 } = geometries

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

export default Geom2Wrapper