import { dialog, ipcMain } from 'electron';
import { readFile } from 'node:fs/promises';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import * as XLSX from 'xlsx';
export { serializeProject } from './project-serialization.js';

export function normalizeFilePayload(input: {
  path: string;
  name: string;
  ext: string;
  content?: string;
  rows?: string[][];
}) {
  return {
    path: input.path,
    name: input.name,
    ext: input.ext,
    content: input.content,
    rows: input.rows
  };
}

export function registerProjectFileHandlers() {
  ipcMain.handle('project-files:pick', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: '资料文件', extensions: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'csv', 'png', 'jpg', 'jpeg', 'webp', 'mp3', 'wav', 'm4a'] }
      ]
    });

    return result.canceled ? [] : result.filePaths;
  });

  ipcMain.handle('project-files:read', async (_event, filePaths: string[]) => {
    const payloads = await Promise.all(
      filePaths.map(async (filePath) => {
        const name = filePath.split(/[\\/]/).pop() ?? filePath;
        const ext = name.split('.').pop()?.toLowerCase() ?? '';

        if (ext === 'csv') {
          const content = await readFile(filePath, 'utf8');
          const rows = content
            .split(/\r?\n/)
            .filter(Boolean)
            .map((line) => line.split(','));
          return normalizeFilePayload({ path: filePath, name, ext, rows });
        }

        if (ext === 'xlsx') {
          const workbook = XLSX.readFile(filePath);
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 }) as string[][];
          return normalizeFilePayload({ path: filePath, name, ext, rows });
        }

        if (['txt', 'md'].includes(ext)) {
          const content = await readFile(filePath, 'utf8');
          return normalizeFilePayload({ path: filePath, name, ext, content });
        }

        if (ext === 'docx') {
          const result = await mammoth.extractRawText({ path: filePath });
          return normalizeFilePayload({ path: filePath, name, ext, content: result.value });
        }

        if (ext === 'pdf') {
          const buffer = await readFile(filePath);
          const parser = new PDFParse({ data: buffer });
          const result = await parser.getText();
          return normalizeFilePayload({ path: filePath, name, ext, content: result.text });
        }

        return normalizeFilePayload({ path: filePath, name, ext });
      })
    );

    return payloads;
  });
}
