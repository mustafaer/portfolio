/**
 * Modern Portfolio JavaScript - Enhanced Functionality
 */

class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.init();
  }

  init() {
    this.setupLoader();
    this.setupNavigation();
    this.setupParticles();
    this.setupTypingAnimation();
    this.setupScrollAnimations();
    this.setupProjectFilters();
    this.setupScrollToTop();
    this.setupIntersectionObserver();
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
    this.createParticleEffect();
    this.animateSkillCards();
  }

  // Enhanced Navigation
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
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
        }
      });
    });

    // Mobile nav toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
      });
    }

    // Nav background on scroll
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 100;
      nav.classList.toggle('scrolled', scrolled);
    });
  }

  scrollToSection(target) {
    const navHeight = 100;
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

  // Particle Animation System
  setupParticles() {
    this.particles = [];
    this.particleContainer = document.getElementById('particles');
  }

  createParticleEffect() {
    if (!this.isLoaded) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
      this.createParticle();
    }

    this.animateParticles();
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const opacity = Math.random() * 0.5 + 0.1;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: #667EEA;
      border-radius: 50%;
      opacity: ${opacity};
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: -1;
    `;

    this.particleContainer.appendChild(particle);

    this.particles.push({
      element: particle,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: size
    });
  }

  animateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;

      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
    });

    requestAnimationFrame(() => this.animateParticles());
  }

  // Enhanced Typing Animation
  setupTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const phrases = [
      'Building Amazing Web Experiences',
      'Frontend Developer & UI/UX Enthusiast',
      'Angular & JavaScript Expert',
      'Creating Digital Innovation'
    ];

    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      const phrase = phrases[currentPhrase];

      if (isDeleting) {
        typingElement.textContent = phrase.substring(0, currentChar - 1);
        currentChar--;

        if (currentChar === 0) {
          isDeleting = false;
          currentPhrase = (currentPhrase + 1) % phrases.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, deleteSpeed);
      } else {
        typingElement.textContent = phrase.substring(0, currentChar + 1);
        currentChar++;

        if (currentChar === phrase.length) {
          isDeleting = true;
          setTimeout(type, pauseTime);
          return;
        }
        setTimeout(type, typeSpeed);
      }
    };

    // Start typing animation after loader
    setTimeout(() => {
      if (this.isLoaded) type();
    }, 2000);
  }

  // Scroll Animations with Intersection Observer
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in', 'visible');

          // Trigger specific animations
          if (entry.target.classList.contains('skills-section')) {
            this.animateSkillCards();
          }

          if (entry.target.classList.contains('hero-section')) {
            this.animateStats();
          }
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section, .hero-section').forEach(section => {
      this.scrollObserver.observe(section);
    });
  }

  // New skill card animation instead of progress bars
  animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';

        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      }, index * 100);
    });
  }

  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
      const target = parseInt(stat.textContent);
      const suffix = stat.textContent.includes('+') ? '+' :
                   stat.textContent.includes('%') ? '%' : '';
      let current = 0;
      const increment = target / 60; // 60 frames

      const updateStat = () => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + suffix;
        } else {
          stat.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateStat);
        }
      };

      updateStat();
    });
  }

  // Project Filtering System
  setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter projects with animation
        this.filterProjects(projectCards, filter);
      });
    });
  }

  filterProjects(cards, filter) {
    cards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      setTimeout(() => {
        if (shouldShow) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.transition = 'all 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-20px)';

          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }, index * 50);
    });
  }

  // Scroll to Top Button
  setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 500;
      scrollBtn.classList.toggle('visible', isVisible);
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Section Detection for Navigation
  setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

          if (navLink) {
            this.setActiveNav(navLink);
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => {
      navObserver.observe(section);
    });
  }
}

// Particle Animation Styles (injected dynamically)
const particleStyles = `
  .particle {
    animation: float 6s ease-in-out infinite;
    filter: blur(0.5px);
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg); 
      opacity: 0.1;
    }
    50% { 
      transform: translateY(-20px) rotate(180deg); 
      opacity: 0.5;
    }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .floating-nav.mobile-open {
    background: rgba(30, 41, 59, 0.98);
  }
  
  .floating-nav.scrolled {
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(25px);
  }
  
  .using-keyboard *:focus {
    outline: 2px solid #667EEA !important;
    outline-offset: 2px !important;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
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

// Handle offline functionality
window.addEventListener('online', () => {
  console.log('Back online');
});

window.addEventListener('offline', () => {
  console.log('Gone offline');
});

// Performance optimization
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    'assets/mustafaer_dev.png',
    'assets/weight-track-brand.png',
    'assets/tabis-brand.png'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Initialize preloading
preloadCriticalResources();
