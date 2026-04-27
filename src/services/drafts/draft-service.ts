export type DraftVariant = {
  id: 'stable' | 'expressive';
  label: string;
  pages: Array<{ title: string; tone: 'clear' | 'bold'; density: 'medium' | 'high' }>;
};

export function buildDraftVariants(pageTitles: string[]): DraftVariant[] {
  return [
    {
      id: 'stable',
      label: '稳妥版',
      pages: pageTitles.map((title) => ({ title, tone: 'clear', density: 'medium' }))
    },
    {
      id: 'expressive',
      label: '强表达版',
      pages: pageTitles.map((title) => ({ title, tone: 'bold', density: 'high' }))
    }
  ];
}
