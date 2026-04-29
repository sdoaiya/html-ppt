import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';
import { createImageProvider } from '@/services/ai/image-provider';
import { autoBuildPagePrompt } from '@/services/ai/prompt-builder';
import { buildDraftVariants } from '@/services/drafts/draft-service';

type PreviewMode = 'outline' | 'layout' | 'assets';
type Density = 'compact' | 'balanced' | 'spacious';

const recentActivities = [
  { time: '刚刚', text: '系统补齐了 2 张区位关系图' },
  { time: '3 分钟前', text: '图表生成器重写了产业对比页' },
  { time: '11 分钟前', text: '你手动确认了招商方案模板' },
  { time: '昨天 18:42', text: '新增了 1 份政策材料' }
];

const outlineItems = [
  { num: '01', title: '封面', desc: '一句主张 + 氛围图' },
  { num: '02', title: '产业趋势', desc: '区域赛道与增长数据' },
  { num: '03', title: '园区条件', desc: '区位、交通、厂房与配套' },
  { num: '04', title: '案例证明', desc: '企业落地前后对比' },
  { num: '05', title: '政策支持', desc: '税收、补贴、服务流程' },
  { num: '06', title: '联系与落地', desc: '闭环 CTA' }
];

const layoutItems = [
  { title: '开场', desc: '大图 + 大结论' },
  { title: '数据页', desc: '左右对比与 KPI 模块' },
  { title: '案例页', desc: '图文混排' },
  { title: '地图页', desc: '整页视觉锚点' },
  { title: '政策页', desc: '列表 + 图标节奏' },
  { title: '收尾页', desc: '联系卡 + 行动' }
];

const assetItems = [
  { title: '封面气氛图', desc: '1 张 · 16:9' },
  { title: '园区区位图', desc: '1 张 · 带路径叠加' },
  { title: '对比柱图', desc: '2 个 · 自动生成' },
  { title: '企业案例图', desc: '2 张 · 来源资料' },
  { title: '政策信息图', desc: '1 张 · 关键力度' },
  { title: '尾页背景', desc: '1 张 · 低干扰' }
];

export default function WorkbenchPage() {
  const project = useProjectStore((state) => state.currentProject);
  const setVariants = useProjectStore((state) => state.setVariants);
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState<PreviewMode>('outline');
  const [density, setDensity] = useState<Density>('balanced');
  const [showEmpty, setShowEmpty] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [promptVersion, setPromptVersion] = useState(0);
  const [imageConfig, setImageConfig] = useState({
    baseUrl: 'https://free.codesonline.dev/v1',
    apiKey: '',
    model: 'gpt-image-2' as const,
    responseFormat: 'url' as const
  });

  const pageTitles = project?.structure.length
    ? project.structure.map((p) => p.title)
    : ['封面', '核心结论', '方案对比'];
  const variants = buildDraftVariants(pageTitles);

  const autoPrompt =
    project && project.structure.length > 0
      ? autoBuildPagePrompt(project.brief, project.structure[0].title, project.structure[0].role)
      : '商业汇报资料「封面」，主题整理成更高级的业务资料';

  const handleRefreshPrompt = () => setPromptVersion((v) => v + 1);
  const handleCheckIssues = () => navigate('/export');

  const handleGenerateImage = async (input: {
    mode: 'generate' | 'edit';
    prompt: string;
    size: string;
    upscale?: '2k' | '4k';
  }) => {
    if (!imageConfig.apiKey) return null;
    const provider = createImageProvider(fetch, imageConfig);
    if (input.mode === 'edit') return null;
    const result = await provider.generate({
      prompt: input.prompt,
      size: input.size,
      upscale: input.upscale,
      n: 1
    });
    const url = (result?.data as Array<{ url?: string }>)?.[0]?.url ?? null;
    if (url) setGeneratedImageUrl(url);
    return url;
  };

  const previewItems =
    previewMode === 'outline'
      ? outlineItems
      : previewMode === 'layout'
      ? layoutItems
      : assetItems;

  return (
    <div className="workbench-wrapper">
      {/* Topbar */}
      <div className="workbench-topbar">
        <div className="workbench-topbar-left">
          <div className="workbench-preview-modes">
            {(['outline', 'layout', 'assets'] as PreviewMode[]).map((mode) => (
              <button
                key={mode}
                className={`preview-mode-btn ${previewMode === mode ? 'active' : ''}`}
                onClick={() => setPreviewMode(mode)}
              >
                {mode === 'outline' ? '章节大纲' : mode === 'layout' ? '版式建议' : '图像与图表'}
              </button>
            ))}
          </div>
          <div className="segmented">
            {(['compact', 'balanced', 'spacious'] as Density[]).map((d) => (
              <button
                key={d}
                className={`segmented-item ${density === d ? 'active' : ''}`}
                onClick={() => setDensity(d)}
              >
                {d === 'compact' ? '紧凑' : d === 'balanced' ? '均衡' : '舒展'}
              </button>
            ))}
          </div>
        </div>
        <div className="workbench-topbar-right">
          <button className="btn btn-surface" style={{ fontSize: 13, padding: '8px 14px' }}>
            {showEmpty ? '显示内容' : '查看空状态'}
          </button>
          <button className="btn btn-accent" onClick={handleCheckIssues}>
            进入导出
          </button>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="workbench-grid">
        {/* Left: Sources + Structure */}
        <div className="workbench-sidebar">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">资料区</span>
            </div>
            {(project?.sources ?? []).length === 0 ? (
              <div className="empty-state" style={{ padding: '16px 0' }}>
                <span>暂无导入资料</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {project?.sources.map((s) => (
                  <div key={s.id} className="source-item">
                    <span className="source-item-name">{s.name}</span>
                    <span className="source-item-meta">
                      {s.extractSummary ?? s.kind}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">结构区</span>
            </div>
            <div className="page-list">
              {(project?.structure ?? []).length === 0
                ? outlineItems.map((item) => (
                    <div key={item.num} className="page-list-item">
                      <span className="page-list-item-num">{item.num}</span>
                      <span className="page-list-item-title">{item.title}</span>
                    </div>
                  ))
                : project?.structure.map((page, i) => (
                    <div key={page.id} className="page-list-item">
                      <span className="page-list-item-num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="page-list-item-title">{page.title}</span>
                      <span className="page-list-item-role">{page.role}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">最近活动</span>
            </div>
            <div className="activity-list">
              {recentActivities.map((a, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-time">{a.time}</span>
                  <span className="activity-text">{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Preview Canvas */}
        <div className="workbench-center">
          <div className="preview-canvas-panel">
            <div className="preview-canvas-header">
              <span className="preview-canvas-title">
                {project?.name ?? '当前项目'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-surface" style={{ fontSize: 12, padding: '6px 12px' }}>
                  稳妥版
                </button>
                <button className="btn btn-surface" style={{ fontSize: 12, padding: '6px 12px' }}>
                  强表达版
                </button>
              </div>
            </div>
            <div className="preview-canvas-body">
              {showEmpty ? (
                <div className="empty-state">
                  <div className="empty-state-icon">⌘</div>
                  <strong>当前筛选下没有可预览内容</strong>
                  <p>你把所有高优先级模块都临时隐藏了。恢复默认配置后，系统会重新显示推荐页序和图像清单。</p>
                  <button className="btn btn-accent" onClick={() => setShowEmpty(false)}>
                    恢复推荐内容
                  </button>
                </div>
              ) : (
                <>
                  <div className="preview-page-card">
                    <div className="preview-page-tag">封面页面</div>
                    <div className="preview-page-title">
                      {project?.brief ?? '整理成更高级的业务资料'}
                    </div>
                    <div className="preview-page-desc">
                      封面保持大图与一句完整结论，不在这里堆满材料细节。
                    </div>
                    {generatedImageUrl && (
                      <img
                        src={generatedImageUrl}
                        alt="封面图"
                        style={{ maxWidth: '100%', borderRadius: 12, marginTop: 8 }}
                      />
                    )}
                  </div>

                  <div className="preview-page-card">
                    <div className="preview-page-tag">
                      {previewMode === 'outline' ? '推荐页序' : previewMode === 'layout' ? '版式节奏' : '图像与图表清单'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {previewItems.map((item: { num?: string; title: string; desc: string }, i: number) => (
                        <div
                          key={i}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '28px 1fr',
                            gap: 8,
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'var(--surface2)',
                            borderRadius: 12,
                            fontSize: 13
                          }}
                        >
                          {item.num && (
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)' }}>
                              {item.num}
                            </span>
                          )}
                          <div>
                            <strong style={{ fontWeight: 600, color: 'var(--text)' }}>{item.title}</strong>
                            <span style={{ color: 'var(--muted)', marginLeft: 6, fontSize: 12 }}>{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions + Status */}
        <div className="workbench-right">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">内容与视觉</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-surface" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                更高级 ↗
              </button>
              <button className="btn btn-surface" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                全局统一
              </button>
              <button className="btn btn-surface" style={{ justifyContent: 'flex-start', fontSize: 13 }} onClick={handleCheckIssues}>
                检查问题页
              </button>
            </div>
          </div>

          {/* Image Generation */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">图片生成</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                  生成模式
                </label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font)', background: 'var(--surface)' }}>
                  <option>文生图</option>
                  <option>图生图</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                  输出尺寸
                </label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font)', background: 'var(--surface)' }}>
                  <option>16:9</option>
                  <option>1:1</option>
                  <option>9:16</option>
                  <option>2048x1152</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                  高清放大
                </label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontFamily: 'var(--font)', background: 'var(--surface)' }}>
                  <option>原始尺寸</option>
                  <option>2K</option>
                  <option>4K</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                  图片提示词
                </label>
                <textarea
                  aria-label="图片提示词"
                  defaultValue={autoPrompt}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    fontSize: 12,
                    fontFamily: 'var(--font)',
                    background: 'var(--surface2)',
                    minHeight: 70,
                    resize: 'vertical'
                  }}
                />
              </div>
              <button
                className="btn btn-accent"
                style={{ width: '100%' }}
                onClick={() =>
                  handleGenerateImage({ mode: 'generate', prompt: autoPrompt, size: '16:9' })
                }
              >
                生成图片
              </button>
              {imageConfig.apiKey ? (
                <p style={{ fontSize: 11, color: 'var(--success)', margin: 0 }}>图片服务已连接</p>
              ) : (
                <p style={{ fontSize: 11, color: 'var(--warning)', margin: 0 }}>请先到设置页配置 API Key</p>
              )}
            </div>
          </div>

          {/* Status & Save */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">状态与保存</span>
            </div>
            <button
              className="btn btn-surface"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={() => {
                setVariants(variants);
                setSaveMessage(`已保存 ${variants.length} 个版本`);
              }}
            >
              保存当前版本
            </button>
            {saveMessage && (
              <p style={{ fontSize: 12, color: 'var(--success)', margin: 0 }}>{saveMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
