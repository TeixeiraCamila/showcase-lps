/* ============================================
   CATPUCCINO - JAVASCRIPT
   Sticky Header, Menu Filter, Theme Toggle
   Performance Optimized Edition
   ============================================ */

// Debounce utility for scroll events
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

// Throttle utility for frequent events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMenuFilter();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initTestimonialsSlider();
  initLazyLoading();
  initPerformanceOptimizations();
});

/* ============================================
   THEME TOGGLE - Light/Dark Mode
   ============================================ */

function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;
  
  // Detecta preferência salva ou usa preferência do sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('catpuccino-theme');
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Define tema inicial
  setTheme(currentTheme);
  updateThemeIcon(currentTheme);
  
  // Event listener para toggle
  themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  
  // Escuta mudanças de preferência do sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('catpuccino-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  const htmlElement = document.documentElement;
  
  // Define o atributo data-theme para mudar variáveis CSS
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('catpuccino-theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle i');
  if (icon) {
    if (theme === 'dark') {
      icon.classList.remove('ph-moon');
      icon.classList.add('ph-sun');
    } else {
      icon.classList.remove('ph-sun');
      icon.classList.add('ph-moon');
    }
  }
}

/* ============================================
   MENU FILTER - Tab System
   ============================================ */

function initMenuFilter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      
      // Remove classe active de todos os buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Adiciona classe active ao button clicado
      button.classList.add('active');
      
      // Filtra menu items
      menuItems.forEach(item => {
        if (item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
  
  // Define primeira tab como ativa
  if (tabButtons.length > 0) {
    tabButtons[0].classList.add('active');
  }
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle) return;
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Fecha menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* ============================================
   SCROLL ANIMATIONS - Fade In on Scroll
   ============================================ */

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observa cards e seções para animação
  const elements = document.querySelectorAll(
    '.experience-card, .menu-item, .highlight-card, .testimonial-card, .gallery-item'
  );
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ============================================
   SMOOTH SCROLL - Navigation Links
   ============================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || !href) return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   PARALLAX EFFECT - Hero Section
   ============================================ */

window.addEventListener('scroll', throttle(() => {
  const parallaxBg = document.querySelector('.parallax-bg');
  
  if (parallaxBg) {
    const scrollPosition = window.pageYOffset;
    parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  }
}, 16));

/* ============================================
   NAVBAR SCROLL EFFECT - Shadow on Scroll
   ============================================ */

window.addEventListener('scroll', throttle(() => {
  const header = document.querySelector('.header');
  
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
}, 16));

/* ============================================
   SCROLL INDICATOR - Active Nav Link
   ============================================ */

window.addEventListener('scroll', throttle(() => {
  let current = '';
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
}, 100));

/* ============================================
   FORM VALIDATION - Future Contact Form
   ============================================ */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */

function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  
  let currentIndex = 0;
  const cardWidth = 100; // Each card is 100% of container width
  
  function updateSlider() {
    const offset = -currentIndex * cardWidth;
    slider.style.transform = `translateX(${offset}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
  }
  
  // Event listeners for buttons
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Event listeners for dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      updateSlider();
    });
  });
  
  // Optional: Auto-advance every 8 seconds
  setInterval(nextSlide, 8000);
}

/* ============================================
   UTILITY - Log Initialization
   ============================================ */

console.log('🐱 Catpuccino - Website carregado com sucesso!');
console.log('☕ Bem-vindo à nossa experiência de aconchego.');

/* ============================================
   LAZY LOADING - Native Image Lazy Load
   ============================================ */

function initLazyLoading() {
  // Check if browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    // Lazy load images with native loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });

    // Observe background images in gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger background image load for gradients
          entry.target.style.willChange = 'transform';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    galleryItems.forEach(item => {
      imageObserver.observe(item);
    });
  }
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

function initPerformanceOptimizations() {
  // Use requestAnimationFrame for smooth animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    // Disable animations if user prefers reduced motion
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }

  // Defer non-critical CSS loading
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach(link => {
    if (!link.hasAttribute('media') || link.media !== 'print') {
      // CSS já carregado, apenas otimizar
      link.removeAttribute('media');
    }
  });

  // Preload critical fonts if available
  const fontLink = document.querySelector('link[rel="preload"][as="font"]');
  if (fontLink) {
    fontLink.crossOrigin = 'anonymous';
  }

  // Monitor Web Vitals (optional - requires reporting endpoint)
  if ('PerformanceObserver' in window) {
    try {
      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported for layout-shift
    }
  }
}
