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

    const signupForm = document.getElementById('signupForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const signupBtn = document.querySelector('.login-btn');
    const termsCheckbox = document.getElementById('terms');

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

    // Toggle password visibility for both password fields
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = fullnameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            if (!termsCheckbox.checked) {
                showError('Please accept the terms and conditions');
                return;
            }
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            try {
                const serverUrl = window.location.origin;
                const response = await fetch(`${serverUrl}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    showSuccess('Account created successfully! Redirecting to login...');
                    setTimeout(() => {
                        window.location.replace('index.html');
                    }, 2000);
                } else {
                    showError(data.error || 'Signup failed');
                    signupBtn.disabled = false;
                    signupBtn.innerHTML = 'Create Account';
                }
            } catch (error) {
                showError('An error occurred. Please try again.');
                signupBtn.disabled = false;
                signupBtn.innerHTML = 'Create Account';
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
            showError(`${platform} signup coming soon!`);
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
        successDiv.className = 'success-message signup';
        successDiv.innerHTML = `<i class='fas fa-check-circle'></i> ${message}`;
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
        updatePasswordMatchIndicator(passwordInput.value && confirmPasswordInput.value ? passwordInput.value === confirmPasswordInput.value : null);
    });

    // Password match checking
    confirmPasswordInput.addEventListener('input', () => {
        updatePasswordMatchIndicator(passwordInput.value && confirmPasswordInput.value ? passwordInput.value === confirmPasswordInput.value : null);
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
        let existingIndicator = document.querySelector('.password-strength');
        if (!existingIndicator) {
            existingIndicator = document.createElement('div');
            existingIndicator.className = 'password-strength';
            const passwordGroup = document.getElementById('password').parentElement;
            const confirmGroup = document.getElementById('confirmPassword').parentElement;
            passwordGroup.parentNode.insertBefore(existingIndicator, confirmGroup);
        }
        const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
        if (typeof strength !== 'number' || strength < 1) {
            existingIndicator.innerHTML = '';
            return;
        }
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

    function updatePasswordMatchIndicator(match) {
        let existingIndicator = document.querySelector('.password-match-indicator');
        if (!existingIndicator) {
            existingIndicator = document.createElement('div');
            existingIndicator.className = 'password-match-indicator';
            const confirmGroup = document.getElementById('confirmPassword').parentElement;
            const terms = document.querySelector('.terms-checkbox');
            confirmGroup.parentNode.insertBefore(existingIndicator, terms);
        }
        existingIndicator.classList.remove('match', 'nomatch');
        if (match === null) {
            existingIndicator.innerHTML = '';
        } else if (match) {
            existingIndicator.classList.add('match');
            existingIndicator.innerHTML = `<span class='strength-text'><i class='fas fa-check-circle'></i> Passwords match</span>`;
        } else {
            existingIndicator.classList.add('nomatch');
            existingIndicator.innerHTML = `<span class='strength-text'><i class='fas fa-times-circle'></i> Passwords do not match</span>`;
        }
    }

    // Email validation function
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
});