// Force download function
function forceDownload(event, url, filename) {
    event.preventDefault();

    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        })
        .catch(error => {
            console.error('Download failed:', error);
            // Fallback to normal link behavior
            window.open(url, '_blank');
        });
}

// About image click animation and mouse follow effect
function initAboutImageAnimation() {
    const aboutImage = document.querySelector('.about-image');
    const aboutImageImg = document.querySelector('.about-image img');

    if (aboutImage && aboutImageImg) {
        // Mouse enter effect
        aboutImage.addEventListener('mouseenter', function() {
            if (!this.classList.contains('clicked')) {
                aboutImageImg.style.transition = 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });

        // Mouse follow animation
        aboutImage.addEventListener('mousemove', function(e) {
            if (!this.classList.contains('clicked')) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate mouse position relative to center
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                // Calculate rotation angles (subtle effect)
                const rotateX = (mouseY / rect.height) * -12; // Max 12 degrees
                const rotateY = (mouseX / rect.width) * 12;   // Max 12 degrees

                // Subtle scale effect
                const scaleEffect = 1.03; // Fixed subtle scale

                // Apply transform with subtle effects
                aboutImageImg.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(${scaleEffect})
                `;

                // Subtle shadow effect
                const shadowX = rotateY * 0.3;
                const shadowY = rotateX * -0.3;
                aboutImageImg.style.boxShadow = `
                    ${shadowX}px ${shadowY}px 20px rgba(0, 212, 170, 0.2),
                    0 0 0 4px rgba(0, 212, 170, 0.05)
                `;
            }
        });

        // Reset on mouse leave
        aboutImage.addEventListener('mouseleave', function() {
            if (!this.classList.contains('clicked')) {
                aboutImageImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                aboutImageImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                aboutImageImg.style.boxShadow = '';
            }
        });

        // Click animation
        aboutImage.addEventListener('click', function() {
            // Remove existing animation if any
            this.classList.remove('clicked');

            // Trigger reflow to restart animation
            void this.offsetWidth;

            // Add animation class
            this.classList.add('clicked');

            // Remove class after animation completes
            setTimeout(() => {
                this.classList.remove('clicked');
                // Reset to normal state after click animation
                aboutImageImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                aboutImageImg.style.boxShadow = '';
            }, 1000);
        });
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize about image animation
    initAboutImageAnimation();
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Header background on scroll
    const header = document.querySelector('.header');
    
    function updateHeaderBackground() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'var(--bg-primary)';
            header.style.backdropFilter = 'none';
        }
    }

    window.addEventListener('scroll', updateHeaderBackground);

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-item, .portfolio-item, .contact-item, .about-text, .about-image');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Typing animation for hero text
    const heroTitle = document.querySelector('.main-title h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name && email && message) {
                // Simulate form submission
                const submitBtn = this.querySelector('.btn-send');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    submitBtn.style.backgroundColor = '#4CAF50';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        this.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Download CV button functionality
    const downloadBtn = document.querySelector('.btn-download');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simulate CV download
            const originalText = this.innerHTML;
            this.innerHTML = '<span>Downloading...</span><i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<span>Downloaded!</span><i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1500);
            }, 1000);
        });
    }

    // Parallax effect for hero background text
    const heroBgText = document.querySelector('.hero-bg-text');
    
    if (heroBgText) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBgText.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
        });
    }

    // Skill items spotlight effect
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        // Set up color variables based on data-color attribute
        const color = item.getAttribute('data-color') || '#5865F2';
        const level = parseInt(item.getAttribute('data-level')) || 0;

        // Convert hex to RGB for alpha variations
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        const rgb = hexToRgb(color);
        if (rgb) {
            item.style.setProperty('--skill-color', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
            item.style.setProperty('--skill-color-80', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
            item.style.setProperty('--skill-color-60', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
            item.style.setProperty('--skill-color-50', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
            item.style.setProperty('--skill-color-30', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        }

        // Calculate progress for circular progress bar
        const circumference = 2 * Math.PI * 35; // radius = 35
        const progress = (level / 100) * circumference;
        item.style.setProperty('--progress', progress);

        // Mouse move event for spotlight effect
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;

            // Set the horizontal position for both the light source and beam
            this.style.setProperty('--mouse-x', `${x}px`);
        });

        // Reset spotlight position on mouse leave
        item.addEventListener('mouseleave', function() {
            this.style.setProperty('--mouse-x', '50%');
        });

        // Initialize mouse position
        item.style.setProperty('--mouse-x', '50%');
    });

    // Portfolio items hover effect
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const link = this.querySelector('.portfolio-link');
            if (link) {
                link.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const link = this.querySelector('.portfolio-link');
            if (link) {
                link.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Social media links functionality
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach(item => {
        item.addEventListener('click', function() {
            const platform = this.querySelector('span').textContent.toLowerCase();
            
            // Add your social media links here
            const socialLinks = {
                'instagram': 'https://instagram.com/sinantokmak',
                'discord': 'https://discord.com/users/sinantokmak',
                'github': 'https://github.com/zhiyang446'
            };
            
            if (socialLinks[platform]) {
                window.open(socialLinks[platform], '_blank');
            }
        });
        
        item.style.cursor = 'pointer';
    });

    // Footer social links
    const footerSocialLinks = document.querySelectorAll('.footer-social a');
    
    footerSocialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            const platform = icon.classList[1].split('-')[1]; // Extract platform from fa-platform
            
            const socialLinks = {
                'github': 'https://github.com/sinantokmak',
                'linkedin': 'www.linkedin.com/in/lim-hobart-1a6409177',
                'twitter': 'https://twitter.com/sinantokmak',
                'instagram': 'https://instagram.com/sinantokmak'
            };
            
            if (socialLinks[platform]) {
                window.open(socialLinks[platform], '_blank');
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Mobile menu toggle (for future mobile optimization)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: var(--primary-color);
        color: var(--bg-primary);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, .btn-download, .btn-send');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Vertical navigation functionality
    const verticalNavItems = document.querySelectorAll('.vertical-nav .nav-item');

    verticalNavItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Define target sections based on nav item index
            const sections = ['#home', '#about', '#skills', '#works', '#blog', '#contact'];
            const targetSection = sections[index];

            if (targetSection) {
                const target = document.querySelector(targetSection);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update vertical nav active state on scroll
    function updateVerticalNavActive() {
        const scrollPosition = window.scrollY + 200;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                verticalNavItems.forEach(item => item.classList.remove('active'));
                if (verticalNavItems[index]) {
                    verticalNavItems[index].classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateVerticalNavActive);
});

// MacBook Animation Control
function initMacBookAnimation() {
    const macbook = document.querySelector('.macbook');

    if (macbook) {
        // Function to restart animation
        function restartAnimation() {
            // Remove all animation classes
            const animatedElements = macbook.querySelectorAll('*');
            animatedElements.forEach(element => {
                element.style.animation = 'none';
            });

            // Force reflow
            macbook.offsetHeight;

            // Re-add animations
            setTimeout(() => {
                animatedElements.forEach(element => {
                    element.style.animation = '';
                });
            }, 50);
        }

        // Click to restart animation
        macbook.addEventListener('click', restartAnimation);

        // Auto restart animation every 10 seconds
        setInterval(restartAnimation, 10000);

        // Add hover effect
        macbook.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });

        macbook.addEventListener('mouseleave', function() {
            this.style.cursor = 'default';
        });
    }
}

// Portfolio Tab Functionality
function initPortfolioTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length === 0 || tabPanes.length === 0) return;

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab pane
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Keyboard navigation for tabs
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let targetIndex = index;

            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                targetIndex = index > 0 ? index - 1 : tabButtons.length - 1;
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                targetIndex = index < tabButtons.length - 1 ? index + 1 : 0;
            } else if (e.key === 'Home') {
                e.preventDefault();
                targetIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                targetIndex = tabButtons.length - 1;
            }

            if (targetIndex !== index) {
                tabButtons[targetIndex].focus();
                tabButtons[targetIndex].click();
            }
        });
    });
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('formStatus');

    if (!form) return;

    // Form validation
    function validateField(field, errorElement, validationFn) {
        const value = field.value.trim();
        const isValid = validationFn(value);
        const fieldContainer = field.closest('.form-field');

        if (isValid) {
            fieldContainer.classList.remove('error');
            fieldContainer.classList.add('success');
            errorElement.textContent = '';
            return true;
        } else {
            fieldContainer.classList.remove('success');
            fieldContainer.classList.add('error');
            return false;
        }
    }

    // Validation rules
    const validations = {
        name: (value) => value.length >= 2,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        subject: (value) => value.length >= 3,
        message: (value) => value.length >= 10
    };

    // Real-time validation
    Object.keys(validations).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        field.addEventListener('blur', () => {
            const isValid = validateField(field, errorElement, validations[fieldName]);
            if (!isValid) {
                const errorMessages = {
                    name: 'Name must be at least 2 characters long',
                    email: 'Please enter a valid email address',
                    subject: 'Subject must be at least 3 characters long',
                    message: 'Message must be at least 10 characters long'
                };
                errorElement.textContent = errorMessages[fieldName];
            }
        });

        field.addEventListener('input', () => {
            if (field.closest('.form-field').classList.contains('error')) {
                validateField(field, errorElement, validations[fieldName]);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        Object.keys(validations).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');
            const isValid = validateField(field, errorElement, validations[fieldName]);

            if (!isValid) {
                isFormValid = false;
                const errorMessages = {
                    name: 'Name must be at least 2 characters long',
                    email: 'Please enter a valid email address',
                    subject: 'Subject must be at least 3 characters long',
                    message: 'Message must be at least 10 characters long'
                };
                errorElement.textContent = errorMessages[fieldName];
            }
        });

        if (!isFormValid) {
            showFormStatus('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(new FormData(form));

            // Success
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

            // Reset field states
            document.querySelectorAll('.form-field').forEach(field => {
                field.classList.remove('success', 'error');
            });

        } catch (error) {
            showFormStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    // Simulate form submission (replace with actual backend integration)
    async function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }
}

// Smooth Scroll to Contact Section
function initSmoothScroll() {
    const letsTalkBtn = document.getElementById('letsTalkBtn');
    const contactSection = document.getElementById('contact');

    if (!letsTalkBtn || !contactSection) return;

    letsTalkBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Add click animation
        letsTalkBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            letsTalkBtn.style.transform = '';
        }, 150);

        // Smooth scroll to contact section
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Optional: Add a slight delay then focus on the first input
        setTimeout(() => {
            const firstInput = contactSection.querySelector('#name');
            if (firstInput) {
                firstInput.focus();
            }
        }, 1000);
    });

    // Add hover effect enhancement
    letsTalkBtn.addEventListener('mouseenter', function() {
        const envelope = letsTalkBtn.querySelector('.fas.fa-envelope');
        if (envelope) {
            envelope.style.transform = 'translateY(-2px)';
        }
    });

    letsTalkBtn.addEventListener('mouseleave', function() {
        const envelope = letsTalkBtn.querySelector('.fas.fa-envelope');
        if (envelope) {
            envelope.style.transform = '';
        }
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMacBookAnimation();
    initPortfolioTabs();
    initContactForm();
    initSmoothScroll();
});
