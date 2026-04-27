type Props = { title: string; projectName?: string; pageTitles?: string[] };

export function PreviewCanvas({ title, projectName = '未命名资料项目', pageTitles = [] }: Props) {
  return (
    <section className="preview-canvas">
      <h3>{title}</h3>
      <article className="preview-card">
        <h4>{projectName}</h4>
        <p>稳妥版 / 强表达版将在这里预览。</p>
        <ol>
          {pageTitles.map((page) => <li key={page}>{page}</li>)}
        </ol>
      </article>
    </section>
  );
}
