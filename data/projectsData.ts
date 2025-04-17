interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'File Upload',
    description: `文件上传工具，支持多文件上传（最多5个文件，每个最大30MB），支持从剪贴板粘贴图片，自动生成带原始文件名的链接，支持一键复制链接。`,
    imgSrc: '/static/images/tool-upload.png',
    href: '/projects/upload',
  },
  {
    title: 'Online Clipboard',
    description: `在线剪贴板工具，支持保存和加载内容，通过访问码在不同设备间共享文本。完全在浏览器中运行，数据存储在服务器上。`,
    imgSrc: '/static/images/clipboard.png',
    href: '/projects/clipboard',
  },
  {
    title: 'Timestamp Converter',
    description: `时间戳转换工具，支持毫秒/秒级时间戳与日期的双向转换，多时区支持，提供历史记录功能。在浏览器中完全本地运行，数据不会发送到服务器。`,
    imgSrc: '/static/images/timestamp-converter.png',
    href: '/tools/timestamp-converter.html',
  },
  {
    title: 'JSON Formatter',
    description: `JSON格式化工具，支持格式化、压缩、验证JSON数据，可自定义缩进方式，一键复制结果。完全在浏览器中运行，数据不会发送到服务器。`,
    imgSrc: '/static/images/json-formatter.png',
    href: '/tools/json-formatter.html',
  },
  {
    title: 'Acc',
    description: `快速找到你要打开的应用程序。不用为了找到某个程序的启动图标而烦恼，不用在任务栏摆一堆的快捷方式。`,
    imgSrc: '/static/images/acc.png',
    href: 'https://github.com/tujiaw/acc',
  },
  {
    title: 'ntscreenshot',
    description: `Windows截图工具，支持贴图，常见标注，马赛克。c键复制当前颜色，键盘像素级移动选区。`,
    imgSrc: '/static/images/ntscreenshot.png',
    href: 'https://github.com/tujiaw/ntscreenshot',
  },
  {
    title: 'gonetdisk',
    description: `个人网盘，将文件存储在服务器上方便管理，分享链接，支持基本的文件、目录操作，充分利用带宽。`,
    imgSrc: '/static/images/gonetdisk.png',
    href: 'https://github.com/tujiaw/gonetdisk',
  },
  {
    title: 'MonitorClipboard',
    description: `监视鼠标位置、键盘按键、剪切板，将信息显示在界面上，仅学习使用，源码编译需要安装WTL。`,
    imgSrc: '/static/images/MonitorClipboard.png',
    href: 'https://gitee.com/tujiaw/MonitorClipboard',
  },
  {
    title: 'TODO应用',
    description: '一个使用Supabase存储数据的现代化待办事项应用，支持多用户、黑暗模式及实时更新。',
    imgSrc: '/static/images/todo-app.jpg',
    href: '/projects/todo',
  },
]

export default projectsData