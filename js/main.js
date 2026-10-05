// Sticky nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach((el) => io.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.classList.toggle('active', isOpen);
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
  });
});

// Floating device: tilt toward the cursor (desktop pointers only)
(() => {
  const stages = document.querySelectorAll('.device-stage');
  if (!stages.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let frame = 0;
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  window.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      stages.forEach((stage) => {
        const r = stage.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const nx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
        const ny = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
        const tilt = stage.querySelector('.device-tilt');
        tilt.style.setProperty('--ry', (nx * 16).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', (-ny * 10).toFixed(2) + 'deg');
      });
    });
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    stages.forEach((s) => {
      const tilt = s.querySelector('.device-tilt');
      tilt.style.setProperty('--ry', '0deg');
      tilt.style.setProperty('--rx', '0deg');
    });
  });
})();
