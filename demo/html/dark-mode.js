// 暗黑模式切换脚本
document.addEventListener('DOMContentLoaded', function() {
    // 创建暗黑模式开关按钮
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #dark-mode-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        #dark-mode-toggle:hover {
            transform: scale(1.1);
            background-color: var(--primary-hover);
        }
        
        .sun-icon, .moon-icon {
            position: absolute;
            transition: opacity 0.3s ease, transform 0.5s ease;
        }
        
        body:not(.dark-mode) .moon-icon {
            opacity: 0;
            transform: rotate(90deg);
        }
        
        body.dark-mode .sun-icon {
            opacity: 0;
            transform: rotate(-90deg);
        }
        
        body.dark-mode {
            --primary: #818cf8;
            --primary-hover: #6366f1;
            --background: #111827;
            --card-bg: #1f2937;
            --text: #f9fafb;
            --text-secondary: #9ca3af;
            --border: #374151;
        }
    `;

    // 添加到文档中
    document.head.appendChild(style);
    document.body.appendChild(darkModeToggle);

    // 检查本地存储中的暗黑模式设置
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // 切换暗黑模式
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    });

    // 添加系统偏好检测
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches && localStorage.getItem('darkMode') === null) {
        document.body.classList.add('dark-mode');
    }

    // 监听系统偏好变化
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}); 