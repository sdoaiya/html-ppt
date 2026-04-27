type Props = { title: string };

export function SourcePanel({ title }: Props) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <p>查看资料、结构树和内容块。</p>
    </section>
  );
}
