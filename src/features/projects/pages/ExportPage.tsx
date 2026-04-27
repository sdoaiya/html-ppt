import { runQualityChecks } from '@/services/quality/quality-service';

export default function ExportPage() {
  const result = runQualityChecks({
    openQuestions: ['封面品牌名待确认'],
    pages: [
      { title: '封面', hasVisual: false, density: 'medium' },
      { title: '方案对比', hasVisual: true, density: 'high' }
    ]
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
      </section>
    </main>
  );
}
