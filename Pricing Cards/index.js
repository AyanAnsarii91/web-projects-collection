document.addEventListener('scroll', function() {
  document.documentElement.classList.add('scrolling');
  clearTimeout(window.scrollEndTimer);
  window.scrollEndTimer = setTimeout(function() {
    document.documentElement.classList.remove('scrolling');
  }, 500);
}, { passive: true });