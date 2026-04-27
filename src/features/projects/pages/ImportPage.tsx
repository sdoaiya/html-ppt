import { useNavigate } from 'react-router-dom';
import { classifyImportedFile, createExtractedSourceAsset, createSourceAssetFromPath } from '@/services/files/import-service';
import { useProjectStore } from '@/stores/project-store';
import { useState } from 'react';

const demoFiles = ['旧方案.pptx', '业务数据.xlsx', '产品截图.png'];

function buildProjectName(brief: string) {
  const trimmed = brief.trim();
  if (!trimmed) return '未命名资料项目';
  return trimmed.length > 18 ? `${trimmed.slice(0, 18)}...` : trimmed;
}

export default function ImportPage() {
  const createProject = useProjectStore((state) => state.createProject);
  const setExtractedSources = useProjectStore((state) => state.setExtractedSources);
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  return (
    <main>
      <h2>上传资料</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const brief = String(form.get('brief') ?? '整理成业务资料');
          createProject(buildProjectName(brief), brief);

          const run = async () => {
            const filePaths = selectedFiles.length ? selectedFiles : demoFiles;
            const payloads = selectedFiles.length
              ? await window.desktopBridge.readProjectFiles(filePaths)
              : filePaths.map((path) => ({ path, name: path, ext: path.split('.').pop() ?? '', content: '演示资料内容' }));

            const extractedSources = await Promise.all(
              payloads.map((payload) =>
                createExtractedSourceAsset({
                  path: payload.path,
                  name: payload.name,
                  kind: classifyImportedFile(payload.name),
                  rawContent: payload.content,
                  rows: payload.rows
                })
              )
            );

            setExtractedSources(extractedSources);
            setStatusMessage(`已解析 ${extractedSources.length} 份资料`);
            navigate('/understanding');
          };

          void run();
        }}
      >
        <label>
          目标说明
          <textarea name="brief" aria-label="目标说明" defaultValue="整理成更高级的业务资料" />
        </label>
        <section>
          <h3>{selectedFiles.length ? '已选择文件' : '演示资料'}</h3>
          <ul>
            {(selectedFiles.length ? selectedFiles : demoFiles).map((file) => <li key={file}>{file}</li>)}
          </ul>
          {statusMessage ? <p>{statusMessage}</p> : <p>支持 txt / md / docx / pdf / xlsx / csv</p>}
        </section>
        <button
          type="button"
          onClick={async () => {
            const files = await window.desktopBridge?.pickProjectFiles();
            if (files?.length) setSelectedFiles(files);
          }}
        >
          选择资料文件
        </button>
        <button type="submit">开始解析资料</button>
      </form>
    </main>
  );
}
