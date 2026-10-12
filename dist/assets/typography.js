(function () {
  'use strict';
  const storageKey = 'vizus-heading-font';
  const valid = value => value === 'reference' || value === 'classic';
  // Apply the saved preference before styles render, avoiding a font flash.
  try {
    const saved = localStorage.getItem(storageKey);
    if (valid(saved)) document.documentElement.dataset.typography = saved;
  } catch (_) { /* The switch still works when browser storage is unavailable. */ }
  document.addEventListener('DOMContentLoaded', function () {
    const buttons = Array.from(document.querySelectorAll('[data-font-option]'));
    function sync() {
      const current = document.documentElement.dataset.typography;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fontOption === current)));
      const status = document.querySelector('#font-preview-status');
      if (status) status.textContent = current === 'classic'
        ? 'Prikazuje se prethodni font: Cormorant Garamond.'
        : 'Prikazuje se novi font: Georgia.';
    }
    buttons.forEach(button => button.addEventListener('click', function () {
      const next = button.dataset.fontOption;
      if (!valid(next)) return;
      document.documentElement.dataset.typography = next;
      try { localStorage.setItem(storageKey, next); } catch (_) { /* Optional persistence. */ }
      sync();
    }));
    sync();
  });
})();
