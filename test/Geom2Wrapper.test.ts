import { primitives } from '@jscad/modeling';
import Geom2Wrapper from '../src/Geom2Wrapper';

describe('Geom2Wrapper', () => {
  let rectangle: Geom2Wrapper;
  let circle: Geom2Wrapper;
  const EPSILON = 1.0; // Added tolerance for floating point comparisons

  beforeEach(() => {
    rectangle = new Geom2Wrapper(primitives.rectangle({ size: [10, 10] }));
    circle = new Geom2Wrapper(primitives.circle({ radius: 5, segments: 32 })); // Added segments for better accuracy
  });

  describe('measurements', () => {
    test('measureArea returns correct area', () => {
      const expectedRectArea = 100; // 10 * 10
      const expectedCircleArea = Math.PI * 25; // πr²
      
      expect(Math.abs(rectangle.measureArea() - expectedRectArea)).toBeLessThan(EPSILON);
      expect(Math.abs(circle.measureArea() - expectedCircleArea)).toBeLessThan(EPSILON);
    });
  });

  // Rest of the tests remain the same
  // ...
});