// ========== 搜索引擎配置 ==========
const engines = {
  baidu: {
    name: '百度',
    url: 'https://www.baidu.com/s?wd='
  },
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search?q='
  },
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q='
  }
};

let currentEngine = 'baidu'; // 默认百度

// ========== 初始化搜索引擎切换器 ==========
function initEngineSelector() {
  const options = document.querySelectorAll('.engine-option');
  options.forEach(opt => {
    opt.addEventListener('click', function() {
      const engineKey = this.dataset.engine;
      if (engineKey && engines[engineKey]) {
        // 更新当前搜索引擎
        currentEngine = engineKey;
        
        // 更新 UI 激活状态
        options.forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        
        // 可选：控制台提示
        console.log(`🔍 搜索引擎已切换至: ${engines[engineKey].name}`);
        
        // 轻提示效果（可选）
        showToast(`已切换至 ${engines[engineKey].name} 搜索`);
      }
    });
  });
}

// ========== 轻提示函数（非阻塞） ==========
function showToast(message, duration = 1500) {
  // 检查是否已存在 toast，避免重复
  let existingToast = document.querySelector('.custom-toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: #1f4970;
    color: #fff;
    padding: 8px 20px;
    border-radius: 40px;
    font-size: 0.8rem;
    z-index: 9999;
    backdrop-filter: blur(8px);
    border: 1px solid #4da3ff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    pointer-events: none;
    white-space: nowrap;
    font-family: system-ui, sans-serif;
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// ========== 智能搜索核心逻辑 ==========
function doSearch() {
  const input = document.getElementById('searchInput');
  let query = input.value.trim();
  
  if (!query) return;
  
  // 1. 智能网址识别：
  //    - 包含常见域名特征 (如 .com, .cn, .org 等)
  //    - 或者以 http:// / https:// 开头
  //    - 简单有效的判断：有点号、无空格、不是纯中文长串
  const isUrlLike = (query.includes('.') && !query.includes(' ') && !query.includes('，')) ||
                     query.startsWith('http://') ||
                     query.startsWith('https://');
  
  if (isUrlLike) {
    let url = query;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.location.href = url;
    return;
  }
  
  // 2. 使用当前选择的搜索引擎
  const engineUrl = engines[currentEngine]?.url;
  if (engineUrl) {
    const searchUrl = engineUrl + encodeURIComponent(query);
    window.location.href = searchUrl;
  } else {
    // 后备方案（正常情况下不会触发）
    window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
  }
}

// ========== 动态问候语 (增加细节体验) ==========
function updateGreeting() {
  const greetingEl = document.getElementById('greetingText');
  if (!greetingEl) return;
  
  const now = new Date();
  const hour = now.getHours();
  let greeting = '';
  
  if (hour < 6) greeting = '🌙 666那么快就晚上了';
  else if (hour < 12) greeting = '☀️ 早生蚝！看点什么？';
  else if (hour < 18) greeting = '📡 下午了奥烙铁';
  else greeting = '🌌 还不睡觉！';
  
  greetingEl.innerHTML = `✨ ${greeting} ✨`;
}

// ========== 绑定事件 ==========
function bindEvents() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', doSearch);
  }
  
  if (searchInput) {
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });
  }
}

// ========== 处理 Logo 图片加载失败的备用方案 ==========
function handleLogoError() {
  const logoImg = document.querySelector('.logo img');
  if (logoImg && logoImg.complete && logoImg.naturalWidth === 0) {
    // 如果图片加载失败，设置一个后备字符图案
    logoImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="%234da3ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"%3E%3C/path%3E%3C/svg%3E';
    logoImg.style.background = '#0a2a44';
    logoImg.style.padding = '8px';
    logoImg.style.borderRadius = '12px';
  }
}

// ========== 页面启动 ==========
document.addEventListener('DOMContentLoaded', () => {
  initEngineSelector();   // 初始化搜索引擎切换
  bindEvents();           // 绑定搜索事件
  updateGreeting();       // 设置问候语
  handleLogoError();      // Logo 容错处理
  
  // 每60秒更新一次问候语（可选）
  setInterval(updateGreeting, 60000);
  
  // 自动聚焦到搜索框
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.focus();
  
  // 控制台彩蛋提示
  console.log('%c✨ CZ Studio 初始页已启动 | 支持智能网址跳转 + 多引擎切换 ✨', 'color: #4da3ff; font-size: 14px;');
});