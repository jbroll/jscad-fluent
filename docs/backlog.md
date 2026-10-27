# Backlog

## 0.7.0 release plan

0.7.0 publishes from `main` (anchor methods, the manifold wrapper fix in
`src/copyGeometry.ts`, the modeling-parity API, model-tree nodes, `jf.hull`
and `jf.hullChain`). `main` carries the `v0.7.0` version and tag. Left to do,
in order:

1. Publish `@jbroll/jscad-modeling` 2.13.4 from the fork's `fork-main`. npm's
   latest is 2.13.3, below the `^2.13.4` peer range, so npm consumers can't
   satisfy the peer until it is out. `@jbroll/jscad-anchors` 0.1.0 is
   already on npm.
2. `npm run build`, `npm publish` (not `make publish`, which bumps the patch
   version), and a jsdelivr purge.

## `copyGeometry` method check matches inherited names

`src/copyGeometry.ts`'s method-forwarding branch checks `!(key in target)`,
which is also true for names inherited from `Object.prototype` (`toString`,
`valueOf`, `hasOwnProperty`, ...) since `in` walks the whole prototype
chain. A source method named like one of those would not be forwarded.
