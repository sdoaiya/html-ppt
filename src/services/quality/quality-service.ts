export function runQualityChecks(input: {
  openQuestions: string[];
  pages: Array<{ title: string; hasVisual: boolean; density: 'low' | 'medium' | 'high' }>;
}) {
  const issues: string[] = [];
  if (input.openQuestions.length) issues.push('存在待确认内容');
  if (input.pages.some((page) => !page.hasVisual)) issues.push('存在缺少视觉素材的页面');
  if (input.pages.some((page) => page.density === 'high')) issues.push('存在信息密度较高页面，建议复查');
  return { issues };
}
