import jscadFluent from '../src/index';

const TAU = Math.PI * 2;

describe('cylinder (enhanced)', () => {
  describe('solid cylinders', () => {
    test('creates solid cylinder with uniform radius (number)', () => {
      const cyl = jscadFluent.cylinder({ radius: 5, height: 10 });

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10); // diameter X
      expect(dimensions[1]).toBeCloseTo(10); // diameter Y
      expect(dimensions[2]).toBeCloseTo(10); // height

      // Volume should be pi * r^2 * h
      const volume = cyl.measureVolume();
      const expectedVolume = Math.PI * 25 * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(10);
    });

    test('creates tapered cylinder with [start, end] radius', () => {
      const cyl = jscadFluent.cylinder({ radius: [5, 3], height: 10 });

      const volume = cyl.measureVolume();
      expect(volume).toBeGreaterThan(0);
      // Tapered cylinder should have less volume than uniform
      const uniformVolume = Math.PI * 5 * 5 * 10;
      expect(volume).toBeLessThan(uniformVolume);
    });

    test('creates elliptical cylinder with [[x1,y1], [x2,y2]] radius', () => {
      const cyl = jscadFluent.cylinder({
        radius: [
          [5, 3],
          [5, 3],
        ],
        height: 10,
      });

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(10); // 2 * 5
      expect(dimensions[1]).toBeCloseTo(6); // 2 * 3
    });

    test('creates tapered elliptical cylinder', () => {
      const cyl = jscadFluent.cylinder({
        radius: [
          [5, 4],
          [3, 2],
        ],
        height: 10,
      });

      const volume = cyl.measureVolume();
      expect(volume).toBeGreaterThan(0);
    });

    test('creates partial arc cylinder (half cylinder)', () => {
      const fullCyl = jscadFluent.cylinder({ radius: 5, height: 10 });
      const halfCyl = jscadFluent.cylinder({
        radius: 5,
        height: 10,
        angle: [0, Math.PI],
      });

      const fullVolume = fullCyl.measureVolume();
      const halfVolume = halfCyl.measureVolume();
      expect(halfVolume).toBeCloseTo(fullVolume / 2, 0);
    });

    test('creates quarter arc cylinder', () => {
      const fullCyl = jscadFluent.cylinder({ radius: 5, height: 10 });
      const quarterCyl = jscadFluent.cylinder({
        radius: 5,
        height: 10,
        angle: [0, TAU / 4],
      });

      const fullVolume = fullCyl.measureVolume();
      const quarterVolume = quarterCyl.measureVolume();
      expect(quarterVolume).toBeCloseTo(fullVolume / 4, 0);
    });

    test('creates cylinder with default radius when undefined', () => {
      const cyl = jscadFluent.cylinder({ height: 10 });

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(2); // default radius 1, diameter 2
      expect(dimensions[1]).toBeCloseTo(2);
    });

    test('creates cylinder with custom segments', () => {
      const lowRes = jscadFluent.cylinder({ radius: 5, height: 10, segments: 8 });
      const highRes = jscadFluent.cylinder({ radius: 5, height: 10, segments: 64 });

      // Both should have positive volume
      expect(lowRes.measureVolume()).toBeGreaterThan(0);
      expect(highRes.measureVolume()).toBeGreaterThan(0);

      // High res should be closer to theoretical volume
      const theoretical = Math.PI * 25 * 10;
      const lowResError = Math.abs(lowRes.measureVolume() - theoretical);
      const highResError = Math.abs(highRes.measureVolume() - theoretical);
      expect(highResError).toBeLessThan(lowResError);
    });

    test('creates cylinder with custom center', () => {
      const cyl = jscadFluent.cylinder({
        radius: 5,
        height: 10,
        center: [10, 20, 30],
      });

      const center = cyl.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10);
      expect(center[1]).toBeCloseTo(20);
      expect(center[2]).toBeCloseTo(30);
    });
  });

  describe('hollow cylinders (tubes)', () => {
    test('creates hollow cylinder with outer/inner radii (numbers)', () => {
      const cyl = jscadFluent.cylinder({ outer: 6, inner: 4, height: 10 });

      const volume = cyl.measureVolume();
      const expectedVolume = Math.PI * (36 - 16) * 10; // pi * (R^2 - r^2) * h
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
    });

    test('creates tapered hollow cylinder', () => {
      const cyl = jscadFluent.cylinder({
        outer: [6, 4],
        inner: [4, 2.5],
        height: 10,
      });

      expect(cyl.measureVolume()).toBeGreaterThan(0);
    });

    test('creates elliptical hollow cylinder', () => {
      const cyl = jscadFluent.cylinder({
        outer: [
          [6, 4],
          [6, 4],
        ],
        inner: [
          [4, 2.5],
          [4, 2.5],
        ],
        height: 10,
      });

      expect(cyl.measureVolume()).toBeGreaterThan(0);
    });

    test('creates partial arc hollow cylinder (half tube)', () => {
      const fullTube = jscadFluent.cylinder({ outer: 6, inner: 4, height: 10 });
      const halfTube = jscadFluent.cylinder({
        outer: 6,
        inner: 4,
        height: 10,
        angle: [0, Math.PI],
      });

      const fullVolume = fullTube.measureVolume();
      const halfVolume = halfTube.measureVolume();
      expect(halfVolume).toBeCloseTo(fullVolume / 2, 0);
    });

    test('using radius as outer for hollow cylinder', () => {
      // When inner is provided, radius should act as outer
      const cyl = jscadFluent.cylinder({ radius: 6, inner: 4, height: 10 });

      const volume = cyl.measureVolume();
      const expectedVolume = Math.PI * (36 - 16) * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
    });
  });

  describe('pipes (wall thickness)', () => {
    test('creates pipe with uniform wall thickness', () => {
      const cyl = jscadFluent.cylinder({ outer: 6, wall: 1, height: 10 });

      // Wall of 1 means inner radius is 5
      const volume = cyl.measureVolume();
      const expectedVolume = Math.PI * (36 - 25) * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
    });

    test('creates tapered pipe', () => {
      const cyl = jscadFluent.cylinder({
        outer: [6, 4],
        wall: [1, 0.8],
        height: 10,
      });

      expect(cyl.measureVolume()).toBeGreaterThan(0);
    });

    test('creates pipe with elliptical wall', () => {
      const cyl = jscadFluent.cylinder({
        outer: [
          [6, 4],
          [6, 4],
        ],
        wall: [
          [1.5, 0.5],
          [1.5, 0.5],
        ],
        height: 10,
      });

      expect(cyl.measureVolume()).toBeGreaterThan(0);
    });

    test('creates partial arc pipe', () => {
      const fullPipe = jscadFluent.cylinder({ outer: 6, wall: 1, height: 10 });
      const partialPipe = jscadFluent.cylinder({
        outer: 6,
        wall: 1,
        height: 10,
        angle: [0, (TAU * 3) / 4],
      });

      const fullVolume = fullPipe.measureVolume();
      const partialVolume = partialPipe.measureVolume();
      expect(partialVolume).toBeCloseTo((fullVolume * 3) / 4, 0);
    });

    test('wall with radius (instead of outer)', () => {
      const cyl = jscadFluent.cylinder({ radius: 6, wall: 1, height: 10 });

      const volume = cyl.measureVolume();
      const expectedVolume = Math.PI * (36 - 25) * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
    });
  });

  describe('fluent chaining', () => {
    test('cylinder supports translate', () => {
      const cyl = jscadFluent.cylinder({ radius: 5, height: 10 }).translate([10, 0, 0]);

      const center = cyl.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10);
    });

    test('cylinder supports rotate', () => {
      const cyl = jscadFluent.cylinder({ radius: 5, height: 10 }).rotate([Math.PI / 2, 0, 0]);

      // After rotating 90 degrees around X, the height should now be along Y
      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[1]).toBeCloseTo(10); // height now in Y direction
    });

    test('cylinder supports scale', () => {
      const cyl = jscadFluent.cylinder({ radius: 5, height: 10 }).scale([2, 1, 1]);

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(20); // scaled in X
      expect(dimensions[1]).toBeCloseTo(10); // unchanged in Y
    });

    test('cylinder supports boolean operations', () => {
      const outer = jscadFluent.cylinder({ radius: 6, height: 10 });
      const inner = jscadFluent.cylinder({ radius: 4, height: 12 });

      const result = outer.subtract(inner);
      const volume = result.measureVolume();
      const expectedVolume = Math.PI * (36 - 16) * 10;
      expect(Math.abs(volume - expectedVolume)).toBeLessThan(20);
    });

    test('hollow cylinder with fluent transforms', () => {
      const cyl = jscadFluent
        .cylinder({ outer: 5, inner: 3, height: 10 })
        .translate([10, 0, 0])
        .rotate([Math.PI / 2, 0, 0]);

      const center = cyl.measureCenter();
      if (typeof center === 'number') return;
      expect(center[0]).toBeCloseTo(10);
    });
  });

  describe('edge cases', () => {
    test('handles default height', () => {
      const cyl = jscadFluent.cylinder({ radius: 5 });

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[2]).toBeCloseTo(1); // default height
    });

    test('handles all defaults', () => {
      const cyl = jscadFluent.cylinder({});

      // Should create a cylinder with radius 1, height 1
      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(2); // diameter
      expect(dimensions[1]).toBeCloseTo(2);
      expect(dimensions[2]).toBeCloseTo(1); // height
    });

    test('outer takes precedence over radius for hollow cylinders', () => {
      // When both radius and outer are specified with inner, outer should be used
      const cyl = jscadFluent.cylinder({
        radius: 10, // should be ignored
        outer: 6,
        inner: 4,
        height: 10,
      });

      const dimensions = cyl.measureDimensions();
      if (typeof dimensions === 'number') return;
      expect(dimensions[0]).toBeCloseTo(12); // 2 * outer radius
    });
  });
});
