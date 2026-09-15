# Architecture

## Modules

| Path | Contents |
|---|---|
| `src/index.ts` | The default export `jscadFluent`: primitive factories, top-level `union`/`subtract`/`intersect`, array constructors, `colors`, and the `FluentGeom2`/`FluentGeom3` classes |
| `src/cylinder.ts` | The `cylinder` factory: solid, tapered, elliptical, hollow, and partial cylinders built on `cylinderElliptic` |
| `src/types.ts` | Type re-exports from `@jscad/modeling` and `@jbroll/jscad-anchors`, plus local tuple types and `FrameInput` |
| `src/gen/` | Generated wrapper classes; never edited by hand |
| `templates/` | Mustache templates, partials, and `methods.json` that produce `src/gen/` |

## Code generation

Most wrapper methods are one-line calls into a modeling namespace that differ
only in name, namespace, and parameters. `templates/methods.json` lists those
methods in groups, and each class template includes the groups that apply to
its geometry type through a partial that sets the method's shape:

| Partial | Shape |
|---|---|
| `methodObject.mustache` | calls `ns.name(params, this)` and returns a new instance of the same class |
| `methodBoolean.mustache` | calls `booleans.name(this, ...others)` |
| `methodMinkowski.mustache` | calls `minkowski.minkowskiSum` (geom3 only) |
| `methodExtrude.mustache` | extrudes a geom2 and returns a `FluentGeom3` |
| `methodValue.mustache` | returns the result of `ns.name(this)` unchanged |
| `methodAnchors.mustache` | `withAnchors`, `anchor`, `attachTo`, `alignTo` (geom2 and geom3) |
| `methodArray*.mustache` | array-class variants |

| Template | Class |
|---|---|
| `FluentGeom2.template` | `FluentGeom2` |
| `FluentGeom3.template` | `FluentGeom3` |
| `FluentPath2.template` | `FluentPath2` |
| `FluentGeometryArray.template` | `FluentGeometryArray<T>`, an `Array` subclass whose transforms apply to every element |
| `FluentGeom2Array.template`, `FluentGeom3Array.template`, `FluentPath2Array.template` | typed arrays with `hull`/`hullChain`, and batch extrusion on geom2 |

`make gen` renders them with `@jbroll/mustache`. The generated files are
committed so the package builds without the generator.

## Wrapper classes

Each class implements the JSCAD geometry interface it wraps, so a fluent
object can be passed straight to any modeling function. The constructor calls
`copyGeometry` (`src/copyGeometry.ts`), which copies every own field of the raw
geometry onto the instance, carrying `color` and `anchors` along with
`polygons`, `sides`, or `points` and `transforms`.

Geometry from the jscadui viewer's manifold engine (`ManifoldGeom3`,
`ManifoldGeom2`) keeps `polygons`, `sides`, `type`, and its `isManifoldGeom3`
and `manifold` markers as getters on its class, which `Object.assign` skips.
`copyGeometry` defines a forwarding getter on the instance for each one, and a
forwarding method for each class method the wrapper lacks (`boundingBox`,
`volume`, `clone`). Reading `polygons` still converts the mesh, but only when
something reads it, and manifold operations given the wrapper find the
`manifold` object without a conversion. The forwarders are non-enumerable, as
they are on the source class, so a spread, `Object.assign`, or the viewer
worker's `postMessage` sees the same fields it would see on the raw geometry.

Methods don't mutate. Each returns `this._wrap(result)`, which constructs a new
instance through `this.constructor`, so the return type stays `this`.

## Modeling through jscad-anchors

Every runtime modeling import, in the templates and in `src/*.ts`, comes from
`@jbroll/jscad-anchors` rather than `@jscad/modeling`. That package re-exports
modeling with each geometry-taking function wrapped so stored frames survive:
transforms carry them, measurements bake them safely, and `booleans.*` are its
anchor-preserving booleans. A raw modeling call that bakes an anchored,
transformed part leaves its frames stale, and the next read throws
`geometry was baked outside jscad-anchors`. Types may still come from
`@jscad/modeling`.

Booleans pass operands as separate arguments, never as one array, because
`subtractAnchored` reads `{ carry }` only from its last argument.

Frames are stored in a plain `anchors` field (`{ frames, basis }`), which the
classes declare. `.anchor(name)` returns resolved world frames.

Path2 has no anchor methods, since jscad-anchors only anchors geom2 and geom3.
Its methods still import through the wrapper.

## Build

Vite builds ES and UMD bundles from `src/index.ts`, with `@jscad/modeling` and
`@jbroll/jscad-anchors` external. Both Vite and Vitest alias `@jscad/modeling`
to `@jbroll/jscad-modeling`. `tsc --emitDeclarationOnly` writes the
declarations.
