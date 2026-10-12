// Desktop only: lay the header and hero out at a 1920px reference width, then
// zoom them to the real viewport so every desktop resolution shows the same composition.
(function () {
  var root = document.documentElement, desktop = window.matchMedia('(min-width: 1201px)');
  // MIN_SCALE keeps text readable on small laptops (1280px wide shows the hero at 75%).
  var REF_WIDTH = 1920, MIN_REF_HEIGHT = 860, MIN_SCALE = 0.75;
  function update() {
    if (!desktop.matches) { root.classList.remove('hero-scaled'); return; }
    var w = root.clientWidth || window.innerWidth, h = window.innerHeight;
    var scale = Math.max(MIN_SCALE, Math.min(w / REF_WIDTH, h / MIN_REF_HEIGHT));
    root.style.setProperty('--hero-scale', scale.toFixed(4));
    root.style.setProperty('--hero-h', (h / scale).toFixed(1) + 'px');
    root.classList.add('hero-scaled');
  }
  update();
  window.addEventListener('resize', update);
  window.addEventListener('DOMContentLoaded', update);
})();
