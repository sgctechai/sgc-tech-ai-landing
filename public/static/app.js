/* ======================================================================
   SGC TECH AI — $10K-Level Interactive 3D Experience
   - GSAP 3D Transforms + ScrollTrigger
   - Lenis Smooth Scroll
   - 3D Card Tilt with perspective
   - Spring-physics micro-interactions
   - Parallax hero with depth layers
   - Scroll-triggered section reveals
   ====================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // LENIS — Buttery smooth scroll (premium feel)
  // =====================================================================
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    ScrollTrigger.defaults({ scroller: window });
    ScrollTrigger.isTouch = lenis.isTouching;

    window.lenis = lenis;
  }

  // =====================================================================
  // 3D CARD TILT — Premium perspective hover effect
  // All .glass cards respond to mouse with 3D rotation
  // =====================================================================
  function init3DCardTilt() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.glass, .pricing-card, .testimonial-card, .industry-card, .value-card, .stack-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      // Set perspective on parent
      if (card.parentElement) {
        card.parentElement.style.perspective = '1000px';
      }

      const sheen = card.querySelector('.holo-sheen') || document.createElement('div');
      if (!card.querySelector('.holo-sheen')) {
        sheen.className = 'holo-sheen';
        sheen.style.cssText = `
          position: absolute; inset: 0; border-radius: inherit; z-index: 1;
          background: linear-gradient(
            135deg,
            transparent 20%,
            rgba(0,217,255,0.08) 40%,
            rgba(0,217,255,0.15) 50%,
            rgba(0,217,255,0.08) 60%,
            transparent 80%
          );
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        `;
        card.style.position = 'relative';
        card.prepend(sheen);
      }

      let rafId;
      card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rotateX = ((y - cy) / cy) * -12;  // Max 12deg tilt
          const rotateY = ((x - cx) / cx) * 12;

          gsap.to(card, {
            rotateX: rotateX, rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.6, ease: 'power2.out',
            overwrite: true,
          });

          // Move sheen highlight
          gsap.to(sheen, {
            opacity: 1, duration: 0.3,
            background: `linear-gradient(
              135deg, transparent 20%,
              rgba(0,217,255,0.04) ${(x / rect.width) * 100}%,
              rgba(0,217,255,0.12) 50%,
              rgba(0,217,255,0.04) ${(100 - (x / rect.width) * 100)}%,
              transparent 80%
            )`,
            overwrite: true,
          });
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.8, ease: 'elastic.out(1, 0.5)',
          overwrite: true,
        });
        gsap.to(sheen, { opacity: 0, duration: 0.4, overwrite: true });
      });
    });
  }

  // =====================================================================
  // HERO PARALLAX — Multiple depth layers moving at different speeds
  // Creates a sense of 3D depth in the hero section
  // =====================================================================
  function initHeroParallax() {
    if (prefersReducedMotion) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Depth layer 1: background particles (slowest)
    const particles = document.getElementById('particles-js');
    if (particles) {
      gsap.to(particles, {
        y: -80, ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // Depth layer 2: circuit background (medium)
    const circuit = hero.querySelector('.circuit-bg, svg[class*="circuit"]');
    if (circuit) {
      gsap.to(circuit, {
        y: -50, ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 1.2,
        }
      });
    }

    // Depth layer 3: hero content (normal speed, slight parallax)
    const heroGrid = hero.querySelector('.hero-grid');
    if (heroGrid) {
      gsap.to(heroGrid, {
        y: -30, ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // Depth layer 4: hero visual (fastest — comes forward)
    const heroVisual = hero.querySelector('.hero-visual');
    if (heroVisual) {
      gsap.to(heroVisual, {
        y: 40, ease: 'none',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom top',
          scrub: 0.8,
        }
      });

      // 3D rotation on the hero visual ring
      const ring = heroVisual.querySelector('.hero-ring, .hero-orbit');
      if (ring) {
        gsap.to(ring, {
          rotateZ: 360, duration: 60, ease: 'none', repeat: -1,
        });
      }
    }
  }

  // =====================================================================
  // SCROLL-TRIGGERED SECTIONS — 3D reveal animations
  // Each section slides/rotates in with depth
  // =====================================================================
  function initSectionReveals() {
    if (prefersReducedMotion) return;
    if (typeof ScrollTrigger === 'undefined') return;

    // Section headers: blur in + slide up with 3D rotate
    ScrollTrigger.batch('.section-header', {
      interval: 0.1,
      onEnter: (batch) => {
        gsap.fromTo(batch, {
          opacity: 0, y: 60, rotateX: -8,
          transformPerspective: 800,
        }, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2, ease: 'power3.out',
          stagger: 0.15, overwrite: true,
        });
      },
      once: true,
    });

    // Industry cards: 3D flip in from bottom
    ScrollTrigger.batch('.industry-card, .value-card', {
      interval: 0.08,
      onEnter: (batch) => {
        gsap.fromTo(batch, {
          opacity: 0, y: 80, rotateX: 15, scale: 0.9,
          transformPerspective: 1000,
        }, {
          opacity: 1, y: 0, rotateX: 0, scale: 1,
          duration: 1, ease: 'back.out(1.4)',
          stagger: 0.1, overwrite: true,
        });
      },
      once: true,
    });

    // Pricing cards: scale + 3D pop
    ScrollTrigger.batch('.pricing-card', {
      interval: 0.1,
      onEnter: (batch) => {
        gsap.fromTo(batch, {
          opacity: 0, y: 100, rotateY: 5, scale: 0.85,
          transformPerspective: 1200,
        }, {
          opacity: 1, y: 0, rotateY: 0, scale: 1,
          duration: 1.1, ease: 'power3.out',
          stagger: 0.15, overwrite: true,
        });
      },
      once: true,
    });

    // Testimonial cards: slide in with rotation
    ScrollTrigger.batch('.testimonial-card', {
      interval: 0.1,
      onEnter: (batch) => {
        gsap.fromTo(batch, {
          opacity: 0, x: -60, rotateY: -10,
          transformPerspective: 1000,
        }, {
          opacity: 1, x: 0, rotateY: 0,
          duration: 1, ease: 'power2.out',
          stagger: 0.2, overwrite: true,
        });
      },
      once: true,
    });

    // Story cards stack: 3D reveal
    ScrollTrigger.batch('.stack-card', {
      interval: 0.12,
      onEnter: (batch) => {
        gsap.fromTo(batch, {
          opacity: 0, z: -200, scale: 0.8,
          transformPerspective: 1500,
        }, {
          opacity: 1, z: 0, scale: 1,
          duration: 1.2, ease: 'power2.out',
          stagger: 0.1, overwrite: true,
        });
      },
      once: true,
    });
  }

  // =====================================================================
  // SPRING PHYSICS MICRO-INTERACTIONS
  // Buttons bounce with elastic ease, CTAs feel alive
  // =====================================================================
  function initSpringButtons() {
    if (prefersReducedMotion) return;

    // Primary buttons: elastic hover
    document.querySelectorAll('.btn-primary, [data-magnetic]').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05, duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: true,
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1, duration: 0.5,
          ease: 'elastic.out(1, 0.6)',
          overwrite: true,
        });
      });
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, {
          scale: 0.95, duration: 0.15,
          ease: 'power2.in', overwrite: true,
        });
      });
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, {
          scale: 1.05, duration: 0.4,
          ease: 'elastic.out(1, 0.4)', overwrite: true,
        });
      });
    });

    // Ghost buttons: subtle glow pulse
    document.querySelectorAll('.btn-ghost').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          boxShadow: '0 0 20px rgba(0,217,255,0.3)',
          duration: 0.4, ease: 'power2.out', overwrite: true,
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          boxShadow: 'none', duration: 0.3, overwrite: true,
        });
      });
    });
  }

  // =====================================================================
  // STATS COUNTER — GSAP-powered number animation (desktop only)
  // Mobile gets static numbers immediately
  // =====================================================================
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    if (prefersReducedMotion) {
      // Reduced motion: set static values
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Mobile: set static values immediately
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    // Desktop: GSAP counter animation
    counters.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = (el.dataset.count.split('.')[1] || '').length;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: () => {
              el.textContent = obj.val.toFixed(decimals) + suffix;
            },
          });
        },
      });
    });
  }

  // =====================================================================
  // NAV — Blur on scroll + mobile toggle
  // =====================================================================
  function initNav() {
    const nav = document.querySelector('.nav');
    if (nav) {
      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
      }, { passive: true });
    }

    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu, .nav-links');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen && typeof gsap !== 'undefined') {
          gsap.fromTo(mobileMenu.querySelectorAll('a'), {
            opacity: 0, x: -30,
          }, {
            opacity: 1, x: 0, duration: 0.5,
            stagger: 0.08, ease: 'power2.out',
            overwrite: true,
          });
        }
      });
      mobileMenu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // =====================================================================
  // CURSOR GLOW — Premium desktop-only cursor effect
  // =====================================================================
  function initCursorGlow() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (typeof gsap === 'undefined') return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position: fixed; width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 70%);
      border-radius: 50%; pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%); mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      gsap.set(glow, { x: cx, y: cy });
    });
  }

  // =====================================================================
  // SMOOTH ANCHOR SCROLLING
  // =====================================================================
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            if (window.lenis) {
              window.lenis.scrollTo(target, { offset: -80 });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      });
    });
  }

  // =====================================================================
  // INITIALIZE EVERYTHING when DOM + LIBRARIES are ready
  // Waits for all deferred CDN scripts to parse before initializing
  // =====================================================================
  let initialized = false; // Prevent double-init from retry loop

  function init() {
    if (initialized) {
      console.warn('init() already called, skipping duplicate initialization');
      return;
    }

    initNav();

    // Check if all required libraries are loaded
    const checkLibraries = () => {
      const hasGsap = typeof gsap !== 'undefined';
      const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
      const hasObserver = typeof Observer !== 'undefined';
      const hasLenis = typeof Lenis !== 'undefined';

      return { gsap: hasGsap, scrollTrigger: hasScrollTrigger, observer: hasObserver, lenis: hasLenis };
    };

    const libs = checkLibraries();

    if (libs.gsap && libs.scrollTrigger) {
      initialized = true; // Mark as initialized BEFORE running to prevent retry issues

      // Register GSAP plugins properly
      try {
        gsap.registerPlugin(ScrollTrigger);
        if (libs.observer) gsap.registerPlugin(Observer);
      } catch (e) {
        console.warn('GSAP plugin registration failed:', e);
      }

      initSmoothScroll();
      init3DCardTilt();
      initHeroParallax();
      initSectionReveals();
      initSpringButtons();
      initCounterAnimation();
      initCursorGlow();
      initSmoothAnchors();

      // Refresh ScrollTrigger after all init
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 100);
    } else {
      // Libraries not loaded yet — wait with polling (max 5s)
      console.warn('Waiting for GSAP/ScrollTrigger to load...', libs);
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        const updatedLibs = checkLibraries();
        if ((updatedLibs.gsap && updatedLibs.scrollTrigger) || attempts > 50) {
          clearInterval(poll);
          init(); // Retry (guarded by initialized flag)
        }
      }, 100);
      return;
    }
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to let deferred scripts parse
      setTimeout(init, 50);
    });
  } else {
    setTimeout(init, 50);
  }

})();
