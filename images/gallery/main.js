/**
 * SPORTS CHAPLAINCY ZAMBIA - MAIN JAVASCRIPT
 * Handles carousel controls, navigation, and accessibility features
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // ========================================
        // ACTIVE NAVIGATION HIGHLIGHTING
        // ========================================
        highlightActiveNavigation();
        
        // ========================================
        // CAROUSEL ACCESSIBILITY ENHANCEMENTS
        // ========================================
        enhanceCarouselAccessibility();
        
        // ========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ========================================
        smoothScrollLinks();
        
        // ========================================
        // NAVBAR SCROLL EFFECT
        // ========================================
        handleNavbarScroll();
        
        // ========================================
        // MOBILE NAVIGATION ENHANCEMENTS
        // ========================================
        enhanceMobileNavigation();
    });

    /**
     * Highlight the active navigation link based on current page
     */
    function highlightActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Enhance carousel with keyboard controls and pause on hover/focus
     */
    function enhanceCarouselAccessibility() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;

        const bsCarousel = bootstrap.Carousel.getInstance(carousel) || 
                          new bootstrap.Carousel(carousel);

        // Pause carousel on hover
        carousel.addEventListener('mouseenter', function() {
            bsCarousel.pause();
        });

        // Resume carousel when mouse leaves
        carousel.addEventListener('mouseleave', function() {
            bsCarousel.cycle();
        });

        // Pause carousel when any element inside receives focus
        carousel.addEventListener('focusin', function() {
            bsCarousel.pause();
        });

        // Resume when focus leaves the carousel
        carousel.addEventListener('focusout', function(e) {
            // Only resume if focus moved outside the carousel
            if (!carousel.contains(e.relatedTarget)) {
                bsCarousel.cycle();
            }
        });

        // Keyboard navigation for carousel
        carousel.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    bsCarousel.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    bsCarousel.next();
                    break;
                case ' ': // Spacebar
                case 'Enter':
                    e.preventDefault();
                    // Toggle pause/play
                    if (carousel.classList.contains('paused')) {
                        bsCarousel.cycle();
                        carousel.classList.remove('paused');
                    } else {
                        bsCarousel.pause();
                        carousel.classList.add('paused');
                    }
                    break;
            }
        });

        // Add ARIA labels to carousel controls
        const prevControl = carousel.querySelector('.carousel-control-prev');
        const nextControl = carousel.querySelector('.carousel-control-next');
        
        if (prevControl) {
            prevControl.setAttribute('aria-label', 'Previous slide');
        }
        if (nextControl) {
            nextControl.setAttribute('aria-label', 'Next slide');
        }

        // Add ARIA labels to indicators
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function smoothScrollLinks() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Set focus to target element for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }

    /**
     * Handle navbar appearance on scroll
     */
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    /**
     * Mobile navigation enhancements
     */
    function enhanceMobileNavigation() {
        // Close mobile navbar when clicking a regular nav link (not dropdowns)
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarCollapse) {
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth < 992) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                });
            });
        }
        
        // Close navbar when clicking dropdown items
        const dropdownItems = document.querySelectorAll('.navbar-nav .dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth < 992 && navbarCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // ========================================
    // WORK GALLERY CAROUSEL
    // ========================================
    
    /**
     * Initialize Work Gallery Carousel (shows 3 items at a time on desktop, 2 on tablet, 1 on mobile)
     */
    function initWorkGalleryCarousel() {
        const track = document.getElementById('workGalleryTrack');
        const prevBtn = document.getElementById('workGalleryPrev');
        const nextBtn = document.getElementById('workGalleryNext');
        const indicatorsContainer = document.getElementById('workGalleryIndicators');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const items = Array.from(track.querySelectorAll('.work-gallery-item'));
        const totalItems = items.length;
        
        let currentIndex = 0;
        let itemsPerView = getItemsPerView();
        let totalSlides = Math.ceil(totalItems / itemsPerView);
        
        // Create indicators
        createIndicators();
        
        // Event listeners
        prevBtn.addEventListener('click', () => navigate('prev'));
        nextBtn.addEventListener('click', () => navigate('next'));
        
        // Keyboard navigation
        track.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigate('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigate('next');
            }
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const newItemsPerView = getItemsPerView();
                if (newItemsPerView !== itemsPerView) {
                    itemsPerView = newItemsPerView;
                    totalSlides = Math.ceil(totalItems / itemsPerView);
                    currentIndex = Math.min(currentIndex, totalSlides - 1);
                    createIndicators();
                    updateCarousel();
                }
            }, 250);
        });
        
        // Initial update
        updateCarousel();
        
        /**
         * Get number of items to show based on screen size
         */
        function getItemsPerView() {
            if (window.innerWidth < 768) {
                return 1; // Mobile: show 1 item
            } else if (window.innerWidth < 992) {
                return 2; // Tablet: show 2 items
            } else {
                return 3; // Desktop: show 3 items
            }
        }
        
        /**
         * Navigate to previous or next slide
         */
        function navigate(direction) {
            if (direction === 'prev' && currentIndex > 0) {
                currentIndex--;
            } else if (direction === 'next' && currentIndex < totalSlides - 1) {
                currentIndex++;
            }
            updateCarousel();
        }
        
        /**
         * Update carousel position and controls
         */
        function updateCarousel() {
            // Calculate transform based on items per view
            const itemWidth = 100 / itemsPerView; // percentage width per item
            const gap = 2; // gap in rem (matches CSS)
            const gapPercentage = (gap / track.offsetWidth) * 100 * (itemsPerView - 1);
            const translateX = -(currentIndex * (itemWidth * itemsPerView + gapPercentage));
            
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;
            
            // Update indicators
            updateIndicators();
        }
        
        /**
         * Create indicator dots
         */
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.classList.add('work-gallery-indicator');
                indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
                indicator.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        /**
         * Update active indicator
         */
        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.work-gallery-indicator');
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }
    
    // Initialize work gallery carousel when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkGalleryCarousel);
    } else {
        initWorkGalleryCarousel();
    }

})();
