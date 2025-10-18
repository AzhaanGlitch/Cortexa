// API Configuration
const API_URL = 'http://localhost:5000/api';

// Initialize auth state checks - RUN IMMEDIATELY
(function initializeAuthState() {
    const currentPath = window.location.pathname;
    const currentHref = window.location.href;
    const isAuthPage = currentPath.includes('login') || currentPath.includes('register') || currentPath === '/' || currentPath === '/index.html' || currentHref.includes('login') || currentHref.includes('register');
    const isAuthenticated = localStorage.getItem('token') !== null;

    console.log('=== AUTH CHECK ===');
    console.log('Current Path:', currentPath);
    console.log('Current Href:', currentHref);
    console.log('Is Auth Page:', isAuthPage);
    console.log('Is Authenticated:', isAuthenticated);

    // PRIORITY 1: If NOT authenticated and NOT on auth page -> GO TO LOGIN
    if (!isAuthenticated && !isAuthPage) {
        console.log('❌ NOT AUTH + NOT ON AUTH PAGE -> REDIRECT TO LOGIN');
        window.location.replace('/login.html');
        return;
    }

    // PRIORITY 2: If authenticated and IS on auth page -> GO TO DASHBOARD
    if (isAuthenticated && (currentPath.includes('login') || currentPath.includes('register'))) {
        console.log('✅ AUTH + ON AUTH PAGE -> REDIRECT TO DASHBOARD');
        window.location.replace('/index.html');
        return;
    }

    console.log('✅ Auth check passed');
})();

// Initialize auth forms when they exist
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');

    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    loginBtn.disabled = true;
    hideError();

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('✅ Login successful');

        // Show success message
        showSuccess('Login successful! Redirecting...');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.replace('/index.html');
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.');
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        loginBtn.disabled = false;
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const btnText = registerBtn.querySelector('.btn-text');
    const btnLoader = registerBtn.querySelector('.btn-loader');

    // Validations
    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (document.getElementById('agreeTerms') && !document.getElementById('agreeTerms').checked) {
        showError('Please agree to the terms and conditions');
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    registerBtn.disabled = true;
    hideError();

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('✅ Registration successful');

        // Show success message
        showSuccess('Account created! Redirecting...');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.replace('/index.html');
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message || 'Registration failed. Please try again.');
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        registerBtn.disabled = false;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Logout user
function logout() {
    console.log('🚪 Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login.html');
}

// Show error message
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'block';
        errorAlert.classList.remove('alert-success');
        errorAlert.classList.add('alert-danger');
        
        console.log('⚠️ Error shown:', message);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    }
}

// Hide error message
function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorAlert.classList.remove('alert-danger');
        errorAlert.classList.add('alert-success');
        errorMessage.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
        errorAlert.style.display = 'block';
    }
}

// API Request with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle unauthorized - redirect to login
            if (response.status === 401) {
                logout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Export functions for use in other files
window.auth = {
    isAuthenticated,
    getCurrentUser,
    getAuthToken,
    logout,
    apiRequest
};