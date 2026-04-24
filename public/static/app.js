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

  // ---- Scroll reveal (.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur) ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
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

  // ---- Stagger grid children ----
  const staggerParents = document.querySelectorAll('.stagger-children');
  if (staggerParents.length) {
    const staggerIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        Array.from(entry.target.children).forEach((child, i) => {
          setTimeout(() => child.classList.add('in'), i * 80);
        });
        staggerIO.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    staggerParents.forEach((p) => staggerIO.observe(p));
  }

  // ---- Parallax — hero visual drifts up at 12% scroll speed ----
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      heroVisual.style.setProperty('--parallax-y', `${window.scrollY * 0.12}px`);
    }, { passive: true });
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

  // =====================================================================
  // AIRA CHATBOX — unified voice + chat interface with intent detection
  // =====================================================================
  function initAiraChatbox() {
    const root = document.querySelector('.aira-chatbox');
    if (!root) return;

    const launcher = root.querySelector('[data-chat-launcher]');
    const panel = root.querySelector('[data-chat-panel]');
    const closeBtn = root.querySelector('[data-chat-close]');
    const talkBtn = root.querySelector('[data-talk-human]');
    const alertLinksWrap = root.querySelector('[data-alert-links]');
    const alertWhatsapp = root.querySelector('[data-alert-whatsapp]');
    const alertTelegram = root.querySelector('[data-alert-telegram]');
    const chatLog = root.querySelector('[data-chat-log]');
    const chatForm = root.querySelector('[data-chat-form]');
    const chatInput = root.querySelector('[data-chat-input]');
    const voiceToggleBtn = root.querySelector('[data-voice-toggle]');
    const voiceStatus = root.querySelector('#aira-voice-status');
    const voiceVisualizer = root.querySelector('#aira-voice-visualizer');
    const syncStatus = root.querySelector('[data-sync-status]');

if (!launcher || !panel || !closeBtn || !talkBtn || !alertLinksWrap || !alertWhatsapp || !alertTelegram || !chatLog || !chatForm || !chatInput || !voiceToggleBtn) {
      return;
    }

    const bookingUrl = root.getAttribute('data-booking-url') || 'https://app.cal.com/sgctech';
    const alertPhone = root.getAttribute('data-alert-phone') || '971563905772';
    const memoryApi = root.getAttribute('data-memory-api') || '/api/aira/memory';
    const storageKey = 'aira-chat-history-v1';
    const eventKey = 'aira-chat-events-v1';
    const brainKey = 'aira-brain-state-v1';
    const sessionKey = 'aira-session-id-v1';

    const sessionId = getOrCreateSessionId();
    const history = loadStorage(storageKey);
    const events = loadStorage(eventKey);
    const brain = loadStorage(brainKey);

    let syncTimer = null;
    let syncInFlight = false;
    let syncQueued = false;

    // Voice recording state (MediaRecorder → real Aira audio)
    let vrRecording = false;
    let vrProcessing = false;
    let vrPlaying = false;
    let vrMediaRecorder = null;
    let vrMicStream = null;
    let vrAudioCtx = null;
    let vrPlaySource = null;

    function loadStorage(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }

    function saveStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (_) {}
    }

    function getOrCreateSessionId() {
      try {
        const current = localStorage.getItem(sessionKey);
        if (current) return current;
        const generated = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : ('sess-' + Date.now() + '-' + Math.random().toString(36).slice(2));
        localStorage.setItem(sessionKey, generated);
        return generated;
      } catch (_) {
        return 'sess-' + Date.now();
      }
    }

    function setSyncStatus(text, level) {
      if (!syncStatus) return;
      syncStatus.textContent = text;
      syncStatus.classList.remove('ok', 'warn', 'err');
      if (level) syncStatus.classList.add(level);
    }

    function initBrainState() {
      return {
        visitorId: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        turns: 0,
        leadScore: 0,
        profile: {
          name: '',
          company: '',
          role: '',
          industry: '',
          timeline: '',
          budget: '',
          stack: [],
          goals: [],
        },
        intentCounts: {},
        lastIntent: 'unknown',
      }
    }

    const brainState = (brain && typeof brain === 'object' && !Array.isArray(brain)) ? brain : initBrainState();

    function queueCentralSync() {
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        syncTimer = null;
        flushCentralSync();
      }, 700);
    }

    async function flushCentralSync() {
      if (syncInFlight) {
        syncQueued = true;
        return;
      }

      syncInFlight = true;
      try {
        const res = await fetch(memoryApi, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            history,
            events,
            brainState,
          }),
        })

        if (res.ok) {
          setSyncStatus('Central memory synced.', 'ok');
        } else {
          setSyncStatus('Central memory sync pending KV configuration.', 'warn');
        }
      } catch (_) {
        setSyncStatus('Central memory unavailable. Using local memory only.', 'warn');
      } finally {
        syncInFlight = false;
        if (syncQueued) {
          syncQueued = false;
          queueCentralSync();
        }
      }
    }

    function mergeRemoteMemory(data) {
      if (!data || typeof data !== 'object') return;

      if (Array.isArray(data.history) && data.history.length) {
        history.splice(0, history.length, ...data.history.slice(-120));
        saveStorage(storageKey, history);
      }

      if (Array.isArray(data.events) && data.events.length) {
        events.splice(0, events.length, ...data.events.slice(-300));
        saveStorage(eventKey, events);
      }

      if (data.brainState && typeof data.brainState === 'object') {
        const remoteBrain = data.brainState;
        const mergedProfile = {
          ...brainState.profile,
          ...(remoteBrain.profile || {}),
          stack: Array.isArray(remoteBrain.profile?.stack) ? remoteBrain.profile.stack.slice(0, 20) : brainState.profile.stack,
          goals: Array.isArray(remoteBrain.profile?.goals) ? remoteBrain.profile.goals.slice(0, 20) : brainState.profile.goals,
        };
        Object.assign(brainState, remoteBrain, { profile: mergedProfile });
        saveStorage(brainKey, brainState);
      }
    }

    async function fetchCentralMemory() {
      try {
        const res = await fetch(memoryApi + '?sessionId=' + encodeURIComponent(sessionId));
        if (!res.ok) {
          setSyncStatus('Central memory sync pending KV configuration.', 'warn');
          return;
        }
        const payload = await res.json();
        if (payload?.ok && payload?.data) {
          mergeRemoteMemory(payload.data);
          setSyncStatus('Central memory sync connected.', 'ok');
          renderHistory();
        } else if (payload?.ok) {
          setSyncStatus('Central memory ready. Starting new profile.', 'ok');
        } else {
          setSyncStatus('Central memory sync pending KV configuration.', 'warn');
        }
      } catch (_) {
        setSyncStatus('Central memory unavailable. Using local memory only.', 'warn');
      }
    }

    function appendEvent(type, detail) {
      events.push({
        type: type,
        detail: detail,
        at: new Date().toISOString(),
      });
      if (events.length > 200) events.splice(0, events.length - 200);
      saveStorage(eventKey, events);
      queueCentralSync();
    }

    function saveBrain() {
      saveStorage(brainKey, brainState);
      queueCentralSync();
    }

    function detectIntent(text) {
      const t = text.toLowerCase();
      const score = {
        greeting: /(hello|hi|hey|good morning|good afternoon)/.test(t) ? 3 : 0,
        booking: /(book|demo|call|meeting|schedule)/.test(t) ? 5 : 0,
        pricing: /(price|pricing|cost|budget|quote)/.test(t) ? 5 : 0,
        integrations: /(integrat|api|crm|erp|sap|salesforce|hubspot|slack|teams)/.test(t) ? 5 : 0,
        compliance: /(security|soc|gdpr|hipaa|compliance|privacy)/.test(t) ? 5 : 0,
        support: /(support|help|sla|response)/.test(t) ? 4 : 0,
        timeline: /(timeline|when|how fast|days|weeks|month)/.test(t) ? 4 : 0,
        human: /(human|specialist|sales rep|agent|person)/.test(t) ? 6 : 0,
        capabilities: /(capab|automate|workflow|predict|analy|roi)/.test(t) ? 4 : 0,
      };

      let best = 'unknown';
      let max = 0;
      Object.keys(score).forEach((key) => {
        if (score[key] > max) {
          max = score[key];
          best = key;
        }
      });
      return best;
    }

    function extractProfile(text) {
      const lower = text.toLowerCase();
      const p = brainState.profile;

      const nameMatch = text.match(/(?:my name is|i am)\s+([A-Za-z][A-Za-z\-']{1,24})/i);
      if (nameMatch && !p.name) p.name = nameMatch[1];

      const companyMatch = text.match(/(?:from|at)\s+([A-Za-z0-9][A-Za-z0-9&.,\-\s]{1,50})/i);
      if (companyMatch && !p.company) p.company = companyMatch[1].trim();

      const roleMatch = text.match(/(?:i am|i'm)\s+(?:a|an|the)?\s*([A-Za-z\s]{3,40})(?:\s+at|\s+from|\.|,|$)/i);
      if (roleMatch && !p.role) {
        const role = roleMatch[1].trim();
        if (!/(interested|looking|need|from|at|ready)/i.test(role)) p.role = role;
      }

      const industries = ['healthcare', 'finance', 'retail', 'manufacturing', 'logistics', 'education', 'legal', 'real estate'];
      industries.forEach((ind) => {
        if (lower.includes(ind) && !p.industry) p.industry = ind;
      });

      const timelineMatch = text.match(/(\d+\s*(?:day|days|week|weeks|month|months))/i);
      if (timelineMatch && !p.timeline) p.timeline = timelineMatch[1];

      const budgetMatch = text.match(/(?:budget|range|spend)\s*(?:is|around|about)?\s*(\$?\s?[0-9.,]+\s*[kKmM]?)/i);
      if (budgetMatch && !p.budget) p.budget = budgetMatch[1].replace(/\s+/g, ' ').trim();

      const knownTools = ['salesforce', 'hubspot', 'sap', 'slack', 'teams', 'zendesk', 'shopify', 'snowflake'];
      knownTools.forEach((tool) => {
        if (lower.includes(tool) && !p.stack.includes(tool)) p.stack.push(tool);
      });

      const goalPhrases = ['reduce cost', 'save time', 'book more demos', 'automate workflows', 'improve support', 'increase conversion'];
      goalPhrases.forEach((g) => {
        if (lower.includes(g) && !p.goals.includes(g)) p.goals.push(g);
      });
    }

    function updateLeadScore(intent) {
      const p = brainState.profile;
      const bumps = {
        booking: 18,
        pricing: 12,
        integrations: 10,
        capabilities: 7,
        timeline: 6,
        compliance: 8,
        human: 10,
        support: 5,
      };
      brainState.leadScore += bumps[intent] || 2;
      if (p.company) brainState.leadScore += 2;
      if (p.role) brainState.leadScore += 2;
      if (p.timeline) brainState.leadScore += 2;
      if (brainState.leadScore > 100) brainState.leadScore = 100;
    }

    function renderHistory() {
      chatLog.innerHTML = '';
      history.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'aira-msg ' + item.role;
        row.textContent = item.text;
        chatLog.appendChild(row);
      });
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    function appendMessage(role, text) {
      history.push({
        role: role,
        text: text,
        at: new Date().toISOString(),
      });
      if (history.length > 120) history.splice(0, history.length - 120);
      saveStorage(storageKey, history);
      renderHistory();
      queueCentralSync();
    }

    function setVoiceState(state) {
      const labels = { idle: 'Tap to speak with Aira', recording: 'Listening… tap to send', processing: 'Aira is thinking…', speaking: 'Aira is speaking…' };
      if (voiceStatus) voiceStatus.textContent = labels[state] || labels.idle;
      if (voiceVisualizer) voiceVisualizer.classList.toggle('recording', state === 'recording' || state === 'speaking');
      if (voiceToggleBtn) voiceToggleBtn.classList.toggle('listening', state === 'recording');
    }

    async function startVoiceRecording() {
      if (vrRecording || vrProcessing) return;
      if (vrPlaying && vrPlaySource) { try { vrPlaySource.stop(); } catch (_) {} vrPlaying = false; }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
      } catch (_) {
        setVoiceState('idle');
        if (voiceStatus) voiceStatus.textContent = 'Microphone access denied';
        return;
      }

      vrMicStream = stream;
      const chunks = [];
      const mimeType = (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
        ? 'audio/webm;codecs=opus' : 'audio/webm';
      vrMediaRecorder = new MediaRecorder(stream, { mimeType });
      vrMediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      vrMediaRecorder.onstop = () => processVoiceAudio(chunks, mimeType);
      vrMediaRecorder.start(100);
      vrRecording = true;
      setVoiceState('recording');
      appendEvent('voice_start', 'tap');
      setTimeout(() => { if (vrRecording) stopVoiceRecording(); }, 30000);
    }

    function stopVoiceRecording() {
      if (!vrRecording) return;
      vrRecording = false;
      if (vrMediaRecorder && vrMediaRecorder.state !== 'inactive') vrMediaRecorder.stop();
      if (vrMicStream) { vrMicStream.getTracks().forEach(t => t.stop()); vrMicStream = null; }
    }

    async function processVoiceAudio(chunks, mimeType) {
      if (!chunks.length) { setVoiceState('idle'); return; }
      vrProcessing = true;
      if (voiceToggleBtn) voiceToggleBtn.disabled = true;
      setVoiceState('processing');

      const blob = new Blob(chunks, { type: mimeType });
      const form = new FormData();
      form.append('audio', blob, 'voice.webm');
      form.append('session_id', sessionId);

      try {
        const resp = await fetch('/api/aira/voice', { method: 'POST', body: form });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);

        const rawT = resp.headers.get('X-Transcript');
        const rawR = resp.headers.get('X-Response');
        if (rawT) {
          try { const t = atob(rawT); appendMessage('user', t); appendEvent('voice_user_message', t); trackBrainState(t); } catch (_) {}
        }
        if (rawR) {
          try { const r = atob(rawR); appendMessage('assistant', r); appendEvent('voice_assistant_message', r); } catch (_) {}
        }

        const audioBuf = await resp.arrayBuffer();
        if (audioBuf.byteLength > 0) await playVoiceAudio(audioBuf);
      } catch (_) {
        appendMessage('assistant', 'Voice service unavailable. Please try chat mode.');
      } finally {
        vrProcessing = false;
        if (voiceToggleBtn) voiceToggleBtn.disabled = false;
        setVoiceState('idle');
      }
    }

    async function playVoiceAudio(arrayBuf) {
      vrPlaying = true;
      setVoiceState('speaking');
      try {
        if (!vrAudioCtx || vrAudioCtx.state === 'closed') vrAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (vrAudioCtx.state === 'suspended') await vrAudioCtx.resume();
        const decoded = await vrAudioCtx.decodeAudioData(arrayBuf);
        vrPlaySource = vrAudioCtx.createBufferSource();
        vrPlaySource.buffer = decoded;
        vrPlaySource.connect(vrAudioCtx.destination);
        await new Promise(resolve => { vrPlaySource.onended = resolve; vrPlaySource.start(); });
      } catch (_) {}
      vrPlaying = false;
      setVoiceState('idle');
    }

    function trackBrainState(userText) {
      const intent = detectIntent(userText);

      brainState.turns += 1;
      brainState.lastIntent = intent;
      brainState.intentCounts[intent] = (brainState.intentCounts[intent] || 0) + 1;

      extractProfile(userText);
      updateLeadScore(intent);
      saveBrain();

      appendEvent('brain_state', {
        intent: intent,
        leadScore: brainState.leadScore,
        profile: brainState.profile,
      });
    }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'aira-msg aira aira-typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      chatLog.appendChild(el);
      chatLog.scrollTop = chatLog.scrollHeight;
      return el;
    }

    function hideTyping(el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    async function callAira(message, source) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const res = await fetch('/api/aira/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message, source: source, sessionId: sessionId }),
          signal: controller.signal,
        });
        const data = await res.json();
        return data.reply || "I'm having trouble responding right now. Please try again.";
      } catch (err) {
        if (err.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const voicePanel = root.querySelector('[data-voice-panel]');
    const modeBtns = Array.from(root.querySelectorAll('[data-mode]'));

    const setMode = (mode) => {
      root.setAttribute('data-active-mode', mode);
      modeBtns.forEach((btn) => {
        const active = btn.getAttribute('data-mode') === mode;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      const isVoice = mode === 'voice';
      if (chatForm) chatForm.hidden = isVoice;
      if (voicePanel) voicePanel.hidden = !isVoice;
      if (!isVoice && vrRecording) stopVoiceRecording();
    };

    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setMode(btn.getAttribute('data-mode') || 'chat');
        appendEvent('switch_mode', btn.getAttribute('data-mode') || 'chat');
      });
    });

    const setOpen = (open) => {
      if (open) {
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add('is-open'));
      } else {
        panel.classList.remove('is-open');
        setTimeout(() => {
          if (!panel.classList.contains('is-open')) panel.hidden = true;
        }, 240);
      }
      launcher.setAttribute('aria-expanded', String(open));
      launcher.classList.toggle('is-active', open);
      appendEvent(open ? 'open_panel' : 'close_panel', 'unified');
    };

    const buildAlertMessage = () => {
      return [
        'Talk-to-human request from Aira chatbox.',
        'Session: ' + sessionId,
        'Page: ' + window.location.href,
        'Please follow up with this lead immediately.',
      ].join(' ');
    };

    launcher.addEventListener('click', () => setOpen(panel.hidden));
    closeBtn.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    document.addEventListener('click', (e) => {
      if (panel.hidden) return;
      if (!root.contains(e.target)) setOpen(false);
    });

    // Character counter + Enter-to-send for textarea
    const charCounter = root.querySelector('[data-char-counter]');
    const MAX_CHARS = 2000;

    if (chatInput) {
      chatInput.addEventListener('input', () => {
        const len = chatInput.value.length;
        if (charCounter) charCounter.textContent = len + '/' + MAX_CHARS;
      });

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      });
    }

    // Mic shortcut button — switches to voice mode
    const modeTriggerBtns = Array.from(root.querySelectorAll('[data-mode-trigger]'));
    modeTriggerBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode-trigger') || 'voice';
        setMode(mode);
        appendEvent('switch_mode', mode);
      });
    });

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      appendMessage('user', message);
      appendEvent('user_message', message);
      chatInput.value = '';
      if (charCounter) charCounter.textContent = '0/' + MAX_CHARS;
      trackBrainState(message);

      const typingEl = showTyping();
      try {
        const reply = await callAira(message, 'chat');
        hideTyping(typingEl);
        appendMessage('assistant', reply);
        appendEvent('assistant_message', reply);
      } catch (_) {
        hideTyping(typingEl);
        appendMessage('assistant', 'Connection error. Please try again.');
      }
    });

    // Tap-to-toggle mic: start recording on first tap, stop + send on second
    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', () => {
        if (vrProcessing) return;
        if (vrRecording) {
          stopVoiceRecording();
        } else {
          if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices) {
            if (voiceStatus) voiceStatus.textContent = 'Voice not supported in this browser';
            return;
          }
          startVoiceRecording();
        }
      });
    }

    talkBtn.addEventListener('click', () => {
      const message = buildAlertMessage();
      const encoded = encodeURIComponent(message);
      const whatsappUrl = 'https://wa.me/' + alertPhone + '?text=' + encoded;
      const telegramUrl = 'tg://resolve?phone=' + alertPhone + '&text=' + encoded;
      const telegramWebFallback = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encoded;

      alertWhatsapp.setAttribute('href', whatsappUrl);
      alertTelegram.setAttribute('href', telegramUrl);
      alertTelegram.setAttribute('data-fallback-href', telegramWebFallback);
      alertLinksWrap.hidden = false;
      appendEvent('talk_to_human', 'unified');
    });

    alertWhatsapp.addEventListener('click', () => {
      appendEvent('alert_whatsapp', window.location.href);
    });

    alertTelegram.addEventListener('click', () => {
      const fallback = alertTelegram.getAttribute('data-fallback-href');
      if (fallback) {
        setTimeout(() => {
          window.open(fallback, '_blank', 'noopener,noreferrer');
        }, 500);
      }
      appendEvent('alert_telegram', window.location.href);
    });

    const quickBookBtn = root.querySelector('[data-book-demo]');
    if (quickBookBtn) {
      quickBookBtn.setAttribute('href', bookingUrl);
      quickBookBtn.addEventListener('click', () => {
        appendEvent('book_demo', bookingUrl);
      });
    }

    setMode('chat');

    setSyncStatus('Central memory sync: checking...', 'warn');

    fetchCentralMemory().finally(() => {
      if (history.length) renderHistory();
      queueCentralSync();
    });

  }

  initAiraChatbox();
})();
