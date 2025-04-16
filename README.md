# 安装

```
npm install -g yarn
yarn
```

如果yarn命令找不到

```
npx yarn
```

# 运行

yarn dev

# 项目结构说明

```
.
├── app/                # Next.js 应用主目录，包含页面、路由、布局等
│   ├── about/          # 关于页面
│   ├── api/            # API 路由
│   ├── blog/           # 博客相关页面及动态路由
│   ├── projects/       # 项目展示页面
│   ├── tags/           # 标签相关页面
│   ├── layout.tsx      # 全局布局
│   └── ...             # 其他页面和配置
├── components/         # 复用型 React 组件
│   ├── social-icons/   # 社交图标组件
│   ├── ui/             # 基础UI组件
│   └── ...             # 其他功能组件
├── data/               # 站点数据与内容
│   ├── blog/           # 博客文章（按年份分文件夹，mdx格式）
│   ├── authors/        # 作者信息（mdx格式）
│   ├── projectsData.ts # 项目数据
│   └── ...             # 站点元数据等
├── layouts/            # 文章、列表等页面布局组件
├── lib/                # 工具函数与核心逻辑
├── public/             # 静态资源（图片、svg、feed等）
├── scripts/            # 自动化脚本（如rss生成、构建后处理等）
├── faq/                # 常见问题文档
├── .contentlayer/      # Contentlayer 生成的内容
├── .next/              # Next.js 构建产物
├── node_modules/       # 依赖包
├── package.json        # 项目依赖与脚本
├── tsconfig.json       # TypeScript 配置
├── next.config.js      # Next.js 配置
├── ...                 # 其他配置文件
```

如需详细了解某一目录内容，可进一步查阅对应文件夹。
