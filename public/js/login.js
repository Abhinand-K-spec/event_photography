// Login Page Functionality
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertMessage = document.getElementById('alertMessage');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// Tab switching
loginTab.addEventListener('click', () => {
    loginTab.classList.remove('btn-secondary');
    loginTab.classList.add('btn-primary');
    registerTab.classList.remove('btn-primary');
    registerTab.classList.add('btn-secondary');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    clearAlert();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.remove('btn-secondary');
    registerTab.classList.add('btn-primary');
    loginTab.classList.remove('btn-primary');
    loginTab.classList.add('btn-secondary');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    clearAlert();
});

// Show alert message
function showAlert(message, type = 'error') {
    alertMessage.className = `alert alert-${type}`;
    alertMessage.textContent = message;
    alertMessage.classList.remove('hidden');
}

function clearAlert() {
    alertMessage.classList.add('hidden');
}

// Handle login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        const data = await authAPI.login(email, password);

        // Store token and photographer info
        localStorage.setItem('token', data.token);
        localStorage.setItem('photographer', JSON.stringify(data.photographer));

        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

// Handle registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        registerButton.disabled = true;
        registerButton.textContent = 'Creating account...';

        const data = await authAPI.register(name, email, password);

        // Store token and photographer info
        localStorage.setItem('token', data.token);
        localStorage.setItem('photographer', JSON.stringify(data.photographer));

        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Create Account';
    }
});

// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = '/dashboard.html';
}
