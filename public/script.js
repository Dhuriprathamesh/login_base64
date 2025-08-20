document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animate the toggle button
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });

    // Find the login form in the new structure
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const loginBtn = document.querySelector('.login-btn');
    const rememberCheckbox = document.getElementById('remember');

    // Floating label effect for new UI
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Handle Login (restored logic)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            try {
                const serverUrl = window.location.origin;
                const response = await fetch(`${serverUrl}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    showSuccess('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.replace(`${serverUrl}/dashboard`);
                    }, 1000);
                } else {
                    showError(data.error || 'Login failed');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = 'Login';
                }
            } catch (error) {
                showError('An error occurred. Please try again.');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        });
    }

    // Social login buttons (show coming soon)
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.classList.contains('google') ? 'Google' :
                             button.classList.contains('facebook') ? 'Facebook' :
                             button.classList.contains('github') ? 'GitHub' : 'Social';
            showError(`${platform} login coming soon!`);
        });
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(() => { errorDiv.remove(); }, 3000);
        }
    }
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => { successDiv.remove(); }, 2000);
        }
    }

    // Password strength indicator
    passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);
        updatePasswordStrengthIndicator(strength);
    });

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    }

    function updatePasswordStrengthIndicator(strength) {
        const inputGroup = passwordInput.parentElement;
        let existingIndicator = document.querySelector('.password-strength');
        if (!existingIndicator) {
            existingIndicator = document.createElement('div');
            existingIndicator.className = 'password-strength';
            // Insert after the password input group, before remember-forgot
            const remember = document.querySelector('.remember-forgot');
            if (remember) {
                remember.parentNode.insertBefore(existingIndicator, remember);
            } else {
                inputGroup.parentNode.insertBefore(existingIndicator, inputGroup.nextSibling);
            }
        }
        const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        existingIndicator.innerHTML = `
            <div class="strength-bars">
                ${Array(4).fill(0).map((_, i) => `
                    <div class="strength-bar ${i < strength ? 'active' : ''}" 
                         style="background-color: ${i < strength ? strengthColors[strength - 1] : '#e5e7eb'}">
                    </div>
                `).join('')}
            </div>
            <span class="strength-text" style="color: ${strengthColors[strength - 1]}">
                ${strengthText[strength - 1]}
            </span>
        `;
    }

    // Check authentication status on dashboard
    if (window.location.pathname === '/dashboard') {
        const user = sessionStorage.getItem('user');
        if (!user) {
            window.location.replace(`${window.location.origin}/`);
        } else {
            // Display user information
            const userData = JSON.parse(user);
            const welcomeMessage = document.getElementById('welcomeMessage');
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${userData.name}!`;
            }
        }
    }

    // Enhanced email validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Shake animation for invalid inputs
    function shakeElement(element) {
        element.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Reset error states
    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.opacity = '0';
            error.style.transform = 'translateY(-10px)';
            setTimeout(() => error.remove(), 300);
        });
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e5e7eb';
        });
    }

    // Add shake animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .password-strength {
            margin-top: 8px;
            font-size: 12px;
        }
        
        .strength-bars {
            display: flex;
            gap: 4px;
            margin-bottom: 4px;
        }
        
        .strength-bar {
            height: 4px;
            flex: 1;
            border-radius: 2px;
            transition: background-color 0.3s ease;
        }
        
        .success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Remember me functionality
    if (localStorage.getItem('rememberedEmail')) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        rememberCheckbox.checked = true;
    }

    rememberCheckbox.addEventListener('change', () => {
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', emailInput.value);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
}); 