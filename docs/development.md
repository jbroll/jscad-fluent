# Development

## Layout

```
src/index.ts, src/cylinder.ts, src/types.ts   hand-written source
src/gen/                                      generated wrapper classes
templates/                                    templates, partials, methods.json
test/                                         Vitest tests
examples/                                     example model
llm.txt                                       compact API reference for LLM prompts
```

`docs/architecture.md` explains how the pieces fit.

## Setup

Dependencies are linked from sibling checkouts:

```bash
git clone -b fork-main https://github.com/jbroll/OpenJSCAD.org ../OpenJSCAD.org
git clone https://github.com/jbroll/jscad-anchors ../jscad-anchors
npm install
```

`devDependencies` link `@jbroll/jscad-modeling` and `@jscad/modeling` to
`../OpenJSCAD.org/packages/modeling`, and `@jbroll/jscad-anchors` to
`../jscad-anchors`. jscad-anchors resolves `@jscad/modeling` from its own
`node_modules`, which links to the same checkout.

## Commands

```bash
npm run build             # Vite bundles, then tsc declarations
npm test                  # Vitest, once
npm run test:watch
npm run test:coverage
npm run type-check        # app (tsconfig.json) and tests (tsconfig.test.json)
npm run lint              # Biome
npm run lint:fix
npm run format
npm run check             # type-check and lint
npm run check:all         # type-check, lint, and tests
make gen                  # regenerate src/gen from templates
make dev                  # gen, then build
make clean                # remove dist and src/gen
```

## Changing wrapper methods

Never edit `src/gen/` by hand; the next `make gen` overwrites it.

- Add or change a method signature in `templates/methods.json`.
- Change how a kind of method is implemented in its partial,
  `templates/*.mustache`.
- Change a class's structure, fields, or imports in `templates/*.template`.

Then run `make gen` and `npm run lint:fix`. The generator's output isn't
Biome-formatted, and the committed files are.

Runtime modeling imports come from `@jbroll/jscad-anchors`, not
`@jscad/modeling`. See `docs/architecture.md`.

API changes also go in `docs/user-manual.md` and `llm.txt`.

## Tests

Tests live in `test/`, one file per area (`primitives2d`, `primitives3d`,
`primitivesPath2`, `booleans`, `hull`, `minkowski`, `cylinder`, `anchors`,
`additional`). Compare measurements with `toBeCloseTo`.

## TypeScript and lint

`tsconfig.json` covers `src` with `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noUnusedLocals`, and `noUnusedParameters`.
`tsconfig.test.json` relaxes the unused checks and adds Vitest globals.

Biome errors on explicit `any`. The generated classes use `biome-ignore`
comments where the JSCAD geometry interfaces require `any`. Tests may use
`any`. `templates/` is excluded from linting and formatting.

## Release

`make publish` builds, bumps the patch version, publishes to npm, and purges
the jsDelivr cache.
