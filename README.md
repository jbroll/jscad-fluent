# JSCAD Fluent API

A fluent interface wrapper around JSCAD's modeling API, providing an intuitive and chainable way to create and manipulate 2D and 3D geometry.

## Installation

```bash
npm install jscad-fluent
```

## Quick Start

```typescript
import { jf } from 'jscad-fluent';

// Create a simple 3D model
const model = jf.cube({ size: 10 })
  .translate([5, 0, 0])
  .rotate([0, Math.PI/4, 0])
  .setColor([1, 0, 0]);

// Create a complex 2D shape
const logo = jf.circle({ radius: 10 })
  .subtract(
    jf.star({
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
jf.rectangle({ size: [width, height] })
jf.roundedRectangle({ size: [width, height], roundRadius: number })
jf.circle({ radius: number })
jf.ellipse({ radius: [rx, ry] })
jf.polygon(points: [number, number][])
jf.square({ size: number })
jf.star({ vertices: number, outerRadius: number, innerRadius: number })
jf.triangle({ type: 'SSS' | 'AAS' | 'ASA' | 'SAS' | 'SSA', values: [a, b, c] })
```

### 3D Primitives

```typescript
// All primitives return a Geom3Wrapper instance
jf.cube({ size: number })
jf.cuboid({ size: [width, depth, height] })
jf.sphere({ radius: number })
jf.cylinder({
  radius: number | [start, end] | [[x1, y1], [x2, y2]],  // flexible radius
  height: number,
  outer?: number,   // for hollow cylinders
  inner?: number,   // for hollow cylinders
  wall?: number,    // wall thickness (alternative to inner)
  angle?: [start, end]  // partial arc in radians
})
jf.cylinderElliptic({
  height: number,
  startRadius: [rx, ry],
  endRadius?: [rx, ry]
})
jf.torus({ innerRadius: number, outerRadius: number })
jf.ellipsoid({ radius: [rx, ry, rz] })
jf.geodesicSphere({ radius: number, frequency?: number })
jf.roundedCuboid({ size: [width, depth, height], roundRadius: number })
jf.roundedCylinder({ radius: number, height: number, roundRadius: number })
jf.polyhedron({
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

// Boolean operations (accepts spread args, arrays, or mixed)
geometry.union(other)
geometry.union(a, b, c)
geometry.union([a, b, c])
geometry.subtract(other)
geometry.subtract(a, b, c)
geometry.subtract([a, b, c])
geometry.intersect(other)
geometry.intersect(a, b, c)
geometry.intersect([a, b, c])

// Top-level boolean operations (for combining multiple geometries)
jf.union(a, b, c)
jf.union([a, b, c])
jf.subtract(base, hole1, hole2)
jf.subtract(base, [hole1, hole2])
jf.intersect(a, b, c)
jf.intersect([a, b, c])

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

### Anchors (2D and 3D)

Anchors are named frames (`{ origin, z, x }`) stored on a part, from
[`@jbroll/jscad-anchors`](https://github.com/jbroll/jscad-anchors). Every
fluent method goes through that package, so frames follow transforms and
booleans. Path2 has no anchors.

```typescript
// Store frames in the part's local space; x may be omitted
part.withAnchors({ axis: { origin: [0, 0, 0], z: [0, 0, 1] } })

// World-space frame by name, or one of the 27 bounding-box defaults
part.anchor('axis')
part.anchor('top+right')

// Stored local frames, or undefined; use anchor(name) for world space
part.anchors?.frames

// Move this part so its childAnchor sits on parent's parentAnchor
post.attachTo(base, 'top', 'bottom', { overlap: 0, flip: true, spin: 0 })

// Translate against parent's bounding box
block.alignTo(base, 'right', { inset: 0, inside: false })

// Booleans keep the first operand's frames; union adds new names from the rest.
// carry copies a tool's frames under a prefix, here 'bolt1.axis'.
plate.subtract(hole, { carry: { bolt1: hole } })
jf.subtract(plate, hole, { carry: { bolt1: hole } })
```

Hull, expand, offset, extrusion, and minkowski results carry no frames.

### Utility Functions

```typescript
// Vector creation
jf.vec2.create()
jf.vec3.create()

// Matrix operations
jf.mat4.create()

// Angle conversion
jf.degToRad(degrees)
jf.radToDeg(radians)
```

## Example: Creating Complex Geometry

```typescript
const complexShape = jf.cube({ size: 10 })
  .union(
    jf.sphere({ radius: 6 })
      .translate([0, 0, 5])
  )
  .subtract(
    jf.cylinder({ radius: 2, height: 20 })
      .rotate([Math.PI/2, 0, 0])
  )
  .expand(0.5, 'round')
  .setColor([0.7, 0.7, 1]);
```

## Development

The published package lists `@jbroll/jscad-modeling` and `@jbroll/jscad-anchors` as peer dependencies. In this repo, `devDependencies` link both `@jbroll/jscad-modeling` and `@jscad/modeling` to `../OpenJSCAD.org/packages/modeling`, and `@jbroll/jscad-anchors` to `../jscad-anchors`, so `npm install` needs both checkouts beside this repo:

```bash
git clone -b fork-main https://github.com/jbroll/OpenJSCAD.org ../OpenJSCAD.org
git clone https://github.com/jbroll/jscad-anchors ../jscad-anchors
npm install
npm test
```

## License

MIT License - see LICENSE file for details
