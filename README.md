# jscad-fluent

Chainable TypeScript wrapper around JSCAD's modeling API for 2D and 3D
geometry, with named anchors from
[jscad-anchors](https://github.com/jbroll/jscad-anchors) for placing parts
against each other.

```js
const jf = require('@jbroll/jscad-fluent')

const hole = jf.cylinder({ radius: 2, height: 10 })
  .withAnchors({ axis: { origin: [0, 0, 2.5], z: [0, 0, 1] } })
  .translate([10, 0, 0])

const plate = jf.cuboid({ size: [40, 40, 5] })
  .subtract(hole, { carry: { bolt1: hole } })
  .colorize(jf.colors.css.steelblue)

const bolt = jf.cylinder({ radius: 1.8, height: 20 })
  .attachTo(plate, 'bolt1.axis', 'bottom', { overlap: 5 })
```

## Install

The peers aren't on npm yet, so link sibling checkouts of
[OpenJSCAD.org](https://github.com/jbroll/OpenJSCAD.org) (`fork-main`),
[jscad-anchors](https://github.com/jbroll/jscad-anchors), and this repository.
See [docs/install.md](docs/install.md).

## Docs

- [Quickstart](docs/quickstart.md)
- [User manual](docs/user-manual.md)
- [Install](docs/install.md)
- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
- [Backlog](docs/backlog.md)

## License

MIT
