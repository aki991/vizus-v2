window.ORDINACIJA = {
  naziv: 'Očna kuća Vizus',
  kontakt: {
    adresa: 'Svetozara Markovića 31, Kragujevac',
    telefon: '034 / 330-505', telefonLink: '+38134330505',
    mobilni: '065 / 330-5051', mobilniLink: '+381653305051',
    email: 'kgvizus@gmail.com', instagram: 'https://www.instagram.com/ocnakucavizus/'
  },
  doktori: [
    { id: 'demo-1', ime: 'Lekar 01', slika: 'levo', figura: 'assets/lekar-01.webp', bio: 'Upoznajte lekara i izaberite pregled koji vam odgovara. Ovaj profil prikazuje način izbora doktora u demo verziji sajta.' },
    { id: 'demo-2', ime: 'Lekar 02', slika: 'desno', figura: 'assets/lekar-02.webp', bio: 'Izaberite svog doktora i napravite sledeći korak ka brizi o vidu. Ovaj profil služi prikazu zakazivanja u demo verziji sajta.' }
  ],
  // Kada video bude spreman, dodati lokalnu putanju u src. Format ostaje 16:9.
  videoOrdinacije: { src: '', poster: 'assets/ordinacija.webp' },
  usluge: [
    { id: 'pregled', naziv: 'Oftalmološki pregled', opis: 'Izaberite pregled kao prvi korak u brizi o svom vidu.', broj: '01' },
    { id: 'kontrola', naziv: 'Kontrola vida', opis: 'Nastavite brigu o vidu uz dogovor o sledećoj poseti.', broj: '02' },
    { id: 'konsultacija', naziv: 'Konsultacija', opis: 'Niste sigurni koji pregled da izaberete? Počnite razgovorom.', broj: '03' }
  ],
  // Ilustrativni raspored služi isključivo demonstraciji, nije radno vreme Vizusa.
  demo: { interval: 30, hours: [{ dani: [1, 2, 3, 4, 5], od: '09:00', do: '17:00' }] }
};
