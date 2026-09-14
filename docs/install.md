# Install

## Requirements

Peer dependencies:

- `@jbroll/jscad-modeling` `^2.13.4`, the `fork-main` branch of
  [jbroll/OpenJSCAD.org](https://github.com/jbroll/OpenJSCAD.org)'s
  `packages/modeling`
- `@jbroll/jscad-anchors` `^0.1.0`, from
  [jbroll/jscad-anchors](https://github.com/jbroll/jscad-anchors)

`@jbroll/jscad-anchors` is not on npm yet, and npm's latest
`@jbroll/jscad-modeling` is 2.13.3, so both currently come from sibling
checkouts.

## Consumer setup

Check out the three repositories side by side and link them:

```json
{
  "dependencies": {
    "@jbroll/jscad-fluent": "file:../jscad-fluent",
    "@jbroll/jscad-anchors": "file:../jscad-anchors",
    "@jbroll/jscad-modeling": "file:../OpenJSCAD.org/packages/modeling",
    "@jscad/modeling": "file:../OpenJSCAD.org/packages/modeling"
  },
  "overrides": {
    "@jscad/modeling": "$@jscad/modeling"
  }
}
```

jscad-anchors requires `@jscad/modeling`, and it must resolve to the same
copy jscad-fluent uses. Two copies break the identity checks jscad-anchors uses
to detect stale frames. The `overrides` entry forces every nested
`@jscad/modeling` onto the root one. jscad-anchors' `docs/install.md` has more
detail.

Build jscad-fluent once in its checkout (`npm install && npm run build`); the
package entry points are in `dist/`.

## Loading

```js
const jf = require('@jbroll/jscad-fluent')     // CommonJS, UMD bundle
import jf from '@jbroll/jscad-fluent'          // ES module bundle
```

Both bundles leave `@jbroll/jscad-anchors` and `@jscad/modeling` external.
