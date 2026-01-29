document.addEventListener('DOMContentLoaded', () => {

    // --- Section 1: Fade-in animations and navigation highlighting ---
    const fadeElements = document.querySelectorAll('.fade-in-section, .fade-in-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('fade-in-item')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    const navLinks = document.querySelectorAll('.header-bar .nav-link');
    const sections = document.querySelectorAll('section[id]');

    const highlightNavObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const highlightNavObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active-nav-link');
                });
                const activeLink = document.querySelector(`.nav-link[data-target="${currentSectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-nav-link');
                }
            }
        });
    };

    const highlightNavObserver = new IntersectionObserver(highlightNavObserverCallback, highlightNavObserverOptions);
    sections.forEach(section => {
        highlightNavObserver.observe(section);
    });

    const initialActiveSection = document.querySelector('.section.is-visible');
    if (initialActiveSection) {
        const initialActiveLinkId = initialActiveSection.id;
        const initialActiveLink = document.querySelector(`.nav-link[data-target="${initialActiveLinkId}"]`);
        if (initialActiveLink) {
            initialActiveLink.classList.add('active-nav-link');
        }
    } else {
        const firstLink = navLinks[0];
        if (firstLink) {
            firstLink.classList.add('active-nav-link');
        }
    }


    // --- Section 4: Universal Slider Initialization ---
    function initializeSlider(containerElement, sliderSelector, dotSelector) {
        const slider = containerElement.querySelector(sliderSelector);
        const images = slider ? slider.querySelectorAll('img') : [];
        const dotsContainer = containerElement.querySelector(dotSelector);
        let dots = [];

        if (!slider || images.length <= 1) {
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let initialTranslateX = 0;
        let isHorizontalSwipe = false;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
            dots = dotsContainer.querySelectorAll('.dot');
        }

        function updateSlider() {
            slider.style.transform = `translateX(${-currentIndex * 100}%)`;
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        // --- Touch Events ---
        containerElement.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialTranslateX = -currentIndex * 100;
            slider.style.transition = 'none';
            isHorizontalSwipe = false;
        }, { passive: false });

        containerElement.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
                    isHorizontalSwipe = true;
                } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 5) {
                    isDragging = false;
                    return;
                }
            }

            if (isHorizontalSwipe) {
                e.preventDefault();
                const dragPercentage = (diffX / containerElement.offsetWidth) * 100;
                let newTranslateX = initialTranslateX + dragPercentage;

                const resistance = 0.3;
                if (currentIndex === 0 && diffX > 0) {
                    newTranslateX = initialTranslateX + dragPercentage * resistance;
                } else if (currentIndex === images.length - 1 && diffX < 0) {
                    newTranslateX = initialTranslateX + dragPercentage * resistance;
                }
                slider.style.transform = `translateX(${newTranslateX}%)`;
            }
        }, { passive: false });

        containerElement.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            isHorizontalSwipe = false;
            slider.style.transition = 'transform 0.5s ease-in-out';

            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;

            const swipeThreshold = containerElement.offsetWidth / 8;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diffX < 0 && currentIndex < images.length - 1) {
                    currentIndex++;
                }
            }
            updateSlider();
        });

        // --- Mouse Events ---
        containerElement.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialTranslateX = -currentIndex * 100;
            slider.style.transition = 'none';
            isHorizontalSwipe = false;
            e.preventDefault();
        });

        containerElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const currentX = e.clientX;
            const currentY = e.clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
                    isHorizontalSwipe = true;
                    e.preventDefault();
                } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 5) {
                    isDragging = false;
                    return;
                }
            }

            if (isHorizontalSwipe) {
                e.preventDefault();
                const dragPercentage = (diffX / containerElement.offsetWidth) * 100;
                let newTranslateX = initialTranslateX + dragPercentage;

                const resistance = 0.3;
                if (currentIndex === 0 && diffX > 0) {
                    newTranslateX = initialTranslateX + dragPercentage * resistance;
                } else if (currentIndex === images.length - 1 && diffX < 0) {
                    newTranslateX = initialTranslateX + dragPercentage * resistance;
                }
                slider.style.transform = `translateX(${newTranslateX}%)`;
            }
        });

        containerElement.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            isHorizontalSwipe = false;
            slider.style.transition = 'transform 0.5s ease-in-out';

            const endX = e.clientX;
            const diffX = endX - startX;

            const swipeThreshold = containerElement.offsetWidth / 8;

            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diffX < 0 && currentIndex < images.length - 1) {
                    currentIndex++;
                }
            }
            updateSlider();
        });

        containerElement.addEventListener('mouseleave', (e) => {
            if (isDragging && isHorizontalSwipe) {
                isDragging = false;
                isHorizontalSwipe = false;
                slider.style.transition = 'transform 0.5s ease-in-out';
                updateSlider();
            }
        });

        updateSlider();
    }

    // --- Initialize All Sliders on the Page (using your existing function) ---
    const mainHeroContainer = document.querySelector('.hero-content .slider-container');
    if (mainHeroContainer) {
        initializeSlider(mainHeroContainer, '.slider', '.dots-container');
    }

    const roomImageContainers = document.querySelectorAll('.room-box .room-image-slider-container');
    roomImageContainers.forEach(container => {
        initializeSlider(container, '.room-image-slider', '.dots-container');
    });


    // --- Section 5: Mobile Menu and Accordion functionality ---
    const menuToggle = document.getElementById('menu');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const html = document.documentElement; // Get the HTML element

// Select all non-dropdown links within the mobile menu
const directNavLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav-main a, .nav-main-page a, .nav-main-social a') : [];

// Select the "Destinations" dropdown toggle link
const destinationsDropdownToggle = mobileMenu ? mobileMenu.querySelector('.nav-links.has-dropdown') : null;
const destinationsDropdownMenu = mobileMenu ? mobileMenu.querySelector('.dropdown-menu') : null;
const destinationLinks = destinationsDropdownMenu ? destinationsDropdownMenu.querySelectorAll('.dropdown-link') : [];

// Select accordion-like headers (like 'Activity')
const accordionHeaders = mobileMenu ? mobileMenu.querySelectorAll('.discover') : [];

let scrollPosition = 0; // Variable to store scroll position

function openMenu() {
    if (!mobileMenu || !overlay || !html) return;

    // Store current scroll position from the window/html
    scrollPosition = window.pageYOffset || html.scrollTop;

    mobileMenu.classList.add('open');
    overlay.classList.add('active');
    html.classList.add('no-scroll'); // Apply no-scroll to HTML
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    if (!mobileMenu || !overlay || !html) return;

    mobileMenu.classList.remove('open');
    overlay.classList.remove('active');

    // Temporarily disable smooth scroll behavior
    html.style.scrollBehavior = 'auto';

    html.classList.remove('no-scroll'); // Remove no-scroll from HTML

    // Restore scroll position instantly
    window.scrollTo(0, scrollPosition);

    // Re-enable smooth scroll after a tiny delay
    // Using setTimeout here to ensure the browser has processed the scrollTo before re-applying smooth scroll.
    setTimeout(() => {
        html.style.scrollBehavior = ''; // This will revert to the CSS defined scroll-behavior (smooth in your case)
    }, 10); // A small delay, e.g., 10ms, is usually sufficient

    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
}

// Toggle menu open/close
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

// Optional: Close menu when clicking outside (on overlay)
if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

// Optional: Close menu when a direct navigation link is clicked
directNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Optional: Close menu when a destination link is clicked
destinationLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

    // Close menu when a direct navigation link is clicked
    directNavLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        // No stopPropagation needed here, as we want it to close
        closeMenu();
        // Handle smooth scroll if needed (your existing logic)
        const targetId = this.getAttribute('href').substring(1); // Get target ID from href
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); // This line performs the smooth scroll
            }
        }
    });
    });


    // Handle accordion-like toggles (like 'Activity')
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function(event) {
            event.stopPropagation(); // Stop click from bubbling up to document and closing menu

            const content = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            if (content) {
                if (content.style.display === "block") {
                    content.style.display = "none";
                    this.classList.remove('active');
                    if (arrow) arrow.classList.remove('active');
                } else {
                    // Close other accordions/dropdowns if necessary before opening this one
                    if (destinationsDropdownMenu) {
                        destinationsDropdownMenu.style.display = 'none';
                        if (destinationsDropdownToggle) destinationsDropdownToggle.classList.remove('active');
                    }
                    accordionHeaders.forEach(otherHeader => {
                        if (otherHeader !== this) { // Don't close the one just clicked
                            const otherContent = otherHeader.nextElementSibling;
                            const otherArrow = otherHeader.querySelector('.arrow');
                            if (otherContent) otherContent.style.display = "none";
                            otherHeader.classList.remove('active');
                            if (otherArrow) otherArrow.classList.remove('active');
                        }
                    });

                    content.style.display = "block";
                    this.classList.add('active');
                    if (arrow) arrow.classList.add('active');
                }
            }
        });
    });

    // Close menu when clicking on the overlay or outside of the menu/toggle button,
    // but *not* when clicking inside the dropdown content (handled by stopPropagation)
    document.addEventListener('click', function(event) {
        if (!mobileMenu || !menuToggle || !overlay) return;

        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        const isClickOnOverlay = overlay.contains(event.target);

        if (mobileMenu.classList.contains('open')) {
            // Only close if click is on overlay OR outside menu AND not on toggle
            if (isClickOnOverlay || (!isClickInsideMenu && !isClickOnToggle)) {
                closeMenu();
            }
        }
    });

    // Your existing mobile menu item (p tags) logic - consider if still needed
    // based on whether .header-discover is purely an accordion or also a nav item.
    // Given your HTML, '.header-discover' is 'Activity', which is an accordion.
    // The previous accordionHeaders logic covers this.
    // If you have other <p> tags acting as menu items, they would need a similar listener.
    const mobileMenuItems = mobileMenu ? mobileMenu.querySelectorAll('.header-discover') : []; // Existing P tags
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(event) { // Add event parameter
            // If this is also an accordion, stop propagation
            event.stopPropagation(); // Add this line if it's an accordion that shouldn't close the menu
            closeMenu(); // This might close the menu if it's meant to navigate
            const targetId = this.id; // Check if these IDs correctly map to sections
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


});


(function() {
  const carouselsData = {
    carousel1: [
      { src: "gallery/received_566007475852197.webp", name: "Dorm Wing Pool" },
      { src: "gallery/received_4590479965328202.webp", name: "Private Wing Pool" },
      { src: "gallery/612625504.webp", name: "Rooftop Pool" },
      { src: "gallery/received_8766750926690907.webp", name: "Common Spaces" },
      { src: "gallery/received_530563756392152.webp", name: "Restaurant & Bar" },
      { src: "gallery/received_525229870112388.webp", name: "Friendly Staff" }
    ],
    carousel2: [
      { src: "experinces/exp-img/experience.webp", name: "Amazing Temples" },
      { src: "experinces/exp-img/floatingvillage.webp", name: "Floating Village" },
      { src: "experinces/exp-img/cooking class.webp", name: "Cooking Class" },
      { src: "experinces/exp-img/phare.webp", name: "Phare, The Cambodian Circus" },
      { src: "experinces/exp-img/pottery class.webp", name: "Pottery Class" },
      { src: "highlights/bracelet-class.webp", name: "Bracelet Making Class" },
      { src: "highlights/doodle-class.webp", name: "Doodle Class" },
      { src: "highlights/yoga-class.webp", name: "Yoga Class" },
      { src: "highlights/pub-crawl.webp", name: "Pub Crawl" },
      { src: "highlights/street-food.webp", name: "Street Food Tour" },
      { src: "highlights/cycling-sunset.webp", name: "Cycling Sunset Tour" },
      { src: "highlights/social-night.webp", name: "Social Night" },
      { src: "highlights/dessert-class.webp", name: "Dessert Class" },
      { src: "highlights/cocktail-class.webp", name: "Cocktail Class" },
      { src: "highlights/kulen-waterfall.webp", name: "Kulen Waterfall" },
      { src: "highlights/movie-night.webp", name: "Movie Night" }
    ]
  };

  function initCarousel(id, images) {
    const wrapper = document.getElementById(id);
    if (!wrapper) {
      console.warn(`Carousel container ${id} not found.`);
      return;
    }
    const track = wrapper.querySelector('.carousel-track');

    // Clear any existing items
    track.innerHTML = '';

    // Create items twice for infinite loop effect
    images.concat(images).forEach(({ src, name }) => {
      const item = document.createElement('div');
      item.className = 'carousel-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = name;
      img.draggable = false; // Prevent default browser image dragging for smoother mouse swipe

      const caption = document.createElement('span');
      caption.className = 'image-name';
      caption.textContent = name;

      item.appendChild(img);
      item.appendChild(caption);
      track.appendChild(item);
    });

    let isDragging = false;
    let startX = 0;
    let startY = 0; // Store initial Y position for touch events
    let scrollLeftStart = 0;
    let autoScrollID;
    let isCarouselSwipe = false; // Flag to indicate if the current touch is a carousel swipe, initialized to false

    // Define a threshold for movement to determine direction
    const movementThreshold = 10; // Pixels

    function autoScroll() {
      wrapper.scrollLeft += 1;
      if (wrapper.scrollLeft >= track.scrollWidth / 2) {
        wrapper.scrollLeft = 0;
      }
    }

    function startAutoScroll() {
      stopAutoScroll();
      autoScrollID = setInterval(autoScroll, 16);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollID);
    }

    function onDragStart(e) {
      stopAutoScroll();
      isDragging = true;
      isCarouselSwipe = false; // Reset flag on every new drag start
      startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      startY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
      scrollLeftStart = wrapper.scrollLeft;
      wrapper.style.cursor = 'grabbing';

      // For mouse events, prevent default directly.
      if (e.type.includes('mouse')) {
        e.preventDefault();
      }
      // For touch events, we allow default initially and decide in onDragMove.
    }

    function onDragMove(e) {
      if (!isDragging) return;

      const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
      const currentY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;

      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);

      if (e.type.includes('touch')) {
        if (!isCarouselSwipe) { // If we haven't yet determined the primary direction
          if (deltaX > movementThreshold && deltaX > deltaY) {
            // Horizontal movement detected and is dominant
            isCarouselSwipe = true;
          } else if (deltaY > movementThreshold && deltaY > deltaX) {
            // Vertical movement detected and is dominant
            // This touch is for scrolling the page, not the carousel
            isDragging = false; // Disengage carousel dragging
            wrapper.style.cursor = 'grab';
            startAutoScroll(); // Resume auto-scroll
            return; // Allow the browser to handle vertical scrolling
          }
          // If neither direction has clearly dominated (within threshold or roughly equal),
          // we continue to not prevent default until a clear intention is seen.
        }

        if (isCarouselSwipe) {
          // If we've determined it's a carousel swipe, prevent default
          // to stop vertical page scrolling.
          e.preventDefault();
        }
      } else { // Mouse event
        e.preventDefault(); // Always prevent default for mouse drag
      }

      // Only apply carousel movement if it's a mouse event or a determined carousel swipe
      if (e.type.includes('mouse') || isCarouselSwipe) {
        const walk = startX - currentX;
        wrapper.scrollLeft = scrollLeftStart + walk;

        // Correctly update startX and scrollLeftStart after looping
        if (wrapper.scrollLeft >= track.scrollWidth / 2) {
          wrapper.scrollLeft -= track.scrollWidth / 2;
          // Adjust startX so that the relative drag position is maintained after loop
          startX = currentX - (track.scrollWidth / 2 - (scrollLeftStart + walk));
          scrollLeftStart = wrapper.scrollLeft;
        } else if (wrapper.scrollLeft <= 0) {
          wrapper.scrollLeft += track.scrollWidth / 2;
          // Adjust startX so that the relative drag position is maintained after loop
          startX = currentX + (track.scrollWidth / 2 + (scrollLeftStart + walk));
          scrollLeftStart = wrapper.scrollLeft;
        }
      }
    }

    function onDragEnd() {
      if (!isDragging) return; // Only process if dragging was active
      isDragging = false;
      wrapper.style.cursor = 'grab';
      startAutoScroll();
      isCarouselSwipe = false; // Reset flag for next interaction
    }

    wrapper.style.cursor = 'grab';

    // Mouse events
    wrapper.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove); // Listen on document to capture drags outside wrapper
    document.addEventListener('mouseup', onDragEnd);     // Listen on document
    wrapper.addEventListener('mouseleave', onDragEnd);   // Ensure mouseleave also stops dragging and resets cursor

    // Touch events
    // Mark as non-passive to allow preventDefault later
    // The `passive: false` is critical for allowing `e.preventDefault()` to work on touchmove.
    wrapper.addEventListener('touchstart', onDragStart, { passive: false });
    wrapper.addEventListener('touchmove', onDragMove, { passive: false });
    wrapper.addEventListener('touchend', onDragEnd);

    // Start auto scroll initially
    startAutoScroll();
  }

  // Initialize all carousels on page load
  window.addEventListener('load', () => {
    initCarousel('carousel1', carouselsData.carousel1);
    initCarousel('carousel2', carouselsData.carousel2);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
    const originalImageSources = [
        "../../siem-reap/gallery/received_934478895256502.webp",
        "../../siem-reap/gallery/received_534966325788121.webp",
        "../../siem-reap/gallery/received_566007475852197.webp",
        "../../siem-reap/gallery/received_8766750926690907.webp",
        "../../siem-reap/gallery/received_444754068070835.webp",
        "../../siem-reap/gallery/received_1582858339335926.webp",
        "../../siem-reap/gallery/received_497042126654101.webp",
        "../../siem-reap/gallery/received_499675879577316.webp",
        "../../siem-reap/gallery/received_1067235718122204.webp",
        "../../siem-reap/gallery/received_955016673333179.webp",
        "../../siem-reap/gallery/received_1000949585119726.webp",
        "../../siem-reap/gallery/received_888751229987705.webp",
        "../../siem-reap/gallery/received_1614537922474663.webp",
        "../../siem-reap/gallery/received_2251783428537380.webp",
        "../../siem-reap/gallery/received_3340627699402943.webp",
        "../../siem-reap/gallery/received_1345036756476678.webp",
        "../../siem-reap/gallery/received_525229870112388.webp",
        "../../siem-reap/gallery/received_1045540420640483.webp",
        "../../siem-reap/gallery/received_881561807414748.webp",
        "../../siem-reap/gallery/received_1209513726981479.webp",
        "../../siem-reap/gallery/received_1249027662951614.webp",
        "../../siem-reap/gallery/received_530563756392152.webp",
        "../../siem-reap/gallery/received_1303105920856225.webp",
        "../../siem-reap/gallery/received_1593637174924075.webp",
        "../../siem-reap/gallery/received_898517221722314.webp",
        "../../siem-reap/gallery/received_501342529557164.webp",
        "../../siem-reap/gallery/received_566007475852197.webp",
        "../../siem-reap/gallery/612625504.webp",
        "../../siem-reap/gallery/received_4590479965328202.webp",
        "../../siem-reap/gallery/received_530849406194868.webp",
        "../../siem-reap/gallery/received_531913776110510.webp",
        "../../siem-reap/gallery/received_565693359131108.webp",
        "../../siem-reap/gallery/received_848102257456561.webp",
        "../../siem-reap/gallery/received_885010916582691.webp",
        "../../siem-reap/gallery/received_1076394100551423.webp",
        "../../siem-reap/gallery/received_1233078591269580.webp",
        "../../siem-reap/gallery/received_1539284006712269.webp",
        "../../siem-reap/gallery/received_3864105780515349.webp",
        "../../siem-reap/gallery/complimentary.webp",
        "../../siem-reap/gallery/standard-double.webp",
        "../../siem-reap/gallery/standard-double2.webp",
        "../../siem-reap/gallery/standard-twin.webp",
        "../../siem-reap/gallery/standard-twin2.webp",
        "../../siem-reap/gallery/received_8343806779060596.webp",
        "../../siem-reap/gallery/received_1247752259759609.webp",
        "../../siem-reap/gallery/received_1279562433222280.webp",
        "../../siem-reap/gallery/superior-6bed2.webp",
        "../../siem-reap/gallery/6-bed-dorm2.webp",
        "../../siem-reap/gallery/6-bed-dorm.webp",
        "../../siem-reap/gallery/4-bed-dorm2.webp",
        "../../siem-reap/gallery/4-bed-dorm3.webp",
        "../../siem-reap/gallery/bathroom-f.webp",
        "../../siem-reap/gallery/standard-shower.webp",
        "../../siem-reap/gallery/standard-toilet.webp",
        "../../siem-reap/gallery/superior-double-toilet.webp",
        "../../siem-reap/gallery/superior-room-shower.webp"
    ];

    const imageSources = [
        originalImageSources[originalImageSources.length - 1], // Dummy last image
        ...originalImageSources,
        originalImageSources[0] // Dummy first image
    ];

    const initialGallery = document.getElementById('initial-gallery');
    const lightbox = document.getElementById('lightbox');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const mainImageDisplayContainer = document.querySelector('.main-image-display-container');
    const imageCarouselWrapper = document.getElementById('image-carousel-wrapper');
    const imageCounter = document.querySelector('.image-counter');
    const galleryParagraph = document.getElementById('gallery-text');
    
    const prevImageBtn = document.getElementById('prev-image-btn');
    const nextImageBtn = document.getElementById('next-image-btn');


    let currentImageIndex = 1;
    let startX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    let dragOffset = 0;
    let carouselWidth = 0;
    let isTransitioning = false; // Flag for ANY animation (CSS or JS jump)
    let clickInitiatedFromButton = false; 

    function getCarouselCurrentTransformX() {
        const transformMatrix = window.getComputedStyle(imageCarouselWrapper).getPropertyValue('transform');
        if (transformMatrix === 'none') {
            return 0;
        }
        const matrixValues = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrixValues[4]);
    }

    function openLightbox(index) {
        currentImageIndex = index + 1;
        
        carouselWidth = mainImageDisplayContainer.offsetWidth;

        loadCarouselImages();

        if (prevImageBtn) {
            prevImageBtn.addEventListener('click', showPreviousImage);
            prevImageBtn.addEventListener('mousedown', (e) => e.stopPropagation());
            prevImageBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }
        if (nextImageBtn) {
            nextImageBtn.addEventListener('click', showNextImage);
            nextImageBtn.addEventListener('mousedown', (e) => e.stopPropagation());
            nextImageBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }
        
        requestAnimationFrame(() => {
            updateCarouselPosition(false);
            updateThumbnails();
            updateImageCounter();
        });

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        window.addEventListener('resize', debouncedResize);
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        imageCarouselWrapper.innerHTML = '';
        window.removeEventListener('resize', debouncedResize);
        
        // Ensure state is clean on close
        imageCarouselWrapper.style.transition = 'none'; 
        isTransitioning = false;
        
        if (prevImageBtn) {
            prevImageBtn.removeEventListener('click', showPreviousImage);
            prevImageBtn.removeEventListener('mousedown', (e) => e.stopPropagation());
            prevImageBtn.removeEventListener('touchstart', (e) => e.stopPropagation());
        }
        if (nextImageBtn) {
            nextImageBtn.removeEventListener('click', showNextImage);
            nextImageBtn.removeEventListener('mousedown', (e) => e.stopPropagation());
            nextImageBtn.removeEventListener('touchstart', (e) => e.stopPropagation());
        }
    }

    function loadCarouselImages() {
        imageCarouselWrapper.innerHTML = '';
        imageSources.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Hotel Image ${index + 1}`;
            if (index === 0) {
                img.dataset.originalIndex = originalImageSources.length - 1;
            } else if (index === imageSources.length - 1) {
                img.dataset.originalIndex = 0;
            } else {
                img.dataset.originalIndex = index - 1;
            }
            
            img.style.width = `${carouselWidth}px`; 
            imageCarouselWrapper.appendChild(img);
        });
        imageCarouselWrapper.style.width = `${imageSources.length * carouselWidth}px`;
    }

    function updateCarouselPosition(animate = true) {
        // If an animation is already in progress, stop it immediately.
        // This ensures a new action can take precedence without waiting.
        if (isTransitioning) {
            imageCarouselWrapper.style.transition = 'none';
            imageCarouselWrapper.offsetWidth; // Force reflow
            imageCarouselWrapper.removeEventListener('transitionend', handleTransitionEnd);
            isTransitioning = false; // Reset immediately as we're interrupting
        }

        const targetX = -currentImageIndex * carouselWidth;

        if (animate) {
            imageCarouselWrapper.style.transition = 'transform 0.3s ease-out';
            isTransitioning = true; // Set to true for the new animation
            
            const handleTransitionEnd = function() {
                imageCarouselWrapper.removeEventListener('transitionend', handleTransitionEnd);
                isTransitioning = false; // Animation finished
                // Only update UI here if no jump is about to occur
                if (!(currentImageIndex === 0 || currentImageIndex === imageSources.length - 1)) {
                    updateThumbnails();
                    updateImageCounter();
                }
            };
            imageCarouselWrapper.addEventListener('transitionend', handleTransitionEnd);

        } else { // No animation (initial load, resize, or instant jump)
            imageCarouselWrapper.style.transition = 'none';
            isTransitioning = false; // Not animating
        }
        imageCarouselWrapper.style.transform = `translateX(${targetX}px)`;

        // Handle infinite loop jumps
        if (currentImageIndex === 0 && animate) { // Moved to dummy last image
            setTimeout(() => {
                imageCarouselWrapper.style.transition = 'none'; // Instant jump
                currentImageIndex = originalImageSources.length; 
                imageCarouselWrapper.style.transform = `translateX(${-currentImageIndex * carouselWidth}px)`;
                updateThumbnails(); 
                updateImageCounter();
                isTransitioning = false; // Crucial: Reset after jump completes
            }, 300); // Must match CSS transition duration
        } else if (currentImageIndex === imageSources.length - 1 && animate) { // Moved to dummy first image
            setTimeout(() => {
                imageCarouselWrapper.style.transition = 'none'; // Instant jump
                currentImageIndex = 1; 
                imageCarouselWrapper.style.transform = `translateX(${-currentImageIndex * carouselWidth}px)`;
                updateThumbnails();
                updateImageCounter();
                isTransitioning = false; // Crucial: Reset after jump completes
            }, 300); // Must match CSS transition duration
        } else if (!animate) {
            // For non-animated updates (e.g., on resize or initial load)
            updateThumbnails();
            updateImageCounter();
        }
    }

    function updateThumbnails() {
        let activeThumbnailIndex;
        if (currentImageIndex === 0) { 
            activeThumbnailIndex = originalImageSources.length - 1;
        } else if (currentImageIndex === imageSources.length - 1) {
            activeThumbnailIndex = 0;
        } else { 
            activeThumbnailIndex = currentImageIndex - 1;
        }

        const thumbnails = thumbnailContainer.querySelectorAll('img');
        thumbnails.forEach((thumb, index) => {
            if (index === activeThumbnailIndex) {
                thumb.classList.add('thumbnail-active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('thumbnail-active');
            }
        });
    }

    function updateImageCounter() {
        let displayIndex;
        if (currentImageIndex === 0) {
            displayIndex = originalImageSources.length;
        } else if (currentImageIndex === imageSources.length - 1) {
            displayIndex = 1;
        } else {
            displayIndex = currentImageIndex;
        }
        
        if (imageCounter) {
            imageCounter.textContent = `${displayIndex} / ${originalImageSources.length}`;
        }
    }

    function showPreviousImage() {
        // Allow immediate movement if not currently in a transition.
        // The previous logic for animationJumpPending is now folded into isTransitioning for simplicity.
        if (isTransitioning) {
            console.log("Carousel is currently transitioning, preventing immediate previous click.");
            return;
        }
        currentImageIndex--;
        updateCarouselPosition(true);
    }

    function showNextImage() {
        // Allow immediate movement if not currently in a transition.
        if (isTransitioning) {
            console.log("Carousel is currently transitioning, preventing immediate next click.");
            return;
        }
        currentImageIndex++;
        updateCarouselPosition(true);
    }

    initialGallery.querySelectorAll('.initial-gallery-item').forEach(imageWrapper => {
        imageWrapper.addEventListener('click', () => {
            const index = parseInt(imageWrapper.dataset.index);
            openLightbox(index);
        });
    });

    if (galleryParagraph) {
        galleryParagraph.addEventListener('click', () => {
            openLightbox(0);
        });
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    function getClientX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }

    // --- Mouse Events ---
    mainImageDisplayContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.nav-btn')) {
            clickInitiatedFromButton = true;
            return;
        }
        isDragging = true;
        startX = getClientX(e);
        imageCarouselWrapper.style.transition = 'none';
        imageCarouselWrapper.offsetWidth; 
        currentTranslateX = getCarouselCurrentTransformX();
        mainImageDisplayContainer.classList.add('grabbing');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = getClientX(e);
        dragOffset = currentX - startX;
        imageCarouselWrapper.style.transform = `translateX(${currentTranslateX + dragOffset}px)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        mainImageDisplayContainer.classList.remove('grabbing');

        if (!clickInitiatedFromButton) {
            const swipeThreshold = carouselWidth * 0.1;

            if (dragOffset < -swipeThreshold) {
                showNextImage();
            } else if (dragOffset > swipeThreshold) {
                showPreviousImage();
            } else {
                updateCarouselPosition(true);
            }
        }
        dragOffset = 0;
        clickInitiatedFromButton = false;
    });

    // --- Touch Events ---
    mainImageDisplayContainer.addEventListener('touchstart', (e) => {
        if (e.target.closest('.nav-btn')) {
            clickInitiatedFromButton = true;
            return;
        }
        const touch = e.touches[0];
        startX = touch.clientX;
        const startY = touch.clientY;

        const handleTouchMoveForDirection = (moveEvent) => {
            const moveX = moveEvent.touches[0].clientX;
            const moveY = moveEvent.touches[0].clientY;
            const deltaX = Math.abs(moveX - startX);
            const deltaY = Math.abs(moveY - startY);

            if (deltaX > deltaY + 5) {
                moveEvent.preventDefault();
            }
            mainImageDisplayContainer.removeEventListener('touchmove', handleTouchMoveForDirection, { passive: false });
        };
        mainImageDisplayContainer.addEventListener('touchmove', handleTouchMoveForDirection, { passive: false });

        isDragging = true;
        imageCarouselWrapper.style.transition = 'none';
        imageCarouselWrapper.offsetWidth;
        currentTranslateX = getCarouselCurrentTransformX();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = getClientX(e);
        dragOffset = currentX - startX;
        imageCarouselWrapper.style.transform = `translateX(${currentTranslateX + dragOffset}px)`;
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        if (!clickInitiatedFromButton) {
            const swipeThreshold = carouselWidth * 0.1;

            if (dragOffset < -swipeThreshold) {
                showNextImage();
            } else if (dragOffset > swipeThreshold) {
                showPreviousImage();
            } else {
                updateCarouselPosition(true);
            }
        }
        dragOffset = 0;
        clickInitiatedFromButton = false;
    });

    let resizeTimer;
    function debouncedResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (lightbox.classList.contains('open')) {
                carouselWidth = mainImageDisplayContainer.offsetWidth;
                const imagesInWrapper = imageCarouselWrapper.querySelectorAll('img');
                imagesInWrapper.forEach(img => {
                    img.style.width = `${carouselWidth}px`;
                });
                imageCarouselWrapper.style.width = `${imageSources.length * carouselWidth}px`;
                updateCarouselPosition(false);
            }
        }, 100);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox && !isDragging && Math.abs(dragOffset) < 5 && !e.target.closest('.nav-btn')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        // Block keyboard input if a transition is in progress
        if (lightbox.classList.contains('open') && !isDragging && isTransitioning) {
             console.log("Keyboard input blocked: Carousel is busy.");
             return;
        }
        
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    function createThumbnails() {
        thumbnailContainer.innerHTML = '';
        originalImageSources.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Thumbnail ${index + 1}`;
            img.classList.add('thumbnail-item');
            img.dataset.index = index;
            img.addEventListener('click', () => {
                currentImageIndex = index + 1;
                updateCarouselPosition(true);
            });
            thumbnailContainer.appendChild(img);
        });
    }

    createThumbnails();
});

