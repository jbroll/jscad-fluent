# Install

## Requirements

The peer dependency is `@jbroll/jscad-anchors` `^0.2.0`, from
[jbroll/jscad-anchors](https://github.com/jbroll/jscad-anchors). Its own peer
is `@jscad/modeling`, aliased to `@jbroll/jscad-modeling` `^2.13.4`, the
`fork-main` branch of
[jbroll/OpenJSCAD.org](https://github.com/jbroll/OpenJSCAD.org)'s
`packages/modeling`.

## Consumer setup

```bash
npm install @jbroll/jscad-fluent
```

npm installs both peers, with the modeling fork under the name
`@jscad/modeling`. jscad-fluent reaches modeling only through jscad-anchors,
so they share that one copy. Two copies would break the identity checks
jscad-anchors uses to detect stale frames. A project that pins upstream
`@jscad/modeling` itself gets a peer conflict from npm.

To work against sibling checkouts instead, see `docs/development.md`.

## Loading

```js
const jf = require('@jbroll/jscad-fluent')     // CommonJS, UMD bundle
import jf from '@jbroll/jscad-fluent'          // ES module bundle
```

Both bundles leave `@jbroll/jscad-anchors` and `@jscad/modeling` external.

In a page, load `dist/jscad-fluent.browser.js`, the package's `jsdelivr` and
`unpkg` entry. It bundles jscad-anchors and reads modeling from the global
`jscadModeling`, which modeling's `dist/jscad-modeling.min.js` defines. It
also loads through AMD or CommonJS, requiring only `@jscad/modeling`.

```html
<script src="https://cdn.jsdelivr.net/npm/@jbroll/jscad-modeling/dist/jscad-modeling.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@jbroll/jscad-fluent"></script>
<script>
  const jf = jscadFluent
</script>
```
