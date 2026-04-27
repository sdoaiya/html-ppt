export function buildImagePrompt(input: { purpose: string; tone: string; constraints?: string[] }) {
  const constraints = input.constraints?.length ? ` 约束：${input.constraints.join('；')}` : '';
  return `${input.purpose}，视觉基调：${input.tone}.${constraints}`;
}
