import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { build } from 'vite';

const require = createRequire(import.meta.url);

// A page that loads the browser bundle from a CDN defines only the modeling global.
describe('browser bundle', () => {
  let source = '';
  const outDir = mkdtempSync(join(tmpdir(), 'jscad-fluent-browser-'));

  beforeAll(async () => {
    await build({
      configFile: resolve(import.meta.dirname, '../vite.config.ts'),
      mode: 'browser',
      logLevel: 'silent',
      build: { outDir, emptyOutDir: true },
    });
    source = readFileSync(join(outDir, 'jscad-fluent.browser.js'), 'utf8');
  }, 60_000);

  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  test('runs in a plain context with only jscadModeling defined', () => {
    const context = { jscadModeling: require('@jbroll/jscad-modeling') };
    runInNewContext(source, context);
    const jf = context.jscadFluent;
    expect(jf.cube({ size: 2 }).translate([1, 0, 0]).measureVolume()).toBeCloseTo(8);

    const plate = jf
      .cuboid({ size: [10, 10, 2] })
      .withAnchors({ hole: { origin: [2, 0, 1], z: [0, 0, 1] } })
      .translate([5, 0, 0]);
    expect(plate.anchor('hole').origin).toEqual([7, 0, 1]);
  });
});
