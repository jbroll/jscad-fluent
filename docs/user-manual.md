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
jf.path({ closed?: boolean=false }, points: Vec2[])
```

### Building paths

Each returns a new `FluentPath2`.

```
.appendPoints(points: Vec2[])
.appendArc({ endpoint: Vec2, radius?: Vec2=[0,0], xaxisrotation?: number=0, clockwise?: boolean=false, large?: boolean=false, segments?: number=16 })
.appendBezier({ controlPoints: (Vec2 | null)[], segments?: number=16 })
.close()
.concat(...paths)           // a point shared at a junction is kept once; only the last path may be closed
.reverse()
```

`appendArc` follows SVG's arc command: an elliptical arc from the last point
to `endpoint`. In `appendBezier` the last control point is the end, and a
`null` first control point mirrors the previous curve's last one for a smooth
join. A closed path's points make a polygon: `jf.polygon(path.toPoints())`.

```js
const outline = jf.line([[0, 0], [20, 0]])
  .appendArc({ endpoint: [20, 10], radius: [5, 5] })
  .appendBezier({ controlPoints: [[10, 20], [0, 10]] })
  .close()
const plate = jf.polygon(outline.toPoints()).extrudeLinear({ height: 2 })
```

### Curves and hull points

These return data for `jf.polygon`, `jf.line`, `jf.path` and `jf.polyhedron`.

```
jf.curves.bezier.create(points)                 -> Bezier   // numbers, or 2D or 3D points
jf.curves.bezier.valueAt(t, bezier)             -> number | point   // t from 0 to 1
jf.curves.bezier.tangentAt(t, bezier)           -> number | vector
jf.curves.bezier.length(segments, bezier)       -> number
jf.curves.bezier.lengths(segments, bezier)      -> number[]  // segments + 1 cumulative lengths
jf.curves.bezier.arcLengthToT({ distance?: number=0, segments?: number=100 }, bezier) -> t

jf.hullPoints2(points: Vec2[])  -> Vec2[]                            // counter-clockwise
jf.hullPoints3(points: Vec3[])  -> { points: Vec3[], faces: number[][] }
```

```js
const curve = jf.curves.bezier.create([[0, 0], [5, 10], [10, 0]])
const arch = Array.from({ length: 17 }, (_, i) => jf.curves.bezier.valueAt(i / 16, curve))
jf.polygon(arch.reverse())                 // counter-clockwise for positive area
jf.polyhedron(jf.hullPoints3(points))
```

### Text

Single-stroke (Hershey simplex) text as open paths, one per stroke. Give the
strokes width with `expand` or `extrudeRectangular`, which path arrays apply
to every stroke.

```
jf.vectorText({ xOffset?: number=0, yOffset?: number=0, height?: number=14, lineSpacing?: number=2.142857, letterSpacing?: number=1, align?: 'left'|'center'|'right'='left', extrudeOffset?: number=0, input?: string }, text?: string) -> FluentPath2Array
jf.vectorChar({ xOffset?: number=0, yOffset?: number=0, height?: number=14, extrudeOffset?: number=0, input?: string }, char?: string) -> { width, height, segments: FluentPath2Array }
```

`height` is the height of a lowercase letter; uppercase letters are 1.5 times
taller. `lineSpacing` and `letterSpacing` are multiples of `height`, and lines
split on newlines. The text may be the only argument: `jf.vectorText('Hi')`.
`vectorChar`'s `width` is the distance to the next character.

```js
const label = jf.union(jf.vectorText({ height: 8 }, 'JSCAD').expand({ delta: 1, corners: 'round' }))
  .extrudeLinear({ height: 2 })
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
.align({ modes?: Mode[]=['center','center','min'], relativeTo?: (number|null)[]=[0,0,0], grouped?: boolean=false })
// Mode = 'min' | 'max' | 'center' | 'none'

jf.align(options, ...geometries) -> (FluentGeom2 | FluentGeom3 | FluentPath2)[]
```

Scale factors must be positive. Use `mirror` for negative scaling.

`align` translates so the bounding box's min, max, or center meets
`relativeTo`, one mode per axis; `'none'` leaves that axis alone. A `null` in
`relativeTo` uses the group's own bounds on that axis. `jf.align` and an
array's `.align` move each shape on its own, or all by the same amount with
`grouped: true`. `alignTo` (under Anchors) places a part against another
part instead of a point.

```js
part.align({ modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0] })   // corner at the origin
const [base, lid] = jf.align({ modes: ['center', 'center', 'none'], grouped: true }, base0, lid0)
```

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

The top-level functions also take a `FluentGeom2Array` or `FluentGeom3Array`
and throw when called with no geometry.

### Splitting

```
.scission() -> FluentGeom3Array    // geom3: one FluentGeom3 per disconnected piece
.scission() -> FluentGeom2Array    // geom2: one FluentGeom2 per separate area, with its holes
```

A geom2 splits into one shape per outer (counter-clockwise) outline. Each
hole (clockwise outline) goes to the smallest outline that contains it, so an
island inside a hole is a shape of its own and keeps its own holes. A hole
with no outline around it becomes a shape by itself. The pieces keep the
shape's color.

```js
const [left, right] = jf.union(a, b).scission()
const areas = jf.union(ring, island).scission().measureArea()   // [ring, island]
```

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

Hull, expand, offset, extrusion, minkowski, and scission results carry no
frames.

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
.extrudeLinear(options)      // geom2 arrays: FluentGeom3Array of FluentGeom3
.extrudeRotate(options)
.extrudeHelical(options)
.extrudeRectangular(options) // geom2 and path2 arrays: FluentGeom3Array
.expand(options)             // path2 arrays: FluentGeom2Array
```

Transforms on an array apply to every item and return an array of the same
class. Items are always fluent objects: the constructors, `append` and `push`
wrap raw modeling geometry, so `arr[0].translate(...)` chains without a cast.
`filter` and `slice` return the same array class; `map` returns a plain array.

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

`expand` returns the same type for geom2 and geom3. On a path2 it returns a
`FluentGeom2`, since expanding a path gives an area:

```js
jf.line([[0, 0], [10, 0], [10, 10]]).expand({ delta: 1, corners: 'round' }).extrudeLinear({ height: 2 })
```

## Extrusion

Each returns a `FluentGeom3`.

```
// geom2
.extrudeLinear({ height?: number=1, twistAngle?: number=0, twistSteps?: number=1 })
.extrudeRotate({ angle?: number=2*PI, startAngle?: number=0, segments?: number=12, overflow?: 'cap'='cap' })
.extrudeHelical({ angle?: number=2*PI, startAngle?: number=0, pitch?: number=10, height?: number=0, endOffset?: number=0, segmentsPerRotation?: number=32 })
.extrudeRectangular({ size?: number=1, height?: number=1, corners?: Corners='edge', segments?: number=16 })
.extrudeFromSlices({ numberOfSlices?: number=2, capStart?: boolean=true, capEnd?: boolean=true, close?: boolean=false, repair?: boolean=true, callback?: (progress, index, base) => Slice | null })

// path2
.extrudeRectangular({ size?: number=1, height?: number=1, corners?: Corners='edge', segments?: number=16 })

jf.extrudeFromSlices(options, baseSlice)
```

- `extrudeHelical` sweeps the shape around the Z axis while rising `pitch`
  per turn. The shape's X is its distance from the axis and its Y becomes Z,
  so place it at positive X. A nonzero `height` sets the pitch from `angle`.
  `endOffset` moves the last slice that much further from the axis.
- `extrudeRectangular` builds a wall along a path or along a shape's
  outlines: it expands them by `size` on each side, then extrudes `height`.
  It also accepts `twistAngle` and `twistSteps`.
- `extrudeFromSlices` calls `callback` `numberOfSlices` times with `progress`
  from 0 to 1 and joins the slices it returns. On a geom2, `base` is the shape
  and the default callback extrudes it one unit up Z. `jf.extrudeFromSlices`
  starts from a slice instead.

```js
const coil = jf.circle({ radius: 1, center: [6, 0] }).extrudeHelical({ angle: Math.PI * 6, pitch: 3 })
const wall = jf.arc({ radius: 20, endAngle: Math.PI }).extrudeRectangular({ size: 1, height: 5 })

const { mat4 } = jf.maths
const twisted = jf.square({ size: 10 }).extrudeFromSlices({
  numberOfSlices: 10,
  callback: (t, i, base) => jf.slice.transform(
    mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), [0, 0, t * 20]), mat4.fromZRotation(mat4.create(), t)),
    jf.slice.fromSides(base.toSides())),
})
```

### Slices

`jf.slice` builds the slices a callback returns. A slice is a closed loop of 3D
edges.

```
jf.slice.fromPoints(points)         // 2D or 3D loop
jf.slice.fromSides(shape.toSides()) // from a geom2
jf.slice.transform(matrix, slice)   // matrix from jf.maths.mat4
jf.slice.reverse(slice)
jf.slice.create(edges?)  jf.slice.clone(slice)  jf.slice.calculatePlane(slice)
jf.slice.toEdges(slice)  jf.slice.toPolygons(slice)  jf.slice.equals(a, b)  jf.slice.isA(x)
```

### Projection

```
.project({ axis?: Vec3=[0,0,1], origin?: Vec3=[0,0,0] }) -> FluentGeom2   // geom3
```

Flattens a solid onto the plane through `origin` normal to `axis`, rotated to
lie in XY.

## Cleanup

```
.generalize({ snap?: boolean=false, simplify?: boolean=false, triangulate?: boolean=false })
.snap()             // snap vertices to the geometry's precision (measureEpsilon)
.retessellate()     // geom3: merge coplanar polygons into larger convex ones
```

`generalize` runs its steps in the order listed and changes only geom3; on a
geom2 or path2 it returns an unchanged copy. These keep anchors.

```
.invert()           // geom3: flip every face; geom2: reverse every side (area changes sign)
.clone()            // a separate copy, with color and anchors
```

A solid whose `measureVolume()` is negative is inside out, usually a
`jf.polyhedron` with faces wound clockwise seen from outside; `.invert()`
fixes it. On a path, `.reverse()` does the same job. Both keep anchors.

```js
const solid = jf.polyhedron({ points, faces })
const fixed = solid.measureVolume() < 0 ? solid.invert() : solid
```

## Measurements

```
.measureBoundingBox()      -> [[minX, minY, minZ], [maxX, maxY, maxZ]]
.measureBoundingSphere()   -> [center: Vec3, radius: number]
.measureCenter()           -> Vec3
.measureDimensions()       -> [width, depth, height]
.measureArea()             -> number   // geom2 area, geom3 surface area; 0 for path2
.measureVolume()           -> number   // geom3
.measureCenterOfMass()     -> Vec3     // geom2 and geom3; Z is 0 for geom2
.measureEpsilon()          -> number   // precision used when comparing points

jf.measureAggregateArea(...geometries)         -> number
jf.measureAggregateVolume(...geometries)       -> number
jf.measureAggregateBoundingBox(...geometries)  -> [[minX, minY, minZ], [maxX, maxY, maxZ]]
jf.measureAggregateEpsilon(...geometries)      -> number
```

The aggregate functions take shapes spread or in arrays and measure them as
one group.

On a geometry array each measurement returns a list with one result per item,
in order, even for one item; an empty array gives `[]`. Arrays of every type
have `measureBoundingBox`, `measureBoundingSphere`, `measureCenter`,
`measureDimensions`, `measureEpsilon` and `measureArea`. Geom2 and geom3
arrays add `measureCenterOfMass`, and geom3 arrays `measureVolume`.

```js
const volumes = part.scission().measureVolume()   // [8, 64]
const total = jf.measureAggregateVolume(part.scission())
```

## Conversion and validation

```
.toPoints()     -> Vec2[]                  // geom2 and path2
.toOutlines()   -> Vec2[][]                // geom2
.toSides()      -> [Vec2, Vec2][]          // geom2, for jf.slice.fromSides
.toPolygons()   -> { vertices: Vec3[] }[]  // geom3
.toString()     -> string
.validate()                                // throws if invalid

jf.isGeom2(value)  jf.isGeom3(value)  jf.isPath2(value)   -> boolean, for fluent or raw geometry
```

Modeling's `geom3.fromPoints` is `jf.polyhedron`, and `geom2.fromPoints` is
`jf.polygon`. The compact-binary functions (`toCompactBinary`,
`fromCompactBinary`) are serialization and are not wrapped.

## Utilities and math

```
jf.utils.degToRad(degrees)        -> radians
jf.utils.radToDeg(radians)        -> degrees
jf.utils.radiusToSegments(radius, minimumLength, minimumAngle) -> number   // at least 4; 0 ignores a limit
jf.utils.flatten(nestedArrays)    -> flat array

jf.maths.constants.TAU            // 2 * PI
jf.maths.constants.EPS            // 1e-5, tolerance for comparing points and planes
jf.maths.constants.NEPS           // 1e-13, tolerance for near-zero distances
jf.maths.constants.spatialResolution   // 1e5, 1 / EPS
jf.maths.vec2.*  jf.maths.vec3.*  jf.maths.vec4.*   // @jscad/modeling vector functions
jf.maths.mat4.*                   // matrices, for .transform(matrix)
jf.maths.line2.*                  // 2D lines as [nx, ny, distance]
jf.maths.line3.*                  // 3D lines as [origin, direction]
jf.maths.plane.*                  // planes as [nx, ny, nz, distance]
jf.maths.utils.area(points)       // signed area of a 2D polygon
jf.maths.utils.sin(a)  .cos(a)    // exact 0 and 1 at quarter turns
jf.maths.utils.solve2Linear  .intersect  .interpolateBetween2DPointsForY  .aboutEqualNormals
```

Modeling has no vec1 functions (a vec1 is a plain number), so there is no
`jf.maths.vec1`. The functions that build a value take the output first, as
in `@jscad/modeling`:

```js
const { vec3, mat4 } = jf.maths
const mid = vec3.lerp(vec3.create(), [0, 0, 0], [10, 0, 0], 0.5)   // [5, 0, 0]
part.transform(mat4.fromZRotation(mat4.create(), Math.PI / 4))

const { plane } = jf.maths
const ground = plane.fromPoints(plane.create(), [0, 0, 0], [1, 0, 0], [0, 1, 0])
plane.signedDistanceToPoint(ground, [2, 2, 5])   // 5
```

## Wrapper classes

`jf.FluentGeom2` and `jf.FluentGeom3` are the classes the factories return.
Embedders can wrap raw modeling geometry with `new jf.FluentGeom3(geometry)`.
