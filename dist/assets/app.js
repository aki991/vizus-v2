(function () {
  'use strict';
  const C = window.ORDINACIJA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  document.documentElement.classList.add('js');
  const portrait = (doctor, lazy = true) => `<div class="portrait video-portrait"><img src="${escape(doctor.portret)}" alt="Portret iz dostavljenog videa: ${escape(doctor.ime)} · demo ime" ${lazy ? 'loading="lazy"' : ''} width="300" height="300"></div>`;
  $('#doctor-figures').innerHTML = C.doktori.map((d, i) => `<button class="lik" type="button" data-index="${i}" aria-label="Izaberite: ${escape(d.ime)}"><img src="${escape(d.figura)}" alt="AI lik za demo: ${escape(d.ime)}" loading="lazy" width="768" height="1024"></button>`).join('');
  $('#doctor-list').innerHTML = C.doktori.map((d, i) => `<button class="hud-stavka" type="button" data-index="${i}" aria-pressed="false">${portrait(d)}<span><span class="hud-ime">${escape(d.ime)}</span><span class="hud-spec">${escape(d.oblast)} · demo</span></span></button>`).join('');
  $('#service-list').innerHTML = C.usluge.map(s => `<article class="service-card reveal"><div class="service-image"><img src="${escape(s.slika)}" alt="${escape(s.alt)}" loading="lazy" width="1536" height="1024"><span class="service-number">${s.broj}</span></div><div class="service-copy"><h3>${escape(s.naziv)}</h3><p>${escape(s.opis)}</p><button class="service-link" type="button" data-book data-service="${escape(s.id)}">Izaberite pregled <span class="service-arrow" aria-hidden="true">↗</span></button></div></article>`).join('');
  $('#booking-services').innerHTML = C.usluge.map(s => `<button class="booking-service" type="button" data-service="${s.id}" aria-pressed="false">${escape(s.naziv)}<span aria-hidden="true">○</span></button>`).join('');
  $('#booking-doctor').innerHTML = '<option value="">Bilo koji lekar</option>' + C.doktori.map(d => `<option value="${d.id}">${escape(d.ime)} · demo profil</option>`).join('');
  // The mobile menu uses normal anchor navigation; Escape restores focus.
  const header = $('#header'), menuButton = $('#menu-toggle');
  function updateHeaderTone() {
    header.classList.toggle('header-light', $('#pocetna').getBoundingClientRect().bottom <= header.offsetHeight + 24);
  }
  window.addEventListener('scroll', updateHeaderTone, {passive:true});
  window.addEventListener('resize', updateHeaderTone);
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

  // Motion is GPU-friendly CSS. No WebGL dependency or permanent JS render loop.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('#pocetna'), scene = $('#eye-scene'), visual = $('#hero-visual'), motionButton = $('#motion-toggle');
  let userPaused = false;
  function pauseMotion() {
    hero.classList.toggle('motion-paused', userPaused || reducedMotion.matches);
    motionButton.setAttribute('aria-pressed', String(userPaused));
    motionButton.setAttribute('aria-label', userPaused ? 'Pokrenite animaciju oka' : 'Pauzirajte animaciju oka');
  }
  motionButton.addEventListener('click', () => { userPaused = !userPaused; pauseMotion(); });
  reducedMotion.addEventListener('change', pauseMotion);
  pauseMotion();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      hero.classList.toggle('motion-offscreen', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => hero.classList.toggle('motion-offscreen', document.hidden));
  visual.addEventListener('pointermove', e => {
    if (reducedMotion.matches || userPaused || e.pointerType !== 'mouse') return;
    const r = visual.getBoundingClientRect();
    scene.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 7}deg`);
    scene.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 9}deg`);
  });
  visual.addEventListener('pointerleave', () => { scene.style.setProperty('--rx', '0deg'); scene.style.setProperty('--ry', '0deg'); });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .08 });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('is-visible'));

  // Keep the existing template's availability contract, with an explicit demo schedule.
  const availability = window.AureaBookingAvailability.createDemo(C.demo);
  const range = availability.getRange();
  const dialog = $('#booking-dialog'), form = $('#booking-form');
  const dateFormat = new Intl.DateTimeFormat('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long' });
  const monthFormat = new Intl.DateTimeFormat('sr-Latn-RS', { month: 'long', year: 'numeric' });
  const initialMonth = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
  let state, step, month, trigger;
  function resetState(doctor = '', service = '') {
    state = { doctor, service, date: null, time: '' };
    step = 1; month = new Date(initialMonth);
    $('#booking-doctor').value = doctor;
    $('#booking-success').hidden = true; form.hidden = false;
    syncServices(); renderCalendar(); renderTimes(); showStep(1, false);
  }
  function openBooking(button, doctor = '', service = '') {
    trigger = button; menu(false); resetState(doctor, service);
    dialog.showModal(); document.body.classList.add('modal-open');
    $('#step-one-heading').focus({ preventScroll: true });
  }
  function closeBooking() { dialog.close(); }
  $$('[data-book]').forEach(button => button.addEventListener('click', () => openBooking(button, button.dataset.doctor || '', button.dataset.service || '')));
  $('#dialog-close').addEventListener('click', closeBooking);
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) closeBooking();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open'); state = null;
    if (trigger) trigger.focus({ preventScroll: true });
  });
  // Explicit focus trap supplements the native dialog, including shifted Tab.
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('a[href],button:not(:disabled),select:not(:disabled),[tabindex="0"]', dialog).filter(el => el.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (!first) return;
    if (e.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('#booking-doctor').addEventListener('change', e => { if (state) state.doctor = e.target.value; });
  $$('.booking-service').forEach(button => button.addEventListener('click', () => {
    state.service = button.dataset.service; syncServices(); $('#booking-error').textContent = '';
  }));
  function syncServices() {
    $$('.booking-service').forEach(button => {
      const selected = button.dataset.service === state.service;
      button.setAttribute('aria-pressed', String(selected)); $('span', button).textContent = selected ? '✓' : '○';
    });
  }
  function sameDate(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }
  function renderCalendar() {
    $('#calendar-month').textContent = monthFormat.format(month);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const startOffset = (month.getDay() + 6) % 7;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < startOffset; i++) { const spacer = document.createElement('span'); spacer.setAttribute('aria-hidden', 'true'); fragment.append(spacer); }
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const hasSlots = availability.getSlots({ date, service: state.service, doctor: state.doctor }).some(s => s.available);
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = day;
      button.disabled = date < range.start || date > range.end || !hasSlots;
      button.setAttribute('aria-label', dateFormat.format(date) + (button.disabled ? ' — bez demo termina' : ''));
      button.setAttribute('aria-pressed', String(sameDate(state.date, date)));
      button.addEventListener('click', () => { state.date = date; state.time = ''; renderCalendar(); renderTimes(); $('#booking-error').textContent = ''; $('#calendar-days [aria-pressed="true"]').focus({ preventScroll: true }); });
      fragment.append(button);
    }
    $('#calendar-days').replaceChildren(fragment);
    $('#month-prev').disabled = month <= initialMonth;
    $('#month-next').disabled = month.getFullYear() > range.end.getFullYear() || (month.getFullYear() === range.end.getFullYear() && month.getMonth() >= range.end.getMonth());
  }
  $('#month-prev').addEventListener('click', () => { month.setMonth(month.getMonth() - 1); renderCalendar(); });
  $('#month-next').addEventListener('click', () => { month.setMonth(month.getMonth() + 1); renderCalendar(); });
  function renderTimes() {
    $('#time-heading').textContent = state.date ? `${dateFormat.format(state.date)} · demo termini` : 'Prvo izaberite datum';
    const container = $('#time-options'); container.replaceChildren();
    if (!state.date) return;
    const slots = availability.getSlots({ date: state.date, service: state.service, doctor: state.doctor });
    slots.forEach(slot => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = slot.time; button.disabled = !slot.available;
      button.setAttribute('aria-label', slot.time + (!slot.available ? ' — nedostupno u demo rasporedu' : ''));
      button.setAttribute('aria-pressed', String(state.time === slot.time));
      button.addEventListener('click', () => { state.time = slot.time; renderTimes(); $('#booking-error').textContent = ''; $('#time-options [aria-pressed="true"]').focus({ preventScroll: true }); });
      container.append(button);
    });
    if (!slots.some(slot => slot.available)) container.innerHTML = '<p>Za ovaj datum nema dostupnih demo termina.</p>';
  }
  function validSelection() {
    return !!state.date && !!state.time && availability.getSlots({date:state.date, service:state.service, doctor:state.doctor}).some(slot => slot.time === state.time && slot.available);
  }
  function renderSummary() {
    const doctor = C.doktori.find(d => d.id === state.doctor);
    const service = C.usluge.find(s => s.id === state.service);
    const rows = [['Pregled', service.naziv], ['Lekar', doctor ? `${doctor.ime} · demo` : 'Bilo koji lekar'], ['Datum', dateFormat.format(state.date)], ['Vreme', `${state.time} · demo termin`]];
    $('#booking-summary').innerHTML = rows.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
  }
  function showStep(number, focus = true) {
    step = number; $('#booking-error').textContent = '';
    $$('.booking-step').forEach(el => el.hidden = +el.dataset.step !== step);
    $$('.booking-progress li').forEach((el, i) => i + 1 === step ? el.setAttribute('aria-current', 'step') : el.removeAttribute('aria-current'));
    $('#booking-back').hidden = step === 1;
    $('#booking-next').textContent = step === 3 ? 'Završite demo ✓' : 'Nastavite ↗';
    if (step === 2) { renderCalendar(); renderTimes(); }
    if (step === 3) renderSummary();
    if (focus) { $(`.booking-step[data-step="${step}"] h3`).focus({ preventScroll: true }); dialog.scrollTop = 0; }
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (step === 1 && !state.service) { $('#booking-error').textContent = 'Izaberite pregled da biste nastavili.'; $('.booking-service').focus(); return; }
    if (step >= 2 && !validSelection()) { showStep(2); $('#booking-error').textContent = 'Izaberite datum i dostupan demo termin.'; return; }
    if (step < 3) { showStep(step + 1); return; }
    form.hidden = true; $('#booking-success').hidden = false;
    $('.booking-success h3').focus({ preventScroll: true }); dialog.scrollTop = 0;
  });
  $('#booking-back').addEventListener('click', () => showStep(Math.max(1, step - 1)));
  $('#booking-restart').addEventListener('click', () => { resetState(); $('#step-one-heading').focus({ preventScroll: true }); });

  // Doctor stage adapted from the user's Claude template: figures, info, list and arrows.
  const stage = $('#doctor-stage'), figures = $$('.lik', stage), doctorList = $$('.hud-stavka', stage);
  const profileDialog = $('#doctor-profile-dialog');
  let currentDoctor = 0, profileTrigger = null;
  function selectDoctor(index) {
    currentDoctor = (index + C.doktori.length) % C.doktori.length;
    const doctor = C.doktori[currentDoctor];
    figures.forEach((figure, i) => {
      const relative = (i - currentDoctor + figures.length) % figures.length;
      const offset = relative <= (figures.length - 1) / 2 ? relative : relative - figures.length;
      const distance = Math.abs(offset);
      figure.classList.toggle('aktivan', distance === 0);
      figure.classList.toggle('sporedan', distance > 0);
      figure.classList.toggle('daleko', distance > 1);
      figure.style.left = `${50 + offset * 110}%`;
      figure.style.height = '96%';
      figure.tabIndex = distance === 0 ? 0 : -1;
      figure.inert = distance !== 0;
      figure.setAttribute('aria-hidden', String(distance !== 0));
      figure.setAttribute('aria-pressed', String(distance === 0));
      figure.setAttribute('aria-label', `Izaberite: ${C.doktori[i].ime}`);
    });
    doctorList.forEach((button, i) => {
      button.classList.toggle('aktivan', i === currentDoctor);
      button.setAttribute('aria-pressed', String(i === currentDoctor));
    });
    $('#selected-doctor-name').textContent = doctor.ime;
    $('#selected-doctor-bio').textContent = doctor.bio;
    $('#selected-doctor-area').textContent = doctor.oblast;
    $('#selected-doctor-topics').innerHTML = doctor.oblasti.map(area => `<span class="cip">${escape(area)}</span>`).join('');
    $('#stage-book').dataset.doctor = doctor.id;
    $('#doctor-current').textContent = String(currentDoctor + 1).padStart(2, '0');
  }
  function openProfile(button) {
    const doctor = C.doktori[currentDoctor];
    profileTrigger = button;
    $('#doctor-profile-title').textContent = doctor.ime;
    $('#doctor-profile-bio').innerHTML = `<p class="profile-intro">${escape(doctor.bio)}</p>` + doctor.profil.map(section => `<section class="profile-section"><h3>${escape(section.naslov)}</h3><p>${escape(section.tekst)}</p></section>`).join('');
    $('#doctor-profile-image').innerHTML = `<img src="${escape(doctor.figura)}" alt="AI lik za demo: ${escape(doctor.ime)}" width="768" height="1024">`;
    profileDialog.showModal(); document.body.classList.add('modal-open');
  }
  figures.forEach((button, i) => button.addEventListener('click', () => selectDoctor(i)));
  doctorList.forEach((button, i) => button.addEventListener('click', () => selectDoctor(i)));
  $$('.strelica', stage).forEach(button => button.addEventListener('click', () => selectDoctor(currentDoctor + Number(button.dataset.direction))));
  stage.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key) || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    e.preventDefault();
    const fromFigure = e.target.closest('.lik'), fromList = e.target.closest('.hud-stavka');
    selectDoctor(currentDoctor + (e.key === 'ArrowRight' ? 1 : -1));
    if (fromFigure) figures[currentDoctor].focus({preventScroll:true});
    else if (fromList) doctorList[currentDoctor].focus({preventScroll:true});
  });
  let touchStart = null;
  $('#doctor-scene').addEventListener('touchstart', e => { touchStart = {x:e.touches[0].clientX, y:e.touches[0].clientY}; }, {passive:true});
  $('#doctor-scene').addEventListener('touchend', e => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x, dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) selectDoctor(currentDoctor + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});
  $('#doctor-scene').addEventListener('touchcancel', () => { touchStart = null; });
  $('#doctor-profile-open').addEventListener('click', e => openProfile(e.currentTarget));
  $('#doctor-profile-close').addEventListener('click', () => profileDialog.close());
  profileDialog.addEventListener('close', () => {
    if (!dialog.open) {
      document.body.classList.remove('modal-open');
      if (profileTrigger) profileTrigger.focus({preventScroll:true});
    }
  });
  $('#profile-book').addEventListener('click', () => {
    profileDialog.close(); openBooking($('#stage-book'), C.doktori[currentDoctor].id);
  });
  $('#doctor-total').textContent = String(C.doktori.length).padStart(2, '0');
  selectDoctor(0);
})();
