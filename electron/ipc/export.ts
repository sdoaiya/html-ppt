import { dialog, ipcMain } from 'electron';
import { writeFile } from 'node:fs/promises';

export function registerExportHandlers() {
  ipcMain.handle('export:project-json', async (_event, project: unknown) => {
    const result = await dialog.showSaveDialog({
      title: '导出项目 JSON',
      defaultPath: 'ziliao-project.json',
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });

    if (result.canceled || !result.filePath) return null;
    await writeFile(result.filePath, JSON.stringify(project, null, 2), 'utf8');
    return result.filePath;
  });
}
