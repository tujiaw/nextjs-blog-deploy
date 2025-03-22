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
    title: '哈希工具',
    description: `支持MD5、SHA1等哈希算法，支持文本和文件哈希计算，支持大小写切换。`,
    href: '/projects/hash-tool',
  },
  {
    title: 'IP地址查询',
    description: `IP地址查询工具，支持IPv4和IPv6地址查询，显示地理位置、ISP信息、时区等详细信息。`,
    href: '/projects/ip-tool',
  },
  {
    title: 'UUID生成器',
    description: `生成UUID v1/v4，支持批量生成、复制、大小写切换，支持多种格式输出。`,
    href: '/projects/uuid-tool',
  },
  {
    title: 'XML格式化',
    description: `XML格式化工具，支持格式化、压缩、美化，支持XML验证。`,
    href: '/projects/xml-tool',
  },
  {
    title: 'CSS格式化',
    description: `CSS格式化工具，支持格式化、压缩、美化，支持CSS验证。`,
    href: '/projects/css-tool',
  },
  {
    title: 'JavaScript格式化',
    description: `JavaScript格式化工具，支持格式化、压缩、美化，支持ESLint规则。`,
    href: '/projects/js-tool',
  },
  {
    title: 'SQL格式化',
    description: `SQL格式化工具，支持格式化、压缩、美化，支持多种SQL方言。`,
    href: '/projects/sql-tool',
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
