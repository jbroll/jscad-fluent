import { describe, expect, test, vi } from 'vitest';

// The production composition is engine -> model tree -> anchors wrapTree ->
// fluent classes, with `@jscad/modeling` resolving to the tree. `@jscadui/model-tree`
// is not resolvable from this checkout, so the test seeds the mock with the tree
// namespace built from `JSCAD_MODEL_TREE` when set; otherwise it skips. With no
// frames in play an anchored wrapper reduces to its wrapped tree constructor.
vi.mock('@jbroll/jscad-anchors', async () => {
  const spec = import.meta.env.JSCAD_MODEL_TREE;
  if (!spec) {
    // Nothing under test loads without the tree: return a namespace shaped
    // enough for the module graph to initialize; the tests skip.
    return {
      anchors: {},
      booleans: {},
      colors: {},
      curves: { bezier: {} },
      expansions: {},
      extrusions: { slice: {} },
      geometries: {},
      hulls: {},
      maths: { constants: {} },
      measurements: {},
      minkowski: {},
      modifiers: {},
      primitives: {},
      text: {},
      transforms: {},
      utils: {},
    };
  }
  const modeling: any = await import('@jscad/modeling');
  const engine = modeling.default ?? modeling;
  const { createModelTree } = await import(/* @vite-ignore */ spec);
  const tree = createModelTree(engine);
  const realModule: any = await import('../../jscad-anchors/src/index.js');
  return { ...tree, anchors: realModule.anchors ?? realModule.default?.anchors };
});

import { FluentGeom2 } from '../src/gen/FluentGeom2';
import { FluentGeom3 } from '../src/gen/FluentGeom3';
import jf from '../src/index';

const modelTreeSpec = import.meta.env.JSCAD_MODEL_TREE ?? '@jscadui/model-tree';
const modelTree: any = await (async () => {
  try {
    return await import(/* @vite-ignore */ modelTreeSpec);
  } catch {
    return null;
  }
})();

describe('fluent method chains build deferred nodes', () => {
  test.skipIf(!modelTree)(
    'every link duck-types as a node and evaluates to the eager chain',
    async () => {
      const cube: any = jf.cube({ size: 4 });
      expect(cube.isTreeNode).toBe(true);
      expect(cube.op).toBe('primitives.cube');

      const moved: any = cube.translate([10, 0, 0]);
      expect(moved.isTreeNode).toBe(true);
      expect(moved.op).toBe('transforms.translate');
      expect(moved.dim).toBe(3);
      expect(moved.children[0]).toBe(cube);

      const modeling: any = await import('@jscad/modeling');
      const engine = modeling.default ?? modeling;

      const { solids } = await modelTree.createEvaluator(engine)(moved, new Map());
      expect(solids).toHaveLength(1);

      const eager = engine.transforms.translate([10, 0, 0], engine.primitives.cube({ size: 4 }));
      const [emin, emax] = engine.measurements.measureBoundingBox(eager);
      const [smin, smax] = engine.measurements.measureBoundingBox(solids[0]);
      for (const i of [0, 1, 2]) {
        expect(smin[i]).toBeCloseTo(emin[i], 6);
        expect(smax[i]).toBeCloseTo(emax[i], 6);
      }
    },
  );

  test.skipIf(!modelTree)('wrapShape dispatches a dim-2 node to FluentGeom2', () => {
    expect(jf.align({}, jf.square({ size: 2 }) as any)[0]).toBeInstanceOf(FluentGeom2);
    expect(jf.align({}, jf.cube({ size: 2 }) as any)[0]).toBeInstanceOf(FluentGeom3);
  });
});
