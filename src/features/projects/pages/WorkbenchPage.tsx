import { ActionPanel } from '@/components/workbench/ActionPanel';
import { PreviewCanvas } from '@/components/workbench/PreviewCanvas';
import { SourcePanel } from '@/components/workbench/SourcePanel';
import { StageProgress } from '@/components/workbench/StageProgress';
import { StructurePanel } from '@/components/workbench/StructurePanel';
import { VariantSwitcher } from '@/components/workbench/VariantSwitcher';
import { buildDraftVariants } from '@/services/drafts/draft-service';

export default function WorkbenchPage() {
  const variants = buildDraftVariants(['封面', '核心结论', '方案对比']);

  return (
    <main>
      <StageProgress />
      <section className="workbench-grid">
        <aside>
          <SourcePanel title="资料区" />
          <StructurePanel />
        </aside>
        <section>
          <VariantSwitcher variants={variants} />
          <PreviewCanvas title="预览区" />
        </section>
        <aside>
          <ActionPanel title="能力区" />
        </aside>
      </section>
    </main>
  );
}
