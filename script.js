/* ==========================================================================
   HERZONE TECHNOLOGIES - PREMIUM FUTURE LOGIC SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PAGE PRELOADER CONTROLLER
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Give a tiny extra delay for maximum premium feeling
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 800);
        });
    }

    /* ==========================================================================
       2. MOUSE-FOLLOW GLOW & CUSTOM CURSOR MECHANICS
       ========================================================================== */
    const mouseGlow = document.getElementById('mouse-glow');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    let cursorX = 0, cursorY = 0; // Current cursor position
    let outlineX = 0, outlineY = 0; // Current outer circle position
    
    // Custom cursor physics interpolation (lerp speed multiplier)
    const lerpSpeed = 0.15; 

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // Move background glow blob (uses absolute page coordinates)
        if (mouseGlow) {
            mouseGlow.style.left = `${x + scrollX}px`;
            mouseGlow.style.top = `${y + scrollY}px`;
        }

        // Keep track of viewport coordinates for custom cursor dots
        cursorX = x;
        cursorY = y;
        
        if (cursorDot) {
            cursorDot.style.opacity = '1';
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
        }
        if (cursorOutline) {
            cursorOutline.style.opacity = '1';
        }
    });

    // Custom cursor smoothing loop (lerp mechanics)
    function animateCursor() {
        // Linear Interpolation: Current position += (Target position - Current position) * Speed
        outlineX += (cursorX - outlineX) * lerpSpeed;
        outlineY += (cursorY - outlineY) * lerpSpeed;

        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Fade out custom cursor when leaving window viewport
    document.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.style.opacity = '0';
        if (cursorOutline) cursorOutline.style.opacity = '0';
    });

    // Shrink cursor outer ring on hover interactive actions
    const interactableElements = document.querySelectorAll('a, button, .filter-btn, .portfolio-item, input, select, textarea');
    interactableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '45px';
                cursorOutline.style.height = '45px';
                cursorOutline.style.borderColor = 'var(--color-gold)';
                cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '30px';
                cursorOutline.style.height = '30px';
                cursorOutline.style.borderColor = 'var(--color-primary-light)';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    /* ==========================================================================
       3. RESPONSIVE MOBILE DRAWER MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');

    if (mobileToggle && mobileMenuOverlay) {
        const closeMenu = () => {
            mobileToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // Toggle body scrolling to prevent scroll bleed
            if (mobileMenuOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

        // Close drawer when link selected
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ==========================================================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal-item');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed to maintain high layout performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    } else {
        // Fallback for older browsers
        revealItems.forEach(item => {
            item.classList.add('revealed');
        });
    }

    /* ==========================================================================
       5. ACTIVE NAVIGATION & SCROLL HEADER TINTS
       ========================================================================== */
    const mainHeader = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky Header scrolling effects
        if (mainHeader) {
            if (scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        // Navigation active links highlight logic
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (scrollY >= secTop && scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       6. RUNNING STATS COUNTER ANIMAION
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const finalVal = parseInt(targetEl.getAttribute('data-target'), 10);
                    animateCounter(targetEl, finalVal);
                    observer.unobserve(targetEl);
                }
            });
        }, {
            threshold: 0.8
        });

        statNumbers.forEach(stat => counterObserver.observe(stat));
    }

    function animateCounter(element, targetValue) {
        let currentCount = 0;
        const duration = 2000; // Counter total run time (ms)
        const frameRate = 1000 / 60; // 60 FPS
        const incrementSteps = Math.ceil(targetValue / (duration / frameRate));

        const counterInterval = setInterval(() => {
            currentCount += incrementSteps;
            if (currentCount >= targetValue) {
                element.textContent = targetValue;
                clearInterval(counterInterval);
            } else {
                element.textContent = currentCount;
            }
        }, frameRate);
    }

    /* ==========================================================================
       7. PORTFOLIO FILTERING MECHANICS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterCat = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                
                // Hide with transition, then toggle actual display
                if (filterCat === 'all' || itemCat === filterCat) {
                    item.classList.remove('hidden');
                    // Micro scale animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400); // Waits for transform fade-out transition
                }
            });
        });
    });

    /* ==========================================================================
       8. TESTIMONIALS SLIDER CAROUSEL (RESPONSIVE)
       ========================================================================== */
    const testimonialWrapper = document.getElementById('testimonials-wrapper');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderPrevBtn = document.getElementById('slider-prev');
    const sliderNextBtn = document.getElementById('slider-next');
    const sliderIndicators = document.querySelectorAll('#slider-indicators .indicator');

    let currentSlideIndex = 0;
    const totalSlides = testimonialSlides.length;

    if (testimonialWrapper && totalSlides > 0) {
        
        function updateSliderPosition() {
            // Move slider wrapper
            testimonialWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

            // Active Class adjustments for scale transitions
            testimonialSlides.forEach((slide, idx) => {
                slide.classList.remove('active');
                if (idx === currentSlideIndex) {
                    slide.classList.add('active');
                }
            });

            // Update indicators active states
            sliderIndicators.forEach((ind, idx) => {
                ind.classList.remove('active');
                if (idx === currentSlideIndex) {
                    ind.classList.add('active');
                }
            });
        }

        // Next slide triggers
        function showNextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSliderPosition();
        }

        // Prev slide triggers
        function showPrevSlide() {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSliderPosition();
        }

        // Event hooks
        if (sliderNextBtn) sliderNextBtn.addEventListener('click', showNextSlide);
        if (sliderPrevBtn) sliderPrevBtn.addEventListener('click', showPrevSlide);

        // Click indicators navigate directly
        sliderIndicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                currentSlideIndex = parseInt(e.target.getAttribute('data-index'), 10);
                updateSliderPosition();
            });
        });

        // Automatic carousel rotation interval
        let autoPlayTimer = setInterval(showNextSlide, 7000);

        // Reset timer on user slider interactions to prevent jumps
        const resetTimer = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(showNextSlide, 7000);
        };

        if (sliderNextBtn) sliderNextBtn.addEventListener('click', resetTimer);
        if (sliderPrevBtn) sliderPrevBtn.addEventListener('click', resetTimer);
        sliderIndicators.forEach(ind => ind.addEventListener('click', resetTimer));

        // Premium Touch Gesture Swipe integration
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });

        function handleSwipeGesture() {
            const swipeThreshold = 50; // Minimum swipe distance in px
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swiped Left -> Load Next Slide
                showNextSlide();
                resetTimer();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swiped Right -> Load Prev Slide
                showPrevSlide();
                resetTimer();
            }
        }
    }


    /* ==========================================================================
       9. CONTACT FORM — Web3Forms INTEGRATION
       ========================================================================== */

    /* ── DOM References ── */
    const formFields       = document.querySelectorAll('.form-input');
    const contactForm      = document.getElementById('contact-form');
    const thankYouModal    = document.getElementById('thank-you-modal');
    const modalCloseBtn    = document.getElementById('modal-close-btn');
    const modalOverlay     = document.getElementById('modal-overlay');
    const modalClientName  = document.getElementById('modal-client-name');
    const modalClientSvc   = document.getElementById('modal-client-service');
    const submitBtn        = document.getElementById('form-submit-btn');
    const btnText          = document.getElementById('btn-text');
    const btnIcon          = document.getElementById('btn-icon');
    const sendErrorBox     = document.getElementById('form-send-error');
    const sendErrorMsg     = document.getElementById('form-send-error-msg');

    /* ── Floating label: lift label when field has content ── */
    formFields.forEach(field => {
        if (field.value.trim() !== '') field.classList.add('has-content');
        field.addEventListener('input', () => {
            field.classList.toggle('has-content', field.value.trim() !== '');
            clearFieldError(field);
        });
        field.addEventListener('blur', () => {
            field.classList.toggle('has-content', field.value.trim() !== '');
        });
    });

    /* ── Validation helpers ── */
    function showFieldError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const err   = document.getElementById(errorId);
        if (field) field.style.borderColor = '#e55353';
        if (err)   { err.textContent = message; err.style.display = 'block'; }
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        const errId = 'err-' + field.id.replace('form-', '');
        const errEl = document.getElementById(errId);
        if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    }

    function validateForm(name, email, phone, service, message) {
        let valid = true;

        if (!name) {
            showFieldError('form-name', 'err-name', 'Please enter your full name.');
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showFieldError('form-email', 'err-email', 'Please enter your email address.');
            valid = false;
        } else if (!emailRegex.test(email)) {
            showFieldError('form-email', 'err-email', 'Please enter a valid email address.');
            valid = false;
        }

        const phoneRegex = /^[0-9+\-\s]{7,15}$/;
        if (!phone) {
            showFieldError('form-phone', 'err-phone', 'Please enter your phone number.');
            valid = false;
        } else if (!phoneRegex.test(phone)) {
            showFieldError('form-phone', 'err-phone', 'Please enter a valid phone number.');
            valid = false;
        }

        if (!service) {
            showFieldError('form-service', 'err-service', 'Please select a service.');
            valid = false;
        }

        if (!message || message.length < 10) {
            showFieldError('form-message', 'err-message', 'Please describe your project (min 10 characters).');
            valid = false;
        }

        return valid;
    }

    /* ── Button state helpers ── */
    function setButtonLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        if (loading) {
            btnText.textContent = 'Sending...';
            btnIcon.className   = 'fa-solid fa-circle-notch fa-spin';
        } else {
            btnText.textContent = 'Send Consultation Request';
            btnIcon.className   = 'fa-solid fa-paper-plane';
        }
    }

    function showSendError(message) {
        if (sendErrorBox) sendErrorBox.style.display = 'flex';
        if (sendErrorMsg) sendErrorMsg.textContent = message;
    }

    function hideSendError() {
        if (sendErrorBox) sendErrorBox.style.display = 'none';
    }

    /* ── Show success modal ── */
    function showSuccessModal(name, service) {
        if (modalClientName) modalClientName.textContent = name;
        if (modalClientSvc)  modalClientSvc.textContent  = service;
        if (thankYouModal)   thankYouModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /* ── Reset form completely ── */
    function resetForm() {
        if (contactForm) contactForm.reset();
        formFields.forEach(field => {
            field.classList.remove('has-content');
            field.style.borderColor = '';
        });
        document.querySelectorAll('.field-error').forEach(e => {
            e.textContent = ''; e.style.display = 'none';
        });
        hideSendError();
    }

    /* ── Main form submit handler ── */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideSendError();

            // Collect values
            const name    = document.getElementById('form-name')?.value.trim()    || '';
            const email   = document.getElementById('form-email')?.value.trim()   || '';
            const phone   = document.getElementById('form-phone')?.value.trim()   || '';
            const service = document.getElementById('form-service')?.value        || '';
            const message = document.getElementById('form-message')?.value.trim() || '';

            // Run validation — abort if errors found
            if (!validateForm(name, email, phone, service, message)) return;

            // Start loading state
            setButtonLoading(true);

            // Web3Forms payload
            const payload = {
                access_key: '04e7ce50-bd36-4a64-a623-6cdd8eba6535',
                name: name,
                email: email,
                phone: phone,
                service: service,
                message: message
            };

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.status === 200) {
                    // ✅ Email sent successfully
                    showSuccessModal(name, service);
                    resetForm();
                } else {
                    throw new Error(result.message || `Web3Forms returned status ${response.status}`);
                }

            } catch (error) {
                console.error('Web3Forms send error:', error);
                showSendError(
                    'Failed to send your message. Please try again.'
                );
            } finally {
                setButtonLoading(false);
            }
        });
    }

    /* ── Modal close handlers ── */
    const closeModal = () => {
        if (thankYouModal) thankYouModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay)  modalOverlay.addEventListener('click', closeModal);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && thankYouModal?.classList.contains('active')) {
            closeModal();
        }
    });

});

