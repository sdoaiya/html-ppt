import { useNavigate } from 'react-router-dom';

export default function PreviewTweakPage() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 6 / 预览微调</div>
        <h1 className="page-title">成品预览与自然语言微调</h1>
        <p className="page-desc">占位版：后续会补充组件选中、高亮、自然语言修改与历史回退。</p>
      </div>

      <div className="card card-sm">
        <div className="card-title">微调入口</div>
        <p className="text-muted">当前先通过工作台进行预览，下一步将把微调能力独立到本页。</p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/workbench')}>
          返回工作台
        </button>
        <button className="btn btn-accent" onClick={() => navigate('/export')}>
          确认成品，进入导出
        </button>
      </div>
    </div>
  );
}
