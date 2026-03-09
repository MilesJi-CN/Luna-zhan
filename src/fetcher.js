import fetch from 'node-fetch';
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'description', 'pubDate', 'link', 'title', 'source']
  }
});

// 新闻源配置（RSS feeds）
const NEWS_SOURCES = [
  {
    name: 'Reuters World',
    url: 'https://www.reuters.org/rssfeed/worldnews',
    filter: ['war', 'conflict', 'military', 'iran', 'israel', 'ukraine', 'russia', 'middle east']
  },
  {
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    filter: ['war', 'conflict', 'military', 'iran', 'israel', 'ukraine', 'russia']
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    filter: ['war', 'conflict', 'military', 'iran', 'israel', 'ukraine', 'russia', 'middle east']
  },
  {
    name: 'France 24',
    url: 'https://www.france24.com/en/rss',
    filter: ['war', 'conflict', 'military', 'iran', 'israel', 'ukraine', 'russia', 'middle east']
  },
  {
    name: 'DW World',
    url: 'https://www.dw.com/rss/world-rss',
    filter: ['war', 'conflict', 'military', 'iran', 'israel', 'ukraine', 'russia']
  },
  {
    name: '联合早报',
    url: 'https://www.zaobao.com.sg/rss/newspaper/world.xml',
    filter: ['战争', '冲突', '军事', '伊朗', '以色列', '乌克兰', '俄罗斯', '中东']
  }
];

// 过滤关键词（中文）
const CN_KEYWORDS = ['战争', '冲突', '军事', '伊朗', '以色列', '乌克兰', '俄罗斯', '中东', '袭击', '导弹', '战场'];

function matchKeywords(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
}

function matchChineseKeywords(text) {
  return CN_KEYWORDS.some(kw => text.includes(kw));
}

async function fetchFeed(source) {
  try {
    console.log(`Fetching ${source.name}...`);
    const feed = await parser.parseURL(source.url);
    
    const items = feed.items.map(item => ({
      title: item.title || '无标题',
      link: item.link || item.url || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      description: (item.contentSnippet || item.description || '').substring(0, 200),
      categories: item.categories || []
    }));
    
    // 过滤相关新闻
    const filtered = items.filter(item => {
      const text = `${item.title} ${item.description}`;
      return matchKeywords(text, source.filter) || matchChineseKeywords(text);
    });
    
    console.log(`  Found ${filtered.length} relevant articles from ${source.name}`);
    return filtered;
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error.message);
    return [];
  }
}

async function main() {
  console.log('🌍 乱战 - 战争信息抓取器');
  console.log('='.repeat(40));
  
  // 确保数据目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // 抓取所有源
  const allArticles = [];
  for (const source of NEWS_SOURCES) {
    const articles = await fetchFeed(source);
    allArticles.push(...articles);
  }
  
  // 去重（基于标题）
  const uniqueArticles = Array.from(
    new Map(allArticles.map(item => [item.title + item.link, item])).values()
  );
  
  // 按时间排序（最新的在前）
  uniqueArticles.sort((a, b) => {
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  
  // 限制数量（最多 50 条）
  const limitedArticles = uniqueArticles.slice(0, 50);
  
  // 保存数据
  const outputData = {
    updatedAt: new Date().toISOString(),
    updateCount: (fs.existsSync(path.join(DATA_DIR, 'articles.json')) 
      ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'articles.json'), 'utf-8')).updateCount || 0 
      : 0) + 1,
    articleCount: limitedArticles.length,
    articles: limitedArticles
  };
  
  const outputPath = path.join(DATA_DIR, 'articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
  
  console.log('='.repeat(40));
  console.log(`✅ 抓取完成！共 ${limitedArticles.length} 条新闻`);
  console.log(`📁 数据已保存至：${outputPath}`);
  console.log(`🔄 更新次数：${outputData.updateCount}`);
  console.log(`⏰ 更新时间：${outputData.updatedAt}`);
}

main().catch(console.error);
