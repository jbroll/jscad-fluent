import { primitives, measurements } from '@jscad/modeling';
import TransformWrapper from '../src/TransformWrapper';
import { Geom2Like, Geom3Like } from '../src/types';

// Create concrete test implementations for 2D and 3D
class TestTransformWrapper2D extends TransformWrapper<Geom2Like> {}
class TestTransformWrapper3D extends TransformWrapper<Geom3Like> {}

describe('TransformWrapper', () => {
  describe('2D Geometry', () => {
    let wrapper: TestTransformWrapper2D;

    beforeEach(() => {
      const geometry = primitives.rectangle({ size: [10, 10] });
      wrapper = new TestTransformWrapper2D(geometry);
    });

    describe('translations', () => {
      test('translate moves geometry in X and Y only', () => {
        const originalCenter = measurements.measureCenter(wrapper.geometry);
        wrapper.translate([10, 20, 30]);
        const newCenter = measurements.measureCenter(wrapper.geometry);
        
        // Extract coordinates, handling both single point and array of points
        const [ox, oy, oz] = Array.isArray(originalCenter[0]) ? originalCenter[0] : originalCenter;
        const [nx, ny, nz] = Array.isArray(newCenter[0]) ? newCenter[0] : newCenter;
        
        // Check the relative movement - for 2D geometry, Z should not change
        expect(nx - ox).toBeCloseTo(10, 1);
        expect(ny - oy).toBeCloseTo(20, 1);
        expect(nz - oz).toBeCloseTo(0, 1);  // Z translation has no effect on 2D
      });

      test('translateZ has no effect on 2D geometry', () => {
        const originalCenter = measurements.measureCenter(wrapper.geometry);
        wrapper.translateZ(30);
        const newCenter = measurements.measureCenter(wrapper.geometry);
        
        const [ox, oy, oz] = Array.isArray(originalCenter[0]) ? originalCenter[0] : originalCenter;
        const [nx, ny, nz] = Array.isArray(newCenter[0]) ? newCenter[0] : newCenter;
        
        expect(nx - ox).toBeCloseTo(0, 1);
        expect(ny - oy).toBeCloseTo(0, 1);
        expect(nz - oz).toBeCloseTo(0, 1);  // No change in Z
      });
    });
  });

  describe('3D Geometry', () => {
    let wrapper: TestTransformWrapper3D;

    beforeEach(() => {
      const geometry = primitives.cube({ size: 10 });
      wrapper = new TestTransformWrapper3D(geometry);
    });

    describe('translations', () => {
      test('translate moves geometry in all dimensions', () => {
        const originalCenter = measurements.measureCenter(wrapper.geometry);
        wrapper.translate([10, 20, 30]);
        const newCenter = measurements.measureCenter(wrapper.geometry);
        
        const [ox, oy, oz] = Array.isArray(originalCenter[0]) ? originalCenter[0] : originalCenter;
        const [nx, ny, nz] = Array.isArray(newCenter[0]) ? newCenter[0] : newCenter;
        
        expect(nx - ox).toBeCloseTo(10, 1);
        expect(ny - oy).toBeCloseTo(20, 1);
        expect(nz - oz).toBeCloseTo(30, 1);
      });

      test('translateZ affects 3D geometry', () => {
        const originalCenter = measurements.measureCenter(wrapper.geometry);
        wrapper.translateZ(30);
        const newCenter = measurements.measureCenter(wrapper.geometry);
        
        const [ox, oy, oz] = Array.isArray(originalCenter[0]) ? originalCenter[0] : originalCenter;
        const [nx, ny, nz] = Array.isArray(newCenter[0]) ? newCenter[0] : newCenter;
        
        expect(nx - ox).toBeCloseTo(0, 1);
        expect(ny - oy).toBeCloseTo(0, 1);
        expect(nz - oz).toBeCloseTo(30, 1);
      });
    });
  });
});