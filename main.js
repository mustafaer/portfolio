/**
 * Adds a fade-in animation to elements with the class `fade-in` when they appear in the viewport.
 * Uses the IntersectionObserver API to detect when elements are visible.
 */
document.addEventListener('DOMContentLoaded', function () {
  const faders = document.querySelectorAll('.fade-in'); // Select all elements with the class 'fade-in'
  const options = { threshold: 0.2 }; // Trigger when 20% of the element is visible

  // Observer callback to add the 'visible' class when the element is in the viewport
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Add 'visible' class for fade-in effect
        observer.unobserve(entry.target); // Stop observing the element
      }
    });
  }, options);

  // Observe each 'fade-in' element
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

/**
 * Implements a typing effect for a text element with the class `typed-text`.
 * Cycles through an array of phrases, typing and deleting each one in sequence.
 */
document.addEventListener('DOMContentLoaded', function () {
  const typedText = document.querySelector('.typed-text'); // Select the element for the typing effect
  const phrases = [
    'Frontend Developer & UI/UX Enthusiast',
    'Building Interactive Web Experiences',
    'Let\'s Create Something Amazing!'
  ]; // Array of phrases to type
  let phraseIndex = 0, charIndex = 0, typing = true; // State variables for typing logic

  /**
   * Handles the typing and deleting of characters for the typing effect.
   */
  function type() {
    if (typing) {
      if (charIndex < phrases[phraseIndex].length) {
        typedText.textContent += phrases[phraseIndex][charIndex++]; // Add the next character
        setTimeout(type, 60); // Continue typing
      } else {
        typing = false; // Switch to deleting after typing the phrase
        setTimeout(type, 1200); // Pause before deleting
      }
    } else {
      if (charIndex > 0) {
        typedText.textContent = phrases[phraseIndex].slice(0, --charIndex); // Remove the last character
        setTimeout(type, 30); // Continue deleting
      } else {
        typing = true; // Switch back to typing the next phrase
        phraseIndex = (phraseIndex + 1) % phrases.length; // Move to the next phrase
        setTimeout(type, 400); // Pause before typing the next phrase
      }
    }
  }

  type(); // Start the typing effect
});

/**
 * Adds smooth scrolling behavior to navigation links with the class `nav-link`.
 * Scrolls to the target section of the page when a link is clicked.
 */
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href')); // Get the target section
    if (target) {
      e.preventDefault(); // Prevent the default link behavior
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); // Smoothly scroll to the target
    }
  });
});

/**
 * Implements a "back to top" button with fade-in and fade-out effects.
 * The button becomes visible when the user scrolls down 300px and scrolls back to the top when clicked.
 */
const backToTop = document.getElementById('backToTop'); // Select the back-to-top button
window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible'); // Show the button when scrolled down
  } else {
    backToTop.classList.remove('visible'); // Hide the button when scrolled up
  }
});

// Scroll to the top of the page when the back-to-top button is clicked
backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top
});
