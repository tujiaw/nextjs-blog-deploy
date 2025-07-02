const fs = require('fs');
const path = require('path');

/**
 * 递归读取目录下的所有MDX文件
 * @param {string} dirPath 目录路径
 * @returns {string[]} 文件路径数组
 */
function getAllMdxFiles(dirPath) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile() && path.extname(item) === '.mdx') {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dirPath);
  return files.sort(); // 按文件名排序
}

/**
 * 解析MDX文件的frontmatter
 * @param {string} content 文件内容
 * @returns {Object} 解析后的frontmatter对象
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};
  
  const frontmatterContent = frontmatterMatch[1];
  const frontmatter = {};
  
  const lines = frontmatterContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*['"]?(.*?)['"]?$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = value;
    }
  }
  
  return frontmatter;
}

/**
 * 读取并处理单个MDX文件
 * @param {string} filePath 文件路径
 * @returns {Object} 处理后的文件对象
 */
function processMdxFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = parseFrontmatter(content);
  
  return {
    path: filePath,
    content: content,
    title: frontmatter.title,
    date: frontmatter.date
  };
}

/**
 * 主函数：读取blog目录中的所有文件并组合
 * @param {string} blogDir blog目录路径
 * @param {string} outputFile 输出文件路径
 */
function combineAllBlogFiles(blogDir = 'data/blog', outputFile = 'combined_blog_content.md') {
  try {
    console.log(`开始读取 ${blogDir} 目录下的所有MDX文件...`);
    
    // 检查目录是否存在
    if (!fs.existsSync(blogDir)) {
      console.error(`❌ 目录不存在: ${blogDir}`);
      return;
    }
    
    // 获取所有MDX文件路径
    const mdxFiles = getAllMdxFiles(blogDir);
    console.log(`找到 ${mdxFiles.length} 个MDX文件`);
    
    if (mdxFiles.length === 0) {
      console.log('📝 没有找到MDX文件');
      return;
    }
    
    // 处理所有文件
    const blogFiles = [];
    for (const filePath of mdxFiles) {
      try {
        const blogFile = processMdxFile(filePath);
        blogFiles.push(blogFile);
        console.log(`✓ 已处理: ${path.basename(filePath)}`);
      } catch (error) {
        console.error(`✗ 处理文件失败: ${filePath}`, error.message);
      }
    }
    
    // 按日期排序（如果有日期的话）
    blogFiles.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime(); // 最新的在前
      }
      return a.path.localeCompare(b.path);
    });
    
    // 组合所有内容
    let combinedContent = '';
    combinedContent += `# 博客文章合集\n\n`;
    combinedContent += `生成时间: ${new Date().toISOString()}\n`;
    combinedContent += `总文章数: ${blogFiles.length}\n\n`;
    combinedContent += `---\n\n`;
    
    for (let i = 0; i < blogFiles.length; i++) {
      const file = blogFiles[i];
      const relativePath = path.relative(process.cwd(), file.path);
      
      combinedContent += `## 文章 ${i + 1}: ${file.title || path.basename(file.path)}\n\n`;
      combinedContent += `- **文件路径**: ${relativePath}\n`;
      if (file.date) {
        combinedContent += `- **发布日期**: ${file.date}\n`;
      }
      combinedContent += `\n---\n\n`;
      combinedContent += file.content;
      combinedContent += `\n\n\n`; // 使用三个换行符分割
    }
    
    // 写入输出文件
    fs.writeFileSync(outputFile, combinedContent, 'utf-8');
    
    console.log(`\n✅ 成功！`);
    console.log(`📁 已处理 ${blogFiles.length} 个文件`);
    console.log(`📄 合并内容已保存到: ${outputFile}`);
    console.log(`📊 文件大小: ${Math.round(fs.statSync(outputFile).size / 1024)} KB`);
    
  } catch (error) {
    console.error('❌ 处理过程中发生错误:', error.message);
  }
}

/**
 * 显示使用帮助
 */
function showHelp() {
  console.log(`
博客文章合并工具

用法:
  node g_knowledge.js [blog目录] [输出文件]

参数:
  blog目录    - 博客文章目录路径 (默认: data/blog)
  输出文件    - 合并后的输出文件路径 (默认: combined_blog_content.md)

示例:
  node g_knowledge.js
  node g_knowledge.js data/blog my_blog_content.md
  node g_knowledge.js data/blog/2025 recent_posts.md

功能:
  - 递归读取指定目录下的所有 .mdx 文件
  - 解析文件的 frontmatter (标题、日期等)
  - 按日期排序文章
  - 使用三个换行符(\\n\\n\\n)分割文章内容
  - 生成包含文章信息的合并文件
`);
}

// 主程序入口
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const blogDir = args[0] || 'data/blog';
  const outputFile = args[1] || 'combined_blog_content.md';
  
  combineAllBlogFiles(blogDir, outputFile);
}

// 导出函数供其他模块使用
module.exports = {
  combineAllBlogFiles,
  getAllMdxFiles,
  processMdxFile,
  parseFrontmatter
}; 