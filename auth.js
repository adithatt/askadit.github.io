// Authentication functions
const USERNAME = 'ahattikudur';
const PASSWORD = 'test123';
const AUTH_KEY = 'askadit_auth';

function login(username, password) {
    if (username === USERNAME && password === PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
