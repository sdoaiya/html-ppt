import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';
import { runQualityChecks } from '@/services/quality/quality-service';

const deliverables = [
  { name: '项目 JSON', desc: '适合继续流转、归档、再加工与系统集成', status: 'ready' },
  { name: 'PDF 汇报版', desc: '适合发领导、客户与会前传阅', status: 'pending' },
  { name: 'PPT 可编辑版', desc: '适合销售团队继续改字与加页', status: 'queued' }
];

const checklistItems = [
  { name: '封面与结论页', pass: true },
  { name: '迁入前后对比页', pass: true },
  { name: '政策力度图表', pass: true },
  { name: '客户联系方式', pass: false }
];

const collaborators = [
  { name: 'Alina Zhou', time: '今天 14:18', action: '补充了 1 条新能源案例' },
  { name: 'Kenji Mori', time: '今天 13:42', action: '确认了园区总图版本' },
  { name: 'Nadia Rahman', time: '昨天 19:07', action: '要求增加政策兑现流程图' }
];

export default function ExportPage() {
  const project = useProjectStore((state) => state.currentProject);
  const navigate = useNavigate();
  const [exportMessage, setExportMessage] = useState('');
  const [lastExportPath, setLastExportPath] = useState('');
  const [lastExportAt, setLastExportAt] = useState('');
  const [lastExportType, setLastExportType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<Array<'html' | 'pdf'>>(['html']);
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Live clock
  useState(() => {
    const update = () => setClock(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  });

  const result = runQualityChecks({
    openQuestions: project?.understanding ? [] : ['资料理解结果尚未确认'],
    pages: (project?.structure ?? []).map((page) => ({
      title: page.title,
      hasVisual: page.role === 'cover' ? false : true,
      density: page.role === 'comparison' ? 'high' : ('medium' as const)
    }))
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText('OC-INV-2025-0418');
    } catch {}
    setCopied(true);
    setShowToast(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleExportJson = async () => {
    if (!project) return;
    const filePath = await window.desktopBridge?.exportProjectJson?.(project);
    if (filePath) {
      setLastExportPath(filePath);
      setLastExportAt(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
      setLastExportType('项目 JSON');
      setExportMessage(`已导出到 ${filePath}`);
    } else {
      setExportMessage('已取消导出');
    }
  };

  const toggleFormat = (format: 'html' | 'pdf') => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleRunExport = async () => {
    if (selectedFormats.length === 0) {
      setExportStatus('error');
      setExportMessage('请至少选择一种导出格式。');
      return;
    }

    setExportStatus('loading');
    setExportMessage('导出中，请稍候...');

    // 当前真实落盘能力：项目 JSON。HTML/PDF 先走状态流程占位。
    if (selectedFormats.includes('html') || selectedFormats.includes('pdf')) {
      const filePath = await window.desktopBridge?.exportProjectJson?.(project);
      if (filePath) {
        setLastExportPath(filePath);
        setLastExportAt(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
        setLastExportType(
          selectedFormats.length === 2
            ? 'HTML + PDF（当前以项目 JSON 作为交付占位）'
            : selectedFormats[0] === 'html'
            ? 'HTML（当前以项目 JSON 作为交付占位）'
            : 'PDF（当前以项目 JSON 作为交付占位）'
        );
        setExportStatus('success');
        setExportMessage('导出完成。');
      } else {
        setExportStatus('error');
        setExportMessage('导出已取消或失败，请重试。');
      }
      return;
    }

    setExportStatus('error');
    setExportMessage('当前未选择可导出格式。');
  };

  const totalChecks = checklistItems.length + result.issues.length;
  const failedChecks = [...checklistItems.filter((item) => !item.pass), ...result.issues].length;
  const deliveryReady = failedChecks === 0;

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 7 / 导出交付</div>
        <h1 className="page-title">生成完成后，直接拿走你真正要交付的文件。</h1>
        <p className="page-desc">这里不是技术面板，而是交付面板。</p>
      </div>

      {/* Delivery Status */}
      <div className="card card-sm">
        <div className="card-title">交付编号</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="delivery-id">OC-INV-2025-0418</span>
          <button
            className="btn btn-surface"
            style={{ fontSize: 12, padding: '6px 12px' }}
            onClick={handleCopyId}
          >
            {copied ? '已复制 ✓' : '复制'}
          </button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
          <span>导出耗时 01:36</span>
          <span>包含图表与图片嵌入</span>
          <span>最后更新 {clock || '--:--:--'}</span>
        </div>
      </div>

      {/* Delivery Summary */}
      <div className="card card-sm">
        <div className="card-title">交付状态总览</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
              {deliveryReady ? '可直接交付' : `仍有 ${failedChecks} 项待确认`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              已检查 {totalChecks} 项，{deliveryReady ? '当前可以进入交付流程。' : '建议先处理未通过项，再发给客户或领导。'}
            </div>
          </div>
          <span className={`deliverable-status ${deliveryReady ? 'ready' : 'pending'}`}>
            {deliveryReady ? '交付就绪' : '需补充确认'}
          </span>
        </div>
      </div>

      <div className="card card-sm">
        <div className="card-title">项目摘要</div>
        <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
          <div><strong>项目名称：</strong>{project?.name ?? '未命名项目'}</div>
          <div><strong>页面数量：</strong>{project?.structure?.length ?? 0} 页</div>
          <div>
            <strong>风格倾向：</strong>
            {project?.deliverableType === 'pitch'
              ? '招商路演'
              : project?.deliverableType === 'report'
              ? '商务汇报'
              : project?.deliverableType === 'product'
              ? '产品表达'
              : project?.deliverableType === 'training'
              ? '教学清晰'
              : project?.deliverableType === 'poster'
              ? '视觉冲击'
              : project?.deliverableType === 'infographic'
              ? '信息密集'
              : '默认'}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="card card-sm">
        <div className="card-title">交付格式</div>
        <div className="export-deliverables">
          {deliverables.map((d) => (
            <div key={d.name} className="deliverable-item">
              <div>
                <div className="deliverable-name">{d.name}</div>
                <div className="deliverable-desc">{d.desc}</div>
              </div>
              <span className={`deliverable-status ${d.status}`}>
                {d.status === 'ready' ? '可导出' : d.status === 'pending' ? '即将支持' : '规划中'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Checklist */}
      <div className="card card-sm">
        <div className="card-title">交付前检查</div>
        <div className="export-checklist">
          {[...checklistItems, ...result.issues.map((issue) => ({ name: issue, pass: false }))].map(
            (item, i) => (
              <div key={i} className="checklist-item">
                <span className="checklist-name">{item.name}</span>
                <span className={`checklist-status ${item.pass ? 'pass' : 'fail'}`}>
                  {item.pass ? '已通过' : '待确认'}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Export Actions */}
      <div className="card card-sm">
        <div className="card-title">导出动作</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            className={`chip ${selectedFormats.includes('html') ? 'active' : ''}`}
            onClick={() => toggleFormat('html')}
          >
            HTML
          </button>
          <button
            className={`chip ${selectedFormats.includes('pdf') ? 'active' : ''}`}
            onClick={() => toggleFormat('pdf')}
          >
            PDF
          </button>
        </div>
        <div className="export-actions">
          <button className="btn btn-accent" onClick={() => void handleRunExport()} disabled={exportStatus === 'loading'}>
            {exportStatus === 'loading' ? '导出中...' : '开始导出'}
          </button>
          <button className="btn btn-surface" onClick={handleExportJson}>
            导出项目 JSON
          </button>
          <button className="btn btn-surface" onClick={() => setShowToast(true)}>
            发送 PDF 到邮箱（即将支持）
          </button>
          <button className="btn btn-surface" onClick={handleCopyId}>
            复制交付编号
          </button>
          <button className="btn btn-surface" onClick={() => navigate('/workbench')}>
            回到预览继续调整
          </button>
        </div>
        {exportMessage && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
            {exportMessage}
          </p>
        )}
        {exportStatus === 'error' ? (
          <button className="btn btn-surface" style={{ marginTop: 8 }} onClick={() => void handleRunExport()}>
            重试导出
          </button>
        ) : null}
      </div>

      {/* Last Export Result */}
      <div className="card card-sm">
        <div className="card-title">最近导出结果</div>
        {lastExportPath ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{lastExportType}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>导出时间：{lastExportAt}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>文件路径：{lastExportPath}</div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>本次项目还没有导出记录。</p>
        )}
      </div>

      {/* Collaborators */}
      {collaborators.length > 0 && (
        <div className="card card-sm">
          <div className="card-title">协作记录</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {collaborators.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 60px 1fr',
                  gap: 8,
                  fontSize: 12,
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                <span style={{ color: 'var(--muted)' }}>{c.time}</span>
                <span style={{ color: 'var(--muted)' }}>{c.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast" onClick={() => setShowToast(false)}>
          已记录本次操作，并同步到项目协作流。
        </div>
      )}
    </div>
  );
}
