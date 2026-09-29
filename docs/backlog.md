# Backlog

## Publish dependencies before the next release

npm has no `@jbroll/jscad-anchors`, and its latest `@jbroll/jscad-modeling`
is 2.13.3, below the `^2.13.4` peer range. Publish both before publishing
jscad-fluent, or npm consumers can't satisfy the peers.

## UMD bundle in the browser

The UMD bundle reads `@jbroll/jscad-anchors` from a global `jscadAnchors`
(`vite.config.ts`), but jscad-anchors is CommonJS with no browser build. Loading
`jscad-fluent.umd.cjs` from jsDelivr in a page therefore fails. The options are
a UMD build of jscad-anchors, or bundling jscad-anchors into jscad-fluent's
browser bundle.

## Array element types

`FluentGeom3Array` and `FluentGeom2Array` extend `FluentGeometryArray<Geom3>`
and `<Geom2>`, so TypeScript types their items as raw geometry even when they
hold fluent objects (`scission()`, path-array `expand`, batch extrusion).
Calling a fluent method on an item needs a cast. Typing items as the fluent
classes would also need `append` and the constructors to wrap raw input.

## Array measurements

`FluentGeometryArray.template` renders `measurementMethods` through a
`methodArrayValue` partial that doesn't exist, so arrays have no measure
methods. `jf.measureAggregate*` covers the group case.

## geom2 scission

`FluentGeom3.scission()` has no geom2 counterpart because modeling's
`scission` returns 2D geometry unchanged. Splitting a geom2 would need its
outlines grouped with the holes inside them.
