/**
 * Preference Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    let step = 1;
    let gender = '';
    let birthdate = '';
    let mbti = [null, null, null, null];
    let selectedStyles = [];

    const styleImages = [
        { id: 'vintage', name: 'Vintage', displayName: '빈티지', url: '../../static/images/vintage_interior/vintage_interior_0_1.jpg' },
        { id: 'luxury', name: 'Luxury', displayName: '럭셔리', url: '../../static/images/luxury_interior/luxury_interior_0_1.jpg' },
        { id: 'natural', name: 'Natural', displayName: '내추럴', url: '../../static/images/natural_interior/natural_interior_0_1.jpg' },
        { id: 'scandinavian', name: 'Scandinavian', displayName: '스칸디나비안', url: '../../static/images/scandinavian_interior/scandinavian_interior_0_1.jpg' },
        { id: 'french', name: 'French', displayName: '프렌치', url: '../../static/images/prench_interior/prench_interior_0_1.jpg' },
        { id: 'lovely', name: 'Lovely', displayName: '러블리', url: '../../static/images/lovely_interior/lovely_interior_0_1.jpg' },
        { id: 'pastel', name: 'Pastel', displayName: '파스텔', url: '../../static/images/pastel_interior/pastel_interior_0_1.jpg' },
        { id: 'modern', name: 'Modern', displayName: '모던', url: '../../static/images/modern_interior/modern_interior_0_1.jpg' },
        { id: 'bohemian', name: 'Bohemian', displayName: '보헤미안', url: '../../static/images/bohemian_interior/bohemian_interior_0_1.jpg' },
        { id: 'classic', name: 'Classic', displayName: '클래식', url: '../../static/images/calssic_interior/calssic_interior_0_1.jpg' },
        { id: 'industrial', name: 'Industrial', displayName: '인더스트리얼', url: '../../static/images/industrial_interior/industrial_interior_0_1.jpg' },
        { id: 'minimal', name: 'Minimal', displayName: '미니멀', url: '../../static/images/minimal_interior/minimal_interior_0_1.jpg' }
    ];

    // Elements
    const headerNav = document.getElementById('header-nav');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');

    // Step 1
    const btnGenderFemale = document.getElementById('btn-gender-female');
    const btnGenderMale = document.getElementById('btn-gender-male');
    const btnGenderNone = document.getElementById('btn-gender-none');
    const btnStep1Next = document.getElementById('btn-step-1-next');

    // Step 2
    const birthdateInput = document.getElementById('birthdate-input');
    const birthdateError = document.getElementById('birthdate-error');
    const btnStep2Next = document.getElementById('btn-step-2-next');

    // Step 3
    const btnStep3Next = document.getElementById('btn-step-3-next');

    // Step 4
    const styleGrid = document.getElementById('style-grid');
    const btnComplete = document.getElementById('btn-complete');

    // Initialize
    renderHeaderNav();
    renderStyleGrid();

    // Functions
    function renderHeaderNav() {
        headerNav.innerHTML = `
            <button onclick="window.location.href='mypage.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">마이페이지</button>
            <button onclick="window.location.href='../user/reference_board.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">레퍼런스 보드</button>
            <button onclick="window.location.href='preference.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">취향분석</button>
            <button onclick="Auth.logout()" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">로그아웃</button>
        `;
    }

    window.showStep = (s) => {
        step = s;
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        step4.classList.add('hidden');

        if (s === 1) step1.classList.remove('hidden');
        if (s === 2) step2.classList.remove('hidden');
        if (s === 3) step3.classList.remove('hidden');
        if (s === 4) step4.classList.remove('hidden');
    };

    // Step 1 Logic
    window.setGender = (val) => {
        gender = val;
        updateGenderButtons();
        btnStep1Next.disabled = false;
    };

    function updateGenderButtons() {
        [btnGenderFemale, btnGenderMale, btnGenderNone].forEach(btn => {
            btn.className = 'w-full py-3 rounded-full border-2 border-blue-200 hover:border-blue-400 transition-colors';
        });

        if (gender === '여성') btnGenderFemale.className = 'w-full py-3 rounded-full border-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 shadow-lg transition-colors';
        if (gender === '남성') btnGenderMale.className = 'w-full py-3 rounded-full border-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 shadow-lg transition-colors';
        if (gender === '선택 안함') btnGenderNone.className = 'w-full py-3 rounded-full border-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 shadow-lg transition-colors';
    }

    btnStep1Next.addEventListener('click', () => {
        if (gender) showStep(2);
    });

    // Step 2 Logic
    function validateBirthdate(value) {
        if (!/^\d{8}$/.test(value)) return false;
        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        const day = parseInt(value.substring(6, 8));
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
        const today = new Date();
        const kstToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
        const kstTodayString = kstToday.toISOString().slice(0, 10).replace(/-/g, '');
        if (parseInt(value) > parseInt(kstTodayString)) return false;
        return true;
    }

    birthdateInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        birthdate = value;
        e.target.value = value;

        if (value.length > 0 && value.length < 8) {
            birthdateError.textContent = '생년월일을 올바른 형식으로 입력해 주시기 바랍니다.';
            birthdateError.classList.remove('hidden');
            btnStep2Next.disabled = true;
        } else if (value.length === 8) {
            if (!validateBirthdate(value)) {
                birthdateError.textContent = '생년월일을 다시 입력해 주시기 바랍니다.';
                birthdateError.classList.remove('hidden');
                btnStep2Next.disabled = true;
            } else {
                birthdateError.classList.add('hidden');
                btnStep2Next.disabled = false;
            }
        } else {
            birthdateError.classList.add('hidden');
            btnStep2Next.disabled = true;
        }
    });

    btnStep2Next.addEventListener('click', () => {
        if (birthdate && validateBirthdate(birthdate)) showStep(3);
    });

    // Step 3 Logic
    window.setMbti = (index, val) => {
        mbti[index] = val;
        updateMbtiButtons();
        btnStep3Next.disabled = mbti.includes(null);
    };

    function updateMbtiButtons() {
        const buttons = {
            0: { 'E': 'btn-mbti-e', 'I': 'btn-mbti-i' },
            1: { 'S': 'btn-mbti-s', 'N': 'btn-mbti-n' },
            2: { 'T': 'btn-mbti-t', 'F': 'btn-mbti-f' },
            3: { 'J': 'btn-mbti-j', 'P': 'btn-mbti-p' }
        };

        for (let i = 0; i < 4; i++) {
            for (const [val, id] of Object.entries(buttons[i])) {
                const btn = document.getElementById(id);
                if (mbti[i] === val) {
                    btn.className = 'w-full px-8 py-3 rounded-full border-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 shadow-lg transition-colors';
                } else {
                    btn.className = 'w-full px-8 py-3 rounded-full border-2 border-blue-200 hover:border-blue-400 transition-colors';
                }
            }
        }
    }

    btnStep3Next.addEventListener('click', () => {
        if (!mbti.includes(null)) showStep(4);
    });

    // Step 4 Logic
    function renderStyleGrid() {
        styleGrid.innerHTML = styleImages.map(style => {
            // Get random image from IMAGE_DATA if available
            let imageUrl = style.url;

            // Debug check
            if (!window.IMAGE_DATA) {
                console.error("IMAGE_DATA not found!");
                // alert("Error: Image data not loaded. Please refresh.");
            }

            if (window.IMAGE_DATA && window.IMAGE_DATA[style.id] && Array.isArray(window.IMAGE_DATA[style.id])) {
                const images = window.IMAGE_DATA[style.id];
                if (images.length > 0) {
                    const randomIndex = Math.floor(Math.random() * images.length);
                    imageUrl = images[randomIndex];
                }
            }

            // Force hardcoded paths for verification - REMOVED
            // if (style.id === 'vintage') imageUrl = 'images/vintage_interior/vintage_interior_0_1.jpg';
            // if (style.id === 'modern') imageUrl = 'images/modern_interior/modern_interior_0_1.jpg';

            return `
            <button onclick="toggleStyle('${style.id}')" class="relative aspect-square rounded-xl overflow-hidden group">
                <img src="${imageUrl}" alt="${style.name}" class="w-full h-full object-cover">
                <!-- Overlay: Solid Gray Background with Text -->
                <div class="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center" style="background-color: #6b7280;">
                    <p class="text-white text-xl font-bold tracking-wide drop-shadow-lg">${style.displayName}</p>
                </div>
                <!-- Selection Checkmark Overlay -->
                <div id="style-overlay-${style.id}" class="hidden absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <i data-lucide="check" class="w-5 h-5" stroke-width="3"></i>
                    </div>
                </div>
            </button>
        `}).join('');
        lucide.createIcons();
    }

    window.toggleStyle = (id) => {
        if (selectedStyles.includes(id)) {
            selectedStyles = selectedStyles.filter(s => s !== id);
        } else {
            if (selectedStyles.length < 3) {
                selectedStyles.push(id);
            }
        }
        updateStyleSelection();
        btnComplete.disabled = selectedStyles.length === 0;
    };

    function updateStyleSelection() {
        styleImages.forEach(style => {
            const overlay = document.getElementById(`style-overlay-${style.id}`);
            if (selectedStyles.includes(style.id)) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        });
    }

    btnComplete.addEventListener('click', () => {
        if (selectedStyles.length > 0) {
            const preferences = {
                gender,
                birthdate,
                mbti: mbti.join(''),
                styles: selectedStyles
            };
            State.set('userPreferences', preferences);
            window.location.href = '../user/reference_board.html';
        }
    });
});
