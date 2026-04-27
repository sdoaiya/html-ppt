import type { SourceAsset } from '@/domain/projects/types';

type Props = { title: string; sources?: SourceAsset[] };

export function SourcePanel({ title, sources = [] }: Props) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <p>查看资料、结构树和内容块。</p>
      <ul className="meta-list">
        {sources.map((source) => (
          <li key={source.id}>
            <strong>{source.name}</strong>
            <span>{source.kind}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
