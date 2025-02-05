# JSCAD Fluent API

A fluent interface wrapper around JSCAD's modeling API, providing an intuitive and chainable way to create and manipulate 2D and 3D geometry.

## Installation

```bash
npm install jscad-fluent
```

## Quick Start

```typescript
import { jscadFluent } from 'jscad-fluent';

// Create a simple 3D model
const model = jscadFluent.cube({ size: 10 })
  .translate([5, 0, 0])
  .rotate([0, Math.PI/4, 0])
  .setColor([1, 0, 0]);

// Create a complex 2D shape
const logo = jscadFluent.circle({ radius: 10 })
  .subtract(
    jscadFluent.star({
      vertices: 5,
      outerRadius: 8,
      innerRadius: 4
    })
  )
  .expand(1)
  .setColor([0, 0, 1]);

// Extrude 2D into 3D
const extruded = logo.extrudeLinear({ height: 10 });
```

## Features

- Fluent interface for all JSCAD operations
- Strong TypeScript support
- 2D and 3D primitive creation
- Boolean operations (union, subtract, intersect)
- Transformations (translate, rotate, scale)
- Measurements (area, volume, dimensions)
- Color support
- Hull operations
- Expansion and offset operations

## API Reference

### 2D Primitives

```typescript
// All primitives return a Geom2Wrapper instance
jscadFluent.rectangle({ size: [width, height] })
jscadFluent.circle({ radius: number })
jscadFluent.ellipse({ radius: [rx, ry] })
jscadFluent.polygon(points: [number, number][])
jscadFluent.square({ size: number })
jscadFluent.star({ vertices: number, outerRadius: number, innerRadius: number })
```

### 3D Primitives

```typescript
// All primitives return a Geom3Wrapper instance
jscadFluent.cube({ size: number })
jscadFluent.sphere({ radius: number })
jscadFluent.cylinder({ radius: number, height: number })
jscadFluent.cylinderElliptic({ 
  height: number, 
  startRadius: [rx, ry],
  endRadius?: [rx, ry] 
})
jscadFluent.torus({ innerRadius: number, outerRadius: number })
jscadFluent.polyhedron({ 
  points: [number, number, number][], 
  faces: number[][]
})
```

### Common Operations (Both 2D and 3D)

```typescript
// Transformations
geometry.translate([x, y, z])
geometry.translateX(offset)
geometry.translateY(offset)
geometry.translateZ(offset)
geometry.rotate([x, y, z])
geometry.rotateX(angle)
geometry.rotateY(angle)
geometry.rotateZ(angle)
geometry.scale([x, y, z])
geometry.scaleX(factor)
geometry.scaleY(factor)
geometry.scaleZ(factor)
geometry.mirror([x, y, z])
geometry.mirrorX()
geometry.mirrorY()
geometry.mirrorZ()

// Center operations
geometry.center([x, y, z])
geometry.centerX()
geometry.centerY()
geometry.centerZ()

// Color
geometry.setColor([r, g, b])       // RGB values 0-1
geometry.setColor([r, g, b, a])    // RGBA values 0-1

// Boolean operations
geometry.union(...others)
geometry.subtract(...others)
geometry.intersect(...others)

// Hull operations
geometry.hull(...others)
geometry.hullChain(...others)

// Expansion
geometry.expand(delta, corners?)    // corners: 'round' | 'edge' | 'chamfer'
geometry.offset(delta)

// Measurements
geometry.measureBoundingBox()
geometry.measureBoundingSphere()
geometry.measureCenter()
geometry.measureDimensions()

// Utility
geometry.clone()
geometry.validate()
```

### 2D-Specific Operations

```typescript
// Measurements
geometry.measureArea()

// Conversion
geometry.toPoints()      // Returns array of 2D points
geometry.toOutlines()    // Returns array of point arrays

// Extrusion to 3D
geometry.extrudeLinear({ height: number })
geometry.extrudeRotate({ angle: number })
```

### 3D-Specific Operations

```typescript
// Measurements
geometry.measureVolume()

// Conversion
geometry.toPolygons()    // Returns array of polygons with vertices
```

### Utility Functions

```typescript
// Vector creation
jscadFluent.vec2.create()
jscadFluent.vec3.create()

// Matrix operations
jscadFluent.mat4.create()

// Angle conversion
jscadFluent.degToRad(degrees)
jscadFluent.radToDeg(radians)
```

## Example: Creating Complex Geometry

```typescript
const complexShape = jscadFluent.cube({ size: 10 })
  .union(
    jscadFluent.sphere({ radius: 6 })
      .translate([0, 0, 5])
  )
  .subtract(
    jscadFluent.cylinder({ radius: 2, height: 20 })
      .rotate([Math.PI/2, 0, 0])
  )
  .expand(0.5, 'round')
  .setColor([0.7, 0.7, 1]);
```

## License

MIT License - see LICENSE file for details
