// Enhanced Portfolio JavaScript with Fixed Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initParticles();
    initNavigation();
    initAnimatedCounters();
    initCertificateFiltering();
    initContactForm();
    initScrollAnimations();
    initIntersectionObserver();
    initI18n();

    // Particle Background Animation
    function initParticles() {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;

        const particleCount = 30;

        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random positioning and animation properties
            const startX = Math.random() * window.innerWidth;
            const animationDuration = Math.random() * 4 + 4;
            const animationDelay = Math.random() * 2;

            particle.style.left = startX + 'px';
            particle.style.bottom = '-10px';
            particle.style.animationDuration = animationDuration + 's';
            particle.style.animationDelay = animationDelay + 's';

            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            particlesContainer.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (animationDuration + animationDelay) * 1000);
        }

        // Create initial particles
        for (let i = 0; i < particleCount; i++) {
            setTimeout(createParticle, i * 100);
        }

        setInterval(createParticle, 300);
    }

    // Fixed Navigation with Proper Smooth Scrolling
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Navbar scroll effect
        function handleNavbarScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Mobile menu toggle
        function toggleMobileMenu() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }

        // Close mobile menu
        function closeMobileMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fixed smooth scrolling function
        function handleSmoothScroll(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();
            e.stopPropagation();

            const targetId = href.substring(1); // Remove #
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;

                // Smooth scroll to target
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });

                // Update active link immediately
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                closeMobileMenu();
            }
        }

        // Update active navigation link on scroll
        function updateActiveNavLink() {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                return; // Don't update when mobile menu is open
            }

            const scrollPosition = window.scrollY + (navbar ? navbar.offsetHeight : 80) + 100;
            const sections = document.querySelectorAll('section[id]');
            let activeSection = null;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSection = section;
                }
            });

            if (activeSection) {
                const activeId = activeSection.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + activeId) {
                        link.classList.add('active');
                    }
                });
            }
        }

        // Event listeners
        window.addEventListener('scroll', debounce(() => {
            handleNavbarScroll();
            updateActiveNavLink();
        }, 10));

        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });
        }

        // Add click listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Add click listener for certificates page link
        const certsLink = document.querySelector('a[href="certificates.html"]');
        if (certsLink) {
            certsLink.addEventListener('click', () => {
                closeMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (navbar && !navbar.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Initial calls
        handleNavbarScroll();
        setTimeout(updateActiveNavLink, 500);
    }

    // Animated Counters
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const animatedCounters = new Set();

        function animateCounter(counter) {
            if (animatedCounters.has(counter)) return;
            animatedCounters.add(counter);

            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 60;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        }

        // Intersection Observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach((counter, index) => {
                        setTimeout(() => animateCounter(counter), index * 200);
                    });
                }
            });
        }, { threshold: 0.5 });

        const heroStatsSection = document.querySelector('.hero-stats');
        if (heroStatsSection) {
            counterObserver.observe(heroStatsSection);
        }
    }

    // Fixed Certificate Filtering System
    function initCertificateFiltering() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const certificateCards = document.querySelectorAll('.certificate-card');

        console.log('Certificate filtering initialized:', categoryButtons.length, 'buttons,', certificateCards.length, 'cards');

        function filterCertificates(category) {
            console.log('Filtering certificates by category:', category);

            certificateCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category') || card.classList[1]; // fallback to class

                if (category === 'all') {
                    // Show all cards
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    // Animate in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    // Check if card matches category
                    if (cardCategory === category || card.classList.contains(category)) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        // Hide card
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                            card.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        }

        if (categoryButtons.length > 0) {
            categoryButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('Category button clicked:', button.textContent);

                    // Update active button
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter certificates
                    const category = button.getAttribute('data-category');
                    filterCertificates(category);
                });
            });

            // Initialize all cards as visible
            certificateCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });

            // Set initial filter
            filterCertificates('all');
        }
    }

    // Fixed Contact Form
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        console.log('Contact form initialized');

        function validateForm() {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            const errors = [];

            if (!name || !name.value.trim()) errors.push('Name is required');
            if (!email || !email.value.trim()) errors.push('Email is required');
            else if (!isValidEmail(email.value.trim())) errors.push('Please enter a valid email address');
            if (!subject || !subject.value.trim()) errors.push('Subject is required');
            if (!message || !message.value.trim()) errors.push('Message is required');
            else if (message.value.trim().length < 10) errors.push('Message must be at least 10 characters long');

            return errors;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Contact form submitted');

            const errors = validateForm();

            if (errors.length > 0) {
                showNotification('Form Error', errors.join('<br>'), 'error');
                return;
            }

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const mailtoLink = `mailto:abdullah.aja@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

            window.location.href = mailtoLink;

            // Note: The notification is now redundant since the browser will handle the action.
            // You can remove it or modify it to indicate that an email client is being opened.
            // For now, I will keep it to show that the action has been triggered.
            showNotification('Success!', 'Your email client should open shortly to send the message.', 'success');
        }

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Scroll Animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.floating-card, .certificate-card, .participation-card'
        );

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Intersection Observer
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.floating-card, .certificate-card, .participation-card'
        );

        animatedElements.forEach((element, index) => {
            element.style.transitionDelay = (index * 100) + 'ms';
            observer.observe(element);
        });
    }

    // Internationalization (i18n) - Removed AR content but kept structure
    function initI18n() {
        const defaultLang = 'en';
        const savedLang = localStorage.getItem('lang') || defaultLang;
        const langSwitch = document.getElementById('lang-switch');

        const translations = {
            en: {
                'nav.name': 'Abdullah Ahmed',
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.experience': 'Experience',
                'nav.projects': 'Project',
                'nav.certificates': 'Certificates',
                'nav.contact': 'Contact',
                'hero.subtitle': 'Traffic and Transportation Engineer',
                'hero.description': 'Aspiring transportation engineer with hands-on experience in traffic analysis, modeling, and infrastructure review. Committed to improving urban mobility and safety through data-driven and sustainable engineering practices.',
                'hero.location': 'Riyadh, Saudi Arabia',
                'cta.contact': 'Contact Me',
                'about.title': 'About Me',
                'about.subtitle': 'Education and Career Objective',
                'about.education': 'Education',
                'about.objective': 'Career Objective',
                'about.skills': 'Technical Skills',
                'experience.title': 'Professional Experience',
                'experience.subtitle': 'Work Experience and Professional Activities',
                'experience.participations': 'Participations & Events',
                'projects.title': 'Graduation Project',
                'projects.subtitle': 'Specialized Academic Research',
                'projects.methodology': 'Methodology:',
                'projects.locationTitle': 'Study Location',
                'projects.outcomes': 'Results & Recommendations:',
                'certs.title': 'Certificates & Training',
                'certs.subtitle': 'Professional Certificates and Development Programs',
                'certs.all': 'All Certificates',
                'contact.title': 'Contact Me',
                'contact.subtitle': 'Let’s discuss opportunities and collaboration',
                'contact.email': 'Email',
                'form.name': 'Name',
                'form.email': 'Email',
                'form.subject': 'Subject',
                'form.message': 'Message',
                'form.send': 'Send Message',
                'footer.name': 'Abdullah Ahmed',
                'footer.title': 'Traffic and Transportation Engineer',
                'footer.rights': 'All rights reserved.'
            }
        };

        function applyLanguage(lang) {
            const html = document.documentElement;
            const dir = lang === 'ar' ? 'rtl' : 'ltr';
            html.setAttribute('lang', lang);
            html.setAttribute('dir', dir);

            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = translations[lang][key];
                if (typeof text === 'string') {
                    if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                        el.setAttribute('placeholder', text);
                    } else {
                        el.textContent = text;
                    }
                }
            });

            document.body.classList.toggle('lang-en', lang === 'en');
            localStorage.setItem('lang', lang);
        }

        applyLanguage('en');
    }

    // Enhanced Notification System
    function showNotification(title, message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <div>
                <strong>${title}</strong><br>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Fixed button click handling
    document.addEventListener('click', function (e) {
        if (e.target.closest('.btn')) {
            const btn = e.target.closest('.btn');
            const href = btn.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    const navbar = document.getElementById('navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = target.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        }
    });

    // Initialize animations with delay
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.animate-text');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

    }, 500);

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('certificate-card') ||
                focusedElement.classList.contains('category-btn')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    console.log('🚀 Portfolio initialized successfully!');
});