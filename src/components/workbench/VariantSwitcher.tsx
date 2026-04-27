import type { DraftVariant } from '@/services/drafts/draft-service';

type Props = {
  variants?: DraftVariant[];
};

export function VariantSwitcher({ variants = [] }: Props) {
  return (
    <div className="variant-switcher">
      {(variants.length ? variants : [
        { id: 'stable', label: '稳妥版' },
        { id: 'expressive', label: '强表达版' }
      ]).map((variant) => (
        <button key={variant.id} type="button">{variant.label}</button>
      ))}
    </div>
  );
}
