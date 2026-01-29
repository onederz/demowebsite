document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenu = document.getElementById('menu');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // Scroll Lock Management
    let scrollY = 0;
const lockScroll = () => {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollY);
};

    // Dropdown Management
    const setupDropdowns = () => {
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-links');
            const dropdown = item.querySelector('.dropdown-menu');

            if (dropdown) {
                // Pre-calculate height for animation
                dropdown.style.display = 'block';
                dropdown.style.setProperty('--dropdown-height', `${dropdown.scrollHeight}px`);
                dropdown.style.display = '';

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleDropdown(item, dropdown, link);
                });
            } else {
                link.addEventListener('click', () => {
                    closeAllDropdowns();
                    closeMenu();
                });
            }
        });
    };

    const toggleDropdown = (item, dropdown, link) => {
        const isOpening = !dropdown.classList.contains('show');

        // Close all other dropdowns first
        if (isOpening) {
            closeAllDropdowns();
        }

        // Toggle current dropdown
        dropdown.classList.toggle('show');
        link.classList.toggle('active-dropdown', isOpening);
        item.classList.toggle('active', isOpening);

        // Animate height
        dropdown.style.height = isOpening
            ? `${dropdown.scrollHeight}px`
            : '0';
    };

    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.style.height = '0';
            dropdown.classList.remove('show');
            const parentItem = dropdown.closest('.nav-item');
            if (parentItem) {
                parentItem.classList.remove('active');
                const link = parentItem.querySelector('.nav-links');
                if (link) link.classList.remove('active-dropdown');
            }
        });
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.style.opacity = '0';

        // Use a transitionend event listener on the overlay to ensure unlockScroll
        // happens after the overlay visually disappears.
        overlay.addEventListener('transitionend', function handler() {
            overlay.style.display = 'none';
            unlockScroll();
            overlay.removeEventListener('transitionend', handler); // Remove listener after execution
        }, { once: true });

        // Fallback for immediate hiding if no transition (e.g., opacity was already 0)
        if (getComputedStyle(overlay).opacity === '0') {
            overlay.style.display = 'none';
            unlockScroll();
        }
    };

    const closeAll = () => {
        closeAllDropdowns();
        closeMenu();
    };

    // Menu Toggle
    mobileMenu.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            closeAll();
        } else {
            lockScroll();
            overlay.style.display = 'block';
            // Use setTimeout to ensure the display: block takes effect before opacity transition
            setTimeout(() => overlay.style.opacity = '1', 10);
            mobileMenu.classList.add('active');
            navMenu.classList.add('active');
            // Do NOT call closeAllDropdowns() here, as it conflicts with opening state
        }
    });

    // Event Delegation
    overlay.addEventListener('click', closeAll);
    document.addEventListener('click', (e) => {
        // Only close dropdowns if click is outside nav-menu and not on the menu toggle itself
        const isClickInsideNavMenu = e.target.closest('.nav-menu');
        const isClickOnMenuToggle = e.target.closest('.menu-toggle');

        if (!isClickInsideNavMenu && !isClickOnMenuToggle) {
            closeAllDropdowns();
            // Add a check to close the main menu if clicked outside AND it's currently active
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    });

    // Initialize
    setupDropdowns();

    // Handle resize - recalculate dropdown heights
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.style.height = 'auto';
                    const height = dropdown.scrollHeight;
                    dropdown.style.height = `${height}px`;
                }
            });
        }, 250);
    });
});



document.addEventListener('DOMContentLoaded', () => {
    // --- Popup (Rate Guarantee) Logic ---
    const popup = document.getElementById('rate-guarantee-cover');

    const hidePopup = () => {
        if (popup) {
            popup.style.opacity = '0';
            popup.style.pointerEvents = 'none';
            window.removeEventListener('scroll', handlePopupScroll);
        }
    };

    const handlePopupScroll = () => {
        if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0) {
            hidePopup();
        }
    };

    // --- Scroll thresholds ---
    let navScrollThreshold = window.innerHeight * 0.5;  // For navbar, bg-bar, etc.
    let bookBtnScrollThreshold = window.innerHeight * 0.5; // For mobile book button

    window.addEventListener('resize', () => {
        navScrollThreshold = window.innerHeight * 0.5;
        bookBtnScrollThreshold = window.innerHeight * 0.5;
        updateMainNavBackground();
    });

    // --- Elements ---
    const mainNavElement = document.getElementById('mainNavigation');
const desktopNavElement = document.querySelector('.desktop-navigation');
const navLinks = document.querySelectorAll('.desktop-nav-link');
const mobileNavBgElement = document.querySelector('.bg-bar');
const mobileBookButton = document.querySelector('.main-mobile-book-btn');
const branchName = document.querySelector('.branch-name');
const logoElement = document.getElementById('logo');
const navbarElement = document.querySelector('.navbar');
const barElements = document.querySelectorAll('.bar');

// --- Mobile book button animation ---
let isAtTop = false;
let animating = false;

const switchBookButton = (toTop) => {
    if (!mobileBookButton || animating) return;
    animating = true;

    mobileBookButton.classList.add('hiding');

    const onHidden = () => {
        mobileBookButton.removeEventListener('transitionend', onHidden);

        if (toTop) {
            mobileBookButton.classList.add('scrolled');
            isAtTop = true;
        } else {
            mobileBookButton.classList.remove('scrolled');
            isAtTop = false;
        }

        mobileBookButton.classList.remove('hiding');
        mobileBookButton.classList.add('showing');

        mobileBookButton.addEventListener(
            'transitionend',
            () => {
                mobileBookButton.classList.remove('showing');
                animating = false;
            },
            { once: true }
        );
    };

    mobileBookButton.addEventListener('transitionend', onHidden);
};

// --- Update nav & button states ---
const updateMainNavBackground = () => {
    const scrolled = window.scrollY > 0;

    // Navbar
    if (mainNavElement) mainNavElement.classList.toggle('scrolled', scrolled);
    if (mobileNavBgElement) mobileNavBgElement.classList.toggle('scrolled', scrolled);
    if (desktopNavElement) desktopNavElement.classList.toggle('scrolled', scrolled);

    // Nav links
    navLinks.forEach(link => link.classList.toggle('scrolled', scrolled));

    // Mobile book button
    if (mobileBookButton) {
        if (scrolled && !isAtTop) switchBookButton(true);
        else if (!scrolled && isAtTop) switchBookButton(false);
    }

    // Branch name / logo / navbar / bars
    if (branchName) branchName.classList.toggle('scrolled', scrolled);
    if (logoElement) logoElement.classList.toggle('scrolled', scrolled);
    if (navbarElement) navbarElement.classList.toggle('scrolled', scrolled);
    barElements.forEach(bar => bar.classList.toggle('scrolled', scrolled));
};

// --- Initial setup ---
updateMainNavBackground();
window.addEventListener('scroll', updateMainNavBackground);


});





