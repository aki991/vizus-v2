# Sekcija doktora

Raspored, CSS bine i logika položaja figura preuzeti su i prilagođeni iz korisnikovog Claude šablona: `C:/Users/Andreja/Desktop/App & site/ordinacija-sablon – kopija`. Izvorni folder nije menjan. Vizus koristi svoje boje, fontove, kontakte i demonstraciono zakazivanje; izmišljena imena, kvalifikacije i statistike iz šablona nisu preneti.

Redosled: hero → video 16:9 → izbor doktora → ostatak postojećeg sadržaja.

Video se naknadno dodaje kroz `videoOrdinacije.src` u `dist/klijenti/vizus/config.js`. Dok je prazan, prikazuje se statični blok bez dugmeta za puštanje nepostojećeg videa. Kada se putanja doda, prikazuje se pravi video sa kontrolama, bez automatskog puštanja, u istom okviru 16:9.

Figurama se upravlja strelicama, klikom na listu, tasterima ← → dok je fokus u sekciji i prevlačenjem na telefonu. Profil se otvara u zasebnom panelu, a izabrani doktor se prenosi u demo zakazivanje.

## AI slike

Ugrađeni ImageGen je prilagodio ranije generisane fiktivne likove u samostalne figure sa prozirnom pozadinom. Konačni web fajlovi: `dist/assets/lekar-01.webp` i `dist/assets/lekar-02.webp`. Alfa prozirnost je očuvana pri smanjivanju i pretvaranju u WebP.

### Lekar 01 — prompt

Use case: precise-object-edit. Reference/edit target is the attached AI-generated pair of fictional doctors from the Vizus demo. Create a single transparent-background cutout for a website doctor carousel. Select ONLY the middle-aged man on the LEFT. Preserve his face, grey-brown short hair, friendly expression, white coat, blue shirt and crossed arms. Extend the portrait down to mid-thigh, natural proportions. Front-facing professional studio lighting matched to the original, photorealistic. Single isolated person centered, complete top of head and complete arms inside frame. True alpha transparency. No other person, no clinic/background, no floor, no text, no logo, no stethoscope, no badge, no shadow. Keep the existing fictional identity. Portrait canvas 3:4 with small margin.

### Lekar 02 — prompt

Use case: precise-object-edit. Reference/edit target is the attached AI-generated pair of fictional doctors from the Vizus demo. Create a single transparent-background cutout for a website doctor carousel. Select ONLY the middle-aged woman on the RIGHT. Preserve her face, shoulder-length wavy brown hair, friendly expression, white coat and ivory blouse. Extend the portrait down to mid-thigh with hands naturally relaxed, natural proportions. Front-facing professional studio lighting matched to the original, photorealistic. Single isolated person centered, complete top of head and complete arms inside frame. True alpha transparency. No other person, no clinic/background, no floor, no text, no logo, no stethoscope, no badge, no shadow. Keep the existing fictional identity. Portrait canvas 3:4 with small margin.
