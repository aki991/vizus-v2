(function () {
  'use strict';
  const header=document.querySelector('#header'),menuButton=document.querySelector('#menu-toggle');
  function menu(open){header.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Zatvorite meni':'Otvorite meni');}
  menuButton.addEventListener('click',()=>menu(menuButton.getAttribute('aria-expanded')!=='true'));
  document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>menu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && header.classList.contains('menu-open')){menu(false);menuButton.focus();}});
  const form=document.querySelector('#contact-form'),result=document.querySelector('#contact-result');
  const endpoint=(form.dataset.endpoint||'').trim(),submit=document.querySelector('#contact-submit'),emailLink=document.querySelector('#contact-email-link');
  const resultTitle=document.querySelector('#contact-result-title'),resultText=document.querySelector('#contact-result-text');
  // With a form endpoint (e.g. Formspree) the message is sent directly; otherwise an email draft is prepared.
  if(endpoint){submit.textContent='Pošaljite poruku';document.querySelector('#contact-form-note').textContent='Poruka stiže direktno ordinaciji. Odgovor šaljemo na vašu email adresu.';}
  function showResult(title,text,withLink){resultTitle.textContent=title;resultText.textContent=text;emailLink.hidden=!withLink;result.hidden=false;}
  form.addEventListener('input',()=>{result.hidden=true;});
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const name=form.elements.ime.value.trim(),email=form.elements.email.value.trim(),message=form.elements.poruka.value.trim();
    if(!name){form.elements.ime.setCustomValidity('Unesite ime i prezime.');form.elements.ime.reportValidity();return;}
    if(message.length<10){form.elements.poruka.setCustomValidity('Unesite poruku sa najmanje 10 znakova.');form.elements.poruka.reportValidity();return;}
    const body=`Ime i prezime: ${name}\nEmail: ${email}\nTelefon: ${form.elements.telefon.value.trim() || 'Nije naveden'}\n\n${message}`;
    emailLink.href='mailto:kgvizus@gmail.com?subject='+encodeURIComponent('Upit preko sajta VIZUS — '+form.elements.tema.value)+'&body='+encodeURIComponent(body);
    if(!endpoint){showResult('Poruka je spremna za slanje.','Otvorite svoju email aplikaciju i pošaljite pripremljenu poruku ordinaciji.',true);return;}
    const label=submit.textContent;submit.disabled=true;submit.textContent='Slanje…';
    try{
      const data=new FormData(form);data.append('_subject','Upit preko sajta VIZUS — '+form.elements.tema.value);
      const response=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(String(response.status));
      form.reset();showResult('Poruka je poslata.','Hvala! Ordinacija će vam odgovoriti na navedenu email adresu.',false);
    }catch(_){
      showResult('Poruka nije poslata.','Došlo je do greške pri slanju. Pošaljite poruku preko svoje email aplikacije ili nas pozovite na 034 / 330-505.',true);
    }finally{submit.disabled=false;submit.textContent=label;}
  });
  [form.elements.ime,form.elements.poruka].forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
})();
// Google Maps iframes are heavy: start them only after the page itself has loaded,
// and only once each map is near the viewport.
(function () {
  'use strict';
  const maps = Array.from(document.querySelectorAll('iframe.deferred-map[data-src]'));
  if (!maps.length) return;
  function load(frame) { if (frame.dataset.src) { frame.src = frame.dataset.src; delete frame.dataset.src; } }
  function start() {
    if (!('IntersectionObserver' in window)) { maps.forEach(load); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); }
    }), { rootMargin: '300px 0px' });
    maps.forEach(frame => observer.observe(frame));
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
})();
