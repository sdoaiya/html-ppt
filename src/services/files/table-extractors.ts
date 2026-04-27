import type { ContentBlock } from '@/domain/projects/types';

export async function extractTableBlocks(input: {
  kind: 'spreadsheet';
  name: string;
  rows: string[][];
}): Promise<ContentBlock[]> {
  const [headers = [], ...dataRows] = input.rows;
  return [
    { type: 'table', headers, rows: dataRows },
    { type: 'table_summary', text: `${input.name} 包含 ${dataRows.length} 行数据，字段：${headers.join('、')}` }
  ];
}
