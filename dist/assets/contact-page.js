(function () {
  'use strict';
  const header=document.querySelector('#header'),menuButton=document.querySelector('#menu-toggle');
  function menu(open){header.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Zatvorite meni':'Otvorite meni');}
  menuButton.addEventListener('click',()=>menu(menuButton.getAttribute('aria-expanded')!=='true'));
  document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>menu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && header.classList.contains('menu-open')){menu(false);menuButton.focus();}});
  const form=document.querySelector('#contact-form'),result=document.querySelector('#contact-result');
  form.addEventListener('input',()=>{result.hidden=true;});
  form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const name=form.elements.ime.value.trim(),email=form.elements.email.value.trim(),message=form.elements.poruka.value.trim();
    if(!name){form.elements.ime.setCustomValidity('Unesite ime i prezime.');form.elements.ime.reportValidity();return;}
    if(message.length<10){form.elements.poruka.setCustomValidity('Unesite poruku sa najmanje 10 znakova.');form.elements.poruka.reportValidity();return;}
    const body=`Ime i prezime: ${name}\nEmail: ${email}\nTelefon: ${form.elements.telefon.value.trim() || 'Nije naveden'}\n\n${message}`;
    document.querySelector('#contact-email-link').href='mailto:kgvizus@gmail.com?subject='+encodeURIComponent('Upit preko sajta VIZUS — '+form.elements.tema.value)+'&body='+encodeURIComponent(body);
    result.hidden=false;
  });
  [form.elements.ime,form.elements.poruka].forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
})();
