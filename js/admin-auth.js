document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');

    // Superuser credentials
    const SUPERUSER_USERNAME = 'admin';
    const SUPERUSER_PASSWORD = '$unteck$23'; // In a real application, this should be hashed and validated on the server.

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            if (username === SUPERUSER_USERNAME && password === SUPERUSER_PASSWORD) {
                // Store login status in sessionStorage (simple client-side auth for this example)
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                // Redirect to admin dashboard
                window.location.href = '/admin-dashboard.html'; // Made path root-relative
            } else {
                if (loginError) {
                    loginError.textContent = 'Invalid username or password.';
                    loginError.style.display = 'block';
                }
            }
        });
    }

    // Check if user is logged in on other admin pages
    // This is a basic check. For robust security, server-side authentication is crucial.
    const protectedAdminPages = ['admin-dashboard.html', 'admin-manage-links.html', 'dummy.html']; // Add other admin pages here
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedAdminPages.includes(currentPage)) {
        if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
            window.location.href = 'admin-login.html';
        }
    }

    // Logout functionality
    function logoutAdmin() {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'admin-login.html';
    }

    // Attach logout to a button if it exists (it will be in the navbar)
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag styled as a button
            logoutAdmin();
        });
    }
});
