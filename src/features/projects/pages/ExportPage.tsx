import { runQualityChecks } from '@/services/quality/quality-service';
import { useProjectStore } from '@/stores/project-store';
import { useState } from 'react';

export default function ExportPage() {
  const project = useProjectStore((state) => state.currentProject);
  const [exportMessage, setExportMessage] = useState('');
  const result = runQualityChecks({
    openQuestions: project?.understanding ? [] : ['资料理解结果尚未确认'],
    pages: (project?.structure ?? []).map((page) => ({
      title: page.title,
      hasVisual: page.role === 'cover' ? false : true,
      density: page.role === 'comparison' ? 'high' : 'medium' as const
    }))
  });

  return (
    <main>
      <h2>导出成品</h2>
      <section>
        <h3>导出前质检</h3>
        <ul>
          {result.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={async () => {
            if (!project) return;
            const filePath = await window.desktopBridge?.exportProjectJson?.(project);
            setExportMessage(filePath ? `已导出到 ${filePath}` : '已取消导出');
          }}
        >
          导出项目 JSON
        </button>
        {exportMessage ? <p>{exportMessage}</p> : null}
      </section>
    </main>
  );
}
