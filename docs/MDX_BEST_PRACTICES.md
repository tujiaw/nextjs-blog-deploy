# 避免 MDX 语法错误的最佳实践

## 1. 本地验证流程

### 推送前必做检查

在推送代码前，始终运行以下命令：

```bash
# 1. 验证 MDX 文件语法
yarn contentlayer

# 2. 完整构建测试
yarn build

# 3. 查看修改的文件
git status
```

### 创建便捷脚本

在 `package.json` 中添加预推送检查：

```json
{
  "scripts": {
    "prepush": "yarn contentlayer && yarn build",
    "check-mdx": "yarn contentlayer"
  }
}
```

使用：
```bash
yarn check-mdx  # 快速检查 MDX 语法
```

## 2. Git Hooks 自动检查

### 安装 Husky

```bash
yarn add -D husky
yarn husky install
```

### 配置 Pre-commit Hook

创建 `.husky/pre-commit`：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 检查是否有 MDX 文件被修改
if git diff --cached --name-only | grep -q '\.mdx$'; then
  echo "🔍 检测到 MDX 文件变更，运行语法检查..."
  yarn contentlayer
  if [ $? -ne 0 ]; then
    echo "❌ MDX 语法检查失败，请修复后再提交"
    exit 1
  fi
  echo "✅ MDX 语法检查通过"
fi
```

设置可执行权限：
```bash
chmod +x .husky/pre-commit
```

### 配置 Pre-push Hook

创建 `.husky/pre-push`：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 推送前运行完整构建测试..."
yarn build
if [ $? -ne 0 ]; then
  echo "❌ 构建失败，请修复后再推送"
  exit 1
fi
echo "✅ 构建测试通过"
```

## 3. 常见 MDX 语法问题清单

### YAML Frontmatter 问题

❌ **错误示例：**
```yaml
title: ""Think"工具"  # 双引号嵌套
summary: "文章包含"特殊字符""  # 未转义
```

✅ **正确做法：**
```yaml
title: '"Think"工具'  # 使用单引号
summary: '文章包含"特殊字符"'  # 使用单引号
# 或转义
summary: "文章包含\"特殊字符\""
```

### HTML 标签问题

❌ **错误示例：**
```markdown
文本<br>更多文本  # 未闭合
<10  # 被误认为 HTML
```

✅ **正确做法：**
```markdown
文本<br />更多文本  # 自闭合
< 10  # 添加空格
```

### 代码块问题

❌ **错误示例：**
````markdown
```javascript
console.log("hello"  # 未闭合
```
````

✅ **正确做法：**
````markdown
```javascript
console.log("hello")
```
````

## 4. VS Code 配置

### 安装推荐扩展

```json
// .vscode/extensions.json
{
  "recommendations": [
    "silvenon.mdx",
    "davidanson.vscode-husky",
    "esbenp.prettier-vscode"
  ]
}
```

### 配置 MDX 支持

创建 `.vscode/settings.json`：

```json
{
  "files.associations": {
    "*.mdx": "markdown"
  },
  "mdx.validate": {
    "enabled": true
  },
  "editor.formatOnSave": true
}
```

## 5. CI/CD 自动检查

### GitHub Actions 配置

创建 `.github/workflows/validate-mdx.yml`：

```yaml
name: Validate MDX

on:
  pull_request:
    paths:
      - 'data/blog/**/*.mdx'
  push:
    paths:
      - 'data/blog/**/*.mdx'

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Validate MDX
        run: yarn contentlayer

      - name: Build
        run: yarn build
```

这会在每次 PR 或推送时自动检查。

## 6. 团队协作流程

### PR 模板

创建 `.github/pull_request_template.md`：

```markdown
## 描述
<!-- 描述你的更改 -->

## MDX 文件检查清单
- [ ] 已运行 `yarn contentlayer` 通过
- [ ] 已运行 `yarn build` 通过
- [ ] 已本地预览确认显示正常
- [ ] 特殊字符已正确转义（引号、HTML 标签等）
- [ ] 代码块已正确闭合

## 测试
<!-- 描述如何测试你的更改 -->
```

### Code Review 检查要点

审查 MDX 文件时关注：
1. Frontmatter 语法正确
2. HTML 标签正确闭合
3. 特殊字符已转义
4. 代码块正确格式化
5. 链接和图片引用正确

## 7. 快速检查命令

### 创建检查脚本

创建 `scripts/check-mdx.sh`：

```bash
#!/bin/bash

echo "🔍 检查 MDX 文件..."

# 检查常见问题
echo "检查常见问题..."

# 1. 检查双引号嵌套
grep -rn 'title:.*".*".*"' data/blog/ && echo "❌ 发现双引号嵌套问题" || echo "✅ 无双引号嵌套"

# 2. 检查未闭合的 <br>
grep -rn '<br>[^/]' data/blog/ && echo "❌ 发现未闭合的 <br>" || echo "✅ 无未闭合的 <br>"

# 3. 检查 <10, >10 等可能被误解析的模式
grep -rnE '<[0-9]|>[0-9]' data/blog/ && echo "⚠️  发现可能的 HTML 标签模式" || echo "✅ 无可疑模式"

# 4. 运行 contentlayer
echo "运行 contentlayer..."
yarn contentlayer

if [ $? -eq 0 ]; then
  echo "✅ 所有检查通过"
else
  echo "❌ 检查失败"
  exit 1
fi
```

使用：
```bash
chmod +x scripts/check-mdx.sh
./scripts/check-mdx.sh
```

## 8. 自动修复工具

### Prettier 配置

安装 Prettier：
```bash
yarn add -D prettier
```

创建 `.prettierrc`：

```json
{
  "semi": true,
  "singleQuote": true,
  "proseWrap": "preserve",
  "overrides": [
    {
      "files": "*.mdx",
      "options": {
        "parser": "mdx",
        "singleQuote": false
      }
    }
  ]
}
```

自动格式化：
```bash
# 格式化所有 MDX 文件
yarn prettier --write "data/blog/**/*.mdx"

# 检查格式（不修改）
yarn prettier --check "data/blog/**/*.mdx"
```

## 9. 文档和培训

### 创建团队文档

创建 `docs/MDX_GUIDE.md`：

```markdown
# MDX 文件编写指南

## Frontmatter 模板

```yaml
---
title: "文章标题"
date: YYYY-MM-DD
tags: ["标签1", "标签2"]
summary: "文章摘要（不要包含特殊字符）"
draft: false
---
```

## 注意事项

1. **引号使用**
   - Frontmatter 中使用单引号包裹包含双引号的文本
   - 示例：`title: '"Think"工具'`

2. **HTML 标签**
   - 所有标签必须自闭合或闭合
   - 示例：`<br />` 而不是 `<br>`

3. **特殊符号**
   - 在符号两边添加空格
   - 示例：`< 10` 而不是 `<10`

4. **代码块**
   - 确保使用正确的语言标识符
   - 确保代码块正确闭合
```

## 10. 监控和报警

### Vercel 部署失败通知

配置 Vercel Slack 集成或邮件通知，当构建失败时立即收到警报。

### 本地开发环境

在 `.env.local` 中启用详细日志：

```bash
CONTENTLAYER_DEBUG=1
```

## 总结

**三级防护体系：**

1. **开发阶段** - 编辑器实时提示 + Prettier 自动格式化
2. **提交阶段** - Git hooks 自动检查
3. **部署阶段** - CI/CD 自动验证

**关键命令：**
```bash
# 开发时
yarn contentlayer --watch  # 监听模式

# 提交前
yarn check-mdx  # 快速检查

# 推送前
yarn build  # 完整构建
```

**记住：** 预防胜于治疗！花 5 分钟检查，胜过花 1 小时调试。
