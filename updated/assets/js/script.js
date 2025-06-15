/*==================== THEME SWITCHING ====================*/
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupThemeToggle();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggle(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggle(newTheme);
    }

    updateThemeToggle(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        const slider = document.querySelector('.theme-toggle__slider');
        
        if (slider) {
            const icon = slider.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.className = `theme-toggle__icon fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`;
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

/*==================== NAVIGATION ====================*/
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSmoothScrolling();
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav__toggle');
        const navMenu = document.querySelector('.nav__menu');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });

            // Close menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('show');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('show');
                }
            });
        }
    }

    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === 'index.html') ||
                (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

/*==================== ANIMATIONS ====================*/
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupLoadAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        const animatedElements = document.querySelectorAll('.section, .card');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupLoadAnimations() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Animate elements on page load
            const heroElements = document.querySelectorAll('.hero__content > *');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-fade-in-up');
                }, index * 200);
            });
        });
    }
}

/*==================== FORM HANDLING ====================*/
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupAdminForm();
    }

    setupContactForm() {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
        }
    }

    setupAdminForm() {
        const adminForm = document.querySelector('#admin-form');
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminSubmission(adminForm);
            });
        }
    }

    handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        this.showNotification('Thank you for your message! I will get back to you soon.', 'success');
        form.reset();
    }

    handleAdminSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!data.content) {
            this.showNotification('Please enter some content for the post.', 'error');
            return;
        }

        // Create post object
        const post = {
            id: Date.now(),
            content: data.content,
            image: data.image || null,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Save to localStorage (in a real app, this would be sent to a server)
        this.savePost(post);
        this.showNotification('Post created successfully!', 'success');
        form.reset();
        
        // Update preview if on admin page
        this.updatePostPreview(post);
    }

    savePost(post) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(post); // Add to beginning of array
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    updatePostPreview(post) {
        const preview = document.querySelector('#post-preview');
        if (preview) {
            preview.innerHTML = this.createPostHTML(post);
            preview.classList.remove('hidden');
        }
    }

    createPostHTML(post) {
        return `
            <div class="post-card">
                <div class="post-card__header">
                    <div class="post-card__avatar">
                        <img src="assets/images/profile.jpg" alt="Madushan Dasanayaka">
                    </div>
                    <div class="post-card__info">
                        <h4>@madushan</h4>
                        <span class="post-card__date">${post.date}</span>
                    </div>
                </div>
                <div class="post-card__content">
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-card__image">` : ''}
                    <p>${post.content}</p>
                </div>
                <div class="post-card__actions">
                    <button class="post-card__action">
                        <i class="fas fa-heart"></i>
                        <span>Like</span>
                    </button>
                    <button class="post-card__action">
                        <i class="fas fa-comment"></i>
                        <span>Comment</span>
                    </button>
                    <button class="post-card__action">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-brown)' : type === 'error' ? '#e74c3c' : 'var(--primary-brown)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px var(--shadow-color);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

/*==================== POSTS MANAGER ====================*/
class PostsManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadLatestPost();
    }

    loadLatestPost() {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const latestPostContainer = document.querySelector('#latest-post');
        
        if (latestPostContainer && posts.length > 0) {
            const latestPost = posts[0];
            latestPostContainer.innerHTML = this.createPostHTML(latestPost);
        } else if (latestPostContainer) {
            latestPostContainer.innerHTML = `
                <div class="post-card">
                    <div class="post-card__header">
                        <div class="post-card__avatar">
                            <img src="assets/images/profile.jpg" alt="Madushan Dasanayaka">
                        </div>
                        <div class="post-card__info">
                            <h4>@madushan</h4>
                            <span class="post-card__date">Welcome</span>
                        </div>
                    </div>
                    <div class="post-card__content">
                        <p>Welcome to my digital space! I'm an entrepreneur passionate about building tech solutions, exploring filmmaking, and leveraging AI to solve real-world problems. Stay tuned for updates on my journey! 🚀</p>
                    </div>
                    <div class="post-card__actions">
                        <button class="post-card__action">
                            <i class="fas fa-heart"></i>
                            <span>Like</span>
                        </button>
                        <button class="post-card__action">
                            <i class="fas fa-comment"></i>
                            <span>Comment</span>
                        </button>
                        <button class="post-card__action">
                            <i class="fas fa-share"></i>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            `;
        }
    }

    createPostHTML(post) {
        return `
            <div class="post-card">
                <div class="post-card__header">
                    <div class="post-card__avatar">
                        <img src="assets/images/profile.jpg" alt="Madushan Dasanayaka">
                    </div>
                    <div class="post-card__info">
                        <h4>@madushan</h4>
                        <span class="post-card__date">${post.date}</span>
                    </div>
                </div>
                <div class="post-card__content">
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-card__image">` : ''}
                    <p>${post.content}</p>
                </div>
                <div class="post-card__actions">
                    <button class="post-card__action">
                        <i class="fas fa-heart"></i>
                        <span>Like</span>
                    </button>
                    <button class="post-card__action">
                        <i class="fas fa-comment"></i>
                        <span>Comment</span>
                    </button>
                    <button class="post-card__action">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        `;
    }
}

/*==================== TYPING ANIMATION ====================*/
class TypingAnimation {
    constructor(element, texts, speed = 100) { // Removed heroSectionElement
        this.element = element;
        this.texts = texts;
        // Removed this.heroSectionElement = heroSectionElement;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        // Removed this.backgroundClasses
        this.init();
    }

    init() {
        if (this.element) { // Reverted check
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];

        // Removed background changing logic
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

/*==================== SOCIAL SLIDESHOW ====================*/
class SocialSlideshow {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.icons = this.container.querySelectorAll('.social__link');
        // Removed direct stat element references from constructor
        
        this.platforms = [
            { platform: "youtube", stat1_num: "7.1M", stat1_label: "Subscribers", stat2_num: "520", stat2_label: "Videos", stat3_num: "16%", stat3_label: "Growth" },
            { platform: "facebook", stat1_num: "2.1M", stat1_label: "Followers", stat2_num: "1.5K", stat2_label: "Posts", stat3_num: "6%", stat3_label: "Growth" },
            { platform: "instagram", stat1_num: "85K", stat1_label: "Followers", stat2_num: "1.1K", stat2_label: "Posts", stat3_num: "10%", stat3_label: "Growth" },
            { platform: "twitter", stat1_num: "1.1M", stat1_label: "Followers", stat2_num: "6.2K", stat2_label: "Tweets", stat3_num: "14%", stat3_label: "Growth" },
            { platform: "linkedin", stat1_num: "20K", stat1_label: "Followers", stat2_num: "250", stat2_label: "Posts", stat3_num: "20%", stat3_label: "Growth" },
            { platform: "tiktok", stat1_num: "4.2M", stat1_label: "Followers", stat2_num: "950", stat2_label: "Videos", stat3_num: "28%", stat3_label: "Growth" },
            { platform: "threads", stat1_num: "60K", stat1_label: "Followers", stat2_num: "350", stat2_label: "Posts", stat3_num: "13%", stat3_label: "Growth" }
        ];

        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.startSlideshow();
    }

    startSlideshow() {
        setInterval(() => {
            this.updateSlideshow();
            this.currentIndex = (this.currentIndex + 1) % this.platforms.length;
        }, 3000); // Change stats every 3 seconds
    }

    updateSlideshow() {
        // Icon highlighting
        this.icons.forEach(icon => {
            icon.classList.remove('highlight');
            // Remove all possible platform-specific highlight classes
            this.platforms.forEach(p => icon.classList.remove(`highlight--${p.platform}`));
        });

        const currentPlatformData = this.platforms[this.currentIndex];
        const activeIcon = this.container.querySelector(`.social__link[data-platform="${currentPlatformData.platform}"]`);

        if (activeIcon) {
            activeIcon.classList.add('highlight'); // Add generic highlight
            activeIcon.classList.add(`highlight--${currentPlatformData.platform}`); // Add specific platform highlight
        }
        
        // Stats update
        const statsContainer = document.querySelector('.profile__stats-slideshow'); // Query current container
        if (statsContainer && statsContainer.parentNode) {
            const parent = statsContainer.parentNode;
            const newStatsContainer = statsContainer.cloneNode(true); // Clone it

            // Query elements within the CLONE
            const s1n = newStatsContainer.querySelector('#stat-1-number');
            const s1l = newStatsContainer.querySelector('#stat-1-label');
            const s2n = newStatsContainer.querySelector('#stat-2-number');
            const s2l = newStatsContainer.querySelector('#stat-2-label');
            const s3n = newStatsContainer.querySelector('#stat-3-number');
            const s3l = newStatsContainer.querySelector('#stat-3-label');

            // Update content of elements IN THE CLONE
            if (s1n) s1n.textContent = currentPlatformData.stat1_num;
            if (s1l) s1l.textContent = currentPlatformData.stat1_label;
            if (s2n) s2n.textContent = currentPlatformData.stat2_num;
            if (s2l) s2l.textContent = currentPlatformData.stat2_label;
            if (s3n) s3n.textContent = currentPlatformData.stat3_num;
            if (s3l) s3l.textContent = currentPlatformData.stat3_label;

            parent.replaceChild(newStatsContainer, statsContainer); // Replace old with updated clone
        }
    }
}

/*==================== INITIALIZATION ====================*/
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new Navigation();
    new AnimationManager();
    new FormManager();
    new PostsManager();
    
    // Initialize Social Slideshow
    new SocialSlideshow('.connect-preview__profile');

    // Initialize typing animation if element exists
    const typingElement = document.querySelector('.typing-text');
    // Removed: const heroSection = document.querySelector('.hero');
    if (typingElement) { // Reverted check
        new TypingAnimation(typingElement, [ // Removed heroSection argument
            'Entrepreneur',
            'Tech Innovator',
            'Filmmaker',
            'AI Enthusiast'
        ]);
    }

    // Add scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--primary-brown);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update scroll progress
    const updateScrollProgress = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollProgress}%`;
    };

    window.addEventListener('scroll', updateScrollProgress);

    console.log('🚀 Madushan\'s Portfolio loaded successfully!');
});
