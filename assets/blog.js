// Shared behavior for blog pages — theme toggle, mobile nav, scroll reveal.
// Keeps the dark-mode preference in sync with the main site (same localStorage key).

(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) root.setAttribute('data-theme', 'dark');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
          root.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        } else {
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    }

    var navToggle = document.getElementById('navToggleBtn');
    var navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () { navLinks.classList.toggle('open'); });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { navLinks.classList.remove('open'); });
      });
    }

    var els = document.querySelectorAll('.reveal, .reveal-stagger');
    if (els.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }

    var bar = document.getElementById('progressBar');
    if (bar) {
      window.addEventListener('scroll', function () {
        var h = document.documentElement;
        var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        bar.style.width = scrolled + '%';
      }, { passive: true });
    }

    // Ambient blob parallax (desktop pointer only, respects reduced motion) — matches main site
    var accents = document.querySelectorAll('.bg-accent span');
    var fine = window.matchMedia('(pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (accents.length && fine && !reduceMotion) {
      window.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5);
        var y = (e.clientY / window.innerHeight - 0.5);
        accents.forEach(function (el, i) {
          var depth = (i + 1) * 12;
          el.style.transform = 'translate3d(' + (x * depth).toFixed(1) + 'px,' + (y * depth).toFixed(1) + 'px,0)';
        });
      }, { passive: true });
    }
  });
})();
