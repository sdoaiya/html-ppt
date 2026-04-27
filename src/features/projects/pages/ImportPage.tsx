import { useNavigate } from 'react-router-dom';
import { createSourceAssetFromPath } from '@/services/files/import-service';
import { useProjectStore } from '@/stores/project-store';

const demoFiles = ['旧方案.pptx', '业务数据.xlsx', '产品截图.png'];

export default function ImportPage() {
  const createProject = useProjectStore((state) => state.createProject);
  const setSources = useProjectStore((state) => state.setSources);
  const navigate = useNavigate();

  return (
    <main>
      <h2>上传资料</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          createProject('未命名资料项目', String(form.get('brief') ?? '整理成业务资料'));
          setSources(demoFiles.map(createSourceAssetFromPath));
          navigate('/understanding');
        }}
      >
        <label>
          目标说明
          <textarea name="brief" aria-label="目标说明" defaultValue="整理成更高级的业务资料" />
        </label>
        <section>
          <h3>演示资料</h3>
          <ul>
            {demoFiles.map((file) => <li key={file}>{file}</li>)}
          </ul>
        </section>
        <button type="button" onClick={() => window.desktopBridge?.pickProjectFiles()}>选择资料文件</button>
        <button type="submit">开始解析资料</button>
      </form>
    </main>
  );
}
