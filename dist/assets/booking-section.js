(function () {
  'use strict';
  const C = window.ORDINACIJA, section = document.querySelector('#zakazivanje');
  if (!section) return;
  const $ = selector => section.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const availability = window.AureaBookingAvailability.createDemo(C.demo), range = availability.getRange();
  const monthFormat = new Intl.DateTimeFormat('sr-Latn-RS', {month:'long',year:'numeric'});
  const dateFormat = new Intl.DateTimeFormat('sr-Latn-RS', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const initialMonth = new Date(range.start.getFullYear(),range.start.getMonth(),1);
  let month = new Date(initialMonth), state = {service:'',doctor:'',date:null,time:''};
  const serviceSelect = $('#booking-service'), doctorSelect = $('#booking-doctor');
  serviceSelect.innerHTML += C.usluge.map(s => `<option value="${escape(s.id)}">${escape(s.naziv)}</option>`).join('');
  doctorSelect.innerHTML += C.doktori.map(d => `<option value="${escape(d.id)}">${escape(d.ime)}</option>`).join('');
  const slotsFor = date => availability.getSlots({date,service:state.service,doctor:state.doctor});
  const sameDate = (a,b) => !!a && !!b && a.getTime() === b.getTime();
  function invalidateConfirmation() {
    $('#booking-result').hidden = true;
    $('#booking-confirm').disabled = false;
    $('#booking-confirm').innerHTML = 'Potvrdite pregled <span aria-hidden="true">↗</span>';
    $('#booking-error').textContent = '';
  }
  function syncSelection() {
    if (state.date && !slotsFor(state.date).some(slot => slot.available)) { state.date = null; state.time = ''; }
    if (state.date && state.time && !slotsFor(state.date).some(slot => slot.available && slot.time === state.time)) state.time = '';
    renderCalendar(); renderTimes(); renderSummary();
  }
  function renderCalendar() {
    $('#calendar-month').textContent = monthFormat.format(month);
    const days = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    const offset = (month.getDay()+6)%7, fragment = document.createDocumentFragment();
    for (let i=0;i<offset;i++) {const spacer=document.createElement('span');spacer.setAttribute('aria-hidden','true');fragment.append(spacer);}
    let hasTabStop = false;
    const selectedMonth = state.date && state.date.getMonth() === month.getMonth() && state.date.getFullYear() === month.getFullYear();
    for (let day=1;day<=days;day++) {
      const date = new Date(month.getFullYear(),month.getMonth(),day), button = document.createElement('button');
      const available = date >= range.start && date <= range.end && slotsFor(date).some(slot => slot.available);
      const selected = sameDate(state.date,date);
      button.type='button';button.textContent=day;button.dataset.day=day;button.disabled=!available;
      button.setAttribute('aria-label',dateFormat.format(date)+(available?'':' — nedostupno'));
      button.setAttribute('aria-pressed',String(selected));
      if (sameDate(date,range.start)) button.setAttribute('aria-current','date');
      button.tabIndex = available && (selected || (!selectedMonth && !hasTabStop)) ? 0 : -1;
      if (button.tabIndex===0) hasTabStop=true;
      button.addEventListener('click',()=>{
        state.date=date;state.time='';invalidateConfirmation();syncSelection();
        $('#calendar-days [aria-pressed="true"]').focus({preventScroll:true});
      });
      fragment.append(button);
    }
    $('#calendar-days').replaceChildren(fragment);
    $('#month-prev').disabled = month <= initialMonth;
    $('#month-next').disabled = month.getFullYear() === range.end.getFullYear() && month.getMonth() >= range.end.getMonth();
  }
  $('#calendar-days').addEventListener('keydown',e=>{
    const move={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
    if(!move || !e.target.matches('button[data-day]')) return;
    e.preventDefault();
    let day=Number(e.target.dataset.day)+move;
    const lastDay=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    while(day>=1 && day<=lastDay) {
      const target=$(`#calendar-days button[data-day="${day}"]`);
      if(target && !target.disabled){target.focus({preventScroll:true});break;}
      day += Math.sign(move);
    }
  });
  $('#month-prev').addEventListener('click',()=>{month.setMonth(month.getMonth()-1);renderCalendar();});
  $('#month-next').addEventListener('click',()=>{month.setMonth(month.getMonth()+1);renderCalendar();});
  function renderTimes() {
    const container = $('#time-options'); container.replaceChildren();
    $('#time-help').textContent = state.date ? dateFormat.format(state.date)+' · demo dostupnost' : 'Prvo odaberite datum u kalendaru.';
    if(!state.date) {container.innerHTML='<p class="time-placeholder">Slobodni termini će se prikazati nakon izbora datuma.</p>';return;}
    const slots=slotsFor(state.date);
    slots.forEach(slot=>{
      const button=document.createElement('button');button.type='button';button.textContent=slot.time;
      button.dataset.time=slot.time;button.disabled=!slot.available;
      button.setAttribute('aria-label',slot.time+(slot.available?'':' — nedostupno u demo rasporedu'));
      button.setAttribute('aria-pressed',String(state.time===slot.time));
      button.addEventListener('click',()=>{
        state.time=slot.time;invalidateConfirmation();renderTimes();renderSummary();
        $('#time-options [aria-pressed="true"]').focus({preventScroll:true});
      });container.append(button);
    });
  }
  function renderSummary() {
    const service=C.usluge.find(s=>s.id===state.service),doctor=C.doktori.find(d=>d.id===state.doctor);
    const rows=[['Datum',state.date?dateFormat.format(state.date):'Izaberite datum'],['Vreme',state.time||'Izaberite vreme'],['Lekar',doctor?doctor.ime:'Bilo koji lekar'],['Pregled',service?service.naziv:'Izaberite pregled']];
    $('#booking-summary').innerHTML=rows.map(([label,value])=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('');
  }
  serviceSelect.addEventListener('change',()=>{state.service=serviceSelect.value;invalidateConfirmation();syncSelection();});
  doctorSelect.addEventListener('change',()=>{state.doctor=doctorSelect.value;invalidateConfirmation();syncSelection();});
  $('#booking-form').addEventListener('submit',e=>{
    e.preventDefault();let error='',focusTarget=null;
    if(!state.date){error='Izaberite datum pregleda.';focusTarget=$('#calendar-days button:not(:disabled)')||$('#month-next');}
    else if(!state.time){error='Izaberite vreme pregleda.';focusTarget=$('#time-options button:not(:disabled)');}
    else if(!state.service){error='Izaberite vrstu pregleda.';focusTarget=serviceSelect;}
    else if(!slotsFor(state.date).some(s=>s.available && s.time===state.time)){state.time='';syncSelection();error='Ovaj termin više nije dostupan. Izaberite drugo vreme.';focusTarget=$('#time-options button:not(:disabled)');}
    if(error){$('#booking-error').textContent=error;if(focusTarget)focusTarget.focus({preventScroll:true});return;}
    $('#booking-error').textContent='';$('#booking-result').hidden=false;$('#booking-confirm').disabled=true;
    $('#booking-confirm').textContent='Potvrđeno u demo prikazu ✓';
  });
  function open(options={}) {
    let changed=false;
    if(options.service && C.usluge.some(s=>s.id===options.service)){state.service=options.service;serviceSelect.value=state.service;changed=true;}
    if(options.doctor && C.doktori.some(d=>d.id===options.doctor)){state.doctor=options.doctor;doctorSelect.value=state.doctor;changed=true;}
    if(changed){invalidateConfirmation();syncSelection();}
    const header=document.querySelector('#header');header.classList.remove('menu-open');
    const toggle=document.querySelector('#menu-toggle');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Otvorite meni');
    if(location.hash!=='#zakazivanje') history.pushState(null,'','#zakazivanje');
    $('#booking-heading').focus({preventScroll:true});
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-book]');if(!button)return;
    e.preventDefault();open({doctor:button.dataset.doctor,service:button.dataset.service});
  });
  window.VizusBooking={open};syncSelection();
})();
