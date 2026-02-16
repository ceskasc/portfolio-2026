document.addEventListener('DOMContentLoaded', () => {

  // ===== Reduced Motion Check =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Project Data =====
  const projectData = {
    1: {
      img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop',
      category: 'Branding', title: 'Noir Essence',
      desc: 'A comprehensive brand identity project for a luxury perfume house. The design language draws from Art Deco elegance fused with contemporary minimalism, crafted to evoke exclusivity and timeless sophistication.',
      client: 'Noir Parfums', year: '2025', type: 'Brand Identity', tools: 'Illustrator, Photoshop'
    },
    2: {
      img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
      category: 'Poster Design', title: 'Metamorphosis',
      desc: 'An art exhibition campaign exploring transformation through bold geometric abstraction. The visual system spans posters, invitations, and digital assets unified by a dynamic evolving grid.',
      client: 'Baku Modern Art', year: '2025', type: 'Campaign Design', tools: 'Illustrator, InDesign'
    },
    3: {
      img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
      category: 'Digital Design', title: 'EcoVista',
      desc: 'Complete UI/UX design and brand identity for a sustainable lifestyle app. The interface celebrates nature through organic shapes, earthy tones, and intuitive navigation.',
      client: 'EcoVista Inc.', year: '2024', type: 'UI/UX & Branding', tools: 'Figma, After Effects'
    },
    4: {
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
      category: 'Social Media',
      title: 'Pulse Festival',
      desc: 'A vibrant social media campaign for a summer music festival. The visual language captured the energy and rhythm of the event through dynamic typography and bold color palettes. We created a cohesive set of assets across Instagram, TikTok, and Facebook, resulting in a 40% increase in ticket sales compared to the previous year.',
      client: 'Live Nation',
      year: '2023',
      type: 'Social Media Strategy',
      tools: 'After Effects, Photoshop, Figma'
    },
    5: {
      img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1200&h=800&fit=crop',
      category: 'Editorial', title: 'Horizon Magazine',
      desc: 'Editorial design for a quarterly travel magazine. The layout system balances expansive photography with refined typography, creating an immersive reading experience.',
      client: 'Horizon Media', year: '2023', type: 'Editorial Layout', tools: 'InDesign, Lightroom'
    },
    6: {
      img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=800&fit=crop',
      category: 'Packaging', title: 'Caspian Coffee',
      desc: 'Complete packaging and brand system for an artisan Azerbaijani coffee roaster. Deep navy and warm gold accents create shelf-ready packaging that tells a story of origin and craftsmanship.',
      client: 'Caspian Roasters', year: '2023', type: 'Packaging Design', tools: 'Illustrator, Photoshop'
    }
  };

  // Check GSAP availability
  const hasGSAP = typeof gsap !== 'undefined';
  const hasScrollTrigger = hasGSAP && typeof ScrollTrigger !== 'undefined';

  // ===== Lenis Smooth Scroll =====
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    if (hasScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ===== Particle System =====
  const particleCanvas = document.getElementById('particles');
  if (particleCanvas && !prefersReducedMotion) {
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resizeParticles() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.01;
        if (this.x < 0 || this.x > particleCanvas.width || this.y < 0 || this.y > particleCanvas.height) {
          this.reset();
        }
      }
      draw() {
        const pulseOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(212, 168, 83, ${pulseOpacity})`;
        pCtx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Draw connections between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            pCtx.beginPath();
            pCtx.moveTo(particles[i].x, particles[i].y);
            pCtx.lineTo(particles[j].x, particles[j].y);
            pCtx.strokeStyle = `rgba(212, 168, 83, ${0.03 * (1 - dist / 150)})`;
            pCtx.lineWidth = 0.5;
            pCtx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ===== Init Animations (No Preloader) =====
  function initAnimations() {
    // Page transition entrance
    const pageTransition = document.getElementById('page-transition');
    if (pageTransition && hasGSAP && !prefersReducedMotion) {
      gsap.to(pageTransition, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' });
    }

    // Hero reveals
    if (hasGSAP && !prefersReducedMotion) {
      gsap.to('#hero .reveal-up', {
        y: 0, opacity: 1, duration: 1, stagger: 0.15,
        ease: 'power4.out', delay: 0.2
      });
    } else {
      document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), 100 + i * 150);
      });
    }

    initTextSplit();
  }

  // Run immediately
  initAnimations();

  // ===== Text Split Animation =====
  function initTextSplit() {
    if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) return;
    document.querySelectorAll('section h2').forEach(heading => {
      if (heading.closest('#hero')) return;
      gsap.fromTo(heading,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power4.inOut'
        }
      );
    });
  }

  // ===== Custom Cursor =====
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorLabel = document.getElementById('cursor-label');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = mouseX - 3 + 'px'; cursorDot.style.top = mouseY - 3 + 'px'; }
    if (cursorLabel) { cursorLabel.style.left = mouseX + 'px'; cursorLabel.style.top = mouseY + 'px'; }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    if (cursor) { cursor.style.left = cursorX - 10 + 'px'; cursor.style.top = cursorY - 10 + 'px'; }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover
  document.querySelectorAll('a, button, .service-item').forEach(el => {
    el.addEventListener('mouseenter', () => { if (cursor) cursor.style.transform = 'scale(2.5)'; });
    el.addEventListener('mouseleave', () => { if (cursor) cursor.style.transform = 'scale(1)'; });
  });

  // VIEW label on work cards
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (cursorLabel) cursorLabel.style.opacity = '1';
      if (cursor) cursor.style.opacity = '0';
      if (cursorDot) cursorDot.style.opacity = '0';
    });
    card.addEventListener('mouseleave', () => {
      if (cursorLabel) cursorLabel.style.opacity = '0';
      if (cursor) cursor.style.opacity = '1';
      if (cursorDot) cursorDot.style.opacity = '1';
    });
  });

  // ===== Cursor Trail =====
  const trailCanvas = document.getElementById('cursor-trail');
  if (trailCanvas && !prefersReducedMotion) {
    const ctx = trailCanvas.getContext('2d');
    let trail = [];
    const maxTrail = 20;

    function resizeCanvas() { trailCanvas.width = window.innerWidth; trailCanvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY, alpha: 1 });
      if (trail.length > maxTrail) trail.shift();
    });

    function drawTrail() {
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      trail.forEach((point, i) => {
        point.alpha *= 0.92;
        const size = (i / trail.length) * 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${point.alpha * 0.3})`;
        ctx.fill();
      });
      trail = trail.filter(p => p.alpha > 0.01);
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  }

  // ===== Scroll Progress Bar =====
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
    }
  }

  // ===== Back to Top (Standard Implementation) =====
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // This listener is now only for scroll progress
  window.addEventListener('scroll', () => { updateScrollProgress(); });

  // ===== Navbar Scroll =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ===== Mobile Menu =====
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Smooth Scroll (anchor links) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        if (lenis) lenis.scrollTo(target);
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Button Ripple Effect =====
  document.querySelectorAll('button, a.inline-flex').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;background:rgba(212,168,83,0.15);border-radius:50%;transform:scale(0);animation:ripple-anim 0.6s ease-out forwards;pointer-events:none;z-index:1;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== Category Filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = '';
        b.style.color = '';
        b.style.background = '';
      });
      btn.classList.add('active');
      btn.style.borderColor = 'rgba(212,168,83,0.3)';
      btn.style.color = '#d4a853';
      btn.style.background = 'rgba(212,168,83,0.1)';

      workCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.style.display = '';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== GSAP Animations =====
  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Section reveals
      gsap.utils.toArray('.reveal-section').forEach(el => {
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 1, ease: 'power3.out'
        });
      });

      // Parallax for about image
      const aboutImg = document.querySelector('#about img');
      if (aboutImg) {
        gsap.to(aboutImg, {
          scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 },
          y: -40, ease: 'none'
        });
      }

      // Parallax for hero glows
      document.querySelectorAll('#hero .absolute.rounded-full').forEach((glow, i) => {
        gsap.to(glow, {
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
          y: 150 + i * 50, ease: 'none'
        });
      });

      // Service items slide in
      gsap.utils.toArray('.service-item').forEach((item, i) => {
        gsap.fromTo(item, { x: -40, opacity: 0 }, {
          scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' },
          x: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out'
        });
      });

      // Skill items stagger
      gsap.utils.toArray('.skill-item').forEach((item, i) => {
        gsap.fromTo(item, { y: 30, opacity: 0, scale: 0.9 }, {
          scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.2)'
        });
      });

      // Work cards stagger
      gsap.utils.toArray('.work-card').forEach((card, i) => {
        gsap.fromTo(card, { y: 80, opacity: 0 }, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 1, delay: (i % 2) * 0.2, ease: 'power3.out'
        });
      });

      // Timeline items
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item, { x: i % 2 === 0 ? -40 : 40, opacity: 0 }, {
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          x: 0, opacity: 1, duration: 1, ease: 'power3.out'
        });
      });

      // Blog cards stagger
      gsap.utils.toArray('.blog-card').forEach((card, i) => {
        gsap.fromTo(card, { y: 50, opacity: 0 }, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
        });
      });
    } else {
      // Reduced motion — just make everything visible
      document.querySelectorAll('.reveal-section, .timeline-item, .blog-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  } else {
    // Fallback: IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-section, .timeline-item, .blog-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      revealObserver.observe(el);
    });
  }

  // ===== Counter Animation =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('.counter');
        if (counter) {
          const target = parseInt(counter.dataset.target);
          if (hasGSAP) {
            gsap.to({ val: 0 }, {
              val: target, duration: 2, ease: 'power2.out',
              onUpdate: function () { counter.textContent = Math.floor(this.targets()[0].val); }
            });
          } else {
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) { counter.textContent = target; clearInterval(timer); }
              else counter.textContent = Math.floor(current);
            }, 40);
          }
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-item').forEach(el => counterObserver.observe(el));

  // ===== 3D Tilt Effect =====
  if (!prefersReducedMotion) {
    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
        const img = card.querySelector('img');
        if (img) img.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        const img = card.querySelector('img');
        if (img) { img.style.transform = 'scale(1) translate(0, 0)'; img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; }
        setTimeout(() => { card.style.transition = ''; if (img) img.style.transition = ''; }, 600);
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
        const img = card.querySelector('img');
        if (img) img.style.transition = 'none';
      });
    });
  }

  // ===== Testimonial Slider =====
  const testimonialSlides = document.querySelector('.testimonial-slides');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-slide').length;

  function goToSlide(index) {
    currentSlide = index;
    if (testimonialSlides) testimonialSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.style.background = i === currentSlide ? '#d4a853' : '';
    });
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
  });

  if (totalSlides > 0) {
    setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
  }

  // ===== Project Modal =====
  const modal = document.getElementById('project-modal');
  const modalContent = modal ? modal.querySelector('.modal-content') : null;

  document.querySelectorAll('.work-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      const data = projectData[index + 1];
      if (!data || !modal) return;

      document.getElementById('modal-img').src = data.img;
      document.getElementById('modal-img').alt = data.title;
      document.getElementById('modal-category').textContent = data.category;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-client').textContent = data.client;
      document.getElementById('modal-year').textContent = data.year;
      document.getElementById('modal-type').textContent = data.type;
      document.getElementById('modal-tools').textContent = data.tools;

      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      if (modalContent) modalContent.classList.remove('scale-95');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();

      // ARIA: announce to screen reader
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', data.title + ' project details');
    });
    // Keyboard: Enter to open card
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View project ${projectData[index + 1]?.title || ''}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // ===== Service Data & Modal Interaction =====
  const serviceData = {
    brand: {
      title: 'Brand Identity',
      desc: 'A comprehensive branding process that defines your business personality. I create cohesive visual systems that resonate with your target audience and stand the test of time.',
      type: 'Visual Strategy',
      tools: 'Illustrator, Photoshop, Figma',
      details: [
        'Logo Design & Variations',
        'Visual Identity Systems',
        'Brand Guidelines',
        'Stationery & Collateral',
        'Social Media Kit'
      ],
      img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop'
    },
    print: {
      title: 'Print Design',
      desc: 'Tactile design experiences that leave a lasting impression. From editorial layouts to packaging, I ensure every printed piece is crafted with precision and creativity.',
      type: 'Editorial & Packaging',
      tools: 'InDesign, Illustrator, Photoshop',
      details: [
        'Editorial Layouts',
        'Packaging Design',
        'Posters & Flyers',
        'Business Cards',
        'Marketing Materials'
      ],
      img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop'
    },
    digital: {
      title: 'Digital Design',
      desc: 'Engaging digital experiences tailored for the modern web. I design user-centric interfaces and social content that drive engagement and tell your story effectively.',
      type: 'Web & Social',
      tools: 'Figma, Adobe XD, After Effects',
      details: [
        'Website UI/UX',
        'Social Media Content',
        'Email Campaigns',
        'Digital Ads',
        'Presentation Decks'
      ],
      img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop'
    },
    motion: {
      title: 'Motion Graphics',
      desc: 'Bringing static designs to life with dynamic motion. Whether it’s a logo reveal or a promotional video, motion adds a layer of depth and professionalism to your brand.',
      type: 'Animation & Video',
      tools: 'After Effects, Premiere Pro',
      details: [
        'Logo Animation',
        'Explainer Videos',
        'Social Media Motion',
        'UI Interactions',
        'Title Sequences'
      ],
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop'
    }
  };

  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      const serviceKey = item.getAttribute('data-service');
      const data = serviceData[serviceKey];
      if (!data) return;

      const modalImg = document.getElementById('modal-img');
      const modal = document.getElementById('project-modal');
      const modalContent = modal.querySelector('.modal-content');

      // Populate Data
      modalImg.src = data.img;
      modalImg.alt = data.title;
      document.getElementById('modal-category').textContent = 'Service';
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-type').textContent = data.type;
      document.getElementById('modal-tools').textContent = data.tools;

      // Adapt Grid for Services
      const grid = modal.querySelector('.grid');
      if (grid) {
        const clientCol = grid.children[0];
        const yearCol = grid.children[1];

        // Change "Client" to "Deliverables"
        const label = clientCol.querySelector('p:first-child');
        if (label) label.textContent = 'Deliverables';

        // Render List
        const value = document.getElementById('modal-client');
        value.innerHTML = `<ul class="list-disc list-inside space-y-1 text-cream-100/70" style="margin-top:-0.25rem">${data.details.map(d => `<li>${d}</li>`).join('')}</ul>`;

        // Hide Year Column
        yearCol.style.display = 'none';
      }

      // Show Modal
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      if (modalContent) modalContent.classList.remove('scale-95');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    });
  });

  // ===== Blog Data & Modal Interaction =====
  const blogData = {
    branding: {
      title: 'The Art of Building a Timeless Brand Identity',
      category: 'Branding',
      date: 'Oct 24, 2024',
      readTime: '5 min read',
      author: 'Reshad Aslanov',
      img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&auto=format&fit=crop',
      content: `
        <p class="mb-4">Building a brand is more than just designing a logo; it's about creating a comprehensive visual and emotional language that resonates with your audience. A timeless brand identity stands firm against fleeting trends, grounded in core values and clear strategic positioning.</p>
        <p class="mb-4"><strong>1. Simplicity is Key</strong><br>The most memorable brands are often the simplest. Think of Apple or Nike. Their visual identities are stripped down to the essentials, making them versatile and instantly recognizable across any medium.</p>
        <p class="mb-4"><strong>2. Consistency Builds Trust</strong><br>Consistency is the bedrock of recognition. From your color palette to your typography and tone of voice, every touchpoint should tell the same story. This reliability builds trust with your consumers over time.</p>
        <p><strong>3. Emotional Connection</strong><br>Great brands connect on an emotional level. They don't just sell a product; they champion a lifestyle or a belief system. Understanding your audience's desires and pain points allows you to craft an identity that speaks directly to them.</p>
      `
    },
    'design-theory': {
      title: 'Color Psychology in Modern Design',
      category: 'Design Theory',
      date: 'Sep 12, 2024',
      readTime: '4 min read',
      author: 'Reshad Aslanov',
      img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&auto=format&fit=crop',
      content: `
        <p class="mb-4">Color is arguably the most powerful tool in a designer's arsenal. It triggers immediate emotional responses and influences perception before a single word is read. Understanding color psychology is essential for creating effective user experiences.</p>
        <p class="mb-4"><strong>Blue: Trust and Stability</strong><br>Often used by financial institutions and technology companies, blue evokes feelings of calmness, security, and professionalism.</p>
        <p class="mb-4"><strong>Red: Passion and Urgency</strong><br>Red captures attention instantly. It's associated with energy, passion, and action—perfect for call-to-action buttons or clearance sales, but should be used sparingly to avoid overwhelming the user.</p>
        <p><strong>Yellow: Optimism and Caution</strong><br>Yellow is the color of happiness and creativity, but it can also signal warning. In UI design, it's often used for highlighting important information without the severity of red.</p>
      `
    },
    typography: {
      title: 'Typography Rules Every Designer Should Break',
      category: 'Typography',
      date: 'Aug 05, 2024',
      readTime: '6 min read',
      author: 'Reshad Aslanov',
      img: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&auto=format&fit=crop',
      content: `
        <p class="mb-4">Typography is governed by a strict set of rules—kerning, leading, hierarchy, and legibility. However, some of the most impactful and memorable designs come from knowing exactly when and how to break these rules.</p>
        <p class="mb-4"><strong>Expressive Type</strong><br>Sometimes, legibility takes a backseat to expression. Distorted, overlapping, or extremely tight typography can evoke specific moods—chaos, speed, or suffocation—that standard setting cannot.</p>
        <p class="mb-4"><strong>Mixing Clashing Fonts</strong><br>Convention says to pair a serif with a sans-serif. But pairing two similar serifs or clashing display fonts can create a brutalist, avant-garde aesthetic that stands out in a sea of clean, minimal design.</p>
        <p><strong>The Takeaway</strong><br>Rules are there to ensure functionality. Once you master them, you earn the right to break them. The key is intent; ensure your choices serve the concept, not just the aesthetic.</p>
      `
    }
  };

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const blogKey = card.getAttribute('data-blog');
      const data = blogData[blogKey];
      if (!data) return;

      const modalImg = document.getElementById('modal-img');
      const modal = document.getElementById('project-modal');
      const modalContent = modal.querySelector('.modal-content');

      // Populate Main Data
      modalImg.src = data.img;
      modalImg.alt = data.title;
      document.getElementById('modal-category').textContent = 'Article'; // Overridden below
      document.getElementById('modal-title').textContent = data.title;
      // Use innerHTML for rich text content
      document.getElementById('modal-desc').innerHTML = data.content;

      // Adapt Grid for Blog
      const grid = modal.querySelector('.grid');
      if (grid) {
        const col1 = grid.children[0];
        const col2 = grid.children[1];
        const col3 = grid.children[2];
        const col4 = grid.children[3];

        // 1. Client -> Topic
        if (col1.querySelector('p:first-child')) col1.querySelector('p:first-child').textContent = 'Topic';
        document.getElementById('modal-client').textContent = data.category; // Reuse ID

        // 2. Year -> Date
        if (col2.querySelector('p:first-child')) col2.querySelector('p:first-child').textContent = 'Date';
        document.getElementById('modal-year').textContent = data.date;
        col2.style.display = 'block'; // Ensure visible (Services hides it)

        // 3. Category -> Read Time
        if (col3.querySelector('p:first-child')) col3.querySelector('p:first-child').textContent = 'Read Time';
        document.getElementById('modal-type').textContent = data.readTime;

        // 4. Tools -> Author
        if (col4.querySelector('p:first-child')) col4.querySelector('p:first-child').textContent = 'Author';
        document.getElementById('modal-tools').textContent = data.author;
      }

      // Show Modal
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      if (modalContent) modalContent.classList.remove('scale-95');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    });
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
    if (modalContent) modalContent.classList.add('scale-95');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    modal.removeAttribute('aria-modal');

    // Reset Modal State (Restore Project Fields)
    setTimeout(() => {
      const grid = modal.querySelector('.grid');
      if (grid) {
        const col1 = grid.children[0];
        const col2 = grid.children[1];
        const col3 = grid.children[2];
        const col4 = grid.children[3];

        // Restore Labels
        if (col1.querySelector('p:first-child')) col1.querySelector('p:first-child').textContent = 'Client';
        if (col2.querySelector('p:first-child')) col2.querySelector('p:first-child').textContent = 'Year';
        if (col3.querySelector('p:first-child')) col3.querySelector('p:first-child').textContent = 'Category';
        if (col4.querySelector('p:first-child')) col4.querySelector('p:first-child').textContent = 'Tools';

        // Restore Visibility
        col2.style.display = 'block';

        // Clear/Reset Values
        document.getElementById('modal-client').textContent = '';
        document.getElementById('modal-year').textContent = '';
        document.getElementById('modal-type').textContent = '';
        document.getElementById('modal-tools').textContent = '';
        document.getElementById('modal-desc').innerHTML = ''; // Clear rich text
      }
    }, 300);
  }

  const modalCloseBtn = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ===== Magnetic Social Icons =====
  document.querySelectorAll('[aria-label="Instagram"], [aria-label="Behance"], [aria-label="Dribbble"], [aria-label="LinkedIn"]').forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
      const rect = icon.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      icon.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    icon.addEventListener('mouseleave', () => { icon.style.transform = 'translate(0, 0)'; });
  });

  // ===== Magnetic Button Effect =====
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0, 0)'; });
  });

  // ===== Dark / Light Mode Toggle =====
  const themeToggle = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  let isDark = true;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isDark = !isDark;
      document.body.classList.toggle('light-mode', !isDark);
      if (iconMoon && iconSun) {
        iconMoon.classList.toggle('hidden', !isDark);
        iconSun.classList.toggle('hidden', isDark);
      }
      // ARIA live announcement
      const announcement = document.getElementById('aria-live');
      if (announcement) announcement.textContent = `Switched to ${isDark ? 'dark' : 'light'} mode`;
    });
  }

  // ===== Lazy Loading Images =====
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  // ===== Contact form (Formspree AJAX) =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="animate-pulse">Sending...</span>';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST', body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          btn.innerHTML = '✓ Message Sent';
          btn.style.borderColor = '#d4a853';
          btn.style.background = 'rgba(212,168,83,0.1)';
          form.reset();
          setTimeout(() => { btn.innerHTML = originalHTML; btn.style.borderColor = ''; btn.style.background = ''; btn.disabled = false; }, 4000);
        } else throw new Error('Form submission failed');
      } catch (err) {
        btn.innerHTML = '✕ Error — Try Again';
        btn.style.borderColor = '#ef4444';
        setTimeout(() => { btn.innerHTML = originalHTML; btn.style.borderColor = ''; btn.disabled = false; }, 3000);
      }
    });
  }

  // ===== Cookie Consent =====
  const cookieConsent = document.getElementById('cookie-consent');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieConsent && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieConsent.style.transform = 'translateY(0)';
    }, 2500);
  }

  function dismissCookie(accepted) {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    if (cookieConsent) cookieConsent.style.transform = 'translateY(100%)';
  }

  if (cookieAccept) cookieAccept.addEventListener('click', () => dismissCookie(true));
  if (cookieDecline) cookieDecline.addEventListener('click', () => dismissCookie(false));

  // ===== PWA Service Worker Registration =====
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    });
  }

  // ===== ARIA Live Region =====
  if (!document.getElementById('aria-live')) {
    const ariaLive = document.createElement('div');
    ariaLive.id = 'aria-live';
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';
    document.body.appendChild(ariaLive);
  }

  // ===== Keyboard Navigation Enhancement =====
  // Focus visible styles are handled in CSS
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // ===== Page Transition on Link Click =====
  document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
        e.preventDefault();
        const pageTransition = document.getElementById('page-transition');
        if (pageTransition && hasGSAP && !prefersReducedMotion) {
          gsap.fromTo(pageTransition,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.5, ease: 'power4.inOut', onComplete: () => { window.location.href = href; } }
          );
        } else {
          window.location.href = href;
        }
      }
    });
  });

});
