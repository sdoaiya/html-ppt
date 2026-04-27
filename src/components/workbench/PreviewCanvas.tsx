type Props = { title: string };

export function PreviewCanvas({ title }: Props) {
  return (
    <section className="preview-canvas">
      <h3>{title}</h3>
      <article className="preview-card">
        <p>稳妥版 / 强表达版将在这里预览。</p>
      </article>
    </section>
  );
}
