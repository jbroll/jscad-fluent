# Backlog

## 0.7.1 release

0.7.0 on npm runs upstream `@jscad/modeling`: jscad-anchors 0.1.0's peer
resolves to it, not the fork. 0.7.1 peers on jscad-anchors 0.2.0, whose peer
aliases `@jscad/modeling` to `@jbroll/jscad-modeling`. Publish jscad-anchors
0.2.0 first, then this package with `npm run build`, `npm publish` (not
`make publish`, which bumps the patch version), and a jsdelivr purge.

## `copyGeometry` method check matches inherited names

`src/copyGeometry.ts`'s method-forwarding branch checks `!(key in target)`,
which is also true for names inherited from `Object.prototype` (`toString`,
`valueOf`, `hasOwnProperty`, ...) since `in` walks the whole prototype
chain. A source method named like one of those would not be forwarded.
