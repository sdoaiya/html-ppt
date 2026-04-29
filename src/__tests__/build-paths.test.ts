import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('production build asset paths', () => {
  it('uses relative asset paths in dist/index.html for file protocol', () => {
    const html = readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');

    expect(html).not.toContain('src="/assets/');
    expect(html).not.toContain('href="/assets/');
  });
});
