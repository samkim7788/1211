/**
 * Chat Page Logic
 */

// Mock Data
const mockProducts = [
    { id: '1', name: '빈티지 패브릭 소파', brand: 'Brand A', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', price: '₩450,000', link: 'https://example.com/product1' },
    { id: '2', name: '원목 커피 테이블', brand: 'Brand B', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', price: '₩180,000', link: 'https://example.com/product2' },
    { id: '3', name: '북유럽 스타일 조명', brand: 'Brand C', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', price: '₩95,000', link: 'https://example.com/product3' },
    { id: '4', name: '미니멀 선반', brand: 'Brand D', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400', price: '₩65,000', link: 'https://example.com/product4' },
    { id: '5', name: '모던 러그 (180x120)', brand: 'Brand E', image: 'https://images.unsplash.com/photo-1609447650324-f332ae27f824?w=400', price: '₩145,000', link: 'https://example.com/product5' },
    { id: '6', name: '감성 액자 세트', brand: 'Brand F', image: 'https://images.unsplash.com/photo-1670785312569-397ff6a5dc55?w=400', price: '₩52,000', link: 'https://example.com/product6' },
    { id: '7', name: '그린 인테리어 식물', brand: 'Brand G', image: 'https://images.unsplash.com/photo-1602522431179-f6552611447e?w=400', price: '₩38,000', link: 'https://example.com/product7' },
    { id: '8', name: '라탄 수납 바구니', brand: 'Brand H', image: 'https://images.unsplash.com/photo-1722084060661-d3df28314d85?w=400', price: '₩42,000', link: 'https://example.com/product8' },
];

const exampleQuestions = [
    '빈티지 스타일 소파 추천해줘',
    '원목 테이블 어디서 구매할 수 있을까?',
    '작은 거실에 어울리는 인테리어 소품은?',
    '모던한 조명 추천 부탁해',
];

document.addEventListener('DOMContentLoaded', () => {
    // State
    let sessions = State.get('chat_sessions', []);
    let currentSessionId = null;
    let favoriteProducts = State.get('favoriteProducts', []);
    let userPreferences = State.get('userPreferences', null);
    let excludedProductIds = new Set();
    let uploadedImage = null;
    let sidebarOpen = true;
    let historyExpanded = false;
    let favoritesExpanded = false;
    let sessionToDelete = null;

    // Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarLoggedOut = document.getElementById('sidebar-logged-out');
    const sidebarLoggedIn = document.getElementById('sidebar-logged-in');
    const sessionContext = document.getElementById('session-context');
    const headerNav = document.getElementById('header-nav');
    const emptyState = document.getElementById('empty-state');
    const messagesContainer = document.getElementById('messages-container');
    const messagesList = document.getElementById('messages-list');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const fileInput = document.getElementById('file-input');
    const btnUploadImage = document.getElementById('btn-upload-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const btnRemoveImage = document.getElementById('btn-remove-image');
    const charCount = document.getElementById('char-count');
    const exampleQuestionsContainer = document.getElementById('example-questions');

    // Initialize
    const isLoggedIn = Auth.isLoggedIn();
    updateSidebarVisibility();
    renderHeaderNav();
    renderExampleQuestions();

    if (isLoggedIn) {
        // Load last session or create new if none
        if (sessions.length > 0) {
            currentSessionId = sessions[0].id;
        }
        renderSidebar();
        renderMessages();
    } else {
        showEmptyState();
    }

    // Event Listeners
    document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;
        sidebar.classList.toggle('-ml-72', !sidebarOpen);
    });

    document.getElementById('btn-new-chat').addEventListener('click', createNewSession);

    document.getElementById('btn-toggle-history').addEventListener('click', () => {
        historyExpanded = !historyExpanded;
        if (historyExpanded) favoritesExpanded = false;
        renderSidebar();
    });

    document.getElementById('btn-toggle-favorites').addEventListener('click', () => {
        favoritesExpanded = !favoritesExpanded;
        if (favoritesExpanded) historyExpanded = false;
        renderSidebar();
    });

    document.getElementById('btn-reset-context').addEventListener('click', resetContext);

    chatInput.addEventListener('input', (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
        charCount.textContent = `${e.target.value.length}/200`;
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    btnSend.addEventListener('click', () => handleSend());

    btnUploadImage.addEventListener('click', () => {
        if (Auth.requireLogin()) fileInput.click();
    });

    fileInput.addEventListener('change', handleImageUpload);
    btnRemoveImage.addEventListener('click', () => {
        uploadedImage = null;
        imagePreviewContainer.classList.add('hidden');
        btnUploadImage.disabled = false;
    });

    document.getElementById('btn-show-guidelines-link').addEventListener('click', () => {
        document.getElementById('popup-guidelines').classList.remove('hidden');
    });

    document.getElementById('btn-show-guidelines-badge').addEventListener('click', () => {
        document.getElementById('popup-guidelines').classList.remove('hidden');
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', confirmDeleteSession);

    // Functions
    function updateSidebarVisibility() {
        if (isLoggedIn) {
            sidebarLoggedOut.classList.add('hidden');
            sidebarLoggedIn.classList.remove('hidden');
            sessionContext.classList.remove('hidden');
            chatInput.disabled = false;
            chatInput.placeholder = '인테리어 고민을 물어보세요...';
            btnSend.disabled = false;
            btnSend.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            btnSend.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-blue-400', 'text-white');
            btnUploadImage.disabled = false;
            btnUploadImage.classList.remove('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
            btnUploadImage.classList.add('bg-gradient-to-r', 'from-blue-100', 'to-yellow-100', 'text-blue-600');
            document.getElementById('input-warning').classList.remove('hidden');
            document.getElementById('welcome-auth-buttons').classList.add('hidden');
        } else {
            sidebarLoggedOut.classList.remove('hidden');
            sidebarLoggedIn.classList.add('hidden');
            sessionContext.classList.add('hidden');
            document.getElementById('welcome-auth-buttons').classList.remove('hidden');
        }
    }

    function renderHeaderNav() {
        if (isLoggedIn) {
            headerNav.innerHTML = `
                <button onclick="window.location.href='mypage.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">마이페이지</button>
                <button onclick="window.location.href='reference_board.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">레퍼런스 보드</button>
                <button onclick="window.location.href='preference.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">취향분석</button>
                <button onclick="Auth.logout()" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">로그아웃</button>
            `;
        } else {
            headerNav.innerHTML = `
                <button onclick="window.location.href='signup.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">회원가입</button>
                <button onclick="window.location.href='login.html'" class="px-4 py-2 text-[15px] font-normal text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all leading-none">로그인</button>
            `;
        }
    }

    function renderExampleQuestions() {
        exampleQuestionsContainer.innerHTML = exampleQuestions.map(q => `
            <button onclick="handleExampleClick('${q}')" class="text-left px-5 py-3.5 bg-white/90 backdrop-blur border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all transform hover:-translate-y-1 text-sm">
                <span class="text-blue-600 mr-2">💡</span>
                <span class="text-gray-700">${q}</span>
            </button>
        `).join('');
    }

    window.handleExampleClick = (q) => {
        if (Auth.requireLogin()) handleSend(q);
    };

    function renderSidebar() {
        // History
        const historyList = document.getElementById('history-list');
        const historyCount = document.getElementById('history-count');
        const iconHistory = document.getElementById('icon-history-toggle');

        historyCount.textContent = sessions.length;
        iconHistory.setAttribute('data-lucide', historyExpanded ? 'chevron-up' : 'chevron-down');

        if (historyExpanded) {
            historyList.classList.remove('hidden');
            if (sessions.length === 0) {
                historyList.innerHTML = '<div class="text-center py-7 text-gray-400 text-xs"><p>채팅 히스토리가 없어요</p><p class="text-xs mt-1">새 채팅을 시작해보세요!</p></div>';
            } else {
                historyList.innerHTML = sessions.map(s => `
                    <div class="relative group">
                        <button onclick="switchSession('${s.id}')" class="w-full text-left px-3.5 py-2.5 rounded-lg mb-2 transition-all text-sm ${s.id === currentSessionId ? 'bg-gradient-to-r from-blue-100 to-yellow-100 shadow-md' : 'hover:bg-blue-50'}">
                            <p class="truncate">${s.title}</p>
                            <p class="text-xs text-gray-500 mt-1">💬 ${s.messages.length}개의 메시지</p>
                        </button>
                        <button onclick="deleteSession('${s.id}')" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all">
                            <i data-lucide="trash-2" class="text-red-500 w-[15px] h-[15px]"></i>
                        </button>
                    </div>
                `).join('');
            }
        } else {
            historyList.classList.add('hidden');
        }

        // Favorites
        const favoritesList = document.getElementById('favorites-list');
        const favoritesCount = document.getElementById('favorites-count');
        const iconFavorites = document.getElementById('icon-favorites-toggle');

        favoritesCount.textContent = favoriteProducts.length;
        iconFavorites.setAttribute('data-lucide', favoritesExpanded ? 'chevron-up' : 'chevron-down');

        if (favoritesExpanded) {
            favoritesList.classList.remove('hidden');
            if (favoriteProducts.length === 0) {
                favoritesList.innerHTML = '<div class="text-center py-7 text-gray-400 text-xs"><i data-lucide="heart" class="mx-auto mb-2 opacity-30 w-[26px] h-[26px]"></i><p>아직 관심 상품이 없어요</p><p class="text-xs mt-1">채팅에서 상품을 추천받아보세요!</p></div>';
            } else {
                favoritesList.innerHTML = favoriteProducts.map(p => `
                    <div class="bg-white rounded-lg overflow-hidden shadow-sm">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-28 object-cover">
                        <div class="p-2.5">
                            <p class="text-xs mb-1 truncate">${p.name}</p>
                            <p class="text-xs text-blue-600 mb-2">${p.price}</p>
                            <div class="flex gap-2">
                                <a href="${p.link}" target="_blank" class="flex-1 text-center px-2.5 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs">구매하기</a>
                                <button onclick="removeFavorite('${p.id}')" class="p-1.5 hover:bg-red-100 rounded-md transition-colors" title="관심 상품 해제">
                                    <i data-lucide="x" class="text-red-500 w-[15px] h-[15px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            favoritesList.classList.add('hidden');
        }

        // Context
        const currentSession = sessions.find(s => s.id === currentSessionId);
        if (currentSession) {
            document.getElementById('ctx-category').textContent = currentSession.context?.category || '(미설정)';
            document.getElementById('ctx-mood').textContent = currentSession.context?.mood || '(미설정)';
            document.getElementById('ctx-budget').textContent = currentSession.context?.budget || '(미설정)';
            document.getElementById('ctx-space').textContent = currentSession.context?.space || '(미설정)';

            const modeEl = document.getElementById('ctx-mode');
            const mode = currentSession.context?.mode || 'SMALL TALK';
            modeEl.textContent = mode;
            modeEl.className = `text-xs px-2 py-0.5 rounded-full text-white ${mode === 'SURVEY' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    mode === 'RECOMMEND' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`;
        }

        lucide.createIcons();
    }

    window.switchSession = (id) => {
        currentSessionId = id;
        excludedProductIds = new Set();
        renderSidebar();
        renderMessages();
    };

    window.deleteSession = (id) => {
        sessionToDelete = id;
        document.getElementById('popup-delete-confirm').classList.remove('hidden');
    };

    function confirmDeleteSession() {
        if (sessionToDelete) {
            sessions = sessions.filter(s => s.id !== sessionToDelete);
            State.set('chat_sessions', sessions);
            if (currentSessionId === sessionToDelete) {
                currentSessionId = sessions.length > 0 ? sessions[0].id : null;
            }
            document.getElementById('popup-delete-confirm').classList.add('hidden');
            sessionToDelete = null;
            renderSidebar();
            renderMessages();
        }
    }

    window.removeFavorite = (id) => {
        favoriteProducts = favoriteProducts.filter(p => p.id !== id);
        State.set('favoriteProducts', favoriteProducts);
        renderSidebar();
        renderMessages(); // Re-render to update heart icons
    };

    window.addFavorite = (product) => {
        if (!favoriteProducts.find(p => p.id === product.id)) {
            favoriteProducts.push(product);
            State.set('favoriteProducts', favoriteProducts);
            renderSidebar();
            renderMessages();
        }
    };

    function createNewSession() {
        if (!Auth.requireLogin()) return;
        currentSessionId = null;
        excludedProductIds = new Set();
        showEmptyState();
        renderSidebar();
    }

    function resetContext() {
        if (currentSessionId) {
            sessions = sessions.map(s => {
                if (s.id === currentSessionId) {
                    return { ...s, context: { mode: 'SMALL TALK' } };
                }
                return s;
            });
            State.set('chat_sessions', sessions);
            excludedProductIds = new Set();
            renderSidebar();
        }
    }

    function showEmptyState() {
        emptyState.classList.remove('hidden');
        messagesContainer.classList.add('hidden');
    }

    function renderMessages() {
        if (!currentSessionId) {
            showEmptyState();
            return;
        }

        const session = sessions.find(s => s.id === currentSessionId);
        if (!session) {
            showEmptyState();
            return;
        }

        emptyState.classList.add('hidden');
        messagesContainer.classList.remove('hidden');

        messagesList.innerHTML = session.messages.map(msg => {
            const isUser = msg.sender === 'user';
            const time = new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

            let productsHtml = '';
            if (msg.products && msg.products.length > 0) {
                productsHtml = `
                    <div class="mt-3.5">
                        <div class="grid grid-cols-3 gap-3 mb-3.5">
                            ${msg.products.map(p => {
                    const isFav = favoriteProducts.some(fp => fp.id === p.id);
                    return `
                                <div class="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all group">
                                    <div class="relative aspect-square">
                                        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                        <button onclick="${isFav ? `removeFavorite('${p.id}')` : `addFavorite({id:'${p.id}',name:'${p.name}',brand:'${p.brand}',image:'${p.image}',price:'${p.price}',link:'${p.link}'})`}" class="absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all shadow-lg ${isFav ? 'bg-pink-500/90' : 'bg-white/90 hover:bg-pink-50/90'}" title="${isFav ? '관심 상품 해제' : '관심 상품 등록'}">
                                            <i data-lucide="heart" class="${isFav ? 'text-white fill-white' : 'text-pink-500'} w-[15px] h-[15px]"></i>
                                        </button>
                                    </div>
                                    <div class="p-3.5">
                                        <h4 class="mb-1 truncate text-sm">${p.name}</h4>
                                        <p class="text-xs text-gray-500 mb-2">${p.brand}</p>
                                        <p class="text-blue-600 mb-2.5 text-sm">${p.price}</p>
                                        <a href="${p.link}" target="_blank" class="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all shadow-sm text-xs">
                                            <i data-lucide="external-link" class="w-[13px] h-[13px]"></i> 구매하기
                                        </a>
                                    </div>
                                </div>
                                `;
                }).join('')}
                        </div>
                        <div class="flex items-center gap-2.5">
                            <button onclick="handleRequestMore(${msg.id})" class="px-3.5 py-2 bg-white border-2 border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-all text-xs">🔄 다른 상품을 원해요</button>
                            <div class="flex gap-2">
                                <button onclick="handleLike(${msg.id}, true)" class="p-2 rounded-full transition-all ${msg.liked === true ? 'bg-blue-500 text-white' : 'bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50'}">
                                    <i data-lucide="thumbs-up" class="w-[15px] h-[15px]"></i>
                                </button>
                                <button onclick="handleLike(${msg.id}, false)" class="p-2 rounded-full transition-all ${msg.liked === false ? 'bg-red-500 text-white' : 'bg-white border-2 border-red-300 text-red-600 hover:bg-red-50'}">
                                    <i data-lucide="thumbs-down" class="w-[15px] h-[15px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[70%] px-5 py-3.5 rounded-2xl shadow-md text-sm ${isUser ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white' : 'bg-white text-gray-800 border border-blue-100'}">
                        ${msg.image ? `<img src="${msg.image}" class="rounded-xl mb-2.5 max-w-full shadow-md">` : ''}
                        ${msg.text ? `<p class="leading-relaxed">${msg.text}</p>` : ''}
                        <p class="text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}">${time}</p>
                    </div>
                </div>
                ${productsHtml}
            `;
        }).join('') + '<div class="h-4"></div>';

        lucide.createIcons();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleSend(customText) {
        if (!Auth.requireLogin()) return;

        const text = customText || chatInput.value.trim();
        if (!text && !uploadedImage) return;

        if (text.length > 200) {
            showAlert('질문은 최대 200자 이내로 입력해주세요.');
            return;
        }

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date(),
            image: uploadedImage
        };

        // Create session if needed
        if (!currentSessionId) {
            const today = new Date().toISOString().split('T')[0];
            const sessionsToday = sessions.filter(s => s.date === today);
            const sessionNumber = sessionsToday.length + 1;
            const title = sessionNumber > 1 ? `${today} (${sessionNumber})` : today;

            const newSession = {
                id: Date.now().toString(),
                date: today,
                title: title,
                messages: [userMessage],
                context: { mode: 'SMALL TALK' }
            };

            sessions.unshift(newSession);
            currentSessionId = newSession.id;
        } else {
            const session = sessions.find(s => s.id === currentSessionId);
            session.messages.push(userMessage);
        }

        State.set('chat_sessions', sessions);

        // Reset Input
        chatInput.value = '';
        chatInput.style.height = '44px';
        charCount.textContent = '0/200';
        uploadedImage = null;
        imagePreviewContainer.classList.add('hidden');
        btnUploadImage.disabled = false;

        renderSidebar();
        renderMessages();

        // Bot Response
        setTimeout(() => {
            const response = generateBotResponse(text);
            const botMessage = {
                id: Date.now() + Math.random(),
                text: response.text,
                sender: 'bot',
                timestamp: new Date(),
                products: response.products,
                liked: null
            };

            const session = sessions.find(s => s.id === currentSessionId);
            session.messages.push(botMessage);
            if (response.products) session.context.mode = 'RECOMMEND';

            State.set('chat_sessions', sessions);
            renderSidebar();
            renderMessages();
        }, 1000);
    }

    function generateBotResponse(text) {
        const keywords = ['소파', '테이블', '조명', '선반', '가구', '인테리어'];
        const hasKeyword = keywords.some(k => text.includes(k));

        if (hasKeyword) {
            const numProducts = Math.floor(Math.random() * 3) + 1;
            const availableProducts = mockProducts.filter(p => !excludedProductIds.has(p.id));

            let selectedProducts;
            if (availableProducts.length === 0) {
                excludedProductIds = new Set();
                const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
                selectedProducts = shuffled.slice(0, numProducts);
            } else {
                const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
                selectedProducts = shuffled.slice(0, Math.min(numProducts, availableProducts.length));
            }

            selectedProducts.forEach(p => excludedProductIds.add(p.id));

            return {
                text: `${userPreferences?.gender || '회원'}님의 취향을 고려해 선별한 상품들이에요! 마음에 드시나요?`,
                products: selectedProducts
            };
        }

        return {
            text: '어떤 스타일의 제품을 찾으시나요? 구체적으로 알려주시면 더 정확한 추천이 가능해요!'
        };
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match(/^image\/(jpeg|png)$/)) {
                showAlert('JPG 또는 PNG 파일만 업로드 가능합니다.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showAlert('이미지 크기는 10MB를 초과할 수 없습니다.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = e.target.result;
                imagePreview.src = uploadedImage;
                imagePreviewContainer.classList.remove('hidden');
                btnUploadImage.disabled = true;
            };
            reader.readAsDataURL(file);
        }
    }

    window.handleLike = (msgId, liked) => {
        const session = sessions.find(s => s.id === currentSessionId);
        const msg = session.messages.find(m => m.id === msgId);
        if (msg) {
            msg.liked = liked;
            State.set('chat_sessions', sessions);
            renderMessages();
        }
    };

    window.handleRequestMore = (msgId) => {
        const availableProducts = mockProducts.filter(p => !excludedProductIds.has(p.id));
        let selectedProducts;
        let messageText;

        if (availableProducts.length === 0) {
            excludedProductIds = new Set();
            const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
            selectedProducts = shuffled.slice(0, 3);
            messageText = '모든 상품을 다 보셨네요! 처음부터 다시 추천해드릴게요 😊';
        } else {
            const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
            selectedProducts = shuffled.slice(0, Math.min(3, availableProducts.length));
            messageText = '다른 스타일의 상품들을 준비했어요!';
        }

        selectedProducts.forEach(p => excludedProductIds.add(p.id));

        const botMessage = {
            id: Date.now() + Math.random(),
            text: messageText,
            sender: 'bot',
            timestamp: new Date(),
            products: selectedProducts,
            liked: null
        };

        const session = sessions.find(s => s.id === currentSessionId);
        session.messages.push(botMessage);
        State.set('chat_sessions', sessions);
        renderMessages();
    };

    function showAlert(msg) {
        document.getElementById('alert-message').textContent = msg;
        document.getElementById('popup-alert').classList.remove('hidden');
    }
});
