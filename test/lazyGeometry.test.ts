import { geometries } from '@jbroll/jscad-anchors';
import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import { FluentPath2 } from '../src/gen/FluentPath2';
import jf from '../src/index';

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const reads = { polygons: 0, sides: 0, points: 0 };

// Shaped like @jscadui/manifold's ManifoldGeom3: private handle, prototype getters.
class LazyMesh {
  #handle = { id: 'mesh' };
  #color: number[] | null = null;
  transforms = identity();

  get type() {
    return 'mesh';
  }
  get polygons() {
    reads.polygons++;
    return [
      {
        vertices: [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
        ],
      },
    ];
  }
  get isManifoldGeom3() {
    return true;
  }
  get manifold() {
    return this.#handle;
  }
  get color() {
    return this.#color;
  }
  set color(value) {
    this.#color = value;
  }
  boundingBox() {
    return [this.#handle.id, 'bounds'];
  }
}

class LazySection {
  #handle = { id: 'section' };
  transforms = identity();

  get sides() {
    reads.sides++;
    return [
      [
        [0, 0],
        [1, 0],
      ],
    ];
  }
  get isManifoldGeom2() {
    return true;
  }
  get crossSection() {
    return this.#handle;
  }
}

class LazyPath {
  transforms = identity();
  isClosed = false;

  get points() {
    reads.points++;
    return [
      [0, 0],
      [1, 0],
    ];
  }
}

const axisFrame = {
  origin: [0, 0, 0] as [number, number, number],
  z: [0, 0, 1] as [number, number, number],
};

beforeEach(() => {
  reads.polygons = 0;
  reads.sides = 0;
  reads.points = 0;
});

describe('wrapping geometry with prototype getters', () => {
  test('a geom3 wrapper passes geom3.isA', () => {
    const part = new FluentGeom3(new LazyMesh() as any);
    expect(geometries.geom3.isA(part)).toBe(true);
  });

  test('withAnchors accepts a geom3 wrapper', () => {
    const part = new FluentGeom3(new LazyMesh() as any).withAnchors({ axis: axisFrame });
    expect(part).toBeInstanceOf(FluentGeom3);
    expect(Object.keys(part.anchors?.frames ?? {})).toEqual(['axis']);
  });

  test('a geom3 wrapper exposes markers and methods without reading polygons', () => {
    const part: any = new FluentGeom3(new LazyMesh() as any);
    const rewrapped: any = new FluentGeom3(part);
    expect(part.isManifoldGeom3).toBe(true);
    expect(part.manifold).toEqual({ id: 'mesh' });
    expect(part.type).toBe('mesh');
    expect(part.boundingBox()).toEqual(['mesh', 'bounds']);
    expect(rewrapped.manifold).toBe(part.manifold);
    expect(reads.polygons).toBe(0);
    expect(part.polygons).toHaveLength(1);
    expect(reads.polygons).toBe(1);
  });

  test('cloning a geom3 wrapper neither reads polygons nor carries forwarders', () => {
    const part = new FluentGeom3(new LazyMesh() as any);
    const clone = (globalThis as any).structuredClone(part);
    expect(Object.keys(clone)).toEqual(Object.keys(new LazyMesh()));
    expect(reads.polygons).toBe(0);
  });

  test('setting color on a geom3 wrapper reaches the source', () => {
    const source = new LazyMesh();
    const part: any = new FluentGeom3(source as any);
    part.color = [1, 0, 0, 1];
    expect(source.color).toEqual([1, 0, 0, 1]);
  });

  test('a geom2 wrapper passes geom2.isA and reads sides only on demand', () => {
    const part: any = new FluentGeom2(new LazySection() as any);
    expect(part.isManifoldGeom2).toBe(true);
    expect(part.crossSection).toEqual({ id: 'section' });
    expect(reads.sides).toBe(0);
    expect(geometries.geom2.isA(part)).toBe(true);
  });

  test('a path2 wrapper passes path2.isA and reads points only on demand', () => {
    const path = new FluentPath2(new LazyPath() as any);
    expect(reads.points).toBe(0);
    expect(geometries.path2.isA(path)).toBe(true);
  });

  test('a wrapper of a plain geom3 keeps own polygons', () => {
    const part = jf.cube({ size: 2 });
    expect(Object.getOwnPropertyDescriptor(part, 'polygons')?.value).toBe(part.polygons);
    expect(part.polygons.length).toBeGreaterThan(0);
  });
});
