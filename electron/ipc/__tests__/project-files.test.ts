import { describe, expect, it } from 'vitest';
import { serializeProject } from '../project-serialization.js';
import { normalizeFilePayload } from '../project-files.js';

describe('serializeProject', () => {
  it('creates JSON snapshot for project export', () => {
    const json = serializeProject({ id: 'p1', name: '招商资料' });
    expect(JSON.parse(json).name).toBe('招商资料');
  });

  it('serializes file payload with utf8 text content', () => {
    const payload = normalizeFilePayload({
      path: 'note.txt',
      name: 'note.txt',
      ext: 'txt',
      content: 'hello'
    });

    expect(payload.content).toBe('hello');
  });
});
