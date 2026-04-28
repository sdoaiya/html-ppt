type Props = {
  title: string;
  projectName?: string;
  pageTitles?: string[];
  generatedImageUrl?: string;
};

export function PreviewCanvas({ title, projectName = '未命名资料项目', pageTitles = [], generatedImageUrl }: Props) {
  return (
    <section className="preview-canvas">
      <h3>{title}</h3>
      <article className="preview-card">
        <div className="preview-meta">
          <span className="preview-tag">当前结果预览</span>
        </div>
        <h4>{projectName}</h4>
        <p>稳妥版 / 强表达版将在这里预览。</p>
        <ol>
          {pageTitles.map((page) => <li key={page}>{page}</li>)}
        </ol>
        <section className="preview-slots">
          <div className="preview-slot">
            <h5>封面卡槽</h5>
            {generatedImageUrl ? <img className="preview-generated-image" src={generatedImageUrl} alt="页面预览" /> : <p>等待生成封面图</p>}
          </div>
          <div className="preview-slot">
            <h5>对比页卡槽</h5>
            {generatedImageUrl ? <img className="preview-generated-image" src={generatedImageUrl} alt="对比页预览" /> : <p>等待生成内容配图</p>}
          </div>
        </section>
      </article>
    </section>
  );
}
