# JSCAD Fluent Architecture Design

## Core Design Principles
- Direct compatibility with JSCAD geometry objects
- Fluent interface for all operations
- Type safety through generics
- Code reuse through class hierarchy
- Seamless mixing of fluent and native JSCAD operations

## Class Hierarchy

### Base Classes

#### `FluentGeometry<T extends Geometry>`
Base class implementing JSCAD Geometry interface
- Properties from JSCAD Geometry interface
- Universal transform operations
- Core measurement operations

#### `FluentGeometryArray<T extends Geometry>`
Base array class for collections of geometries
- Extends Array<T>
- Universal transform operations that work on arrays
- Core measurement operations for collections

### Intermediate Classes

#### `FluentBoundedGeometry<T extends JSCADGeom2 | JSCADGeom3>`
Intermediate class for operations shared between Geom2 and Geom3
- Extends FluentGeometry<T>
- Boolean operations (union, subtract, intersect)
- Hull operations (hull, hullChain)
- Expansion operations (expand, offset)
- Common measurements

#### `FluentBoundedGeometryArray<T extends JSCADGeom2 | JSCADGeom3>`
Intermediate array class for bounded geometry collections
- Extends FluentGeometryArray<T>
- Boolean operations on collections
- Hull operations on collections
- Expansion operations on collections
- Common measurements on collections

### Concrete Classes

#### `FluentGeom2`
2D geometry implementation
- Extends FluentBoundedGeometry<JSCADGeom2>
- Implements JSCADGeom2 interface
- 2D-specific operations (measureArea, etc.)
- Extrusion operations to 3D
- 2D-specific conversions (toPoints, toOutlines)

#### `FluentGeom2Array`
Collection of 2D geometries
- Extends FluentBoundedGeometryArray<JSCADGeom2>
- 2D-specific array operations
- Extrusion operations returning FluentGeom3Array
- 2D-specific aggregate measurements

#### `FluentGeom3`
3D geometry implementation
- Extends FluentBoundedGeometry<JSCADGeom3>
- Implements JSCADGeom3 interface
- 3D-specific operations (measureVolume, etc.)
- 3D-specific conversions (toPolygons)

#### `FluentGeom3Array`
Collection of 3D geometries
- Extends FluentBoundedGeometryArray<JSCADGeom3>
- 3D-specific array operations
- 3D-specific aggregate measurements

## Key Methods by Class

### FluentGeometry<T>
```typescript
translate(offset: Vec3): this
rotate(angle: Vec3): this
scale(factor: Vec3): this
transform(matrix: Mat4): this
mirror(vector: Vec3): this
center(axes: [boolean, boolean, boolean]): this
measureBoundingBox(): BoundingBox
measureBoundingSphere(): [Centroid, number]
measureCenter(): [number, number, number]
measureDimensions(): [number, number, number]
```

### FluentGeometryArray<T>
```typescript
// Inherits Array methods
map<U>(callbackfn: (value: T) => U): FluentGeometryArray<U>
filter(predicate: (value: T) => boolean): this
// etc...

// Geometry operations
translate(offset: Vec3): this
rotate(angle: Vec3): this
// etc... (same as FluentGeometry but operating on arrays)
```

### FluentBoundedGeometry<T>
```typescript
union(...others: T[]): this
subtract(...others: T[]): this
intersect(...others: T[]): this
hull(...others: T[]): this
hullChain(...others: T[]): this
expand(delta: number, corners?: Corners): this
offset(delta: number): this
```

### FluentBoundedGeometryArray<T>
```typescript
union(): T
subtract(): T
intersect(): T
hull(): T
hullChain(): T
expand(delta: number, corners?: Corners): this
offset(delta: number): this
```

### FluentGeom2
```typescript
measureArea(): number
extrudeLinear(options: ExtrudeLinearOptions): FluentGeom3
extrudeRotate(options: ExtrudeRotateOptions): FluentGeom3
toPoints(): Vec2[]
toOutlines(): Vec2[][]
```

### FluentGeom3
```typescript
measureVolume(): number
toPolygons(): Array<{vertices: Vec3[]}>
```

## Factory Functions

```typescript
const jscadFluent = {
  // Creation from primitives
  circle(options: CircleOptions): FluentGeom2
  rectangle(options: RectangleOptions): FluentGeom2
  cube(options: CubeOptions): FluentGeom3
  sphere(options: SphereOptions): FluentGeom3
  // etc...

  // Wrapping existing geometries
  from(geometry: JSCADGeom2): FluentGeom2
  from(geometry: JSCADGeom3): FluentGeom3
  from(geometries: JSCADGeom2[]): FluentGeom2Array
  from(geometries: JSCADGeom3[]): FluentGeom3Array
}
```

## Type Relationships

```typescript
// Core interfaces
interface FluentGeometry<T> extends Geometry {
  // Universal operations
}

// Bounded geometry specialization
interface FluentBoundedGeometry<T> extends FluentGeometry<T> {
  // Shared Geom2/Geom3 operations
}

// Concrete implementations
interface FluentGeom2 extends FluentBoundedGeometry<JSCADGeom2>, JSCADGeom2 {
  // 2D-specific operations
}

interface FluentGeom3 extends FluentBoundedGeometry<JSCADGeom3>, JSCADGeom3 {
  // 3D-specific operations
}
```

## Usage Examples

```typescript
// Direct creation
const circle = jscadFluent.circle({ radius: 10 })
  .translate([5, 0, 0])
  .union(jscadFluent.circle({ radius: 5 }));

// Working with arrays
const circles = FluentGeom2Array.create(
  jscadFluent.circle({ radius: 10 }),
  jscadFluent.circle({ radius: 20 })
).translate([10, 0, 0]);

// Mixing with native JSCAD
const native = primitives.circle({ radius: 10 });
const fluent = jscadFluent.from(native);
const result = transforms.translate([1, 0, 0], fluent); // Works directly
```

## Implementation Notes

1. All transformation methods modify the object in place and return `this`
2. Array operations maintain proper typing through method overrides
3. Factory functions ensure proper type creation and wrapping
4. All classes implement proper JSCAD interfaces for compatibility
5. Type guards and assertions are used where necessary
6. Generic constraints ensure type safety

## Next Steps

1. Implement base classes with core functionality
2. Add intermediate bounded geometry classes
3. Implement concrete Geom2/Geom3 classes
4. Add array implementations
5. Create factory functions
6. Add comprehensive type tests
7. Document usage patterns