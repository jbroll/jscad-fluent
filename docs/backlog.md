# Backlog

## 0.7.0 release plan

The plan is to publish 0.7.0 from `local-packages` (anchor methods plus the
manifold wrapper fix in `src/copyGeometry.ts`). `make publish`
(`Makefile`'s `publish` target) bumps the patch version, so 0.7.0 needs a
manual `npm version 0.7.0` first, then `npm run build`, `npm publish`, and a
jsdelivr purge. Publish only after the jscadui viewer deploy: the currently
deployed viewer has no `@jscad/modeling-for-anchors` alias and would fail
loading 0.7.0.

## `copyGeometry` method check matches inherited names

`src/copyGeometry.ts`'s method-forwarding branch checks `!(key in target)`,
which is also true for names inherited from `Object.prototype` (`toString`,
`valueOf`, `hasOwnProperty`, ...) since `in` walks the whole prototype
chain. A source method named like one of those would not be forwarded.

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
