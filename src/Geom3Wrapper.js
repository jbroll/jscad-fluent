import { measurements, utils, geometries } from '@jscad/modeling'
import GeometryWrapper from './GeometryWrapper'

const { geom3 } = geometries

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

export default Geom3Wrapper