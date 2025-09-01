// NAVBAR
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.innerHTML = navLinks.classList.contains('active')
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Count animation - mobile optimized
function animateValue(element, options) {
  const { start = 0, end, duration = 2000, suffix = '' } = options;
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const value = Math.floor(easeOutQuart * (end - start) + start);
    element.textContent = value.toLocaleString() + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function initStatsAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  // Track if animation is currently running to prevent overlapping
  let isAnimating = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isAnimating) {
          isAnimating = true;

          // Reset and animate each stat number
          statNumbers.forEach((stat, index) => {
            if (index === 0) {
              stat.textContent = '0+';
              animateValue(stat, {
                start: 0,
                end: 50,
                duration: 2500,
                suffix: '+',
              });
            } else if (index === 1) {
              stat.textContent = '0%';
              animateValue(stat, {
                start: 0,
                end: 98,
                duration: 2500,
                suffix: '%',
              });
            }
          });

          // Reset animation flag after animation completes
          setTimeout(() => {
            isAnimating = false;
          }, 2500);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
    }
  );

  // Try to observe the first stat number, fallback to .about section
  const targetElement = statNumbers[0] || document.querySelector('.about');
  if (targetElement) {
    observer.observe(targetElement);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initStatsAnimation);

// Fallback for cases where DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStatsAnimation);
} else {
  initStatsAnimation();
}

// TESTIMONIAL
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.carousel-button-prev');
  const nextButton = document.querySelector('.carousel-button-next');

  let currentIndex = 0;

  // Function to update carousel
  function updateCarousel() {
    cards.forEach((card) => card.classList.remove('active'));

    cards[currentIndex].classList.add('active');

    // Update dots
    dots.forEach((dot) => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  // Next testimonial
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  // Previous testimonial
  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  // Add event listeners to buttons
  nextButton.addEventListener('click', nextTestimonial);
  prevButton.addEventListener('click', prevTestimonial);

  // Add event listeners to dots
  dots.forEach((dot) => {
    dot.addEventListener('click', function () {
      currentIndex = parseInt(this.getAttribute('data-index'));
      updateCarousel();
    });
  });

  // Auto-advance carousel (optional)
  let carouselInterval = setInterval(nextTestimonial, 5000);

  // Pause auto-advance on hover
  const carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextTestimonial, 5000);
  });

  // Handle touch events for mobile swipe
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      nextTestimonial(); // Swipe left
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      prevTestimonial(); // Swipe right
    }
  }
});

// GALLERY FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const expandButtons = document.querySelectorAll('.gallery-expand');

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get filter value
      const filterValue = this.getAttribute('data-filter');

      // Filter items
      galleryItems.forEach((item) => {
        if (
          filterValue === 'all' ||
          item.getAttribute('data-category') === filterValue
        ) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  let currentImageIndex = 0;
  let scrollPosition = 0;
  const images = Array.from(galleryItems);

  // Open lightbox
  function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();

    // Store current scroll position
    scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Lock body scroll and position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    // Force lightbox to be positioned relative to viewport, not parent container
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.right = '0';
    lightbox.style.bottom = '0';
    lightbox.style.width = '100vw';
    lightbox.style.height = '100vh';
    lightbox.style.zIndex = '9999';
    lightbox.style.padding = '0';
    lightbox.style.margin = '0';
    lightbox.style.background = 'rgba(0, 0, 0, 0.9)';
    lightbox.style.display = 'flex';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';

    // Move lightbox to document body to ensure it's not affected by parent containers
    if (lightbox.parentNode !== document.body) {
      document.body.appendChild(lightbox);
    }

    // Force the lightbox content to be centered in viewport
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    if (lightboxContent) {
      lightboxContent.style.position = 'fixed';
      lightboxContent.style.top = '50%';
      lightboxContent.style.left = '50%';
      lightboxContent.style.transform = 'translate(-50%, -50%)';
      lightboxContent.style.zIndex = '10000';
    }

    // Add lightbox active class
    lightbox.classList.add('active');
  }

  // Update lightbox content
  function updateLightbox() {
    const item = images[currentImageIndex];
    const imgSrc = item.querySelector('img').src;
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p').textContent;

    lightboxImage.src = imgSrc;
    lightboxCaption.textContent = `${title} - ${description}`;
  }

  // Close lightbox
  function closeLightbox() {
    // Remove lightbox active class first
    lightbox.classList.remove('active');

    // Clear all inline styles applied to lightbox
    lightbox.style.position = '';
    lightbox.style.top = '';
    lightbox.style.left = '';
    lightbox.style.right = '';
    lightbox.style.bottom = '';
    lightbox.style.width = '';
    lightbox.style.height = '';
    lightbox.style.zIndex = '';
    lightbox.style.padding = '';
    lightbox.style.margin = '';
    lightbox.style.background = '';
    lightbox.style.display = '';
    lightbox.style.alignItems = '';
    lightbox.style.justifyContent = '';

    // Clear lightbox content styles
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    if (lightboxContent) {
      lightboxContent.style.position = '';
      lightboxContent.style.top = '';
      lightboxContent.style.left = '';
      lightboxContent.style.transform = '';
      lightboxContent.style.zIndex = '';
    }

    // Restore body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';

    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }

  // Navigate to next image
  function nextImage() {
    const visibleItems = images.filter((item) => item.style.display !== 'none');
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item === images[currentImageIndex]
    );
    const nextVisibleIndex = (currentVisibleIndex + 1) % visibleItems.length;
    currentImageIndex = images.findIndex(
      (item) => item === visibleItems[nextVisibleIndex]
    );
    updateLightbox();
  }

  // Navigate to previous image
  function prevImage() {
    const visibleItems = images.filter((item) => item.style.display !== 'none');
    const currentVisibleIndex = visibleItems.findIndex(
      (item) => item === images[currentImageIndex]
    );
    const prevVisibleIndex =
      (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
    currentImageIndex = images.findIndex(
      (item) => item === visibleItems[prevVisibleIndex]
    );
    updateLightbox();
  }

  // Add event listeners to expand buttons
  expandButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(index);
    });
  });

  // Add event listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't open lightbox if clicking on expand button
      if (e.target.closest('.gallery-expand')) {
        return;
      }

      openLightbox(index);
    });
  });

  // Lightbox controls
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextImage();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevImage();
    });
  }

  // Close lightbox when clicking outside content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      }
    }
  });

  // Swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  }

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      nextImage(); // Swipe left
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      prevImage(); // Swipe right
    }
  }
});

// NEWSLETTER FORM FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function () {
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('.newsletter-input');
      const checkbox = this.querySelector('#newsletter-checkbox');

      // Simple validation
      if (!emailInput.value || !emailInput.value.includes('@')) {
        showError(emailInput, 'Please enter a valid email address');
        return;
      }

      if (!checkbox.checked) {
        showError(checkbox, 'Please agree to receive communications');
        return;
      }

      // If validation passes, simulate submission
      simulateSubmission(this);
    });

    // Remove error state on input
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const checkbox = newsletterForm.querySelector('#newsletter-checkbox');

    emailInput.addEventListener('input', function () {
      clearError(this);
    });

    checkbox.addEventListener('change', function () {
      clearError(this);
    });
  }

  function showError(element, message) {
    // Remove any existing error
    clearError(element);

    // Add error class
    element.classList.add('error');

    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e53e3e';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.5rem';

    // Insert after the element
    element.parentNode.insertBefore(errorElement, element.nextSibling);
  }

  function clearError(element) {
    element.classList.remove('error');
    const errorElement = element.nextElementSibling;
    if (errorElement && errorElement.className === 'error-message') {
      errorElement.remove();
    }
  }

  function simulateSubmission(form) {
    const submitBtn = form.querySelector('.newsletter-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Thank you for subscribing!';
      successMessage.style.color = '#38a169';
      successMessage.style.fontWeight = '600';
      successMessage.style.marginTop = '1rem';

      form.appendChild(successMessage);

      // Reset form
      form.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        successMessage.remove();
      }, 3000);
    }, 1500);
  }
});

// Contact form functionality
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Clear previous errors
      clearErrors();

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      }

      // Validate email
      if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
      }

      if (isValid) {
        // Simulate form submission
        simulateFormSubmission();
      }
    });

    // Add input event listeners to clear errors
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.addEventListener('input', function () {
        clearError(this);
      });
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    input.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e53e3e';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.3rem';

    input.parentNode.appendChild(errorElement);
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((error) => error.remove());

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach((input) => input.classList.remove('error'));
  }

  function simulateFormSubmission() {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `
                    <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary); margin-top: 1.5rem;">
                        <p style="color: var(--primary); font-weight: 600; margin: 0;">
                            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                            Thank you for your message! We'll get back to you within 24 hours.
                        </p>
                    </div>
                `;

      contactForm.appendChild(successMessage);

      // Reset form
      contactForm.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        successMessage.remove();
      }, 4000);
    }, 1500);
  }
});

// SLIDESHOW FUNCTIONALITY
class LuxurySlideshow {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.progressBar = document.querySelector('.progress-bar');
    this.currentSlide = 0;
    this.slideInterval = null;
    this.slideDuration = 2500;

    this.init();
  }

  init() {
    this.startSlideshow();
    this.addIndicatorListeners();

    // Pause on hover
    const banner = document.querySelector('.slideshow-banner');
    banner.addEventListener('mouseenter', () => this.pauseSlideshow());
    banner.addEventListener('mouseleave', () => this.startSlideshow());
  }

  showSlide(index) {
    // Remove active class from all slides and indicators
    this.slides.forEach((slide) => slide.classList.remove('active'));
    this.indicators.forEach((indicator) =>
      indicator.classList.remove('active')
    );

    // Add active class to current slide and indicator
    this.slides[index].classList.add('active');
    this.indicators[index].classList.add('active');

    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  startSlideshow() {
    this.pauseSlideshow(); // Clear any existing interval

    // Restart progress bar animation
    this.progressBar.style.animation = 'none';
    this.progressBar.offsetHeight; // Trigger reflow
    this.progressBar.style.animation = `progress ${this.slideDuration}ms linear infinite`;

    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }

  pauseSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
    this.progressBar.style.animationPlayState = 'paused';
  }

  addIndicatorListeners() {
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.showSlide(index);
        this.startSlideshow(); // Restart the slideshow from this slide
      });
    });
  }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LuxurySlideshow();
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
  const circles = document.querySelectorAll('.floating-circle');
  circles.forEach((circle, index) => {
    const speed = (index + 1) * 0.02;
    const x = (e.clientX * speed) % 50;
    const y = (e.clientY * speed) % 50;
    circle.style.transform += ` translate(${x}px, ${y}px)`;
  });
});

// Footer functionality
document.addEventListener('DOMContentLoaded', function () {
  // Footer newsletter form
  const newsletterForm = document.querySelector('.footer-newsletter');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');

      if (!emailInput.value || !emailInput.value.includes('@')) {
        // Add error styling
        emailInput.style.border = '1px solid #e53e3e';
        return;
      }

      // Reset styling
      emailInput.style.border = 'none';

      // Show success feedback
      const originalHtml = this.innerHTML;
      this.innerHTML =
        '<div style="color: #38a169; font-weight: 600;">Thank you for subscribing!</div>';

      // Reset after delay
      setTimeout(() => {
        this.innerHTML = originalHtml;
        emailInput.value = '';
      }, 3000);
    });
  }

  // Back to top button
  const backToTopButton = document.createElement('a');
  backToTopButton.href = '#';
  backToTopButton.className = 'back-to-top';
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
  backToTopButton.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopButton);

  // Show/hide back to top button
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Smooth scroll to top
  backToTopButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});

// FAQ functionality
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqQuestions = document.querySelectorAll('.faq-question');

  // Initialize first item as open
  if (faqItems.length > 0) {
    faqItems[0].querySelector('.faq-question').classList.add('active');
    faqItems[0].querySelector('.faq-answer').classList.add('active');
  }

  // Add click event to each question
  faqQuestions.forEach((question) => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;

      // Toggle active class on question
      this.classList.toggle('active');

      // Toggle active class on answer
      answer.classList.toggle('active');

      // If answer is being opened, close others
      if (this.classList.contains('active')) {
        faqQuestions.forEach((otherQuestion) => {
          if (
            otherQuestion !== this &&
            otherQuestion.classList.contains('active')
          ) {
            otherQuestion.classList.remove('active');
            otherQuestion.nextElementSibling.classList.remove('active');
          }
        });
      }
    });
  });

  // FAQ scroll animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe each FAQ item
  faqItems.forEach((item, index) => {
    // Add delay based on index for staggered animation
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Keyboard accessibility
  faqQuestions.forEach((question) => {
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
});
