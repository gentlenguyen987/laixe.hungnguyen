document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise use system preference (default dark)
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Trigger subtle haptic-like effect or ripple if wanted
        themeToggleBtn.style.transform = 'scale(0.9) rotate(15deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = 'none';
        }, 150);
    });

    /* ==========================================================================
       MOBILE MENU DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================================================
       SCROLL PROGRESS BAR & STICKY HEADER
       ========================================================================== */
    const header = document.querySelector('.main-header');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Reading Progress Bar
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${scrollPercent}%`;

        // 2. Sticky Header active class
        if (scrollTop > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 3. Back to Top Button visibility
        if (scrollTop > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Back to top scroll execution
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       ACTIVE NAV LINK SCROLL SPY
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const scrollSpy = () => {
        const scrollPos = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       HERO TEXT TYPING ANIMATION
       ========================================================================== */
    const typingTextEl = document.getElementById('typing-text');
    const phrases = [
        "Tự Tin Vững Tay Lái",
        "Tỉ Lệ Đỗ Sát Hạch 99%",
        "Xe Tập Lái Đời Mới",
        "Học Phí Trọn Gói Cam Kết"
    ];
    
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // faster deletion
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120; // normal typing
        }

        // State machine logic
        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause at full text
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // pause before typing next
        }

        setTimeout(typeAnimation, typingSpeed);
    };

    // Start typing animation
    typeAnimation();

    /* ==========================================================================
       HERO SECTION STATS ANIMATED COUNTER
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic function
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(easeProgress * target);
                
                // Format numbers with commas (e.g. 15,000)
                if (currentValue >= 1000) {
                    counter.textContent = currentValue.toLocaleString('en-US');
                } else {
                    counter.textContent = currentValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target >= 1000 ? target.toLocaleString('en-US') : target;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    /* ==========================================================================
       COURSES FILTER SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Animate hide/show smoothly using CSS scale and opacity transitions
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // delay display none until transition finishes
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       ACCORDION FAQ SYSTEM
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle selected item
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    /* ==========================================================================
       FORM VALIDATION & REGISTRATION
       ========================================================================== */
    const regForm = document.getElementById('registration-form');
    const successMessage = document.getElementById('form-success');
    const successCloseBtn = document.getElementById('success-close');
    
    const fullnameInput = document.getElementById('fullname');
    const phoneInput = document.getElementById('phone');
    const areaInput = document.getElementById('area');
    const courseInterestInput = document.getElementById('course-interest');

    // Setup visual select validation when placeholder selected
    const selectElements = document.querySelectorAll('.select-input');
    selectElements.forEach(select => {
        select.addEventListener('change', () => {
            if (select.value !== "") {
                select.classList.add('has-value');
            } else {
                select.classList.remove('has-value');
            }
        });
    });

    // Check if select inputs already have default values (e.g. preselected)
    selectElements.forEach(select => {
        if(select.value !== "") {
            select.classList.add('has-value');
        }
    });

    // Interactive button auto course selector from course cards
    const registerButtons = document.querySelectorAll('.register-course-btn');
    registerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedCourseName = btn.getAttribute('data-course');
            
            // Map course names to dropdown values
            let dropdownVal = "";
            if (selectedCourseName.includes("A1")) dropdownVal = "A1";
            else if (selectedCourseName.includes("A2")) dropdownVal = "A2";
            else if (selectedCourseName.includes("B1")) dropdownVal = "B1";
            else if (selectedCourseName.includes("B2")) dropdownVal = "B2";
            else if (selectedCourseName.includes("C")) dropdownVal = "C";
            else if (selectedCourseName.includes("D") || selectedCourseName.includes("E")) dropdownVal = "DE";
            else if (selectedCourseName.includes("Bổ Túc")) dropdownVal = "botuc";

            if (dropdownVal) {
                courseInterestInput.value = dropdownVal;
                courseInterestInput.classList.add('has-value');
            }
        });
    });

    // Validation helper functions
    const validateName = (name) => {
        // Name must be between 2 and 50 characters, only letters and spaces (Vietnamese characters supported)
        const regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơư\s]{2,50}$/;
        return regex.test(name.trim());
    };

    const validatePhone = (phone) => {
        // Allow numbers, spaces, dots, hyphens, and plus signs. Total digits must be between 9 and 11.
        const cleanPhone = phone.replace(/[\s\.\-\+]/g, '');
        const regex = /^[0-9]{9,11}$/;
        return regex.test(cleanPhone);
    };

    const markFieldInvalid = (element, errorId, show) => {
        const group = element.parentElement;
        if (show) {
            group.classList.add('invalid');
        } else {
            group.classList.remove('invalid');
        }
    };

    // Live validation
    fullnameInput.addEventListener('blur', () => {
        markFieldInvalid(fullnameInput, 'name-error', !validateName(fullnameInput.value));
    });

    phoneInput.addEventListener('blur', () => {
        markFieldInvalid(phoneInput, 'phone-error', !validatePhone(phoneInput.value));
    });

    fullnameInput.addEventListener('input', () => {
        if (validateName(fullnameInput.value)) {
            markFieldInvalid(fullnameInput, 'name-error', false);
        }
    });

    phoneInput.addEventListener('input', () => {
        if (validatePhone(phoneInput.value)) {
            markFieldInvalid(phoneInput, 'phone-error', false);
        }
    });

    // Form Submission
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName(fullnameInput.value);
        const isPhoneValid = validatePhone(phoneInput.value);
        const isAreaValid = areaInput.value !== "";
        const isCourseValid = courseInterestInput.value !== "";

        markFieldInvalid(fullnameInput, 'name-error', !isNameValid);
        markFieldInvalid(phoneInput, 'phone-error', !isPhoneValid);

        if (isNameValid && isPhoneValid && isAreaValid && isCourseValid) {
            // Show loading animation on button
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Đang xử lý...";

            // Create form data to submit
            const formData = new FormData(regForm);

            // Fetch to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/gentle.nguyen987@gmail.com", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Gửi dữ liệu không thành công.");
            })
            .then(data => {
                // Show success screen
                regForm.classList.add('hidden');
                successMessage.classList.add('active');
                
                // Reset form values
                regForm.reset();
                selectElements.forEach(select => select.classList.remove('has-value'));
            })
            .catch(error => {
                alert("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng liên hệ Hotline 0907.070.308 để được hỗ trợ đăng ký trực tiếp.");
                console.error("Error submitting form:", error);
            })
            .finally(() => {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        }
    });

    successCloseBtn.addEventListener('click', () => {
        successMessage.classList.remove('active');
        regForm.classList.remove('hidden');
    });

    /* ==========================================================================
       SCROLL REVEAL & STATS COUNTER TRIGGER (INTERSECTION OBSERVER)
       ========================================================================== */
    // Add scroll reveal classes to HTML elements dynamically
    const revealTargets = [
        ...document.querySelectorAll('.course-card'),
        ...document.querySelectorAll('.why-card'),
        ...document.querySelectorAll('.faq-item'),
        ...document.querySelectorAll('.gallery-item'),
        document.querySelector('.hero-content'),
        document.querySelector('.hero-visual'),
        document.querySelector('.section-header'),
        document.querySelector('.facilities-content'),
        document.querySelector('.facilities-visual'),
        document.querySelector('.contact-info'),
        document.querySelector('.contact-form-wrapper')
    ];

    revealTargets.forEach(target => {
        if (target) {
            target.classList.add('reveal-item');
        }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // only reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // trigger slightly before entering fully
    });

    revealTargets.forEach(target => {
        if (target) {
            revealObserver.observe(target);
        }
    });

    // Observer specifically to trigger stats counter at the right time
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        statsObserver.observe(statsSection);
    }
});
