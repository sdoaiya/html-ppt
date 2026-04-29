import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { classifyImportedFile, createExtractedSourceAsset } from '@/services/files/import-service';

const demoFiles = ['旧方案.pptx', '业务数据.xlsx', '产品截图.png'];

type ImportStatus = 'pending' | 'extracting' | 'done' | 'error';

interface FileItem {
  name: string;
  status: ImportStatus;
  progress: number;
  time: string;
}

const defaultSuggestions = [
  { icon: '📍', text: '建议补充一页最新区位图', sub: '建议换成 2024 园区总图。' },
  { icon: '🏢', text: '企业案例可以再增加 2 个', sub: '补一例医疗器械与一例新能源。' },
  { icon: '📋', text: '政策原文已足够', sub: '适合自动抽取亮点与条件限制。' }
];

function buildProjectName(brief: string) {
  const trimmed = brief.trim();
  if (!trimmed) return '未命名资料项目';
  return trimmed.length > 18 ? `${trimmed.slice(0, 18)}...` : trimmed;
}

export default function ImportPage() {
  const createProject = useProjectStore((state) => state.createProject);
  const setExtractedSources = useProjectStore((state) => state.setExtractedSources);
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [suggestions] = useState(defaultSuggestions);

  const handleFilePick = async () => {
    const files = await window.desktopBridge?.pickProjectFiles();
    if (files?.length) {
      setSelectedFiles(files);
      setFileItems(
        files.map((name) => ({
          name,
          status: 'pending' as ImportStatus,
          progress: 0,
          time: '刚刚'
        }))
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const brief = String(form.get('brief') ?? '整理成业务资料');
    createProject(buildProjectName(brief), brief);

    setIsExtracting(true);
    const filesToProcess = selectedFiles.length ? selectedFiles : demoFiles;

    // Simulate parsing queue for demo
    if (!selectedFiles.length) {
      setFileItems(
        demoFiles.map((name, i) => ({
          name,
          status: 'extracting' as ImportStatus,
          progress: 0,
          time: '刚刚'
        }))
      );
    }

    const run = async () => {
      try {
        const payloads = selectedFiles.length
          ? await window.desktopBridge.readProjectFiles(filesToProcess)
          : filesToProcess.map((path) => ({
              path,
              name: path,
              ext: path.split('.').pop() ?? '',
              content: '演示资料内容'
            }));

        const extractedSources = await Promise.all(
          payloads.map((payload) =>
            createExtractedSourceAsset({
              path: payload.path,
              name: payload.name,
              kind: classifyImportedFile(payload.name),
              rawContent: payload.content,
              rows: payload.rows
            })
          )
        );

        setExtractedSources(extractedSources);
        setStatusMessage(`已解析 ${extractedSources.length} 份资料`);
        setIsExtracting(false);
        navigate('/type');
      } catch {
        setIsExtracting(false);
      }
    };

    void run();
  };

  const displayFiles = fileItems.length > 0 ? fileItems : demoFiles.map((name) => ({
    name,
    status: 'done' as ImportStatus,
    progress: 100,
    time: ''
  }));

  return (
    <div className="page-wrapper">
      <div>
        <div className="page-step-label">STEP 1 / 导入资料</div>
        <h1 className="page-title">先把原始资料放进来</h1>
        <p className="page-desc">
          支持 PDF、Word、Excel、Markdown、图片与链接摘录。上传后系统会自动提取标题、摘要、数据点与可复用图片位。
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <div className="card">
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
            目标说明
            <textarea
              name="brief"
              aria-label="目标说明"
              defaultValue="整理成更高级的业务资料"
              style={{
                padding: '10px 12px',
                border: '1px solid var(--line)',
                borderRadius: 12,
                fontSize: 14,
                fontFamily: 'var(--font)',
                background: 'var(--surface2)',
                minHeight: 60,
                resize: 'vertical'
              }}
            />
          </label>
        </div>

        {/* Drop Zone */}
        <div className="import-drop-zone" onClick={handleFilePick}>
          <div className="import-drop-zone-icon">📂</div>
          <h3 className="import-drop-zone-title">拖拽资料到这里，或从本地与知识库选择</h3>
          <p className="import-drop-zone-sub">单次最多导入 18 个文件，总容量建议控制在 240MB 内。</p>
        </div>

        {/* File List */}
        {(selectedFiles.length > 0 || demoFiles.length > 0) && (
          <div className="card card-sm">
            <div className="card-title">{selectedFiles.length ? '已选择文件' : '演示资料'}</div>
            <div className="import-sources-list">
              {displayFiles.map((file) => (
                <div key={file.name} className="import-source-item">
                  <span className="import-source-name">{file.name}</span>
                  <span className="import-source-status">
                    <span className={`status-dot ${file.status === 'extracting' ? 'live' : file.status === 'done' ? 'done' : ''}`} />
                    {file.status === 'extracting' ? `解析中 ${file.progress}%` : file.status === 'done' ? '已完成' : '待处理'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="card card-sm">
            <div className="card-title">导入建议</div>
            <div className="import-suggestions">
              {suggestions.map((s, i) => (
                <div key={i} className="import-suggestion-item">
                  <span className="suggestion-icon">{s.icon}</span>
                  <div className="suggestion-text">
                    <strong>{s.text}</strong>
                    <span>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            className="btn btn-surface"
            onClick={handleFilePick}
          >
            选择本地文件
          </button>
          <button type="submit" className="btn btn-accent" disabled={isExtracting}>
            {isExtracting ? '解析中...' : '开始解析资料'}
          </button>
        </div>

        {statusMessage && (
          <p style={{ color: 'var(--success)', fontSize: 14, fontWeight: 600 }}>{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
