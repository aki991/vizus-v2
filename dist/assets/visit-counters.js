(function(){
  'use strict';
  const stats=document.querySelector('#practice-stats');
  if(!stats)return;
  const counters=Array.from(stats.querySelectorAll('[data-count]'));
  const format=new Intl.NumberFormat('sr-Latn-RS'),motion=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,started=false;
  function finish(){cancelAnimationFrame(frame);counters.forEach(el=>{el.textContent=format.format(Number(el.dataset.count));});stats.dataset.counterState='complete';}
  function animate(){
    if(started)return;started=true;
    if(motion.matches){finish();return;}
    const start=performance.now(),duration=1900;
    stats.dataset.counterState='running';
    function tick(now){
      const progress=Math.min((now-start)/duration,1),eased=1-Math.pow(1-progress,3);
      counters.forEach(el=>{el.textContent=format.format(Math.floor(Number(el.dataset.count)*eased));});
      if(progress<1)frame=requestAnimationFrame(tick);else finish();
    }
    frame=requestAnimationFrame(tick);
  }
  if(!('IntersectionObserver' in window)||motion.matches){started=true;finish();return;}
  counters.forEach(el=>{el.textContent='0';});stats.dataset.counterState='idle';
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();animate();}
  },{threshold:.25});observer.observe(stats);
  motion.addEventListener('change',()=>{if(motion.matches){observer.disconnect();started=true;finish();}});
})();
