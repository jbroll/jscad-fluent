import { primitives } from '@jscad/modeling';
import GeometryWrapper from '../src/GeometryWrapper';
import { Geom2Like } from '../src/types';

// Create a concrete test implementation since GeometryWrapper is abstract
class TestGeometryWrapper extends GeometryWrapper<Geom2Like> {
  clone(): this {
    return new TestGeometryWrapper(this.geometry) as this;
  }
  validate(): void {
    // No-op for test
  }
  toString(): string {
    return 'TestGeometryWrapper';
  }
}

describe('GeometryWrapper', () => {
  let geometry: Geom2Like;
  let wrapper: TestGeometryWrapper;

  beforeEach(() => {
    geometry = primitives.rectangle({ size: [10, 10] });
    wrapper = new TestGeometryWrapper(geometry);
  });

  describe('measurements', () => {
    test('measureBoundingBox returns correct dimensions', () => {
      const bbox = wrapper.measureBoundingBox();
      expect(bbox[0]).toEqual([-5, -5, 0]); // min point
      expect(bbox[1]).toEqual([5, 5, 0]); // max point
    });

    test('measureCenter returns center point', () => {
      const center = wrapper.measureCenter();
      expect(Array.isArray(center)).toBeTruthy();
      const [x, y, z] = Array.isArray(center[0]) ? center[0] : center;
      expect(x).toBeCloseTo(0);
      expect(y).toBeCloseTo(0);
      expect(z).toBeCloseTo(0);
    });

    test('measureDimensions returns correct size', () => {
      const dimensions = wrapper.measureDimensions();
      const [width, height, depth] = Array.isArray(dimensions[0]) ? dimensions[0] : dimensions;
      expect(width).toBeCloseTo(10);
      expect(height).toBeCloseTo(10);
      expect(depth).toBeCloseTo(0);
    });
  });

  describe('transformations', () => {
    test('setColor applies color correctly', () => {
      const color: [number, number, number] = [1, 0, 0];
      wrapper.setColor(color);
      expect(wrapper.geometry.color).toEqual([1, 0, 0, 1]);
    });

    test('center correctly positions geometry', () => {
      const original = wrapper.measureCenter();
      wrapper.center([true, true, true]);
      const centered = wrapper.measureCenter();
      expect(centered).toEqual(original); // Already centered in this case
    });

    test('centerX centers on X axis', () => {
      wrapper.translate([10, 0, 0]);
      wrapper.centerX();
      const center = wrapper.measureCenter();
      const [x] = Array.isArray(center[0]) ? center[0] : center;
      expect(x).toBeCloseTo(0);
    });
  });
});
