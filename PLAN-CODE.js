This implementation guide provides the core structure for each class in our
architecture, with key methods and type relationships shown. A few important
points about the implementation:

1. Each class directly implements the corresponding JSCAD interface
2. Transform operations modify the object in place after applying JSCAD
   operations
3. Array classes maintain proper typing through method overrides
4. Factory functions handle type-safe creation and wrapping
5. Generics enforce type constraints throughout the hierarchy



// ===========================================================================
// Base Geometry Class
// ===========================================================================

/**
 * Base class for all fluent geometry types.
 * Implements the core JSCAD Geometry interface and universal operations.
 */
class FluentGeometry<T extends Geometry> implements Geometry {
  readonly type: T['type'];

  constructor(geometry: T) {
    // Copy all properties from the source geometry
    Object.assign(this, geometry);
  }

  // Universal transform operations that work on any geometry
  translate(offset: Vec3): this {
    const result = transforms.translate(offset, this);
    Object.assign(this, result);
    return this;
  }

  rotate(angle: Vec3): this {
    const result = transforms.rotate(angle, this);
    Object.assign(this, result);
    return this;
  }

  // Core measurement operations
  measureBoundingBox(): BoundingBox {
    return measurements.measureBoundingBox(this);
  }

  measureCenter(): [number, number, number] {
    return measurements.measureCenter(this);
  }
}

// ===========================================================================
// Base Array Class
// ===========================================================================

/**
 * Base array class for collections of geometries.
 * Extends Array to provide native array operations while adding geometry operations.
 */
class FluentGeometryArray<T extends Geometry> extends Array<T> {
  static create<T extends Geometry>(...items: T[]): FluentGeometryArray<T> {
    return new FluentGeometryArray(...items);
  }

  // Override array methods to maintain proper typing
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): FluentGeometryArray<U> {
    return FluentGeometryArray.create(...super.map(callbackfn));
  }

  // Universal transform operations on arrays
  translate(offset: Vec3): this {
    return FluentGeometryArray.create(...transforms.translate(offset, this)) as this;
  }

  rotate(angle: Vec3): this {
    return FluentGeometryArray.create(...transforms.rotate(angle, this)) as this;
  }
}

// ===========================================================================
// Intermediate Bounded Geometry Class
// ===========================================================================

/**
 * Intermediate class for operations shared between Geom2 and Geom3.
 * Implements boolean operations, hulls, and expansions.
 */
class FluentBoundedGeometry<T extends JSCADGeom2 | JSCADGeom3> extends FluentGeometry<T> {
  union(...others: this[]): this {
    const result = booleans.union([this, ...others]);
    Object.assign(this, result);
    return this;
  }

  subtract(...others: this[]): this {
    const result = booleans.subtract([this, ...others]);
    Object.assign(this, result);
    return this;
  }

  hull(...others: this[]): this {
    const result = hulls.hull([this, ...others]);
    Object.assign(this, result);
    return this;
  }

  expand(delta: number, corners: Corners = 'round'): this {
    const result = expansions.expand({ delta, corners }, this);
    Object.assign(this, result);
    return this;
  }
}

// ===========================================================================
// Intermediate Bounded Array Class
// ===========================================================================

/**
 * Array class for bounded geometries (Geom2 or Geom3).
 * Implements shared operations that work on collections.
 */
class FluentBoundedGeometryArray<T extends JSCADGeom2 | JSCADGeom3> extends FluentGeometryArray<T> {
  union(): T {
    return booleans.union(this);
  }

  subtract(): T {
    return booleans.subtract(this);
  }

  hull(): T {
    return hulls.hull(this);
  }

  expand(delta: number, corners: Corners = 'round'): this {
    return FluentGeometryArray.create(...expansions.expand({ delta, corners }, this)) as this;
  }
}

// ===========================================================================
// Concrete 2D Geometry Class
// ===========================================================================

/**
 * Concrete implementation for 2D geometries.
 * Implements JSCADGeom2 interface and 2D-specific operations.
 */
class FluentGeom2 extends FluentBoundedGeometry<JSCADGeom2> implements JSCADGeom2 {
  readonly type: 'geom2' = 'geom2';
  sides: Array<any>;  // From JSCADGeom2 interface

  measureArea(): number {
    return measurements.measureArea(this);
  }

  extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3 {
    const result = extrusions.extrudeLinear(options, this);
    return new FluentGeom3(result);
  }

  toPoints(): Vec2[] {
    return geom2.toPoints(this);
  }
}

// ===========================================================================
// Concrete 3D Geometry Class
// ===========================================================================

/**
 * Concrete implementation for 3D geometries.
 * Implements JSCADGeom3 interface and 3D-specific operations.
 */
class FluentGeom3 extends FluentBoundedGeometry<JSCADGeom3> implements JSCADGeom3 {
  readonly type: 'geom3' = 'geom3';
  polygons: Array<any>;  // From JSCADGeom3 interface

  measureVolume(): number {
    return measurements.measureVolume(this);
  }

  toPolygons(): Array<{vertices: Vec3[]}> {
    return geom3.toPolygons(this);
  }
}

// ===========================================================================
// Factory Functions
// ===========================================================================

/**
 * Factory functions for creating fluent geometry objects.
 * Provides type-safe creation and wrapping of JSCAD geometries.
 */
export const jscadFluent = {
  // Primitive creation
  circle(options: CircleOptions): FluentGeom2 {
    return new FluentGeom2(primitives.circle(options));
  },

  cube(options: CubeOptions): FluentGeom3 {
    return new FluentGeom3(primitives.cube(options));
  },

  // Wrapping existing geometries
  from(geom: JSCADGeom2): FluentGeom2;
  from(geom: JSCADGeom3): FluentGeom3;
  from(geom: JSCADGeom2[]): FluentGeom2Array;
  from(geom: JSCADGeom3[]): FluentGeom3Array;
  from(geom: any): any {
    if (Array.isArray(geom)) {
      return geom[0]?.type === 'geom2' 
        ? FluentGeom2Array.create(...geom)
        : FluentGeom3Array.create(...geom);
    }
    return geom.type === 'geom2' 
      ? new FluentGeom2(geom)
      : new FluentGeom3(geom);
  }
};
