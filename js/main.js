// Main JavaScript file

// Copy coupon code function
function copyCode(code) {
    navigator.clipboard.writeText(code).then(function() {
        showNotification('Coupon code copied: ' + code);
    }, function(err) {
        // Fallback method
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Coupon code copied: ' + code);
    });
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Search function
function initSearch() {
    const searchBox = document.querySelector('.search-box input');
    const headerSearch = document.getElementById('headerSearch');
    
    if (searchBox) {
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
    
    if (headerSearch) {
        headerSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    const searchQuery = query || document.getElementById('headerSearch')?.value || document.querySelector('.search-box input')?.value;
    if (searchQuery && searchQuery.trim()) {
        window.location.href = `coupons.html?search=${encodeURIComponent(searchQuery.trim())}`;
    }
}

// User authentication functions (for future use)
function checkLoginStatus() {
    // Check if user is logged in (from localStorage or session)
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function logout() {
    // Clear user data
    localStorage.removeItem('user');
    // Update UI
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    // Redirect to home page
    window.location.href = 'index.html';
}

// Hero Carousel Functions
let currentSlide = 0;

function initCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const totalSlides = slides.length;
    const totalSlidesElement = document.getElementById('totalSlides');
    
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
    
    if (slides.length === 0) return;
}

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const currentSlideElement = document.getElementById('currentSlide');
    
    if (slides.length === 0) return;
    
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Ensure index is within bounds
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Add active class to current slide
    slides[currentSlide].classList.add('active');
    
    // Update pagination
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide + 1;
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    showSlide(currentSlide + 1);
}

function prevSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    showSlide(currentSlide - 1);
}

// Initialize stores row scroll (disabled for responsive grid layout)
function initStoresRowScroll() {
    // Grid layout handles responsive display automatically
    // No scrolling needed as cards wrap to new rows
    const scrollLeftBtn = document.querySelector('.stores-scroll-left');
    const scrollRightBtn = document.querySelector('.stores-scroll-right');
    
    if (scrollLeftBtn) scrollLeftBtn.style.display = 'none';
    if (scrollRightBtn) scrollRightBtn.style.display = 'none';
}

// Initialize deals row scroll
function initDealsRowScroll() {
    const dealsRow = document.querySelector('.deals-row');
    const scrollRightBtn = document.querySelector('.deals-scroll-right');
    
    if (dealsRow && scrollRightBtn) {
        // Check if all items fit (4 cards visible)
        const checkIfScrollable = () => {
            const allCards = dealsRow.querySelectorAll('.deal-card');
            if (allCards.length <= 4) {
                // All 4 cards should be visible, hide button
                scrollRightBtn.style.display = 'none';
            } else {
                // More than 4 cards, enable scrolling
                scrollRightBtn.style.display = 'flex';
                scrollRightBtn.addEventListener('click', () => {
                    dealsRow.scrollBy({
                        left: 320,
                        behavior: 'smooth'
                    });
                });
                
                // Update button visibility based on scroll position
                const updateScrollButton = () => {
                    const isAtEnd = dealsRow.scrollLeft >= dealsRow.scrollWidth - dealsRow.clientWidth - 1;
                    scrollRightBtn.style.display = isAtEnd ? 'none' : 'flex';
                };
                
                dealsRow.addEventListener('scroll', updateScrollButton);
                updateScrollButton();
            }
        };
        
        checkIfScrollable();
        window.addEventListener('resize', checkIfScrollable);
    }
}

// Initialize price drops products scroll
function initPriceDropsScroll() {
    const productsRow = document.querySelector('.price-drops-products');
    const scrollLeftBtn = document.querySelector('.products-scroll-left');
    const scrollRightBtn = document.querySelector('.products-scroll-right');
    
    if (productsRow && scrollLeftBtn && scrollRightBtn) {
        // Calculate scroll amount (one product card width + gap)
        const getScrollAmount = () => {
            const firstCard = productsRow.querySelector('.product-card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth;
                const gap = 32; // gap between cards
                return cardWidth + gap;
            }
            return 240;
        };
        
        // Scroll right
        scrollRightBtn.addEventListener('click', () => {
            productsRow.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
        
        // Scroll left
        scrollLeftBtn.addEventListener('click', () => {
            productsRow.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
        
        // Update button visibility based on scroll position
        const updateScrollButtons = () => {
            const isAtStart = productsRow.scrollLeft <= 1;
            const isAtEnd = productsRow.scrollLeft >= productsRow.scrollWidth - productsRow.clientWidth - 1;
            
            scrollLeftBtn.style.display = isAtStart ? 'none' : 'flex';
            scrollRightBtn.style.display = isAtEnd ? 'none' : 'flex';
        };
        
        productsRow.addEventListener('scroll', updateScrollButtons);
        updateScrollButtons();
        
        // Check on resize
        window.addEventListener('resize', () => {
            if (productsRow.scrollWidth <= productsRow.clientWidth) {
                scrollLeftBtn.style.display = 'none';
                scrollRightBtn.style.display = 'none';
            } else {
                updateScrollButtons();
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    
    // Initialize carousel
    initCarousel();
    
    // Add carousel navigation (manual only, no auto-play)
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
    
    // Initialize stores row scroll
    initStoresRowScroll();
    
    // Initialize deals row scroll
    initDealsRowScroll();
    
    // Initialize price drops products scroll
    initPriceDropsScroll();
    
    // Check login status (for future use)
    checkLoginStatus();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileSideMenu = document.getElementById('mobileSideMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenuToggle && mobileSideMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileSideMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeMobileMenu() {
        if (mobileSideMenu) {
            mobileSideMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('btn-loading')) {
                e.preventDefault();
                return;
            }
            
            // If it's a form submit button, show loading state
            if (this.type === 'submit') {
                this.classList.add('btn-loading');
                this.innerHTML = '<span class="loading"></span> Processing...';
            }
        });
    });
});
