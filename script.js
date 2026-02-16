// ============================================
// ProLikam - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle with ARIA
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', isOpen);
            this.setAttribute('aria-label', isOpen ? 'Zavřít menu' : 'Otevřít menu');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Otevřít menu');
            });
        });
    }

    // Navbar scroll effect
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .tech-card, .product-card, .stat-item, .content-grid, .partner-item, .process-step, .about-value, .contact-channel, .faq-item');
    animateElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease ' + (i % 6) * 0.08 + 's, transform 0.6s ease ' + (i % 6) * 0.08 + 's';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                const q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Show success message if redirected back after form submission
    if (window.location.search.includes('sent=1')) {
        const formEl = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        if (formEl && formSuccess) {
            formEl.style.display = 'none';
            formSuccess.classList.add('visible');
        }
    }

    // Form validation with error states
    const contactForm = document.querySelector('.contact-form form, #contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.form-submit, .btn-primary[type="submit"]');
        const formSuccess = document.getElementById('formSuccess');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            this.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

            const name = this.querySelector('input[name="name"]');
            const email = this.querySelector('input[name="email"]');
            const message = this.querySelector('textarea[name="message"]');
            const gdpr = this.querySelector('input[name="gdpr"]');

            let isValid = true;

            if (name && name.value.trim() === '') {
                const fg = name.closest('.form-group');
                if (fg) fg.classList.add('has-error');
                isValid = false;
            }

            if (email && !isValidEmail(email.value)) {
                const fg = email.closest('.form-group');
                if (fg) fg.classList.add('has-error');
                isValid = false;
            }

            if (message && message.value.trim() === '') {
                const fg = message.closest('.form-group');
                if (fg) fg.classList.add('has-error');
                isValid = false;
            }

            if (gdpr && !gdpr.checked) {
                isValid = false;
            }

            if (isValid) {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Odesílám...';
                }
                this.submit();
            }
        });

        // Clear errors on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                const fg = this.closest('.form-group');
                if (fg) fg.classList.remove('has-error');
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Parallax effect for hero image (throttled via rAF)
    const heroImage = document.querySelector('.hero-bg img');
    if (heroImage) {
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    if (scrolled < window.innerHeight) {
                        heroImage.style.transform = 'translateY(' + scrolled * 0.15 + 'px)';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');

        if (isNaN(number)) return;

        let current = 0;
        const increment = number / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = text;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 35);
    }

    // ============================================
    // Cookie Consent + Google Analytics
    // ============================================
    var GA_MEASUREMENT_ID = 'G-EP7TPYH9FB';

    function loadGoogleAnalytics() {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    }

    var cookieBar = document.getElementById('cookieConsent');
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieReject = document.getElementById('cookieReject');

    if (cookieBar) {
        var consent = localStorage.getItem('cookieConsent');

        if (consent === 'accepted') {
            cookieBar.classList.add('hidden');
            loadGoogleAnalytics();
        } else if (consent === 'rejected') {
            cookieBar.classList.add('hidden');
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBar.classList.add('hidden');
                loadGoogleAnalytics();
            });
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'rejected');
                cookieBar.classList.add('hidden');
            });
        }
    }
});
