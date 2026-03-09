import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_DIR = path.join(__dirname, '../public');

// 确保 public 目录存在
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 读取数据
const dataPath = path.join(DATA_DIR, 'articles.json');
let data = { articles: [], updatedAt: new Date().toISOString(), updateCount: 0, articleCount: 0 };

if (fs.existsSync(dataPath)) {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// 生成 HTML
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>乱战 | 全球战争信息追踪</title>
  <meta name="description" content="实时抓取全球战争、冲突、军事相关新闻">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #eee;
      min-height: 100vh;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      text-align: center;
      padding: 40px 0;
      border-bottom: 2px solid #e74c3c;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 3em;
      color: #e74c3c;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      margin-bottom: 10px;
    }
    .subtitle {
      color: #aaa;
      font-size: 1.1em;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .stat-item {
      background: rgba(231, 76, 60, 0.2);
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid #e74c3c;
    }
    .stat-label { color: #aaa; font-size: 0.9em; }
    .stat-value { color: #e74c3c; font-size: 1.3em; font-weight: bold; }
    .news-list { list-style: none; }
    .news-item {
      background: rgba(255,255,255,0.05);
      border-left: 4px solid #e74c3c;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 0 8px 8px 0;
      transition: transform 0.2s, background 0.2s;
    }
    .news-item:hover {
      transform: translateX(5px);
      background: rgba(255,255,255,0.08);
    }
    .news-title {
      font-size: 1.2em;
      margin-bottom: 10px;
    }
    .news-title a {
      color: #fff;
      text-decoration: none;
      transition: color 0.2s;
    }
    .news-title a:hover { color: #e74c3c; }
    .news-meta {
      display: flex;
      gap: 15px;
      font-size: 0.85em;
      color: #888;
      flex-wrap: wrap;
    }
    .news-source {
      background: #e74c3c;
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
    }
    .news-date { color: #666; }
    .news-description {
      margin-top: 12px;
      color: #bbb;
      font-size: 0.95em;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .empty-state h2 { color: #e74c3c; margin-bottom: 10px; }
    footer {
      text-align: center;
      padding: 40px 0;
      color: #666;
      font-size: 0.9em;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 40px;
    }
    .refresh-notice {
      background: rgba(231, 76, 60, 0.1);
      border: 1px solid #e74c3c;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      font-size: 0.9em;
    }
    @media (max-width: 600px) {
      h1 { font-size: 2em; }
      .stats { gap: 15px; }
      .stat-item { padding: 8px 15px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⚔️ 乱战</h1>
      <p class="subtitle">全球战争信息追踪 | Real-time Conflict Monitor</p>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-label">新闻数量</div>
          <div class="stat-value">${data.articleCount}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">更新次数</div>
          <div class="stat-value">${data.updateCount}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最后更新</div>
          <div class="stat-value">${new Date(data.updatedAt).toLocaleString('zh-CN')}</div>
        </div>
      </div>
    </header>

    <div class="refresh-notice">
      🔄 数据每 15 分钟自动更新 | 来源：Reuters, BBC, Al Jazeera, CNN
    </div>

    ${data.articles.length > 0 ? `
      <ul class="news-list">
        ${data.articles.map(article => `
          <li class="news-item">
            <div class="news-title">
              <a href="${article.link}" target="_blank" rel="noopener">📰 ${escapeHtml(article.title)}</a>
            </div>
            <div class="news-meta">
              <span class="news-source">${escapeHtml(article.source)}</span>
              <span class="news-date">🕐 ${formatDate(article.pubDate)}</span>
            </div>
            ${article.description ? `<div class="news-description">${escapeHtml(article.description)}...</div>` : ''}
          </li>
        `).join('')}
      </ul>
    ` : `
      <div class="empty-state">
        <h2>📭 暂无新闻</h2>
        <p>数据正在收集中，请稍后刷新...</p>
      </div>
    `}

    <footer>
      <p>乱战 LuanZhan © 2026 | 数据来源：公开 RSS 源</p>
      <p>⚠️ 本网站仅供信息参考，不代表任何政治立场</p>
    </footer>
  </div>
</body>
</html>`;

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// 写入文件
const outputPath = path.join(PUBLIC_DIR, 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`✅ 网站构建完成！`);
console.log(`📁 输出：${outputPath}`);
console.log(`📊 新闻数量：${data.articleCount}`);
