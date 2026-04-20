/* ======================================================================
   SGC TECH AI — Interaction Layer
   - Nav blur on scroll
   - Scroll-reveal intersection observer
   - Magnetic CTAs
   - Glass card mouse-spotlight
   - Cursor glow (desktop)
   - Mobile nav toggle
   - Circuit animated paths
   - Hero animations (Typed.js, GSAP, Motion)
   ====================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // TYPED.JS — Hero headline typewriter
  // =====================================================================
  function initTyped() {
    const headlineElement = document.querySelector('.hero h1 .highlight');
    if (!headlineElement || typeof Typed === 'undefined' || prefersReducedMotion) return;

    const typedSpan = document.createElement('span');
    typedSpan.className = 'highlight text-gradient-cyan typed-text';
    headlineElement.parentNode.replaceChild(typedSpan, headlineElement);

    new Typed('.typed-text', {
      strings: ['30 Days.', 'Weeks.', 'One Month.', 'Record Time.'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 800,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      autoInsertCss: false,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTyped);
  } else {
    initTyped();
  }

  // =====================================================================
  // PAIN POINT ROTATOR — Typed.js typewriter on the hero pain stage
  // =====================================================================
  function initPainTyped() {
    const el = document.getElementById('painText');
    if (!el || typeof Typed === 'undefined') return;

    el.textContent = ''; // let Typed.js own the content

    new Typed('#painText', {
      strings: [
        'Chasing approvals on <span class="pain-red">WhatsApp.</span>',
        'Commissions calculated on <span class="pain-red">spreadsheets.</span>',
        'No visibility on <span class="pain-red">who\'s actually performing.</span>',
        'Deals <span class="pain-red">falling through</span> broken pipelines.',
        'Paying for software <span class="pain-red">nobody actually uses.</span>',
        'Finance closing the month manually. <span class="pain-red">Again.</span>',
      ],
      typeSpeed: 40,
      backSpeed: 18,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      autoInsertCss: false,
      contentType: 'html',
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPainTyped);
  } else {
    initPainTyped();
  }

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Scroll reveal (handles .reveal, .reveal-left, .reveal-right, .reveal-scale) ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- Glass card spotlight ----
  document.querySelectorAll('.glass').forEach((card) => {
    const spotlight = document.createElement('span');
    spotlight.className = 'spotlight';
    card.prepend(spotlight);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // ---- Magnetic CTAs ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const strength = 18;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---- Cursor glow (desktop only) ----
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Stats counter animation ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReducedMotion) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1600;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = (target * eased).toFixed(decimals);
          el.textContent = value + suffix;
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        cIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cIO.observe(el));
  }

  // ---- Smooth anchor scrolling with offset (handled via CSS scroll-padding) ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // =====================================================================
  // HOLOGRAPHIC TILT — mouse-tracked 3D rotation on [data-holo] elements
  // Mirrors the React HolographicCard: tracks x/y, computes rotateX/Y,
  // exposes --x, --y, --rx, --ry for the CSS shimmer layer.
  // =====================================================================
  const holoCards = document.querySelectorAll('[data-holo]');
  if (holoCards.length && !prefersReducedMotion) {
    holoCards.forEach((card) => {
      // Ensure the sheen layer exists
      if (!card.querySelector('.holo-sheen')) {
        const sheen = document.createElement('div');
        sheen.className = 'holo-sheen';
        card.appendChild(sheen);
      }

      let raf = null;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        // Match the original's feel: divide by 10 for gentle tilt
        const rotateX = ((y - cy) / rect.height) * 14;   // -7..+7 deg
        const rotateY = ((cx - x) / rect.width) * 14;    // -7..+7 deg

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--x', x + 'px');
          card.style.setProperty('--y', y + 'px');
          card.style.setProperty('--rx', rotateX + 'deg');
          card.style.setProperty('--ry', rotateY + 'deg');
        });
      };

      const onEnter = () => card.classList.add('holo-active');
      const onLeave = () => {
        card.classList.remove('holo-active');
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--x', '50%');
        card.style.setProperty('--y', '50%');
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // =====================================================================
  // CARD STACK — 3D fanned carousel
  // Ported from the React + Framer Motion version. Supports:
  //   • fan geometry (stepDeg, overlap, depth)
  //   • active-card drag/swipe (pointer events) with velocity-based decision
  //   • autoplay w/ pauseOnHover
  //   • keyboard ← → navigation
  //   • click-to-focus, dot navigation, prev/next buttons
  // =====================================================================
  function initCardStack(root) {
    const stage = root.querySelector('.card-stack-stage');
    const viewport = root.querySelector('.card-stack-viewport');
    if (!stage || !viewport) return;

    const cards = Array.from(viewport.querySelectorAll('.stack-card'));
    const dots  = Array.from(root.querySelectorAll('.cs-dot'));
    const btnPrev = root.querySelector('[data-cs-prev]');
    const btnNext = root.querySelector('[data-cs-next]');
    const externalLink = root.querySelector('.cs-external');
    const len = cards.length;
    if (!len) return;

    const opts = {
      maxVisible: parseInt(root.dataset.maxVisible || '7', 10),
      overlap:    parseFloat(root.dataset.overlap || '0.48'),
      loop:       root.dataset.loop !== 'false',
      autoplay:   root.dataset.autoplay === 'true',
      intervalMs: parseInt(root.dataset.interval || '3200', 10),
      pauseOnHover: root.dataset.pauseHover !== 'false',
    };

    const cssRead = (name, fallback) => {
      const v = parseFloat(getComputedStyle(root).getPropertyValue(name));
      return isNaN(v) ? fallback : v;
    };
    const cardWidth   = cssRead('--cs-width', 520);
    const cardHeight  = cssRead('--cs-height', 340);
    const spreadDeg   = cssRead('--cs-spread', 48);
    const depthPx     = cssRead('--cs-depth', 130);
    const activeScale = cssRead('--cs-active-scale', 1.04);
    const inactiveScale = cssRead('--cs-inactive-scale', 0.94);
    const activeLift  = cssRead('--cs-active-lift', 22);
    const tiltX       = cssRead('--cs-tilt-x', 10);

    const maxOff = Math.max(1, Math.floor(opts.maxVisible / 2));
    const spacing = Math.max(10, Math.round(cardWidth * (1 - opts.overlap)));
    const stepDeg = spreadDeg / maxOff;

    let active = 0;
    let hovering = false;
    let autoTimer = null;

    const wrap = (n) => ((n % len) + len) % len;

    const signedOffset = (i) => {
      const raw = i - active;
      if (!opts.loop || len <= 1) return raw;
      const alt = raw > 0 ? raw - len : raw + len;
      return Math.abs(alt) < Math.abs(raw) ? alt : raw;
    };

    const render = () => {
      cards.forEach((card, i) => {
        const off = signedOffset(i);
        const abs = Math.abs(off);
        const visible = abs <= maxOff;

        if (!visible) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.transform = `translate3d(0, 0, ${-maxOff * depthPx - 100}px) scale(0.8)`;
          card.classList.remove('is-active');
          return;
        }

        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';

        const isActive = off === 0;
        const x = off * spacing;
        const y = abs * 8 - (isActive ? activeLift : 0);
        const z = -abs * depthPx;
        const rotZ = off * stepDeg;
        const rotX = isActive ? 0 : tiltX;
        const scale = isActive ? activeScale : inactiveScale;
        const zIndex = 100 - abs;

        card.style.zIndex = String(zIndex);
        card.style.transform =
          `translate3d(${x}px, ${y}px, ${z}px) ` +
          `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
        card.classList.toggle('is-active', isActive);
      });

      dots.forEach((d, i) => d.classList.toggle('on', i === active));

      if (externalLink) {
        const href = cards[active].dataset.href;
        if (href) externalLink.setAttribute('href', href);
        externalLink.style.display = href ? '' : 'none';
      }

      // Update prev/next disabled state when not looping
      if (btnPrev) btnPrev.disabled = !opts.loop && active === 0;
      if (btnNext) btnNext.disabled = !opts.loop && active === len - 1;
    };

    const go = (to) => {
      const clamped = opts.loop ? wrap(to) : Math.max(0, Math.min(len - 1, to));
      if (clamped === active) return;
      active = clamped;
      render();
    };

    const prev = () => go(active - 1);
    const next = () => go(active + 1);

    // ---- Drag / swipe on active card ----
    let dragStartX = 0;
    let dragStartTime = 0;
    let dragging = false;
    let dragCard = null;

    viewport.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.stack-card.is-active');
      if (!card) return;
      dragging = true;
      dragCard = card;
      dragStartX = e.clientX;
      dragStartTime = performance.now();
      card.classList.add('is-dragging');
      card.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!dragging || !dragCard) return;
      const dx = e.clientX - dragStartX;
      // elastic drag — apply a small translateX on the active card
      dragCard.style.transform = dragCard.style.transform.replace(
        /translate3d\([^)]+\)/,
        `translate3d(${dx}px, ${-activeLift}px, 0px)`
      );
    });

    const endDrag = (e) => {
      if (!dragging || !dragCard) return;
      const dx = e.clientX - dragStartX;
      const dt = performance.now() - dragStartTime;
      const velocity = dx / Math.max(dt, 1); // px/ms
      const threshold = Math.min(140, cardWidth * 0.22);

      dragCard.classList.remove('is-dragging');
      dragCard = null;
      dragging = false;

      if (dx > threshold || velocity > 0.65) prev();
      else if (dx < -threshold || velocity < -0.65) next();
      else render(); // snap back
    };

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // ---- Click non-active card to focus it ----
    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        // ignore click if it was actually the end of a drag
        if (Math.abs(e.clientX - dragStartX) > 5 && dragStartTime) return;
        if (i !== active) go(i);
      });
    });

    // ---- Dots ----
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

    // ---- Prev/Next buttons ----
    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    // ---- Keyboard ----
    stage.tabIndex = 0;
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // ---- Hover pause + autoplay ----
    root.addEventListener('mouseenter', () => { hovering = true; });
    root.addEventListener('mouseleave', () => { hovering = false; });

    const startAuto = () => {
      if (!opts.autoplay || prefersReducedMotion) return;
      stopAuto();
      autoTimer = window.setInterval(() => {
        if (opts.pauseOnHover && hovering) return;
        next();
      }, Math.max(1500, opts.intervalMs));
    };
    const stopAuto = () => {
      if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
    };

    // Initial paint
    render();
    startAuto();

    // Repaint on resize (spacing depends on computed CSS vars that can shift at breakpoints)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Re-read CSS vars via recalc
        location.hash === location.hash; // no-op
        render();
      }, 120);
    });
  }

  document.querySelectorAll('.card-stack').forEach(initCardStack);

  // =====================================================================
  // PARTICLES BACKGROUND — ported from the React particles-bg component.
  // Uses particles.js (loaded via CDN in renderer.tsx). Dark-only palette
  // since our site is dark-theme-locked. Waits for the CDN script to load
  // because we rely on `window.particlesJS` being defined.
  // =====================================================================
  function initParticles() {
    const container = document.getElementById('particles-js');
    if (!container) return;
    if (typeof window.particlesJS !== 'function') return false;

    // Clean up any previous canvas (idempotent)
    const old = container.querySelector('canvas');
    if (old) old.remove();
    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom.forEach((p) => {
        try { p.pJS.fn.vendors.destroypJS(); } catch (_) {}
      });
      window.pJSDom = [];
    }

    // SGC TECH palette — matches hero cyan/tech-blue exactly
    const colors = {
      particles: '#00d9ff',  // electric cyan (main accent)
      lines:     '#00b8d9',  // dim cyan (line connectors)
      accent:    '#0047ff',  // tech blue (stroke)
    };

    // Tune particle count by viewport — fewer on mobile for perf
    const vw = Math.max(window.innerWidth, 320);
    const count = vw < 700 ? 60 : vw < 1100 ? 90 : 120;

    window.particlesJS('particles-js', {
      particles: {
        number:  { value: count, density: { enable: true, value_area: 900 } },
        color:   { value: colors.particles },
        shape:   { type: 'circle', stroke: { width: 0.5, color: colors.accent } },
        opacity: {
          value: 0.55,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.15 },
        },
        size: {
          value: 2.4,
          random: true,
          anim: { enable: true, speed: 1.8, size_min: 0.6 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: colors.lines,
          opacity: 0.28,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.4,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'bounce',
          attract: { enable: false },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !prefersReducedMotion, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize:  true,
        },
        modes: {
          grab:    { distance: 200, line_linked: { opacity: 0.7 } },
          push:    { particles_nb: 3 },
          repulse: { distance: 180, duration: 0.4 },
        },
      },
      retina_detect: true,
    });
    return true;
  }

  // particles.js is loaded with `defer`, but so is this script. It may load
  // after our DOMContentLoaded. We poll briefly (up to ~3s) then init.
  (function waitForParticles() {
    let tries = 0;
    const attempt = () => {
      if (initParticles() === true) return;
      if (++tries > 30) return;         // give up after ~3s
      setTimeout(attempt, 100);
    };
    attempt();
  })();
})();
