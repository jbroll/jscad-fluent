# JSCAD Fluent API

A fluent interface wrapper for the JSCAD modeling library that enables method
chaining for creating and manipulating 2D and 3D geometries. This API provides
a chainable way to work with JSCAD's core functionality.


## Basic Usage

```javascript
// Create a red cube centered on the origin
const cube = jscad.cube({ size: 10 })
  .center([true, true, true])
  .setColor([1, 0, 0])

// Create a complex 2D shape
const shape = jscad.rectangle({ size: [20, 10] })
  .union(jscad.circle({ radius: 5 }).translate([15, 0]))
  .subtract(jscad.square({ size: 3 }).translate([-5, -2]))

// Create an extruded text
const text = jscad.text({ text: "Hello" })
  .extrudeLinear({ height: 10 })
  .rotate(Math.PI/4)
  .setColor([0, 0, 1])
```

## Available Methods

### Primitives

#### 2D Primitives
- `rectangle(options)` - Creates a rectangle
- `circle(options)` - Creates a circle
- `ellipse(options)` - Creates an ellipse
- `polygon(points)` - Creates a polygon from points
- `square(options)` - Creates a square
- `star(options)` - Creates a star shape

#### 3D Primitives
- `cube(options)` - Creates a cube
- `cuboid(options)` - Creates a cuboid
- `sphere(options)` - Creates a sphere
- `cylinder(options)` - Creates a cylinder
- `cylinderElliptic(options)` - Creates an elliptic cylinder
- `torus(options)` - Creates a torus
- `polyhedron(options)` - Creates a polyhedron

### Transform Methods

All geometries support the following transform operations:

#### Basic Transforms
- `translate(vec)` - Translate by vector
- `translateX(offset)` - Translate along X axis
- `translateY(offset)` - Translate along Y axis
- `translateZ(offset)` - Translate along Z axis
- `rotate(angle, axis)` - Rotate around axis
- `rotateX(angle)` - Rotate around X axis
- `rotateY(angle)` - Rotate around Y axis
- `rotateZ(angle)` - Rotate around Z axis
- `scale(vec)` - Scale by vector
- `scaleX(factor)` - Scale along X axis
- `scaleY(factor)` - Scale along Y axis
- `scaleZ(factor)` - Scale along Z axis
- `mirror(vec)` - Mirror along vector
- `mirrorX()` - Mirror along X axis
- `mirrorY()` - Mirror along Y axis
- `mirrorZ()` - Mirror along Z axis

#### Alignment and Centering
- `center(axes)` - Center on specified axes
- `centerX()` - Center on X axis
- `centerY()` - Center on Y axis
- `centerZ()` - Center on Z axis
- `align(align, other)` - Align with another geometry

### Boolean Operations

All geometries support these boolean operations:

- `union(...others)` - Union with other geometries
- `subtract(...others)` - Subtract other geometries
- `intersect(...others)` - Intersect with other geometries

### Path Operations (Path2)

Path-specific operations for 2D paths:

- `appendPoints(points)` - Append points to path
- `appendBezier(bezier)` - Append bezier curve
- `appendArc(point, radius, options)` - Append arc
- `close()` - Close the path
- `reverse()` - Reverse path direction
- `toPoints()` - Convert to points array
- `toGeom2()` - Convert to 2D geometry

### Measurements

Available measurement methods:

#### Common Measurements
- `measureBounds()` - Get bounding box
- `measureBoundingSphere()` - Get bounding sphere
- `measureCenter()` - Get center point
- `measureDimensions()` - Get dimensions
- `measureEpsilon()` - Get epsilon value

#### 2D-Specific Measurements
- `measureArea()` - Get area (2D only)
- `measureHeights()` - Get heights (2D only)

#### 3D-Specific Measurements
- `measureVolume()` - Get volume (3D only)
- `measureSurface()` - Get surface area (3D only)
- `measureSignedVolume()` - Get signed volume (3D only)

### Expansion Operations

- `expand(delta, corners)` - Expand geometry
- `offset(delta)` - Offset geometry

### Hull Operations

- `hull(...others)` - Create hull with other geometries
- `hullChain(...others)` - Create hull chain

### Color Operations

- `setColor(color)` - Set geometry color

### Utilities

#### Math Utilities
- `vec2` - 2D vector operations
- `vec3` - 3D vector operations
- `mat4` - 4x4 matrix operations
- `degToRad` - Convert degrees to radians
- `radToDeg` - Convert radians to degrees

#### Curve Utilities
- `curves.bezier` - Bezier curve utilities
- `curves.catmullRom` - Catmull-Rom curve utilities

#### Conversion Utilities
- `toPolygons()` - Convert to polygons
- `toOutlines()` - Convert to outlines
- `triangulate()` - Triangulate 3D geometry

## License

MIT
