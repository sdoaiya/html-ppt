import { dialog, ipcMain } from 'electron';

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
}
