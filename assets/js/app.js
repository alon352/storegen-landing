/**
 * StoreGen Pro Landing Page - Main JavaScript
 * Version: 24.2
 *
 * Modules:
 * 1. Theme Toggle
 * 2. Smooth Scroll
 * 3. Header Hide/Show
 * 4. i18n (Internationalization)
 * 5. Cookie Banner
 * 6. Mobile Navigation
 * 7. Sparks Animation
 * 8. Boot Sequence
 */


(function () {
  'use strict';

  // ====== PASSWORD PROTECTION ======
  // Change this password as needed
  const PAGE_PASSWORD = 'letmein';
  function showPasswordOverlay() {
    const overlay = document.getElementById('password-overlay');
    const main = document.getElementById('sg-wp-container');
    overlay.style.display = 'flex';
    main.style.filter = 'blur(8px)';
    main.style.pointerEvents = 'none';
    main.style.userSelect = 'none';
  }
  function hidePasswordOverlay() {
    const overlay = document.getElementById('password-overlay');
    const main = document.getElementById('sg-wp-container');
    overlay.style.display = 'none';
    main.style.filter = '';
    main.style.pointerEvents = '';
    main.style.userSelect = '';
  }
  function setupPasswordProtection() {
    const overlay = document.getElementById('password-overlay');
    const input = document.getElementById('password-input');
    const submit = document.getElementById('password-submit');
    const error = document.getElementById('password-error');
    function tryUnlock() {
      if (input.value === PAGE_PASSWORD) {
        hidePasswordOverlay();
      } else {
        error.textContent = 'Incorrect password.';
        input.value = '';
        input.focus();
      }
    }
    submit.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') tryUnlock();
    });
    overlay.style.display = 'flex';
    input.focus();
  }


  /* =====================================================
     CONFIGURATION
  ===================================================== */
  const CONFIG = {
    defaultLang: 'en',
    defaultTheme: 'dark',
    sparkCount: 42,
    storageKeys: {
      theme: 'sg-theme',
      lang: 'sg-lang',
      cookies: 'sg-cookies-accepted'
    }
  };

  /* =====================================================
     SYNONYM LISTS FOR TYPER
  ===================================================== */
  const synonyms = {
    en: ['Beautifully', 'Professionally', 'Effortlessly', 'Instantly', 'Perfectly'],
    he: ['בצורה מדהימה', 'בקלות', 'במקצועיות', 'מיד', 'בצורה מושלמת'],
    es: ['Hermosamente', 'Profesionalmente', 'Sin Esfuerzo', 'Instantáneamente', 'Perfectamente'],
    fr: ['Magnifiquement', 'Professionnellement', 'Sans Effort', 'Instantanément', 'Parfaitement']
  };

  /* =====================================================
     STATE
  ===================================================== */
  let translations = {};
  let currentLang = CONFIG.defaultLang;
  let typerTimeout = null;

  /* =====================================================
     UTILITIES
  ===================================================== */
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(target, duration = 800, offset = 120) {
    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + window.scrollY - offset;
    const diff = endY - startY;
    let startTime = null;

    function step(time) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* =====================================================
     1. THEME TOGGLE
  ===================================================== */
  function initTheme() {
    const saved = localStorage.getItem(CONFIG.storageKeys.theme);
    const theme = saved || CONFIG.defaultTheme;
    document.body.dataset.theme = theme;

    const toggle = $('.theme-ctrl');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = next;
        localStorage.setItem(CONFIG.storageKeys.theme, next);
      });
    }
  }

  /* =====================================================
     2. SMOOTH SCROLL
  ===================================================== */
  function initScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length <= 1) return;
        const target = $(id);
        if (target) {
          e.preventDefault();
          closeMobileNav();
          smoothScrollTo(target);
        }
      });
    });
  }

  /* =====================================================
     3. HEADER HIDE/SHOW
  ===================================================== */
  function initHeader() {
    const header = $('.s-header');
    if (!header) return;

    let lastY = 0;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 100 && y > lastY) {
        header.style.transform = 'translateY(-140%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastY = y;
    }, { passive: true });
  }

  /* =====================================================
     4. INTERNATIONALIZATION (i18n)
  ===================================================== */
  async function loadTranslation(lang) {
    try {
      const response = await fetch(`assets/lang/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`Failed to load ${lang}.json:`, err);
      return null;
    }
  }

  async function initI18n() {
    // Determine initial language
    const saved = localStorage.getItem(CONFIG.storageKeys.lang);
    currentLang = saved || CONFIG.defaultLang;

    // Load translation
    translations = await loadTranslation(currentLang);
    if (!translations && currentLang !== CONFIG.defaultLang) {
      translations = await loadTranslation(CONFIG.defaultLang);
      currentLang = CONFIG.defaultLang;
    }

    if (translations) {
      applyLang();
    }

    // Bind language buttons
    $$('.lang-opt').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const lang = btn.dataset.lang;
        if (lang === currentLang) return;

        const newTrans = await loadTranslation(lang);
        if (newTrans) {
          translations = newTrans;
          currentLang = lang;
          localStorage.setItem(CONFIG.storageKeys.lang, lang);
          applyLang();
        }
      });
    });
  }

  function applyLang() {
    if (!translations) return;

    const dir = translations.direction || 'ltr';
    const root = $('.app-root');
    if (root) root.setAttribute('dir', dir);

    // Update current language display
    const currentLangEl = $('#currentLang');
    if (currentLangEl) {
      currentLangEl.textContent = translations.lang_name || currentLang.toUpperCase();
    }

    // Apply translations to all elements with data-i18n
    $$('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    });

    // Restart typer with new language
    startTyper();
  }

  function startTyper() {
    if (typerTimeout) {
      clearTimeout(typerTimeout);
      typerTimeout = null;
    }

    const el = $('#typerTarget');
    if (!el) return;

    const words = synonyms[currentLang] || synonyms.en;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const word = words[wordIndex];

      if (isDeleting) {
        el.textContent = word.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = word.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 55 : 110;

      if (!isDeleting && charIndex === word.length) {
        delay = 2500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 450;
      }

      typerTimeout = setTimeout(type, delay);
    }

    type();
  }

  /* =====================================================
     5. COOKIE BANNER
  ===================================================== */
  function initCookies() {
    const card = $('.cookie-card');
    const btn = $('.btn-cookie');

    if (!card || !btn) return;

    if (localStorage.getItem(CONFIG.storageKeys.cookies)) {
      card.classList.remove('active');
      return;
    }

    // Show after 2 seconds
    setTimeout(() => card.classList.add('active'), 2000);

    btn.addEventListener('click', () => {
      localStorage.setItem(CONFIG.storageKeys.cookies, '1');
      card.classList.remove('active');
    });
  }

  /* =====================================================
     6. MOBILE NAVIGATION
  ===================================================== */
  function openMobileNav() {
    const overlay = $('.mobile-nav-overlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    const overlay = $('.mobile-nav-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initMobileNav() {
    const toggle = $('.menu-toggle');
    const close = $('.close-btn');
    const overlay = $('.mobile-nav-overlay');

    if (toggle) toggle.addEventListener('click', openMobileNav);
    if (close) close.addEventListener('click', closeMobileNav);

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMobileNav();
      });
    }
  }

  /* =====================================================
     7. SPARKS ANIMATION
  ===================================================== */
  function initSparks() {
    const container = $('#sparks-root');
    if (!container) return;

    for (let i = 0; i < CONFIG.sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'v-spark';

      const size = 8 + Math.random() * 22;
      const dur = 12 + Math.random() * 22;
      const delay = Math.random() * dur;

      spark.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        --dur: ${dur}s;
        animation-delay: -${delay}s;
      `;

      container.appendChild(spark);
    }
  }

  /* =====================================================
     8. BOOT SEQUENCE
  ===================================================== */
  async function boot() {
    initTheme();
    initScroll();
    initHeader();
    await initI18n();
    initCookies();
    initMobileNav();
    initSparks();
  }

  // Start when DOM is ready
  function startWithPassword() {
    setupPasswordProtection();
    // Only boot the rest of the app after password is entered
    const overlay = document.getElementById('password-overlay');
    const main = document.getElementById('sg-wp-container');
    function unlockHandler() {
      if (overlay.style.display === 'none') {
        boot();
        overlay.removeEventListener('transitionend', unlockHandler);
      }
    }
    // Listen for overlay being hidden
    const observer = new MutationObserver(function() {
      if (overlay.style.display === 'none') {
        boot();
        observer.disconnect();
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWithPassword);
  } else {
    startWithPassword();
  }
})();
