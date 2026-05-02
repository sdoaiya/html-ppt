import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';
import type { DeliverableType } from '@/domain/projects/types';

const filterTags = ['政策', '区位', '案例', '财税', '路线图'];

const defaultSkills = [
  {
    key: 'cover',
    name: '内容抽取',
    desc: '识别标题层级、摘要、关键结论与适合做图的数字。',
    badge: '自动开启',
    badgeColor: 'accent',
    enabled: true
  },
  {
    key: 'structure',
    name: '结构规划',
    desc: '根据招商对象和资料完整度自动生成页序与章节节奏。',
    badge: '高优先级',
    badgeColor: 'warning',
    enabled: true
  },
  {
    key: 'chart',
    name: '图表与地图',
    desc: '将产业分布、案例对比、政策力度转成适合演示的图形。',
    badge: '按需启用',
    badgeColor: 'success',
    enabled: false
  },
  {
    key: 'image',
    name: '生图与视觉',
    desc: '为封面、区位图过渡页和行业氛围页补齐高质量视觉。',
    badge: '建议开启',
    badgeColor: 'violet',
    enabled: true
  }
] as const;

const recommendedConfigByType: Record<DeliverableType, { title: string; pages: number; charts: number; images: number; focus: string }> = {
  report: { title: '汇报材料', pages: 14, charts: 8, images: 3, focus: '重点强化结论、指标趋势和阶段进展。' },
  pitch: { title: '招商方案', pages: 16, charts: 7, images: 3, focus: '优先保留产业趋势、园区条件、案例证明、政策支持。' },
  product: { title: '产品介绍', pages: 12, charts: 4, images: 4, focus: '突出核心卖点、场景价值与方案闭环。' },
  training: { title: '培训课件', pages: 20, charts: 3, images: 4, focus: '强化章节节奏、步骤讲解与复盘页。' },
  poster: { title: '宣传海报', pages: 2, charts: 1, images: 5, focus: '强调视觉冲击和单屏关键信息。' },
  infographic: { title: '信息长图', pages: 1, charts: 6, images: 3, focus: '强化连续叙事与数据可视化表达。' }
};

type SkillToggleKey = (typeof defaultSkills)[number]['key'];

const densityOptions: Array<{ key: string; label: string; hint: string }> = [
  { key: 'compact', label: '高信息量', hint: '适合领导快读' },
  { key: 'balanced', label: '推荐', hint: '兼顾会议演示与阅读' },
  { key: 'spacious', label: '更偏展示', hint: '适合大屏路演' }
];

export default function ConfigPage() {
  const navigate = useNavigate();
  const setStage = useProjectStore((state) => state.setStage);
  const project = useProjectStore((state) => state.currentProject);
  const [filters, setFilters] = React.useState<string[]>(['政策', '区位']);
  const [density, setDensity] = React.useState('balanced');
  const [skills, setSkills] = useState(defaultSkills);
  const [targetPages, setTargetPages] = useState(16);
  const [style, setStyle] = useState('商务稳重');
  const [autoImage, setAutoImage] = useState(true);
  const [imageQuality, setImageQuality] = useState<'standard' | 'hd'>('standard');

  const deliverableType = project?.deliverableType ?? 'pitch';
  const recommendedConfig = recommendedConfigByType[deliverableType];

  React.useEffect(() => {
    setTargetPages(recommendedConfig.pages);
    setStyle(deliverableType === 'poster' ? '视觉冲击' : '商务稳重');
  }, [deliverableType, recommendedConfig.pages]);

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSkill = (key: SkillToggleKey) => {
    setSkills((prev) => prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
  };

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 4 / 配置方案</div>
        <h1 className="page-title">把底层能力翻译成你听得懂的组合配置</h1>
        <p className="page-desc">
          系统自动决定内容抽取、结构规划、图表生成、图片生成和导出格式。
        </p>
      </div>

      {/* Filter Tags */}
      <div className="card card-sm">
        <div className="card-title">内容筛选标签</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filterTags.map((tag) => (
            <button
              key={tag}
              className={`chip ${filters.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Items */}
      <div className="config-grid">
        {skills.map((skill) => (
          <div key={skill.name} className="config-item">
            <div className="config-item-header">
              <span className="config-item-name">{skill.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`chip ${skill.badgeColor}`} style={{ fontSize: 11, padding: '3px 10px' }}>
                  {skill.badge}
                </span>
                <button
                  type="button"
                  className={`chip ${skill.enabled ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill.key)}
                >
                  {skill.enabled ? '已开启' : '已关闭'}
                </button>
              </div>
            </div>
            <p className="config-item-desc">{skill.desc}</p>
          </div>
        ))}
      </div>

      {/* Recommended Config */}
      <div className="recommended-config">
        <h3>推荐配置 · {recommendedConfig.title}</h3>
        <div className="recommended-meta">
          <div className="recommended-meta-item">
            <label>页数</label>
            <span>{recommendedConfig.pages} 页</span>
          </div>
          <div className="recommended-meta-item">
            <label>图表</label>
            <span>{recommendedConfig.charts} 个</span>
          </div>
          <div className="recommended-meta-item">
            <label>生图</label>
            <span>{recommendedConfig.images} 张</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
          {recommendedConfig.focus}
        </p>
      </div>

      {/* Output Density */}
      <div className="card card-sm">
        <div className="card-title">输出密度</div>
        <div className="segmented" style={{ marginBottom: 10 }}>
          {densityOptions.map((opt) => (
            <button
              key={opt.key}
              className={`segmented-item ${density === opt.key ? 'active' : ''}`}
              onClick={() => setDensity(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-muted">{densityOptions.find((o) => o.key === density)?.hint}</p>
      </div>

      <div className="card card-sm">
        <div className="card-title">关键参数</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="text-muted">目标页数</span>
            <input
              type="number"
              min={1}
              value={targetPages}
              onChange={(e) => setTargetPages(Number(e.target.value) || 1)}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="text-muted">风格倾向</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)' }}
            >
              <option>商务稳重</option>
              <option>简约清晰</option>
              <option>创意表达</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className={`chip ${autoImage ? 'active' : ''}`} onClick={() => setAutoImage((v) => !v)}>
              图片自动生成 {autoImage ? '开启' : '关闭'}
            </button>
            <select
              value={imageQuality}
              onChange={(e) => setImageQuality(e.target.value as 'standard' | 'hd')}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)' }}
            >
              <option value="standard">标准</option>
              <option value="hd">高清</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/type')}>
          上一步
        </button>
        <button
          className="btn btn-accent"
          onClick={() => {
            setStage('workbench');
            navigate('/progress');
          }}
        >
          确认配置，开始生成
        </button>
      </div>
    </div>
  );
}
