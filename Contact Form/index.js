 (function () {
            const toggleBtn = document.querySelector('.navbar__toggle');
            const menu = document.getElementById('navbar-menu');

            toggleBtn.addEventListener('click', () => {
                const expanded = toggleBtn.getAttribute('aria-expanded') === 'true' || false;
                toggleBtn.setAttribute('aria-expanded', !expanded);
                menu.classList.toggle('navbar__menu--open');
            });
        })();

document.addEventListener('scroll', function() {
  document.documentElement.classList.add('scrolling');
  clearTimeout(window.scrollEndTimer);
  window.scrollEndTimer = setTimeout(function() {
    document.documentElement.classList.remove('scrolling');
  }, 500);
}, { passive: true });