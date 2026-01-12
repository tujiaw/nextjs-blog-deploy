export default function Logo() {
  return (
    <svg width="110" height="80" viewBox="40 0 80 80" xmlns="http://www.w3.org/2000/svg">
      {/* 渐变定义 - 匹配网站青蓝色渐变 */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#33ccff" />
          <stop offset="100%" stopColor="#00a0e9" />
        </linearGradient>

        {/* 发光效果 */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* 轻微动效滤镜 */}
        <filter id="shimmer" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feDisplacementMap in="blur" in2="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* 特色N字母和Z字母 - 紧密连接 */}
      <g transform="translate(50, 10)">
        {/* N字母 */}
        <path
          d="M0,55 L0,15 L25,55 L25,15"
          stroke="url(#logoGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          filter="url(#softGlow)"
        >
          <animate attributeName="opacity" values="0.95;1;0.95" dur="5s" repeatCount="indefinite" />
        </path>

        {/* 连接元素 */}
        <path
          d="M25,15 L40,25"
          stroke="url(#logoGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.85"
          fill="none"
        ></path>

        {/* Z字母 - 更靠近N */}
        <path
          d="M40,25 L65,25 L40,45 L65,45"
          stroke="url(#logoGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          filter="url(#softGlow)"
        >
          <animate attributeName="opacity" values="0.9;1;0.9" dur="6s" repeatCount="indefinite" />
        </path>

        {/* 装饰斜线 */}
        <path d="M5,30 L15,20" stroke="#33ccff" strokeWidth="5" strokeLinecap="round" opacity="0.5"></path>
        <path d="M50,30 L57,25" stroke="#33ccff" strokeWidth="3" strokeLinecap="round" opacity="0.5"></path>
      </g>

      {/* 背景微妙装饰 - 低调呼应网站风格 */}
      <path d="M35,65 L50,50" stroke="#33ccff" strokeWidth="1" opacity="0.2"></path>
      <path d="M110,65 L95,50" stroke="#33ccff" strokeWidth="1" opacity="0.2"></path>

      {/* 微妙光点效果 */}
      <circle cx="50" cy="20" r="1" fill="#ffffff" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="55" r="1" fill="#ffffff" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* 整体效果加强 */}
      <rect x="40" y="0" width="80" height="80" fill="none" stroke="none">
        <animate attributeName="opacity" values="0.98;1;0.98" dur="8s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}
