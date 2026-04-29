import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const filterTags = ['政策', '区位', '案例', '财税', '路线图'];

const skills = [
  {
    name: '内容抽取',
    desc: '识别标题层级、摘要、关键结论与适合做图的数字。',
    badge: '自动开启',
    badgeColor: 'accent',
    enabled: true
  },
  {
    name: '结构规划',
    desc: '根据招商对象和资料完整度自动生成页序与章节节奏。',
    badge: '高优先级',
    badgeColor: 'warning',
    enabled: true
  },
  {
    name: '图表与地图',
    desc: '将产业分布、案例对比、政策力度转成适合演示的图形。',
    badge: '按需启用',
    badgeColor: 'success',
    enabled: false
  },
  {
    name: '生图与视觉',
    desc: '为封面、区位图过渡页和行业氛围页补齐高质量视觉。',
    badge: '建议开启',
    badgeColor: 'violet',
    enabled: true
  }
];

const recommendedConfig = {
  pages: 16,
  charts: 7,
  images: 3
};

const densityOptions: Array<{ key: string; label: string; hint: string }> = [
  { key: 'compact', label: '高信息量', hint: '适合领导快读' },
  { key: 'balanced', label: '推荐', hint: '兼顾会议演示与阅读' },
  { key: 'spacious', label: '更偏展示', hint: '适合大屏路演' }
];

export default function ConfigPage() {
  const navigate = useNavigate();
  const setStage = useProjectStore((state) => state.setStage);
  const [filters, setFilters] = React.useState<string[]>(['政策', '区位']);
  const [density, setDensity] = React.useState('balanced');

  const toggleFilter = (tag: string) => {
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 3 / 组合 Skill</div>
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
              <span className={`chip ${skill.badgeColor}`} style={{ fontSize: 11, padding: '3px 10px' }}>
                {skill.badge}
              </span>
            </div>
            <p className="config-item-desc">{skill.desc}</p>
          </div>
        ))}
      </div>

      {/* Recommended Config */}
      <div className="recommended-config">
        <h3>推荐配置 · 招商方案</h3>
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
          当前会优先保留：产业趋势、园区条件、案例证明、政策支持与落地路径。
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

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/type')}>
          上一步
        </button>
        <button
          className="btn btn-accent"
          onClick={() => {
            setStage('workbench');
            navigate('/workbench');
          }}
        >
          确认配置，进入预览
        </button>
      </div>
    </div>
  );
}
