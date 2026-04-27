type Props = { title: string };

export function ActionPanel({ title }: Props) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <button type="button">更高级</button>
      <button type="button">全局统一</button>
      <button type="button">检查问题页</button>
    </section>
  );
}
