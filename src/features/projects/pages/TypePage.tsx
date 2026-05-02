import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';
import type { DeliverableType } from '@/domain/projects/types';

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
  },
  {
    id: 'training',
    name: '培训课件',
    desc: '适合内部培训、流程教学与知识传递',
    pages: '16–28 页',
    mode: '章节 + 场景讲解',
    color: 'accent'
  },
  {
    id: 'poster',
    name: '宣传海报',
    desc: '适合活动宣传、招商海报与单屏视觉表达',
    pages: '1–3 张',
    mode: '强视觉 + 核心卖点',
    color: 'warning'
  }
] as const satisfies ReadonlyArray<{
  id: DeliverableType;
  name: string;
  desc: string;
  pages: string;
  mode: string;
  color: string;
}>;

const recommendedPlanByType: Record<DeliverableType, { skills: string; pages: string; style: string }> = {
  report: {
    skills: '封面生成 + 内容配图 + 图表生成 + 幻灯片生成',
    pages: '建议 12–18 页',
    style: '商务稳重'
  },
  pitch: {
    skills: '封面生成 + 内容配图 + 图表生成 + 幻灯片生成',
    pages: '建议 14–22 页',
    style: '招商路演'
  },
  product: {
    skills: '封面生成 + 内容配图 + 交互原型 + 幻灯片生成',
    pages: '建议 8–14 页',
    style: '产品表达'
  },
  training: {
    skills: '封面生成 + 内容配图 + 交互原型 + 幻灯片生成',
    pages: '建议 16–28 页',
    style: '教学清晰'
  },
  poster: {
    skills: '封面生成 + 内容配图 + 交互原型',
    pages: '建议 1–3 张',
    style: '视觉冲击'
  },
  infographic: {
    skills: '封面生成 + 内容配图 + 图表生成',
    pages: '建议 1 张长图',
    style: '信息密集'
  }
};

export default function TypePage() {
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.currentProject);
  const setStage = useProjectStore((state) => state.setStage);
  const setDeliverableType = useProjectStore((state) => state.setDeliverableType);
  const [selectedType, setSelectedType] = useState<DeliverableType>(project?.deliverableType ?? 'pitch');
  const selectedPlan = recommendedPlanByType[selectedType];

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 2 / 选择类型</div>
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

      <div className="card card-sm">
        <div className="card-title">推荐生成方案</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div><strong>Skill 组合：</strong>{selectedPlan.skills}</div>
          <div><strong>预计页数：</strong>{selectedPlan.pages}</div>
          <div><strong>默认风格：</strong>{selectedPlan.style}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-surface" onClick={() => navigate('/import')}>
          上一步
        </button>
        <button
          className="btn btn-accent"
          onClick={() => {
            setDeliverableType(selectedType);
            setStage('understanding');
            navigate('/understanding');
          }}
        >
          确认类型，进入理解
        </button>
      </div>
    </div>
  );
}
