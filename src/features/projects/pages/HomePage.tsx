import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section>
        <p>让不懂设计的人，也能把杂乱资料快速做成高质量业务资料。</p>
        <button onClick={() => navigate('/import')}>新建项目</button>
      </section>
      <ul className="quick-types">
        <li>汇报材料</li>
        <li>招商方案</li>
        <li>产品介绍</li>
        <li>长图 / 信息页</li>
      </ul>
    </main>
  );
}
