(function () {
  'use strict';
  const viewport = document.querySelector('#testimonial-viewport');
  if (!viewport) return;
  // Illustrative demo copy and AI portraits, not real patient reviews.
  const reviews = [
    {name:'Marko P.', image:'assets/iskustvo-marko.webp', text:'Profesionalan pristup i prijatan razgovor. Dobio sam jasno objašnjenje svakog koraka pregleda.'},
    {name:'Jelena M.', image:'assets/iskustvo-jelena.webp', text:'Pažljiv tim i prostor za sva moja pitanja. Posebno mi znači kada su preporuke objašnjene razumljivo.'},
    {name:'Milica S.', image:'assets/iskustvo-milica.webp', text:'Jednostavan izbor termina i prijatna atmosfera. Dopala mi se pažnja pri razgovoru o mom vidu.'}
  ];
  viewport.innerHTML = reviews.map(r => `<article class="v2-review reveal is-visible"><img class="v2-review-avatar" src="${r.image}" alt="" loading="lazy" width="96" height="96"><h3>${r.name}</h3><p class="v2-review-stars" aria-label="5 od 5 zvezdica"><span aria-hidden="true">★★★★★</span></p><blockquote>„${r.text}“</blockquote></article>`).join('');
})();
