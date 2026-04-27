const stages = ['上传资料', '理解资料', '组织结构', '选择方向', '生成版式', '导出成品'];

export function StageProgress() {
  return (
    <ol className="stage-progress">
      {stages.map((stage) => (
        <li key={stage}>{stage}</li>
      ))}
    </ol>
  );
}
