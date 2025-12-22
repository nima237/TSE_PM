// Password Authentication
const CORRECT_PASSWORD = 'Tse_1404';

// Check if user is already authenticated
window.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    // If already authenticated, redirect to home
    if (isAuthenticated === 'true') {
        window.location.href = 'home.html';
        return;
    }

    // Setup login form
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const enteredPassword = passwordInput.value.trim();
            
            // Clear previous error
            errorMessage.classList.remove('show');
            submitBtn.disabled = true;
            submitBtn.textContent = 'در حال بررسی...';

            // Simulate a small delay for better UX
            setTimeout(() => {
                if (enteredPassword === CORRECT_PASSWORD) {
                    // Set authentication flag
                    sessionStorage.setItem('authenticated', 'true');
                    
                    // Redirect to home page
                    window.location.href = 'home.html';
                } else {
                    // Show error
                    errorMessage.classList.add('show');
                    passwordInput.value = '';
                    passwordInput.focus();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ورود';
                    
                    // Shake animation on input
                    passwordInput.style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        passwordInput.style.animation = '';
                    }, 500);
                }
            }, 300);
        });

        // Focus on password input when page loads
        passwordInput.focus();

        // Allow Enter key to submit
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }
});

// Protect home.html - check authentication on page load
if (window.location.pathname.includes('home.html')) {
    window.addEventListener('DOMContentLoaded', () => {
        const isAuthenticated = sessionStorage.getItem('authenticated');
        
        if (isAuthenticated !== 'true') {
            // Not authenticated, redirect to login
            window.location.href = 'index.html';
        }
    });
}

