# Očna kuća Vizus — demo

Samostalni statički demo u `dist/`, napravljen prema odobrenom predlogu hero sekcije. Iz postojećeg šablona zadržan je princip konfiguracije po ordinaciji i adapter za demo dostupnost. Originalni šablon na Desktopu nije menjan.

## Pokretanje

Uz instaliran Node.js: `node preview-server.mjs`, zatim otvoriti `http://127.0.0.1:4173/`. Alternativno servirati `dist/` bilo kojim statičkim serverom.

Nema instalacije paketa, build koraka ili runtime biblioteka. Folder `dist/` je spreman za statički hosting, uključujući Vercel. Google Fonts koriste Cormorant Garamond i Manrope; sistemski fontovi su rezervna opcija.

## Izgled i ponašanje

- Logo Vizusa prilagođen tamnoj pozadini, bez belog kruga i crnih uglova; AI enterijer u pozadini i odvojeni prozirni iris. Obrada logotipa opisana je u `LOGO-PROMPT.md`.
- Naziv Očna kuća VIZUS je glavni naslov. Hero zauzima najmanje prvi ekran, a izbor lekara je ispod njega bez preklapanja. Dodatni plavi lukovi i kružići kreću se nezavisno oko oka.
- CSS rotacija irisa i fokusnih prstenova, pulsiranje zenice, blago praćenje miša. Pauza dugmetom; poštuje `prefers-reduced-motion`, zaustavlja se van hero sekcije i na skrivenoj kartici.
- Responsive raspored, mobilni meni, pregledi, AI demo profili i stvarni kontakt sa Instagram profila.
- Modal sa tri demo koraka: pregled/lekar, datum/vreme, pregled izbora.
- Podaci ne napuštaju stranicu; nema servera za rezervacije i nema stvarnog zakazivanja. Izbor ostaje samo u memoriji dok je dialog otvoren.

## Sadržaj za potvrdu pre javnog sajta

Enterijer i lekari su AI ilustracije. Profili su označeni `Lekar 01` i `Lekar 02`, bez izmišljenih imena i kvalifikacija. Ponuda pregleda je ilustrativna. Radno vreme nije potvrđeno: raspored u config fajlu je samo demo. Stvarno zakazivanje vodi preko telefona ordinacije. Za produkciju treba potvrditi usluge, radno vreme, profile i način slanja zahteva.

Izvori logotipa, telefona, emaila i adrese: https://www.instagram.com/ocnakucavizus/. Slogan o dve generacije preuzet je iz njihove objave https://www.instagram.com/ocnakucavizus/p/DeWhaGIIfxt/.

Generisani vizueli napravljeni su ugrađenim ImageGen alatom. Promptovi se nalaze u `ASSET-PROMPTS.md`. PNG originali su pretvoreni u WebP, bez promene kompozicije, uz zadržanu prozirnost irisa. Ukupne slike za sajt zauzimaju približno 640 KB.
