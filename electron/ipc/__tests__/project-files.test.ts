import { describe, expect, it } from 'vitest';
import { serializeProject } from '../project-serialization.js';

describe('serializeProject', () => {
  it('creates JSON snapshot for project export', () => {
    const json = serializeProject({ id: 'p1', name: '招商资料' });
    expect(JSON.parse(json).name).toBe('招商资料');
  });
});
