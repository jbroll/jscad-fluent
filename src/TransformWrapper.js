import { transforms } from '@jscad/modeling'

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

export default TransformWrapper