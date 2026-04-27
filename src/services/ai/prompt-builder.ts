const roleToneMap: Record<string, string> = {
  cover: '大气稳重、现代商务风格、专业质感、深蓝色与金色点缀',
  conclusion: '简洁清晰、数据可视化、图表风格、高可读性',
  background: '冷静客观、深色调、商务数据氛围',
  comparison: '对比清晰、左右分栏、视觉冲击力强',
  process: '流程图风格、箭头导向、步骤清晰、简约高效',
  data: '信息图表风格、干净素雅、数据可视化冲击',
  proof: '专业背书、真实质感、权威稳重',
  closing: '温暖有力、行动导向、鼓舞人心'
};

export function buildImagePrompt(input: { purpose: string; tone: string; constraints?: string[] }) {
  const constraints = input.constraints?.length ? ` 约束：${input.constraints.join('；')}` : '';
  return `${input.purpose}，视觉基调：${input.tone}.${constraints}`;
}

export function autoBuildPagePrompt(brief: string, pageTitle: string, role: string): string {
  const toneTag = roleToneMap[role] ?? '现代商务风格、专业质感';
  return `商业汇报资料「${pageTitle}」，主题${brief}，视觉基调：${toneTag}，16:9宽屏比例，文字排版干净留白充裕`;
}
