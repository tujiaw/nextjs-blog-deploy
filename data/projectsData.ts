interface Project {
  title: string
  description: string
  href?: string
}

const projectsData: Project[] = [
  {
    title: 'JSON格式化',
    description: `JSON格式化，支持格式化、压缩、美化、转换为对象、转换为字符串。`,
    href: '/projects/json-tool',
  },
  {
    title: '时间戳转换',
    description: `Linux时间戳工具，支持时间戳和格式化时间的相互转换，显示当前时间，考虑时区。`,
    href: '/projects/timestamp-tool',
  },
  {
    title: 'Acc',
    description: `快速找到你要打开的应用程序。不用为了找到某个程序的启动图标而烦恼，不用在任务栏摆一堆的快捷方式。`,
    href: 'https://github.com/tujiaw/acc',
  },
  {
    title: 'ntscreenshot',
    description: `Windows截图工具，支持贴图，常见标注，马赛克。c键复制当前颜色，键盘像素级移动选区。`,
    href: 'https://github.com/tujiaw/ntscreenshot',
  },
  {
    title: 'gonetdisk',
    description: `个人网盘，将文件存储在服务器上方便管理，分享链接，支持基本的文件、目录操作，充分利用带宽。`,
    href: 'https://github.com/tujiaw/gonetdisk',
  },
  {
    title: 'MonitorClipboard',
    description: `监视鼠标位置、键盘按键、剪切板，将信息显示在界面上，仅学习使用，源码编译需要安装WTL。`,
    href: 'https://gitee.com/tujiaw/MonitorClipboard',
  },
]

export default projectsData
