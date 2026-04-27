import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

export default function ImportPage() {
  const createProject = useProjectStore((state) => state.createProject);
  const navigate = useNavigate();

  return (
    <main>
      <h2>上传资料</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          createProject('未命名资料项目', String(form.get('brief') ?? '整理成业务资料'));
          navigate('/understanding');
        }}
      >
        <label>
          目标说明
          <textarea name="brief" aria-label="目标说明" defaultValue="整理成更高级的业务资料" />
        </label>
        <button type="button" onClick={() => window.desktopBridge?.pickProjectFiles()}>选择资料文件</button>
        <button type="submit">开始解析资料</button>
      </form>
    </main>
  );
}
