# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 包管理器

本项目使用 **Yarn** 作为包管理器。始终使用 `yarn` 而不是 `npm`。

## 常用命令

### 开发
- `yarn dev` - 启动开发服务器并构建 contentlayer（推荐）
- `yarn start` - 直接启动 Next.js 开发服务器（不重新构建 contentlayer）
- `yarn build` - 生产环境构建（运行 contentlayer、next build 和 postbuild 脚本）
- `yarn serve` - 启动生产服务器

### 代码质量
- `yarn lint` - 在 app、components、lib、layouts 和 scripts 目录上运行 ESLint 自动修复

### 内容管理
- `yarn contentlayer` - 构建 contentlayer（处理 data/blog 和 data/authors 中的 MDX 文件）

### 分析
- `yarn analyze` - 分析打包大小（在环境中设置 ANALYZE=true）

## 项目架构

这是一个使用 App Router 的 **Next.js 16 博客**，使用 **Contentlayer2** 进行 MDX 内容管理。

### 核心架构组件

**Contentlayer 集成：**
- 内容以 MDX 文件形式存储在 `data/blog/`（按年份组织）和 `data/authors/` 中
- Contentlayer2 在构建时使用 `contentlayer.config.ts` 处理这些文件
- MDX 文件被转换为带有计算字段的 TypeScript 类型（readingTime、slug、toc、structuredData）
- 生成的内容写入 `.contentlayer/` 目录（自动生成，请勿编辑）
- 构建成功后，contentlayer 生成标签计数（`app/tag-data.json`）和搜索索引

**内容处理流程：**
1. `data/blog/` 中的原始 MDX 文件，带有 frontmatter（title、date、tags、draft、summary 等）
2. Contentlayer 使用 remark/rehype 插件构建内容（GFM、数学、代码高亮、警报、引用）
3. 博客页面使用 Contentlayer 生成的类型进行类型安全访问
4. 搜索索引和标签数据自动生成

**路由结构：**
- `/app/blog/[...slug]/page.tsx` - 动态博客文章路由（处理嵌套路径如 `/blog/2025/post-title`）
- `/app/blog/page/[page]/page.tsx` - 分页博客列表
- `/app/tags/[tag]/page.tsx` - 按标签筛选的文章
- `/app/api/` - API 路由（剪贴板、通讯）

**重要构建顺序：**
`yarn build` 命令按以下顺序运行：
1. `contentlayer2 build` - 处理所有 MDX 内容
2. `next build` - 构建 Next.js 应用
3. `node ./scripts/postbuild.mjs` - 生成 RSS 订阅（`public/feed.xml`）

### 样式与资源

- **Tailwind CSS v3** 用于样式（配置在 `tailwind.config.js` 中）
- 自定义 CSS 在 `css/tailwind.css` 中
- 图片在 `public/` 目录中
- SVG logo 在 `data/logo.svg` 中

### 状态管理

- **Zustand** 用于客户端状态（next-themes 用于暗黑模式）
- **Supabase** 集成在 `lib/supabase.ts` 中

### 特殊功能

**数学与代码：**
- KaTeX 用于数学渲染（remark-math、rehype-katex）
- Prism.js 用于语法高亮（rehype-prism-plus）
- 通过 remark 插件实现代码标题

**警报：**
- 使用 `remark-github-blockquote-alert` 实现 GitHub 风格的警报/引用语法

**搜索：**
- 基于 Kbar 的本地搜索（可通过 `siteMetadata.search.kbarConfig` 配置）

## 博客内容操作

### 添加新博客文章

1. 在 `data/blog/YYYY/` 中创建 MDX 文件（例如 `data/blog/2026/my-post.mdx`）
2. 必需的 frontmatter 字段：
   - `title: "文章标题"`（字符串，必需）
   - `date: "YYYY-MM-DD"`（日期，必需）
   - `tags: ["标签1", "标签2"]`（字符串数组，可选）
   - `draft: true/false`（布尔值，可选 - 草稿在生产环境中隐藏）
   - `summary: "简短描述"`（字符串，可选）
3. Contentlayer 将在下次构建时自动处理
4. 文件路径成为 URL slug：`data/blog/2026/my-post.mdx` → `/blog/my-post`

### 博客内容约定

- 带有特殊字符的标签（如 "C++"）在标签计数中保持原样
- 草稿文章（`draft: true`）从生产构建中排除，但在开发中包含
- 阅读时间根据内容自动计算
- 目录（toc）从标题中自动提取

### MDX 文件规范

**必须遵守的语法规则：**

1. **YAML Frontmatter**
   ```yaml
   ---
   title: '文章标题'           # 使用单引号
   date: 2026-01-15
   tags: ["AI", "Agent"]
   summary: '文章摘要'         # 不要在 summary 中使用双引号
   draft: false
   ---
   ```
   - ❌ `title: ""Think""` （双引号嵌套）
   - ✅ `title: '"Think"'` 或 `title: "'Think'"`

2. **HTML 标签必须自闭合**
   - ❌ `<br>`
   - ✅ `<br />`

3. **特殊符号必须加空格**
   - ❌ `<10` `>10`
   - ✅ `< 10` `> 10`

4. **代码块必须闭合**
   ```markdown
   ```javascript
   console.log("hello")
   ```
   ```

**推送前必做检查：**
```bash
# 1. 验证 MDX 语法（必做！）
yarn contentlayer

# 2. 完整构建测试
yarn build

# 3. 确认无误后推送
git push origin main
```

**常见错误速查：**
| 问题 | 错误写法 | 正确写法 |
|------|---------|---------|
| 引号嵌套 | `""Think""` | `'"Think"'` |
| 未闭合标签 | `<br>` | `<br />` |
| 小于号 | `<10` | `< 10` |
| 大于号 | `>5` | `> 5` |

## 构建输出说明

- 静态页面在构建时预渲染（664+ 页面）
- RSS 订阅生成到 `public/feed.xml`
- 标签数据 JSON 写入到 `app/tag-data.json`
- 使用 Turbopack 加快构建速度（实验性）
- 启用 CSS 优化（`experimental.optimizeCss`）

## 重要约束

**禁止使用 Webpack：**
- 本项目使用 Turbopack 作为构建工具
- 不要使用 `--webpack` 标志
- 不要在 `next.config.js` 中配置 webpack
- 字体加载问题通过 `adjustFontFallback: true` 解决

## 环境

- 启用 ES 模块的 Node.js
- 严格模式的 TypeScript
- 严格模式的 React 19
- 带有 App Router 的 Next.js 16
