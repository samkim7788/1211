/**
 * Reference Board Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check Login
    if (!Auth.requireLogin()) return;

    // State
    let userPreferences = State.get('userPreferences', null);
    let userEmail = State.get('userEmail', '');
    let selectedStyles = userPreferences?.styles || [];

    const styleCategories = [
        'vintage', 'luxury', 'natural', 'scandinavian', 'french',
        'lovely', 'pastel', 'modern', 'bohemian', 'classic',
        'industrial', 'minimal'
    ];

    // Use generated image data if available
    const categoryImages = typeof IMAGE_DATA !== 'undefined' ? IMAGE_DATA : {};

    // Elements
    const headerNav = document.getElementById('header-nav');
    const styleTags = document.getElementById('style-tags');
    const imageGrid = document.getElementById('image-grid');
    const emptyMessage = document.getElementById('empty-message');
    const preferenceMessage = document.getElementById('preference-message');
    const userNameDisplay = document.getElementById('user-name-display');

    // Initialize
    renderHeaderNav();
    renderStyleTags();
    renderImages();

    if (userPreferences && userPreferences.styles && userPreferences.styles.length > 0) {
        preferenceMessage.classList.remove('hidden');
        userNameDisplay.textContent = userEmail ? userEmail.split('@')[0] : (userPreferences.gender || '회원');
    }

    // Functions
    function renderHeaderNav() {
        headerNav.innerHTML = `
            <button onclick="window.location.href='mypage.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">마이페이지</button>
            <button onclick="window.location.href='../user/reference_board.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">레퍼런스 보드</button>
            <button onclick="window.location.href='preference.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">취향분석</button>
            <button onclick="Auth.logout()" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">로그아웃</button>
        `;
    }

    function renderStyleTags() {
        styleTags.innerHTML = styleCategories.map(style => `
            <button onclick="toggleStyle('${style}')" class="px-6 py-2 rounded-full border-2 transition-all whitespace-nowrap ${selectedStyles.includes(style)
                ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white border-transparent shadow-lg'
                : 'bg-white text-purple-600 border-purple-300 hover:border-purple-400'
            }">
                ${style}
            </button>
        `).join('');
    }

    window.toggleStyle = (style) => {
        if (selectedStyles.includes(style)) {
            selectedStyles = selectedStyles.filter(s => s !== style);
        } else {
            selectedStyles.push(style);
        }
        renderStyleTags();
        renderImages();
    };

    function renderImages() {
        let displayImages = [];

        if (!userPreferences || selectedStyles.length === 0) {
            // Random images from all categories if no specific selection
            // If IMAGE_DATA is used, flatten all arrays
            const allImages = [];
            Object.values(categoryImages).forEach(imgs => {
                if (Array.isArray(imgs)) allImages.push(...imgs);
            });
            displayImages = allImages.sort(() => Math.random() - 0.5).slice(0, 20); // Limit random display number
        } else {
            selectedStyles.forEach(style => {
                if (categoryImages[style]) displayImages.push(...categoryImages[style]);
            });
        }

        if (displayImages.length > 0) {
            imageGrid.innerHTML = displayImages.map((img, index) => `
                <div class="relative group">
                    <div class="aspect-square rounded-3xl overflow-hidden">
                        <img src="${img}" alt="Interior ${index + 1}" class="w-full h-full object-cover">
                    </div>
                    <button onclick="downloadImage('${img}', ${index})" class="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-gray-50">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        download
                    </button>
                </div>
            `).join('');
            emptyMessage.classList.add('hidden');
        } else {
            imageGrid.innerHTML = '';
            emptyMessage.classList.remove('hidden');
        }
        lucide.createIcons();
    }

    window.downloadImage = async (url, index) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `mood-on-reference-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('이미지 다운로드에 실패했습니다.');
        }
    };
});
