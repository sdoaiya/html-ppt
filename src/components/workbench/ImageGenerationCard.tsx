export function ImageGenerationCard() {
  return (
    <section className="image-generation-card">
      <h3>图片生成</h3>
      <label>
        生成模式
        <select defaultValue="generate">
          <option value="generate">文生图</option>
          <option value="edit">图生图</option>
        </select>
      </label>
      <label>
        输出尺寸
        <select aria-label="输出尺寸" defaultValue="16:9">
          <option value="16:9">16:9</option>
          <option value="1:1">1:1</option>
          <option value="9:16">9:16</option>
          <option value="2048x1152">2048x1152</option>
        </select>
      </label>
      <label>
        高清放大
        <select defaultValue="">
          <option value="">原始尺寸</option>
          <option value="2k">2K</option>
          <option value="4k">4K</option>
        </select>
      </label>
      <p>2K / 4K 是本地放大，不是重新绘制纹理细节。</p>
      <textarea aria-label="图片提示词" placeholder="描述你想生成的图像" />
      <button type="button">生成图片</button>
    </section>
  );
}
