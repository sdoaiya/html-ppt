type Props = { title: string; projectName?: string; pageTitles?: string[]; generatedImageUrl?: string };

export function PreviewCanvas({ title, projectName = '未命名资料项目', pageTitles = [], generatedImageUrl }: Props) {
  return (
    <section className="preview-canvas">
      <h3>{title}</h3>
      <article className="preview-card">
        <h4>{projectName}</h4>
        <p>稳妥版 / 强表达版将在这里预览。</p>
        <ol>
          {pageTitles.map((page) => <li key={page}>{page}</li>)}
        </ol>
        {generatedImageUrl ? (
          <img className="preview-generated-image" src={generatedImageUrl} alt="页面预览" />
        ) : null}
      </article>
    </section>
  );
}
