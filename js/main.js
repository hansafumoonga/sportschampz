/**
 * SPORTS CHAPLAINCY ZAMBIA — MAIN JAVASCRIPT v2
 * ──────────────────────────────────────────────
 * Original features (unchanged):
 *   • Active nav highlighting
 *   • Carousel accessibility (keyboard, pause-on-hover)
 *   • Smooth-scroll for anchor links
 *   • Navbar compact-on-scroll (.scrolled class)
 *   • Mobile nav close-on-link-click
 *   • Work-gallery multi-item carousel
 *
 * Added:
 *   • Scroll-reveal observer – triggers .visible on
 *     elements with .reveal or .reveal-stagger classes
 */

(function() {
    'use strict';

    /* ──────────────────────────────────────────────
       BOOT – wait for DOM
       ────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', function() {
        highlightActiveNavigation();
        enhanceCarouselAccessibility();
        smoothScrollLinks();
        handleNavbarScroll();
        enhanceMobileNavigation();
        initScrollReveal();          // ← NEW: scroll-reveal
    });

    /* ──────────────────────────────────────────────
       ACTIVE NAVIGATION HIGHLIGHTING
       (unchanged)
       ────────────────────────────────────────────── */
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

    /* ──────────────────────────────────────────────
       CAROUSEL ACCESSIBILITY
       (unchanged)
       ────────────────────────────────────────────── */
    function enhanceCarouselAccessibility() {
        const carousel = document.getElementById('heroCarousel');
        if (!carousel) return;

        const bsCarousel = bootstrap.Carousel.getInstance(carousel) ||
                          new bootstrap.Carousel(carousel);

        carousel.addEventListener('mouseenter', function() { bsCarousel.pause(); });
        carousel.addEventListener('mouseleave', function() { bsCarousel.cycle(); });
        carousel.addEventListener('focusin',    function() { bsCarousel.pause(); });
        carousel.addEventListener('focusout',   function(e) {
            if (!carousel.contains(e.relatedTarget)) bsCarousel.cycle();
        });

        carousel.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault(); bsCarousel.prev(); break;
                case 'ArrowRight':
                    e.preventDefault(); bsCarousel.next(); break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
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

        const prevControl = carousel.querySelector('.carousel-control-prev');
        const nextControl = carousel.querySelector('.carousel-control-next');
        if (prevControl) prevControl.setAttribute('aria-label', 'Previous slide');
        if (nextControl) nextControl.setAttribute('aria-label', 'Next slide');

        carousel.querySelectorAll('.carousel-indicators button').forEach((ind, i) => {
            ind.setAttribute('aria-label', `Slide ${i + 1}`);
        });
    }

    /* ──────────────────────────────────────────────
       SMOOTH SCROLL FOR ANCHOR LINKS
       (unchanged)
       ────────────────────────────────────────────── */
    function smoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }

    /* ──────────────────────────────────────────────
       NAVBAR SCROLL EFFECT
       (unchanged – adds .scrolled class)
       ────────────────────────────────────────────── */
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /* ──────────────────────────────────────────────
       MOBILE NAVIGATION ENHANCEMENTS
       (unchanged)
       ────────────────────────────────────────────── */
    function enhanceMobileNavigation() {
        const navLinks       = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarCollapse) {
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth < 992) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                });
            });

            document.querySelectorAll('.navbar-nav .dropdown-item').forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth < 992) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                });
            });
        }
    }

    /* ══════════════════════════════════════════════
       NEW – SCROLL REVEAL
       Uses IntersectionObserver to add .visible class
       to any element carrying .reveal or .reveal-stagger.
       Falls back gracefully when IO is unavailable.
       ════════════════════════════════════════════════ */
    function initScrollReveal() {
        const targets = document.querySelectorAll('.reveal, .reveal-stagger');
        if (!targets.length) return;

        /* If IntersectionObserver not available, show everything */
        if (!window.IntersectionObserver) {
            targets.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // one-shot
                }
            });
        }, {
            threshold: 0.12,            // trigger when 12 % visible
            rootMargin: '0px 0px -40px 0px'  // slightly before bottom edge
        });

        targets.forEach(el => observer.observe(el));
    }

    /* ══════════════════════════════════════════════
       WORK GALLERY CAROUSEL
       (unchanged – multi-item responsive carousel)
       ════════════════════════════════════════════════ */
    function initWorkGalleryCarousel() {
        const track             = document.getElementById('workGalleryTrack');
        const prevBtn           = document.getElementById('workGalleryPrev');
        const nextBtn           = document.getElementById('workGalleryNext');
        const indicatorsContainer = document.getElementById('workGalleryIndicators');

        if (!track || !prevBtn || !nextBtn) return;

        const items        = Array.from(track.querySelectorAll('.work-gallery-item'));
        const totalItems   = items.length;

        let currentIndex   = 0;
        let itemsPerView   = getItemsPerView();
        let totalSlides    = Math.ceil(totalItems / itemsPerView);

        createIndicators();

        prevBtn.addEventListener('click', () => navigate('prev'));
        nextBtn.addEventListener('click', () => navigate('next'));

        track.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate('prev'); }
            if (e.key === 'ArrowRight') { e.preventDefault(); navigate('next'); }
        });

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const newItemsPerView = getItemsPerView();
                if (newItemsPerView !== itemsPerView) {
                    itemsPerView  = newItemsPerView;
                    totalSlides   = Math.ceil(totalItems / itemsPerView);
                    currentIndex  = Math.min(currentIndex, totalSlides - 1);
                    createIndicators();
                    updateCarousel();
                }
            }, 250);
        });

        updateCarousel();

        function getItemsPerView() {
            if (window.innerWidth < 768)  return 1;
            if (window.innerWidth < 992)  return 2;
            return 3;
        }

        function navigate(direction) {
            if (direction === 'prev' && currentIndex > 0)              currentIndex--;
            if (direction === 'next' && currentIndex < totalSlides - 1) currentIndex++;
            updateCarousel();
        }

        function updateCarousel() {
            const itemWidth      = 100 / itemsPerView;
            const gap            = 2;
            const gapPercentage  = (gap / track.offsetWidth) * 100 * (itemsPerView - 1);
            const translateX     = -(currentIndex * (itemWidth * itemsPerView + gapPercentage));

            track.style.transform = `translateX(${translateX}%)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;

            updateIndicators();
        }

        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.classList.add('work-gallery-indicator');
                indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
                indicator.addEventListener('click', () => { currentIndex = i; updateCarousel(); });
                indicatorsContainer.appendChild(indicator);
            }
        }

        function updateIndicators() {
            indicatorsContainer.querySelectorAll('.work-gallery-indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === currentIndex);
            });
        }
    }

    /* Initialise gallery carousel immediately or on DOMContentLoaded */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorkGalleryCarousel);
    } else {
        initWorkGalleryCarousel();
    }

})();
