import { describe, expect, it } from 'vitest';
import { extractTableBlocks } from '../table-extractors';

describe('extractTableBlocks', () => {
  it('converts csv rows to table blocks and summary', async () => {
    const blocks = await extractTableBlocks({
      kind: 'spreadsheet',
      name: 'data.csv',
      rows: [
        ['地区', '销售额'],
        ['华北', '120'],
        ['华东', '160']
      ]
    });

    expect(blocks[0]).toMatchObject({ type: 'table' });
    expect(blocks[1]).toMatchObject({ type: 'table_summary' });
  });

  it('keeps xlsx-like row arrays as a table block', async () => {
    const blocks = await extractTableBlocks({
      kind: 'spreadsheet',
      name: 'sheet.xlsx',
      rows: [
        ['产品', '数量'],
        ['A', '10']
      ]
    });

    expect(blocks[0]).toEqual({
      type: 'table',
      headers: ['产品', '数量'],
      rows: [['A', '10']]
    });
  });
});
