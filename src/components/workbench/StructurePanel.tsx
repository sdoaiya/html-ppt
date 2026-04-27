import type { StructureNode } from '@/domain/projects/types';

type Props = {
  pages?: StructureNode[];
};

export function StructurePanel({ pages = [] }: Props) {
  return (
    <section className="panel">
      <h3>结构区</h3>
      <p>页面角色、内容顺序和表达方式。</p>
      <ol className="meta-list ordered">
        {pages.map((page) => (
          <li key={page.id}>
            <strong>{page.title}</strong>
            <span>{page.role}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
