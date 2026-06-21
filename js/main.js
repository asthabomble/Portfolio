document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. TYPING TEXT ANIMATION
     ========================================================================== */
  const typingTextElement = document.getElementById('typing-text');
  const taglines = [
    "Information Technology Engineering Student",
    "Python Developer",
    "Frontend Enthusiast"
  ];
  
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentTagline = taglines[taglineIndex];
    
    if (isDeleting) {
      // Deleting character
      typingTextElement.textContent = currentTagline.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster deletion speed
    } else {
      // Typing character
      typingTextElement.textContent = currentTagline.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Standard typing speed
    }
    
    // Switch state when complete word typed
    if (!isDeleting && charIndex === currentTagline.length) {
      typingSpeed = 2000; // Pause at the end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length; // Move to next tagline
      typingSpeed = 500; // Pause before starting typing next word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Initialize typing loop
  if (typingTextElement && taglines.length > 0) {
    // Clear initial markup to start animation cleanly
    typingTextElement.textContent = '';
    setTimeout(type, 1000);
  }

  /* ==========================================================================
     2. DARK & LIGHT THEME CONTROLLER
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set theme from local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeButtonAria(initialTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonAria(newTheme);
  });
  
  function updateThemeButtonAria(theme) {
    if (theme === 'dark') {
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  
  mobileNavToggle.addEventListener('click', () => {
    const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
    mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('active');
    
    // Prevent body scrolling when navigation menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });
  
  // Close menu when clicking navigation drawer links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ==========================================================================
     4. INTERSECTION OBSERVER - SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observerOptions = {
    root: null, // relative to viewport
    threshold: 0.15, // trigger when 15% visible
    rootMargin: '0px 0px -50px 0px' // offset bottom trigger slightly
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // Unobserve to trigger animation once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     4b. SCROLLSPY ACTIVE NAVIGATION LINKS
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const scrollObserverOptions = {
    root: null,
    threshold: 0.25,
    rootMargin: '-95px 0px -40% 0px'
  };
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollObserverOptions);
  
  sections.forEach(section => {
    scrollObserver.observe(section);
  });

  /* ==========================================================================
     5. FLOATING BACK-TO-TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    // Show back to top button when scroll exceeds 500px
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
    
    // Subtle backdrop shadow to navbar when scrolling down
    if (window.scrollY > 50) {
      header.style.boxShadow = 'var(--shadow-sm)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     6. FOOTER COPYRIGHT YEAR
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     7. INTERACTIVE CONTACT FORM SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const successAlert = document.getElementById('form-success-alert');
  const errorAlert = document.getElementById('form-error-alert');
  const submitBtn = document.getElementById('form-submit-btn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset alerts
      successAlert.hidden = true;
      errorAlert.hidden = true;
      
      // Simple validation check
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      if (!name || !email || !message) {
        errorAlert.textContent = "Please fill in all the required fields.";
        errorAlert.hidden = false;
        return;
      }
      
      // Disable button and show loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
      
      // Simulate form submission delay
      setTimeout(() => {
        // Successful response callback simulation
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        
        successAlert.hidden = false;
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successAlert.hidden = true;
        }, 5000);
        
      }, 1500);
    });
  }

  /* ==========================================================================
     8. LUCIDE ICONS INITIALIZATION
     ========================================================================== */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     9. INTERACTIVE SKILLS MODAL CONTROLLER
     ========================================================================== */
  const skillModal = document.getElementById('skill-modal');
  const modalOverlay = skillModal ? skillModal.querySelector('.skill-modal-overlay') : null;
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalIconContainer = document.getElementById('modal-tech-icon-container');
  const modalName = document.getElementById('modal-tech-name');
  const modalDesc = document.getElementById('modal-tech-desc');
  const modalLevelText = document.getElementById('modal-tech-level-text');
  const modalLevelFill = document.getElementById('modal-tech-fill');
  const modalLevelBarContainer = document.getElementById('modal-level-bar-container');
  
  let lastActiveElement = null;
  
  // Get all skill pill cards
  const skillPills = document.querySelectorAll('.skill-pill-card');
  
  function openModal(button) {
    if (!skillModal) return;
    
    // Save current focused element to return focus later
    lastActiveElement = button;
    
    // Retrieve data attributes
    const techName = button.getAttribute('data-tech-name');
    const techDesc = button.getAttribute('data-tech-desc');
    const techLevel = button.getAttribute('data-tech-level');
    const techLevelText = button.getAttribute('data-tech-level-text');
    const techIconClass = button.getAttribute('data-tech-icon');
    
    // Populate name, description, and level text
    modalName.textContent = techName;
    modalDesc.textContent = techDesc;
    modalLevelText.textContent = techLevelText + ` (${techLevel})`;
    
    // Set icon
    modalIconContainer.innerHTML = '';
    if (techIconClass === 'custom-svg-globe') {
      // Copy Google Earth Engine SVG
      const svgNode = button.querySelector('svg').cloneNode(true);
      svgNode.style.width = '2.25rem';
      svgNode.style.height = '2.25rem';
      modalIconContainer.appendChild(svgNode);
    } else {
      // Create an <i> element for Devicon
      const iconElement = document.createElement('i');
      iconElement.className = techIconClass + ' colored';
      modalIconContainer.appendChild(iconElement);
    }
    
    // Update progress bar accessibility attributes
    const numericLevel = parseInt(techLevel, 10) || 0;
    modalLevelBarContainer.setAttribute('aria-valuenow', numericLevel);
    modalLevelBarContainer.setAttribute('aria-valuetext', `${techLevelText} (${techLevel})`);
    
    // Show modal
    skillModal.classList.add('open');
    skillModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Set initial focus to close button
    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);
    
    // Animate progress bar fill width (after a tiny delay so the transition triggers)
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (modalLevelFill) {
          modalLevelFill.style.width = techLevel;
        }
      }, 50);
    });
  }
  
  function closeModal() {
    if (!skillModal) return;
    
    // Hide modal
    skillModal.classList.remove('open');
    skillModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    
    // Reset progress bar width
    if (modalLevelFill) {
      modalLevelFill.style.width = '0';
    }
    
    // Restore focus to cached triggering button
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }
  
  // Add click event listeners to all skill cards
  skillPills.forEach(pill => {
    pill.addEventListener('click', () => {
      openModal(pill);
    });
  });
  
  // Close listeners
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  // Keyboard Event Handlers
  document.addEventListener('keydown', (e) => {
    if (!skillModal || !skillModal.classList.contains('open')) return;
    
    // 1. Close on Escape Key
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    
    // 2. Keyboard Focus Trap (Tab & Shift+Tab)
    if (e.key === 'Tab') {
      const focusableElements = skillModal.querySelectorAll('button, [tabindex="0"]');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
});

