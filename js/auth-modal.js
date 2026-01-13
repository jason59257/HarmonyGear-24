// Auth Modal Functions

function openAuthModal(type = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthForm(type);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchAuthForm(type) {
    const loginContainer = document.getElementById('loginFormContainer');
    const registerContainer = document.getElementById('registerFormContainer');
    
    if (type === 'login') {
        if (loginContainer) loginContainer.style.display = 'block';
        if (registerContainer) registerContainer.style.display = 'none';
    } else if (type === 'register') {
        if (loginContainer) loginContainer.style.display = 'none';
        if (registerContainer) registerContainer.style.display = 'block';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const eyeIcon = button.querySelector('.eye-icon');
    const eyeOffIcon = button.querySelector('.eye-off-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (eyeIcon) eyeIcon.style.display = 'none';
        if (eyeOffIcon) eyeOffIcon.style.display = 'block';
    } else {
        input.type = 'password';
        if (eyeIcon) eyeIcon.style.display = 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Here you would normally send this to your backend
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, save user to localStorage
    const userData = {
        email: email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    updateAuthUI();
    
    // Close modal
    closeAuthModal();
    
    showNotification('Login successful!');
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const emailError = document.getElementById('registerEmailError');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.style.display = 'block';
        document.getElementById('registerEmail').style.borderColor = '#dc3545';
        return;
    } else {
        emailError.style.display = 'none';
        document.getElementById('registerEmail').style.borderColor = '';
    }
    
    // Validate password match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match');
        return;
    }
    
    // Validate password length
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters');
        return;
    }
    
    // Here you would normally send this to your backend
    console.log('Registration attempt:', { email, password });
    
    // For demo purposes, save user to localStorage and auto-login
    const userData = {
        email: email,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    updateAuthUI();
    
    // Close modal
    closeAuthModal();
    
    showNotification('Registration successful! You are now logged in.');
}

function handleSocialLogin(provider) {
    console.log('Social login:', provider);
    showNotification(`${provider} login functionality will be implemented with backend`);
}

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAuthModal();
    }
});

// Update authentication UI based on login status
function updateAuthUI() {
    const isLoggedIn = checkLoginStatus();
    const rewardsLink = document.getElementById('rewardsLink');
    const authButtons = document.getElementById('authButtons');
    const userAccount = document.getElementById('userAccount');
    const userEmail = document.getElementById('userEmail');
    const mobileMenuAuth = document.getElementById('mobileMenuAuth');
    const mobileMenuUser = document.getElementById('mobileMenuUser');
    const mobileUserEmail = document.getElementById('mobileUserEmail');
    
    if (isLoggedIn) {
        // Show rewards link and user account (desktop)
        if (rewardsLink) rewardsLink.style.display = 'flex';
        if (userAccount) userAccount.style.display = 'flex';
        
        // Hide auth buttons (desktop)
        if (authButtons) authButtons.style.display = 'none';
        
        // Update user email
        const user = JSON.parse(localStorage.getItem('user'));
        if (userEmail && user) {
            userEmail.textContent = user.email.split('@')[0]; // Show username part
        }
        if (mobileUserEmail && user) {
            mobileUserEmail.textContent = user.email.split('@')[0]; // Show username part
        }
        
        // Mobile menu: hide auth buttons, show user info
        if (mobileMenuAuth) mobileMenuAuth.style.display = 'none';
        if (mobileMenuUser) mobileMenuUser.style.display = 'block';
    } else {
        // Hide rewards link and user account (desktop)
        if (rewardsLink) rewardsLink.style.display = 'none';
        if (userAccount) userAccount.style.display = 'none';
        
        // Show auth buttons (desktop)
        if (authButtons) authButtons.style.display = 'flex';
        
        // Mobile menu: show auth buttons, hide user info
        if (mobileMenuAuth) mobileMenuAuth.style.display = 'flex';
        if (mobileMenuUser) mobileMenuUser.style.display = 'none';
    }
}

// Initialize email validation on input
document.addEventListener('DOMContentLoaded', function() {
    const registerEmail = document.getElementById('registerEmail');
    if (registerEmail) {
        registerEmail.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailError = document.getElementById('registerEmailError');
            if (!emailRegex.test(this.value) && this.value.length > 0) {
                emailError.style.display = 'block';
                this.style.borderColor = '#dc3545';
            } else {
                emailError.style.display = 'none';
                this.style.borderColor = '';
            }
        });
    }
    
    // Update UI on page load
    updateAuthUI();
    
    // User account dropdown toggle
    const userAccountBtn = document.getElementById('userAccountBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAccountBtn && userDropdown) {
        userAccountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('active');
        });
    }
});
