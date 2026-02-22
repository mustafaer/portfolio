/**
 * Premium Portfolio 2025 - Main Script
 * Author: Mustafa ER
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Spotlight Effect (Mouse Tracking Light)
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  document.addEventListener('mousemove', (e) => {
    spotlightCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 2. Magnetic Buttons Effect
  const magneticWraps = document.querySelectorAll('.magnetic-wrap');

  magneticWraps.forEach(wrap => {
    wrap.addEventListener('mousemove', (e) => {
      const area = wrap.querySelector('.magnetic-area');
      if (!area) return;

      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      area.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      area.style.transition = 'transform 0s';
    });

    wrap.addEventListener('mouseleave', () => {
      const area = wrap.querySelector('.magnetic-area');
      if (!area) return;

      area.style.transform = 'translate(0, 0)';
      area.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
  });

  // 3. Project Slider Logic
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (track && prevBtn && nextBtn) {
    // Button Navigation
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -350, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 350, behavior: 'smooth' });
    });

    // Drag to Scroll (Desktop)
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('active');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('active');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('active');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // 4. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-item');

  const observerOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: "-50px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 5. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 6. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.bento-item, .project-card, .skill-category, .contact-text, .timeline-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.5, 0, 0, 1)';
    el.style.transitionDelay = `${index * 0.05}s`;
    revealObserver.observe(el);
  });

  const style = document.createElement('style');
  style.innerHTML = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // 7. Dynamic Local Time (Turkey GMT+3)
  function updateTime() {
    const timeElement = document.getElementById('local-time');
    if (timeElement) {
      const now = new Date();
      const options = { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' };
      const timeString = now.toLocaleTimeString('en-US', options);
      timeElement.textContent = `${timeString} (GMT+3)`;
    }
  }
  setInterval(updateTime, 1000);
  updateTime();

  // 8. Dynamic Year
  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
  }

});
