import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('electron preload build output', () => {
  it('emits a preload script that is not ESM import-based', () => {
    const cjsPath = path.resolve(__dirname, '../../dist-electron/preload.cjs');
    const jsPath = path.resolve(__dirname, '../../dist-electron/preload.js');
    const preloadPath = existsSync(cjsPath) ? cjsPath : jsPath;
    const code = readFileSync(preloadPath, 'utf8');

    expect(code).not.toMatch(/^import\s/m);
  });
});
