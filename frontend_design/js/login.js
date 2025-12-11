/**
 * Login Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const blockedContainer = document.getElementById('blocked-container');
    const blockedMessage = document.getElementById('blocked-message');

    let failCount = 0;
    let isBlocked = false;
    let blockTimeLeft = 0;
    let timerInterval = null;

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle Icon
        const iconName = type === 'password' ? 'eye' : 'eye-off';
        togglePasswordBtn.innerHTML = `<i data-lucide="${iconName}" class="w-[18px] h-[18px]"></i>`;
        lucide.createIcons();
    });

    // Validation
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorContainer.classList.remove('hidden');
    }

    function hideError() {
        errorContainer.classList.add('hidden');
    }

    function startBlockTimer() {
        isBlocked = true;
        blockTimeLeft = 600; // 10 minutes

        emailInput.disabled = true;
        passwordInput.disabled = true;
        loginButton.disabled = true;

        showError('로그인 5회 실패로 10분간 로그인이 제한됩니다.');

        updateBlockedMessage();
        blockedContainer.classList.remove('hidden');

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            blockTimeLeft--;
            updateBlockedMessage();

            if (blockTimeLeft <= 0) {
                clearInterval(timerInterval);
                isBlocked = false;
                failCount = 0;

                emailInput.disabled = false;
                passwordInput.disabled = false;
                loginButton.disabled = false;

                blockedContainer.classList.add('hidden');
                hideError();
            }
        }, 1000);
    }

    function updateBlockedMessage() {
        const minutes = Math.floor(blockTimeLeft / 60);
        const seconds = blockTimeLeft % 60;
        blockedMessage.textContent = `${minutes}분 ${seconds}초 후 재시도 가능`;
    }

    // Login Handler
    function handleLogin() {
        hideError();

        if (isBlocked) {
            const minutes = Math.floor(blockTimeLeft / 60);
            const seconds = (blockTimeLeft % 60).toString().padStart(2, '0');
            showError(`10분 후 다시 시도해주세요. (${minutes}:${seconds})`);
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!validateEmail(email)) {
            showError('올바른 이메일 형식이 아닙니다.');
            return;
        }

        if (!email || !password) {
            showError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        // Mock Login
        const mockEmail = 'test@test.com';
        const mockPassword = 'test123!';

        if (email !== mockEmail || password !== mockPassword) {
            failCount++;

            if (failCount >= 5) {
                startBlockTimer();
            } else {
                showError(`이메일 또는 비밀번호가 일치하지 않습니다. (${failCount}/5)`);
            }
            return;
        }

        // Success
        Auth.login(email);
    }

    loginButton.addEventListener('click', handleLogin);

    // Enter key support
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    });
});
