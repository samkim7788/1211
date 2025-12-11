/**
 * Shared Logic for MOOD ON (Vanilla JS)
 */

// State Management
const State = {
    get(key, defaultValue) {
        const value = localStorage.getItem(`moodon_${key}`);
        if (value === null) return defaultValue;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },
    set(key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(`moodon_${key}`, JSON.stringify(value));
        } else {
            localStorage.setItem(`moodon_${key}`, value);
        }
    },
    remove(key) {
        localStorage.removeItem(`moodon_${key}`);
    }
};

// Auth Helper
const Auth = {
    isLoggedIn() {
        return State.get('isLoggedIn', false) === 'true' || State.get('isLoggedIn', false) === true;
    },
    login(email) {
        State.set('isLoggedIn', 'true');
        if (email) State.set('userEmail', email);
        window.location.href = 'chat.html';
    },
    logout() {
        State.remove('isLoggedIn');
        State.remove('userEmail');
        State.remove('userPreferences');
        State.remove('favoriteProducts');
        State.remove('chat_sessions');
        window.location.href = 'chat.html';
    },
    requireLogin() {
        if (!this.isLoggedIn()) {
            // Show popup or redirect
            // For simplicity in multi-page, we might just redirect or show the popup overlay
            // We'll implement the popup injection here
            this.showLoginPopup();
            return false;
        }
        return true;
    },
    showLoginPopup() {
        const popupHtml = `
        <div id="login-required-popup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span class="text-4xl">🔒</span>
              </div>
              <h2 class="text-2xl mb-3 text-gray-800">로그인이 필요합니다</h2>
              <p class="text-gray-600">해당 서비스를 이용하시려면<br/>먼저 로그인해주세요.</p>
            </div>
            <div class="flex gap-3">
              <button onclick="document.getElementById('login-required-popup').remove()" class="flex-1 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all text-gray-700">취소</button>
              <button onclick="window.location.href='login.html'" class="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-2xl hover:from-blue-600 hover:to-blue-500 transition-all shadow-lg">로그인하기</button>
            </div>
          </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHtml);
    }
};

// Header Component
function renderHeader(currentPage) {
    const isLoggedIn = Auth.isLoggedIn();
    
    const navItems = isLoggedIn ? `
        <button onclick="window.location.href='mypage.html'" class="px-5 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 leading-none transition-colors">마이페이지</button>
        <button onclick="window.location.href='reference_board.html'" class="px-5 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 leading-none transition-colors">레퍼런스 보드</button>
        <button onclick="window.location.href='preference.html'" class="px-5 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 leading-none transition-colors">취향분석</button>
        <button onclick="Auth.logout()" class="px-5 py-2 text-[15px] bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full hover:from-blue-600 hover:to-blue-500 transition-all shadow-md leading-none">로그아웃</button>
    ` : `
        <button onclick="window.location.href='signup.html'" class="px-5 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 leading-none transition-colors">회원가입</button>
        <button onclick="window.location.href='login.html'" class="px-5 py-2 text-[15px] bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full hover:from-blue-600 hover:to-blue-500 transition-all shadow-md leading-none">로그인</button>
    `;

    const headerHtml = `
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-[14px] flex items-center justify-between">
        <button onclick="window.location.href='chat.html'" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity whitespace-nowrap">
          <div class="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-300 rounded-full flex items-center justify-center shadow-md">
            <i data-lucide="lamp" class="text-white w-[18px] h-[18px]"></i>
          </div>
          <span class="text-[20px] font-medium leading-none bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent select-none">MOOD ON</span>
        </button>
        <nav class="flex items-center gap-[10px] whitespace-nowrap">
          ${navItems}
        </nav>
      </div>
    </header>
    `;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    
    // Initialize icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Icons are initialized in renderHeader or manually if header is not used
    if (window.lucide) lucide.createIcons();
});
