# User manual

```js
const jf = require('@jbroll/jscad-fluent')
```

`llm.txt` at the repository root is a compact version of this manual for LLM
prompts.

## Conventions

- Angles are radians.
- Colors are RGB or RGBA with components from 0 to 1.
- Every operation returns a new object; inputs are never changed.
- Booleans combine geometry of one type: all geom2 or all geom3.
- Measurements return values and don't chain.

Types used below:

```
Vec2 = [number, number]
Vec3 = [number, number, number]
RGB  = [number, number, number]
RGBA = [number, number, number, number]
Corners = 'edge' | 'chamfer' | 'round'
```

## 2D primitives

Each returns a `FluentGeom2`. Defaults follow `=`.

```
jf.rectangle({ size?: Vec2=[2,2], center?: Vec2=[0,0] })
jf.roundedRectangle({ size?: Vec2=[2,2], center?: Vec2=[0,0], roundRadius?: number=0.2, segments?: number=32 })
jf.square({ size?: number=2, center?: Vec2=[0,0] })
jf.circle({ radius?: number=1, center?: Vec2=[0,0], startAngle?: number=0, endAngle?: number=2*PI, segments?: number=32 })
jf.ellipse({ radius?: Vec2=[1,1], center?: Vec2=[0,0], startAngle?: number=0, endAngle?: number=2*PI, segments?: number=32 })
jf.polygon(points: Vec2[])            // counter-clockwise for extrusion
jf.star({ vertices?: number=5, outerRadius?: number=1, innerRadius?: number=0, density?: number=2, startAngle?: number=0, center?: Vec2=[0,0] })
jf.triangle({ type?: 'SSS'|'AAS'|'ASA'|'SAS'|'SSA'='SSS', values?: [number,number,number]=[1,1,1] })  // A = angle, S = side
```

## Path primitives

Each returns a `FluentPath2`.

```
jf.arc({ center?: Vec2=[0,0], radius?: number=1, startAngle?: number=0, endAngle?: number=2*PI, segments?: number=32, makeTangent?: boolean=false })
jf.line(points: Vec2[])
```

## 3D primitives

Each returns a `FluentGeom3`.

```
jf.cube({ size?: number=2, center?: Vec3=[0,0,0] })
jf.cuboid({ size?: Vec3=[2,2,2], center?: Vec3=[0,0,0] })
jf.sphere({ radius?: number=1, center?: Vec3=[0,0,0], segments?: number=32 })
jf.cylinderElliptic({ height?: number=2, startRadius?: Vec2=[1,1], endRadius?: Vec2=[1,1], startAngle?: number=0, endAngle?: number=2*PI, center?: Vec3=[0,0,0], segments?: number=32 })
jf.torus({ innerRadius?: number=1, outerRadius?: number=4, innerSegments?: number=32, outerSegments?: number=32, innerRotation?: number=0, outerRotation?: number=2*PI, startAngle?: number=0 })
jf.ellipsoid({ radius?: Vec3=[1,1,1], center?: Vec3=[0,0,0], segments?: number=32, axes?: [Vec3,Vec3,Vec3] })
jf.geodesicSphere({ radius?: number=1, frequency?: number=6 })   // frequency in multiples of 6
jf.roundedCuboid({ size?: Vec3=[2,2,2], center?: Vec3=[0,0,0], roundRadius?: number=0.2, segments?: number=32 })
jf.roundedCylinder({ radius?: number=1, height?: number=2, center?: Vec3=[0,0,0], roundRadius?: number=0.2, segments?: number=32 })
jf.polyhedron({ points: Vec3[], faces: number[][] })
```

### `jf.cylinder`

```
jf.cylinder({
  radius?: FlexRadius=1,
  height?: number=1,
  center?: Vec3=[0,0,0],
  segments?: number=32,
  angle?: [number, number],   // start and end angle, default [0, 2*PI]
  outer?: FlexRadius,         // outer radius of a hollow cylinder
  inner?: FlexRadius,         // inner radius of a hollow cylinder
  wall?: FlexRadius           // wall thickness; inner = outer - wall
})
// FlexRadius = number | [start, end] | [[x1, y1], [x2, y2]]
```

```js
jf.cylinder({ radius: 5, height: 10 })                     // solid
jf.cylinder({ radius: [5, 3], height: 10 })                // tapered
jf.cylinder({ radius: [[5, 3], [5, 3]], height: 10 })      // elliptical
jf.cylinder({ outer: 6, inner: 4, height: 10 })            // hollow
jf.cylinder({ outer: 6, wall: 1, height: 10 })             // pipe
jf.cylinder({ radius: 5, height: 10, angle: [0, Math.PI / 2] })  // quarter
```

## Transforms

All geometry types.

```
.translate(offset: Vec3)    .translateX(n)  .translateY(n)  .translateZ(n)
.rotate(angles: Vec3)       .rotateX(a)     .rotateY(a)     .rotateZ(a)
.scale(factors: Vec3)       .scaleX(f)      .scaleY(f)      .scaleZ(f)
.mirror({ origin?: Vec3=[0,0,0], normal?: Vec3=[0,0,1] })
.mirrorX()                  // across the YZ plane
.mirrorY()                  // across the XZ plane
.mirrorZ()                  // across the XY plane
.center({ axes?: [boolean,boolean,boolean]=[true,true,true], relativeTo?: Vec3=[0,0,0] })
.centerX()  .centerY()  .centerZ()
.transform(matrix: Mat4)
```

Scale factors must be positive. Use `mirror` for negative scaling.

## Color

```
.colorize(color: RGB | RGBA)

jf.colors.hexToRgb(hex)          // '#FF0000', '#F00', '#FF000080'
jf.colors.colorNameToRgb(name)   // 'red', 'cornflowerblue'
jf.colors.hslToRgb([h, s, l])
jf.colors.hsvToRgb([h, s, v])
jf.colors.rgbToHex(rgb)
jf.colors.rgbToHsl(rgb)
jf.colors.rgbToHsv(rgb)
jf.colors.css.<name>             // 150+ CSS colors as RGB
```

## Booleans

Operands may be spread, passed as arrays, or mixed.

```
.union(...others)
.subtract(...others, { carry }?)
.intersect(...others)
.minkowski(...others)            // geom3 only

jf.union(...geometries)
jf.subtract(base, ...tools, { carry }?)
jf.intersect(...geometries)
```

```js
a.union(b, c)
block.subtract([hole1, hole2])
jf.union([part1, part2, part3])
jf.cube({ size: 10 }).minkowski(jf.sphere({ radius: 1 }))   // rounded cube
```

The top-level functions throw when called with no geometry.

## Anchors

Anchors are named frames stored on a geom2 or geom3, provided by
`@jbroll/jscad-anchors`. A frame is `{ origin: Vec3, z: Vec3, x: Vec3 }`. `z`
carries the meaning of the anchor, such as a face normal or a hole axis, and
`x` fixes rotation about it. Frames follow every transform and boolean. Path2
has no anchors.

Names are strings. Direction names are `top`, `bottom`, `left`, `right`,
`front`, and `back`, joined with `+` for edges and corners (`top+right`), plus
`center`. A direction vector with components in `{-1, 0, 1}` works wherever a
name does.

### `.withAnchors(frames)`

```js
part.withAnchors({ axis: { origin: [0, 0, 0], z: [0, 0, 1] } })
```

Adds frames in the part's local space, merged with any it already has. `z` is
normalized. `x` is made perpendicular to `z` and, when omitted, set to BOSL2's
default for that `z`.

### `.anchor(ref)`

```js
part.anchor('axis')       // an explicit frame
part.anchor('top+right')  // a bounding-box default
```

Returns a world-space frame. An explicit frame with that name wins. Otherwise
a direction name resolves to one of 27 defaults computed from the bounding
box. Unknown names throw.

### `.anchors`

```js
Object.keys(part.anchors?.frames ?? {})
```

The raw stored data, `{ frames, basis }`, or `undefined` if the part has no
explicit frames. `frames` are in local space and don't reflect later
transforms. Use `.anchor(name)` for world-space frames.

### `.attachTo(parent, parentAnchor, childAnchor, options)`

```js
post.attachTo(base, 'top', 'bottom')
bolt.attachTo(plate, 'bolt1.axis', 'bottom', { overlap: 5 })
```

Moves and rotates the part so its `childAnchor` sits on `parent`'s
`parentAnchor`.

- `flip` (default `true`) points the two `z` axes at each other, face to face.
  `false` makes them equal.
- `overlap` (default `0`) moves the part that many mm further into the parent.
- `spin` (default `0`, radians) rotates the part about its anchor's `z` first.

### `.alignTo(parent, direction, options)`

```js
block.alignTo(base, 'right')
block.alignTo(base, 'top+front', { inside: true, inset: 1 })
```

Translates the part against `parent`'s bounding box without rotating it. On an
axis where `direction` is zero the part is centered. On a nonzero axis it sits
just outside that face, or flush inside it with `inside: true`, offset by
`inset` mm.

### Anchors through booleans

- `union` keeps the first operand's frames and adds names from later operands
  that aren't already present.
- `subtract` and `intersect` keep only the first operand's frames.
- `subtract`'s `carry: { prefix: tool }` also keeps that tool's explicit frames
  as `prefix.name`:

```js
const plate = jf.cuboid({ size: [40, 40, 5] }).subtract(hole, { carry: { bolt1: hole } })
plate.anchor('bolt1.axis')
```

Hull, expand, offset, extrusion, and minkowski results carry no frames.

## Geometry arrays

```
jf.array(g1, g2, ...)        // type from the first item; needs at least one
jf.geom2Array(...items)      // may be empty
jf.geom3Array(...items)
jf.path2Array(...items)
g1.append(g2)                // new array of both
array.append(g)              // adds to the array and returns it
```

```
.hull()                      // convex hull of all items, as one geometry
.hullChain()                 // union of hulls of consecutive pairs
.extrudeLinear(options)      // geom2 arrays: FluentGeom3Array
.extrudeRotate(options)
```

Transforms on an array apply to every item and return an array.

```js
let arr = jf.geom2Array()
for (let i = 0; i < 5; i++) arr = arr.append(jf.circle({ radius: i + 1 }).translate([i * 10, 0, 0]))
const shape = arr.hull()
```

## Hull, expansion, and offset

```
.hull()  .hullChain()        // on a single geometry
.expand({ delta?: number=1, corners?: Corners='edge', segments?: number=16 })
.offset({ delta?: number=1, corners?: Corners='edge', segments?: number=16 })   // geom2 and path2
```

## Extrusion

Geom2 only; returns a `FluentGeom3`.

```
.extrudeLinear({ height?: number=1, twistAngle?: number=0, twistSteps?: number=1 })
.extrudeRotate({ angle?: number=2*PI, startAngle?: number=0, segments?: number=12, overflow?: 'cap'='cap' })
```

## Measurements

```
.measureBoundingBox()      -> [[minX, minY, minZ], [maxX, maxY, maxZ]]
.measureBoundingSphere()   -> [center: Vec3, radius: number]
.measureCenter()           -> Vec3
.measureDimensions()       -> [width, depth, height]
.measureArea()             -> number   // geom2 and path2
.measureVolume()           -> number   // geom3
```

## Conversion and validation

```
.toPoints()     -> Vec2[]                  // geom2 and path2
.toOutlines()   -> Vec2[][]                // geom2
.toPolygons()   -> { vertices: Vec3[] }[]  // geom3
.toString()     -> string
.validate()                                // throws if invalid
```

## Wrapper classes

`jf.FluentGeom2` and `jf.FluentGeom3` are the classes the factories return.
Embedders can wrap raw modeling geometry with `new jf.FluentGeom3(geometry)`.
