/**
 * Modern Portfolio JavaScript - Enhanced Functionality with Mobile Support
 */

class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.init();
  }

  init() {
    this.setupLoader();
    this.setupNavigation();
    this.setupMobileNavigation();
    this.setupParticles();
    this.setupTypingAnimation();
    this.setupScrollAnimations();
    this.setupProjectFilters();
    this.setupScrollToTop();
    this.setupIntersectionObserver();
    this.setupTouchHandlers();
    this.setupResizeHandler();
    this.setupMobileOptimizations();
    this.setupAccessibility();
  }

  // Loading Animation
  setupLoader() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
        this.isLoaded = true;
        this.startAnimations();
      }, 1500);
    });
  }

  startAnimations() {
    // Trigger initial animations after loading
    if (!this.isMobile) {
      this.createParticleEffect();
    }
    this.animateSkillCards();
  }

  // Enhanced Navigation with Mobile Support
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('floatingNav');

    // Smooth scroll navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          this.scrollToSection(targetSection);
          this.setActiveNav(link);

          // Close mobile menu if open
          if (this.isMobile) {
            this.closeMobileMenu();
          }
        }
      });
    });

    // Nav background on scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 100;
      nav.classList.toggle('scrolled', scrolled);
    });
  }

  // Mobile Navigation
  setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.getElementById('floatingNav');

    if (navToggle && navLinks) {
      // Toggle mobile menu
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });

      // Prevent menu close when clicking inside nav
      navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  toggleMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // Touch Handlers for Mobile
  setupTouchHandlers() {
    // Swipe to close mobile menu
    const navLinks = document.querySelector('.nav-links');

    if (navLinks) {
      navLinks.addEventListener('touchstart', (e) => {
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      navLinks.addEventListener('touchend', (e) => {
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
      }, { passive: true });
    }

    // Improve touch interactions for cards
    const touchElements = document.querySelectorAll('.project-card, .skill-card, .contact-card');

    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });

      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartY - this.touchEndY;

    // Swipe up to close menu
    if (diff > swipeThreshold) {
      this.closeMobileMenu();
    }
  }

  // Resize Handler
  setupResizeHandler() {
    let resizeTimer;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

    // If switching from mobile to desktop, close mobile menu
    if (wasmobile && !this.isMobile) {
      this.closeMobileMenu();
    }

    // Recreate particles if needed
    if (!this.isMobile && wasMobile) {
      this.createParticleEffect();
    } else if (this.isMobile && !wasobile) {
      this.clearParticles();
    }

    // Update typing animation for mobile
    this.updateTypingAnimation();
  }

  // Mobile Optimizations
  setupMobileOptimizations() {
    if (this.isMobile) {
      // Reduce animation complexity
      document.body.classList.add('mobile-device');

      // Optimize images for mobile
      this.optimizeImagesForMobile();

      // Setup lazy loading
      this.setupLazyLoading();

      // Reduce motion if preferred
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
      }
    }
  }

  optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Add loading lazy for better performance
      img.loading = 'lazy';

      // Add mobile-optimized classes
      img.classList.add('mobile-optimized');
    });
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Accessibility Enhancements
  setupAccessibility() {
    // Focus management for mobile navigation
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-controls', 'navigation-menu');
      navLinks.setAttribute('id', 'navigation-menu');

      // Update aria-expanded when menu toggles
      const originalToggle = this.toggleMobileMenu.bind(this);
      this.toggleMobileMenu = () => {
        originalToggle();
        const isOpen = navLinks.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isOpen.toString());
      };
    }

    // Skip to content link for mobile
    this.createSkipLink();

    // Improve focus indicators
    this.enhanceFocusIndicators();
  }

  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-bg);
      color: var(--text-primary);
      padding: 8px;
      border-radius: 4px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceFocusIndicators() {
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  scrollToSection(target) {
    const navHeight = this.isMobile ? 80 : 100;
    const targetPosition = target.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  // Particle Animation System (Desktop only)
  setupParticles() {
    this.particles = [];
    this.particleContainer = document.getElementById('particles');

    if (this.isMobile) {
      return; // Skip particles on mobile for performance
    }
  }

  createParticleEffect() {
    if (!this.isLoaded || this.isMobile) return;

    const particleCount = this.isTablet ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
      this.createParticle();
    }

    this.animateParticles();
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(102, 126, 234, 0.5);
      border-radius: 50%;
      pointer-events: none;
    `;

    this.resetParticle(particle);
    this.particleContainer.appendChild(particle);
    this.particles.push(particle);
  }

  resetParticle(particle) {
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.vx = (Math.random() - 0.5) * 0.5;
    particle.vy = (Math.random() - 0.5) * 0.5;
    particle.life = Math.random() * 100;
  }

  animateParticles() {
    if (this.isMobile) return;

    this.particles.forEach(particle => {
      const currentLeft = parseFloat(particle.style.left);
      const currentTop = parseFloat(particle.style.top);

      particle.style.left = currentLeft + particle.vx + 'px';
      particle.style.top = currentTop + particle.vy + 'px';

      particle.life--;

      if (particle.life <= 0 ||
          currentLeft < 0 || currentLeft > window.innerWidth ||
          currentTop < 0 || currentTop > window.innerHeight) {
        this.resetParticle(particle);
      }
    });

    requestAnimationFrame(() => this.animateParticles());
  }

  clearParticles() {
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }

  // Enhanced Typing Animation with Mobile Support
  setupTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const texts = [
      'Frontend Developer',
      'Angular Specialist',
      'UI/UX Designer',
      'Full Stack Developer',
      'Problem Solver'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = this.isMobile ? 80 : 50;
    const deleteSpeed = this.isMobile ? 40 : 25;
    const pauseTime = this.isMobile ? 1500 : 2000;

    const type = () => {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentText.length) {
        nextDelay = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }

      setTimeout(type, nextDelay);
    };

    setTimeout(type, 1000);
  }

  updateTypingAnimation() {
    // Restart typing animation with new mobile settings if needed
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
      // Clear current animation and restart
      typingElement.textContent = '';
      setTimeout(() => this.setupTypingAnimation(), 100);
    }
  }

  // Enhanced Project Filters with Mobile Support
  setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects with mobile-optimized animation
        this.filterProjects(projectCards, filter);
      });
    });
  }

  filterProjects(cards, filter) {
    cards.forEach((card, index) => {
      const shouldShow = filter === 'all' || card.classList.contains(filter);

      if (shouldShow) {
        card.style.display = 'block';
        // Stagger animation for better mobile performance
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * (this.isMobile ? 50 : 100));
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Intersection Observer for Mobile Performance
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: this.isMobile ? 0.1 : 0.2,
        rootMargin: this.isMobile ? '50px' : '100px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Update active navigation
            const id = entry.target.getAttribute('id');
            if (id) {
              const navLink = document.querySelector(`[href="#${id}"]`);
              if (navLink) {
                this.setActiveNav(navLink);
              }
            }
          }
        });
      }, observerOptions);

      // Observe all sections
      document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });

      // Observe cards for animation
      document.querySelectorAll('.skill-card, .project-card, .contact-card').forEach(card => {
        observer.observe(card);
      });
    }
  }

  // Enhanced Scroll Animations
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hero-content, .about-text, .section-header');

    // Reduce animations on mobile for better performance
    if (this.isMobile) {
      animatedElements.forEach(el => {
        el.classList.add('mobile-animation');
      });
    }
  }

  // Mobile-optimized Scroll to Top
  setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    const toggleScrollBtn = () => {
      const scrolled = window.scrollY > (this.isMobile ? 300 : 500);
      scrollBtn.classList.toggle('visible', scrolled);
    };

    window.addEventListener('scroll', toggleScrollBtn);

    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Animate skill cards with mobile optimization
  animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * (this.isMobile ? 50 : 100));
    });
  }

  // Performance monitoring for mobile
  monitorPerformance() {
    if ('performance' in window && 'memory' in performance) {
      const memory = performance.memory;
      const memoryLimit = 50 * 1024 * 1024; // 50MB threshold

      if (memory.usedJSMemorySize > memoryLimit) {
        // Reduce effects on low-memory devices
        this.clearParticles();
        document.body.classList.add('low-memory-mode');
      }
    }
  }
}

// Initialize the portfolio app
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Service Worker Registration for PWA support
if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
