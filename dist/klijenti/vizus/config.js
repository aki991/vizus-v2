window.ORDINACIJA = {
  naziv: 'Očna kuća Vizus',
  kontakt: {
    adresa: 'Svetozara Markovića 31, Kragujevac',
    telefon: '034 / 330-505', telefonLink: '+38134330505',
    mobilni: '065 / 330-5051', mobilniLink: '+381653305051',
    email: 'kgvizus@gmail.com', instagram: 'https://www.instagram.com/ocnakucavizus/'
  },
  doktori: [
    { id: 'demo-1', ime: 'Lekar 01', slika: 'levo' },
    { id: 'demo-2', ime: 'Lekar 02', slika: 'desno' }
  ],
  usluge: [
    { id: 'pregled', naziv: 'Oftalmološki pregled', opis: 'Izaberite pregled kao prvi korak u brizi o svom vidu.', broj: '01' },
    { id: 'kontrola', naziv: 'Kontrola vida', opis: 'Nastavite brigu o vidu uz dogovor o sledećoj poseti.', broj: '02' },
    { id: 'konsultacija', naziv: 'Konsultacija', opis: 'Niste sigurni koji pregled da izaberete? Počnite razgovorom.', broj: '03' }
  ],
  // Ilustrativni raspored služi isključivo demonstraciji, nije radno vreme Vizusa.
  demo: { interval: 30, hours: [{ dani: [1, 2, 3, 4, 5], od: '09:00', do: '17:00' }] }
};
