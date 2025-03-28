import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://fibmocuqjpkyzrzoydzq.supabase.co',
  '1yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYm1vY3VxanBreXpyem95ZHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1MDcyODQsImV4cCI6MjA0MDA4MzI4NH0.q_MpIGXxxoRaBTJUBCI-D-lwyM-nt_-6Xlgp4re0e74'
)

let time_caches = {}
let title_caches = {}
// 递归遍历blog目录下的所有.mdx文件名，包括子目录
function findMdxFilesSync(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // 如果是目录，则递归调用自身
      fileList = findMdxFilesSync(filePath, fileList)
    } else if (path.extname(file).toLowerCase() === '.mdx') {
      // 如果是 .mdx 文件，则添加到文件列表中
      fileList.push(filePath)
    }
  })

  return fileList
}

let blog_dir = '/home/jave/project/github/nextjs-blog/data/blog'
let file_list = []
findMdxFilesSync(blog_dir, file_list)
function convertISOToCustomFormat(isoString, title) {
  // 创建一个新的 Date 对象
  const date = new Date(isoString)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }

  // 获取年份、月份、日期、小时、分钟和秒数
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // 月份从0开始
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // 构建并返回自定义格式的字符串
  let created_at = `${year}${month}${day}${hours}${minutes}${seconds}`
  // 将date加入cache，如果有重复就加1秒,
  while (time_caches[created_at]) {
    date.setSeconds(date.getSeconds() + 1)
    created_at = convertISOToCustomFormat(date.toISOString())
  }
  time_caches[created_at] = true
  title = title.trim()
  title_caches[title] = created_at
  return created_at
}

let { data: posts, error } = await supabase.from('posts').select('title,created_at')

// 遍历结果中的title和created_at
for (let i = 0; i < posts.length; i++) {
  convertISOToCustomFormat(posts[i].created_at, posts[i].title)
}

// 将文件名称改为缓存中的created_at
for (let i = 0; i < file_list.length; i++) {
  const fileName = path.basename(file_list[i], '.mdx')
  // 判断filename是否存在
  if (!title_caches[fileName]) {
    console.log(`${fileName} not found in cache`)
    continue
  }
  const old_path = file_list[i]
  const new_path = old_path.replace(fileName, title_caches[fileName])
  fs.renameSync(old_path, new_path)
}
