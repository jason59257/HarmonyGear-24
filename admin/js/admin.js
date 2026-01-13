// Admin Panel JavaScript

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('authToken');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    
    // Check both token and adminLoggedIn for compatibility
    if (!token && !adminLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Admin logout
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        window.location.href = 'login.html';
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication on all admin pages except login
    if (!window.location.pathname.includes('login.html')) {
        checkAdminAuth();
    }

    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('adminMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
});

// Show notification
function showAdminNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.admin-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export to global scope
window.showAdminNotification = showAdminNotification;
