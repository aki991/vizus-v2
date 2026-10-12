(function () {
  'use strict';
  const C = window.ORDINACIJA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  document.documentElement.classList.add('js');
  const serviceIcons = {
    pregled: '<path d="M3 20s6-9 17-9 17 9 17 9-6 9-17 9S3 20 3 20Z"/><circle cx="20" cy="20" r="7"/><path d="M20 16a4 4 0 1 1-4 4"/>',
    dioptrija: '<path d="M3 16h11l2 3-2 8H7l-3-3-1-8Zm21 0h13l-1 8-3 3h-7l-2-8Zm-8 3c2-2 6-2 8 0M3 16l-1-2m35 2 1-2"/>',
    pritisak: '<path d="M5 24a15 15 0 1 1 30 0M20 6v4M9 11l3 3M31 11l-3 3M5 20h4M35 20h-4M20 26V13l6 8"/><circle cx="20" cy="29" r="3"/><path d="M12 34h16"/>',
    konsultacija: '<circle cx="20" cy="11" r="4"/><path d="M12 22v-2a8 8 0 0 1 16 0v2"/><circle cx="9" cy="25" r="3"/><circle cx="31" cy="25" r="3"/><path d="M3 35v-3a6 6 0 0 1 12 0v3H3Zm22 0v-3a6 6 0 0 1 12 0v3H25ZM17 28h6m-3-3v6"/>'
  };
  $('#service-list').innerHTML = C.usluge.map(s => `<article class="v2-service reveal"><div class="v2-service-image"><img src="${escape(s.slika)}" alt="${escape(s.alt)}" loading="lazy" width="1536" height="1024"><span class="v2-service-icon" aria-hidden="true"><svg viewBox="0 0 40 40">${serviceIcons[s.id] || serviceIcons.pregled}</svg></span></div><div class="v2-service-body"><h3>${escape(s.naziv)}</h3><p>${escape(s.opis)}</p><button class="v2-btn v2-btn-solid v2-btn-small" type="button" data-book data-service="${escape(s.id)}">Izaberite pregled</button></div></article>`).join('');
  // Team cards: the photo opens the full profile, "Zakaži" opens booking with that doctor.
  $('#team-list').innerHTML = C.doktori.map((d, i) => `<article class="v2-doctor reveal"><button class="v2-doctor-photo" type="button" data-profile="${i}" aria-label="Profil: ${escape(d.ime)}"><img src="${escape(d.figura)}" alt="" loading="lazy" width="900" height="1350"></button><div class="v2-doctor-body"><h3>${escape(d.ime)}</h3><p>${escape(d.oblast)}</p><button class="v2-btn v2-btn-solid v2-btn-xs" type="button" data-book data-doctor="${escape(d.id)}">Zakaži</button></div></article>`).join('');
  // The mobile menu uses normal anchor navigation; Escape restores focus.
  const header = $('#header'), menuButton = $('#menu-toggle');
  function updateHeaderTone() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', updateHeaderTone, {passive:true});
  updateHeaderTone();
  function menu(open) {
    header.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Zatvorite meni' : 'Otvorite meni');
  }
  menuButton.addEventListener('click', () => menu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#navigation a').forEach(a => a.addEventListener('click', () => menu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { menu(false); menuButton.focus(); }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .08 });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('is-visible'));

  // Full doctor profile dialog, opened from the team cards.
  const profileDialog = $('#doctor-profile-dialog');
  let currentDoctor = 0, profileTrigger = null;
  function openProfile(index, button) {
    currentDoctor = index;
    const doctor = C.doktori[index];
    profileTrigger = button;
    $('#doctor-profile-title').textContent = doctor.ime;
    $('#doctor-profile-bio').innerHTML = `<p class="profile-intro">${escape(doctor.bio)}</p>` + doctor.profil.map(section => `<section class="profile-section"><h3>${escape(section.naslov)}</h3><p>${escape(section.tekst)}</p></section>`).join('');
    $('#doctor-profile-image').innerHTML = `<img src="${escape(doctor.figura)}" alt="AI lik za demo: ${escape(doctor.ime)}" width="768" height="1024">`;
    profileDialog.showModal(); document.body.classList.add('modal-open');
  }
  $$('[data-profile]').forEach(button => button.addEventListener('click', () => openProfile(Number(button.dataset.profile), button)));
  $('#doctor-profile-close').addEventListener('click', () => profileDialog.close());
  profileDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (profileTrigger) profileTrigger.focus({preventScroll:true});
  });
  $('#profile-book').addEventListener('click', () => {
    profileDialog.close(); window.VizusBooking.open({doctor: C.doktori[currentDoctor].id});
  });
})();
