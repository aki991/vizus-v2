(function(){
  'use strict';
  const section=document.querySelector('#iskustva');if(!section)return;
  // All four entries are illustrative demo copy, never real patient reviews.
  const reviews=[
    {name:'Marko P.',image:'assets/iskustvo-marko.webp',text:'Profesionalan pristup i prijatan razgovor. Dobio sam jasno objašnjenje svakog koraka pregleda.'},
    {name:'Jelena M.',image:'assets/iskustvo-jelena.webp',text:'Pažljiv tim i prostor za sva moja pitanja. Posebno mi znači kada su preporuke objašnjene razumljivo.'},
    {name:'Milica S.',image:'assets/iskustvo-milica.webp',text:'Jednostavan izbor termina i prijatna atmosfera. Dopala mi se pažnja pri razgovoru o mom vidu.'},
    {name:'Petar J.',image:'assets/iskustvo-petar.webp',text:'Ljubaznost i strpljenje od prvog razgovora. Sve informacije o pregledu bile su jasne i pregledne.'}
  ];
  const viewport=section.querySelector('#testimonial-viewport'),dots=section.querySelector('#testimonial-dots');
  const mobile=matchMedia('(max-width:700px)');let current=1,startX=null;
  viewport.innerHTML=reviews.map((r,i)=>`<article class="testimonial-card" data-review="${i}" role="group" aria-roledescription="slajd" aria-label="${i+1} od 4 — ${r.name}, demo komentar"><img class="testimonial-avatar" src="${r.image}" alt="AI portret za ilustrativni komentar ${r.name}" loading="lazy" width="96" height="96"><p class="testimonial-stars" aria-label="5 od 5 zvezdica"><span aria-hidden="true">★★★★★</span></p><blockquote>${r.text}</blockquote><cite>– ${r.name}</cite><span class="testimonial-demo-label">Primer komentara · demo</span></article>`).join('');
  dots.innerHTML=reviews.map((r,i)=>`<button class="testimonial-dot" type="button" data-review-index="${i}" aria-label="Prikažite komentar ${r.name}" aria-pressed="false"></button>`).join('');
  const cards=Array.from(viewport.children),dotButtons=Array.from(dots.children);
  function render(announce=false){
    const prev=(current+reviews.length-1)%reviews.length,next=(current+1)%reviews.length;
    cards.forEach((card,i)=>{
      const position=i===current?'center':i===prev?'left':i===next?'right':'hidden';
      card.className='testimonial-card is-'+position;
      card.setAttribute('aria-hidden',String(position==='hidden'||(mobile.matches&&i!==current)));
    });
    dotButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
    if(announce)section.querySelector('#testimonial-status').textContent=`Komentar ${current+1} od ${reviews.length}. ${reviews[current].name}. Ilustrativni demo komentar.`;
  }
  function move(direction){current=(current+direction+reviews.length)%reviews.length;render(true);}
  section.querySelectorAll('[data-testimonial-direction]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.testimonialDirection))));
  dotButtons.forEach((button,i)=>button.addEventListener('click',()=>{current=i;render(true);}));
  section.querySelector('.testimonial-carousel').addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}
  });
  viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')startX=event.clientX;});
  viewport.addEventListener('pointerup',event=>{if(startX===null)return;const delta=event.clientX-startX;startX=null;if(Math.abs(delta)>40)move(delta<0?1:-1);});
  viewport.addEventListener('pointercancel',()=>{startX=null;});mobile.addEventListener('change',()=>render());render();
})();
