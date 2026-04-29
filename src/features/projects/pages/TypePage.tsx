import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';

const deliverableTypes = [
  {
    id: 'report',
    name: '汇报材料',
    desc: '适合季度复盘、业务进展汇报',
    pages: '12–18 页',
    mode: '图表 + 章节型',
    color: 'accent'
  },
  {
    id: 'pitch',
    name: '招商方案',
    desc: '适合园区推介、产业落地方案',
    pages: '14–22 页',
    mode: '大图 + 数据证据',
    color: 'warning'
  },
  {
    id: 'product',
    name: '产品介绍',
    desc: '适合解决方案、产品卖点表达',
    pages: '8–14 页',
    mode: '卖点 + 场景化',
    color: 'success'
  },
  {
    id: 'infographic',
    name: '信息长图',
    desc: '适合公众号长图、单页信息展示',
    pages: '1 张长图',
    mode: '连续滚动阅读',
    color: 'violet'
  }
];

export default function TypePage() {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.currentProject);
  const setStage = useProjectStore((state) => state.setStage);
  const [selectedType, setSelectedType] = useState<string>('pitch');

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 2 / 理解主题</div>
        <h1 className="page-title">先确定你想生成什么</h1>
        <p className="page-desc">
          你不需要知道 Skill 名称，只需选择最终成品类型，系统会自动匹配最合适的结构。
        </p>
      </div>

      <div className="type-grid">
        {deliverableTypes.map((type, idx) => {
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              className={`type-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="type-card-header">
                <span className="type-card-num">{idx + 1}</span>
                <span className="type-card-pages">{type.pages}</span>
              </div>
              <div className="type-card-name">{type.name}</div>
              <div className="type-card-desc">{type.desc}</div>
              <span className="type-card-mode">{type.mode}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/import')}>
          上一步
        </button>
        <button
          className="btn btn-accent"
          onClick={() => {
            setStage('structure');
            navigate('/config');
          }}
        >
          确认类型，继续配置
        </button>
      </div>
    </div>
  );
}
