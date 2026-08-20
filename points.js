// Prize points awarded from Cursor chat or pasted JSON.
// Each award is applied once (by id), then stored in the browser.
// Append new rows — do not reuse an id.
//
// Chat: "Add 5 points to Danyela C. for the quiz"
// JSON:
//   { "Danyela C.": 5, "Logan M.": 10 }
//   [{ "name": "Danyela C.", "delta": 5, "note": "Quiz" }]

window.CSD_POINTS = {
  awards: [
    { id: '2026-08-20-all-s01', name: 'Danyela C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s02', name: 'Iszael M.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s03', name: 'Savannah A.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s04', name: 'Logan M.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s05', name: 'Giselle A.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s06', name: 'Sophia L.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s07', name: 'Tyran C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s08', name: 'Zayan I.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s09', name: 'Junho A.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s10', name: 'Lucas D.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s11', name: 'Oswa N.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s12', name: 'Sofia J.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s13', name: 'Jeffrey D.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s14', name: 'Trinity T.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s15', name: 'Victoria R.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s16', name: 'Thanh B.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s17', name: 'Javier A.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s18', name: 'Axel B.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s19', name: 'Nghia T.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s20', name: 'Charlize P.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s21', name: 'Jackson R.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s22', name: 'Isaac L.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s23', name: 'Alyviah C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s24', name: 'Hadassa G.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s25', name: 'Emma C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s26', name: 'Kiaraliz O.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s27', name: 'Angel M.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s28', name: 'Dania C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s29', name: 'Alyssia R.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s30', name: 'Aisha C.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-all-s31', name: 'Naia B.', delta: 5, note: 'Class points' },
    { id: '2026-08-20-bonus-victoria', name: 'Victoria R.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-axel', name: 'Axel B.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-charlize', name: 'Charlize P.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-tyran', name: 'Tyran C.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-isaac', name: 'Isaac L.', delta: 2, note: 'Bonus point' },
    { id: '2026-08-20-bonus-javier', name: 'Javier A.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-sophia', name: 'Sophia L.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-lucas', name: 'Lucas D.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-oswa', name: 'Oswa N.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-thanh', name: 'Thanh B.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-kiaraliz', name: 'Kiaraliz O.', delta: 2, note: 'Bonus point' },
    { id: '2026-08-20-bonus-jackson', name: 'Jackson R.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-logan', name: 'Logan M.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-emma', name: 'Emma C.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-dania', name: 'Dania C.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-zayan', name: 'Zayan I.', delta: 2, note: 'Bonus point' },
    { id: '2026-08-20-bonus-danyela', name: 'Danyela C.', delta: 1, note: 'Bonus point' },
    { id: '2026-08-20-bonus-iszael', name: 'Iszael M.', delta: 1, note: 'Bonus point' }
  ]
}
