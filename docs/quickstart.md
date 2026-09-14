# Quickstart

Clone the three repositories side by side, then build jscad-fluent:

```bash
git clone -b fork-main https://github.com/jbroll/OpenJSCAD.org
git clone https://github.com/jbroll/jscad-anchors
git clone https://github.com/jbroll/jscad-fluent
cd jscad-fluent
npm install
npm run build
```

Save this as `plate.cjs` in `jscad-fluent/`:

```js
const jf = require('./dist/jscad-fluent.umd.cjs')

const hole = jf.cylinder({ radius: 2, height: 10 })
  .withAnchors({ axis: { origin: [0, 0, 2.5], z: [0, 0, 1] } })
  .translate([10, 0, 0])

const plate = jf.cuboid({ size: [40, 40, 5] })
  .subtract(hole, { carry: { bolt1: hole } })

const bolt = jf.cylinder({ radius: 1.8, height: 20 })
  .attachTo(plate, 'bolt1.axis', 'bottom', { overlap: 5 })

console.log(plate.measureVolume())
console.log(bolt.measureBoundingBox())
```

Run it:

```bash
node plate.cjs
```

It prints the plate's volume (a little under 8000) and the bolt's bounding
box, `[[8.2, -1.8, -2.5], [11.8, 1.8, 17.5]]`: the bolt stands in the hole,
running through the 5 mm plate.

`docs/user-manual.md` lists every operation.
