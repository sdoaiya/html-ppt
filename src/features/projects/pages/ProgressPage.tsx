import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

type StepStatus = 'pending' | 'running' | 'done' | 'error';

type ProgressStep = {
  id: string;
  label: string;
  status: StepStatus;
};

const baseSteps: ProgressStep[] = [
  { id: 'analyze', label: '分析资料结构', status: 'pending' },
  { id: 'content', label: '生成页面内容', status: 'pending' },
  { id: 'image', label: '生成配图（image2）', status: 'pending' },
  { id: 'assemble', label: '组装成品预览', status: 'pending' }
];

export default function ProgressPage() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<ProgressStep[]>(() =>
    baseSteps.map((step, idx) => ({ ...step, status: idx === 0 ? 'running' : 'pending' }))
  );

  const [hasError, setHasError] = useState(false);
  const [injectedImageError, setInjectedImageError] = useState(false);

  const currentIndex = useMemo(() => steps.findIndex((s) => s.status === 'running'), [steps]);
  const doneCount = useMemo(() => steps.filter((s) => s.status === 'done').length, [steps]);
  const progressPercent = Math.round((doneCount / steps.length) * 100);

  const runNext = () => {
    if (hasError) return;
    const runningIndex = steps.findIndex((s) => s.status === 'running');
    if (runningIndex < 0) return;

    const isImageStep = steps[runningIndex].id === 'image';

    // 演示：在图片生成步骤触发一次可重试错误
    if (isImageStep && !injectedImageError) {
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === runningIndex ? { ...s, status: 'error' } : s
        )
      );
      setHasError(true);
      setInjectedImageError(true);
      return;
    }

    setSteps((prev) => {
      const next = prev.map((s) => ({ ...s }));
      next[runningIndex].status = 'done';
      if (runningIndex + 1 < next.length) {
        next[runningIndex + 1].status = 'running';
      }
      return next;
    });
  };

  const retryCurrent = () => {
    const errorIndex = steps.findIndex((s) => s.status === 'error');
    if (errorIndex < 0) return;
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === errorIndex ? { ...s, status: 'running' } : s
      )
    );
    setHasError(false);
  };

  const canContinue = doneCount === steps.length;
  const currentLabel =
    steps.find((s) => s.status === 'running')?.label ??
    (hasError ? '生成流程已中断' : '已完成所有步骤');

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 5 / 生成进度</div>
        <h1 className="page-title">系统正在生成资料草稿</h1>
        <p className="page-desc">这里会展示生成流程进度（分析资料、组织内容、生成配图、组装预览）。</p>
      </div>

      <div className="card card-sm">
        <div className="card-title">当前状态</div>
        <p className="text-muted">总进度：{progressPercent}% · 当前步骤：{currentLabel}</p>
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 10,
                background: 'var(--surface2)'
              }}
            >
              <span>{index + 1}. {step.label}</span>
              <strong>
                {step.status === 'pending' && '等待中'}
                {step.status === 'running' && '进行中'}
                {step.status === 'done' && '已完成'}
                {step.status === 'error' && '失败'}
              </strong>
            </div>
          ))}
        </div>
        {hasError ? (
          <p style={{ color: 'var(--warning)', marginTop: 10 }}>
            图片生成步骤失败，可点击“重试当前步骤”。
          </p>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/config')}>
          上一步
        </button>
        {hasError ? (
          <button className="btn btn-surface" onClick={retryCurrent}>
            重试当前步骤
          </button>
        ) : (
          <button className="btn btn-surface" onClick={runNext} disabled={canContinue}>
            {canContinue ? '已全部完成' : '推进下一步'}
          </button>
        )}
        <button className="btn btn-accent" onClick={() => navigate('/workbench')} disabled={!canContinue}>
          生成完成，进入工作台
        </button>
      </div>
    </div>
  );
}
