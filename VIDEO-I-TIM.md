# Video i portreti tima

Video je dostavio korisnik. Izvor: `Doctors_walking_toward_clinic_en…_20261011185623.mp4`.

Ulaz: 1920 × 1080, 24 fps, trajanje 8,00 s. Izbačen je uvod do 1,50 s, gde su sva četiri lika potpuno vidljiva bez početnog pretapanja. Izlaz: 1920 × 1080, 24 fps, 6,50 s, H.264 CRF 18, preset slow, yuv420p, AAC 160 kb/s, faststart. Blago smanjenje šuma: hqdn3d=0.65:0.65:1.5:1.5; blaga oštrina: unsharp=3:3:0.25:3:3:0. Nije rađeno povećavanje rezolucije niti uklanjanje AI promena između kadrova.

`dist/assets/video-poster.webp` je prvi kadar obrađenog videa. Originalni klip nije menjan.

Video sekcija prati korisnikov referentni `venus.mp4`: zauzima celu širinu i 100svh bez margina, okvira ili razmaka između heroja i tima. Video pokriva sekciju pomoću object-fit: cover. Preko njega je naslov VIZUS sa tekstom „Posvećeni zdravlju vaših očiju“. Počinje automatski bez zvuka kada je vidljivo bar 12% sekcije, ponavlja se i pauzira van vidnog polja ili pri sakrivanju taba. Kada se sekcija ponovo otkrije, počinje iz zajedničkog prvog kadra. Ručna pauza ima prednost nad automatskim pokretanjem. Referentni Venus video nije ugrađen u sajt.

## Podaci o doktorima

Provereni 11.10.2026: [Instagram profil](https://www.instagram.com/ocnakucavizus/), [objava o dve generacije](https://www.instagram.com/ocnakucavizus/p/DeWhaGIIfxt/), [objava o timu](https://www.instagram.com/ocnakucavizus/reel/DeG2BCdoB4G/), [poslovni podaci](https://www.companywall.rs/firma/vizus/MMxGz0Tpq).

Poslovni podaci navode Vericu Todorović kao vlasnicu registrovane oftalmološke ordinacije. To ne potvrđuje identitet četiri generisana lika u dostavljenom videu, ceo tim, stručne oblasti ni biografije. Nije vršeno prepoznavanje ljudi po licima. Korisnik je odobrio proizvoljna imena kada nema potvrde. Sva četiri imena (Ana Petrović, Nikola Jovanović, Jelena Marković, Milica Stanković), opisi i oblasti rada su ilustrativni, jasno označeni kao demo. Nisu izmišljene ustanove obrazovanja, godine staža, nagrade ili akademske titule.

## Portreti

Male sličice `portret-*.webp` su direktni isečci iz kadra originalnog videa na 1,50 s. Velike figure `tim-*.webp` su AI izdvajanja tih likova iz istog kadra, pomoću ugrađenog ImageGen alata, uz zahtev da se očuva identitet i odeća. Izlazna alpha transparentnost je sačuvana; WebP je prilagođen prikazu na sajtu.

## Sačuvani promptovi

### Portret 1

Use case: background-extraction. Edit target: attached video frame. Asset type: transparent individual doctor cutout for an existing website carousel. Isolate ONLY the LEFTMOST WOMAN with dark tied-back hair and navy blouse. Remove the clinic background and every other person. Preserve this exact individual's facial identity, age, hairstyle, expression, white coat, clothing, hands and pose from the input frame. Do not redesign or beautify the face. Show the person from head to just below the knees, centered with equal horizontal margins; bottom cropped naturally as in the source frame, no invented legs or feet. Preserve realistic photographic detail and a clean alpha silhouette including hair. Actual transparent background, no shadows on a background, no text or added elements.

### Portret 2

Use case: background-extraction. Edit target: attached video frame. Asset type: transparent individual doctor cutout for an existing website carousel. Isolate ONLY the MAN, second person from the left, with salt-and-pepper hair, short beard and charcoal shirt. Remove the clinic background and every other person. Preserve this exact individual's facial identity, age, hairstyle, expression, white coat, clothing, hands and pose from the input frame. Do not redesign or beautify the face. Show the person from head to just below the knees, centered with equal horizontal margins; bottom cropped naturally as in the source frame, no invented legs or feet. Preserve realistic photographic detail and a clean alpha silhouette including hair. Actual transparent background, no shadows on a background, no text or added elements.

### Portret 3

Use case: background-extraction. Edit target: attached video frame. Asset type: transparent individual doctor cutout for an existing website carousel. Isolate ONLY the WOMAN, third person from the left, with shoulder-length wavy brown hair and beige outfit. Remove the clinic background and every other person. Preserve this exact individual's facial identity, age, hairstyle, expression, white coat, clothing, hands and pose from the input frame. Do not redesign or beautify the face. Show the person from head to just below the knees, centered with equal horizontal margins; bottom cropped naturally as in the source frame, no invented legs or feet. Preserve realistic photographic detail and a clean alpha silhouette including hair. Actual transparent background, no shadows on a background, no text or added elements.

### Portret 4

Use case: background-extraction. Edit target: attached video frame. Asset type: transparent individual doctor cutout for an existing website carousel. Isolate ONLY the RIGHTMOST WOMAN with tied-back blonde hair and white blouse. Remove the clinic background and every other person. Preserve this exact individual's facial identity, age, hairstyle, expression, white coat, clothing, hands and pose from the input frame. Do not redesign or beautify the face. Show the person from head to just below the knees, centered with equal horizontal margins; bottom cropped naturally as in the source frame, no invented legs or feet. Preserve realistic photographic detail and a clean alpha silhouette including hair. Actual transparent background, no shadows on a background, no text or added elements.
