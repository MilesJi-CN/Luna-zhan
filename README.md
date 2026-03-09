# ⚔️ 乱战 LuanZhan

全球战争信息追踪网站 - 实时抓取全球冲突、军事相关新闻

## 🌐 在线演示

部署后可访问：https://luan-zhan.pages.dev

## ✨ 功能特点

- 🔄 **自动更新** - 每 15 分钟自动抓取最新新闻
- 📰 **多源聚合** - Reuters、BBC、Al Jazeera、CNN 等权威媒体
- 🔍 **智能过滤** - 自动筛选战争、冲突、军事相关内容
- 🎨 **响应式设计** - 手机、电脑都能完美浏览
- 🆓 **完全免费** - 使用 GitHub Actions + Cloudflare Pages

## 🚀 快速部署

### 1. Fork 本项目

点击 GitHub 右上角的 **Fork** 按钮

### 2. 配置 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create Application** → **Pages**
3. 选择 **Connect to Git**
4. 选择你的 `luan-zhan` 仓库
5. 设置构建配置：
   - Build command: `npm run build`
   - Build output directory: `public`
6. 点击 **Save and Deploy**

### 3. 配置 GitHub Secrets

在 GitHub 仓库的 **Settings** → **Secrets and variables** → **Actions** 中添加：

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token（需 Pages 权限）|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

#### 获取 Cloudflare API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 在 Permissions 中添加：
   - Account:Cloudflare Pages:Edit
5. 复制生成的 Token

#### 获取 Account ID

在 Cloudflare Dashboard 右侧边栏找到你的 Account ID

### 4. 启用 GitHub Actions

1. 进入仓库的 **Actions** 标签
2. 点击 **I understand my workflows, go ahead and enable them**
3. 手动触发一次 **Run workflow** 测试

## 📁 项目结构

```
luan-zhan/
├── .github/workflows/
│   └── update.yml          # GitHub Actions 定时任务
├── src/
│   ├── fetcher.js          # 新闻抓取脚本
│   └── build.js            # 网站构建脚本
├── data/
│   └── articles.json       # 抓取的新闻数据
├── public/
│   └── index.html          # 生成的静态网站
├── package.json
└── README.md
```

## 🔧 自定义配置

### 添加新闻源

编辑 `src/fetcher.js`，在 `NEWS_SOURCES` 数组中添加：

```javascript
{
  name: '你的新闻源名称',
  url: 'RSS 源地址',
  filter: ['关键词 1', '关键词 2', '关键词 3']
}
```

### 修改更新频率

编辑 `.github/workflows/update.yml`，修改 cron 表达式：

```yaml
schedule:
  - cron: '*/15 * * * *'  # 每 15 分钟
  # - cron: '0 * * * *'   # 每小时
  # - cron: '0 0 * * *'   # 每天
```

### 修改关键词

编辑 `src/fetcher.js` 中的 `CN_KEYWORDS` 数组：

```javascript
const CN_KEYWORDS = ['战争', '冲突', '军事', '伊朗', '以色列', ...];
```

## 📊 数据格式

`data/articles.json` 结构：

```json
{
  "updatedAt": "2026-03-09T10:00:00.000Z",
  "updateCount": 100,
  "articleCount": 50,
  "articles": [
    {
      "title": "新闻标题",
      "link": "https://...",
      "pubDate": "2026-03-09T09:45:00.000Z",
      "source": "Reuters",
      "description": "新闻摘要..."
    }
  ]
}
```

## ⚠️ 注意事项

1. **GitHub Actions 限制** - 免费账户每月 2000 分钟运行时间
   - 每 15 分钟运行一次 ≈ 96 次/天 ≈ 2880 次/月
   - 建议调整为每 30 分钟或每小时

2. **Cloudflare Pages 限制** - 免费账户：
   - 无限请求
   - 100 次构建/天
   - 500 MB 带宽/天

3. **RSS 源稳定性** - 部分新闻源可能不稳定，建议定期检查

## 🛠️ 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/luan-zhan.git
cd luan-zhan

# 安装依赖
npm install

# 抓取新闻
npm run fetch

# 构建网站
npm run build

# 预览（需要 HTTP 服务器）
npx serve public
```

## 📄 许可证

MIT License

## ⚠️ 免责声明

本网站仅聚合公开的新闻 RSS 源，仅供信息参考，不代表任何政治立场。新闻版权归原媒体所有。

---

**乱战 LuanZhan** © 2026 | 用爱发电 ⚡
