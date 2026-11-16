/* Level 5 – Änderungen lesen (Diff).
   Die drei Stationen sind die drei Arten von Zeilen in einem Diff: Minus, Plus, ohne Zeichen. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[5] = {
  nr: 5,
  titel: 'Änderungen lesen',
  szene: 'drei',
  drei: [
    { z: '−', name: 'Minus', rolle: 'fliegt raus' },
    { z: '+', name: 'Plus', rolle: 'kommt dazu' },
    { z: '=', name: 'Ohne Zeichen', rolle: 'bleibt, wie es ist' }
  ],
  merksatz: ['Minus fliegt raus.', 'Plus kommt dazu.', 'Erst lesen, dann durchlassen.'],
  intro: {
    titel: 'Ein Diff zeigt nur den Unterschied',
    text: 'Wenn die KI etwas ändert, zeigt sie dir einen Diff: Rot mit Minus fliegt raus, Grün mit Plus kommt dazu. Zeilen ohne Zeichen bleiben und zeigen nur die Umgebung.'
  },
  runden: [
    {
      id: 'plus',
      typ: 'wahl',
      ziel: 1,
      code: ['+ print("Termin gespeichert")'],
      frage: 'Was bedeutet das Plus am Anfang?',
      antworten: [
        { t: 'Diese Zeile kommt neu dazu', r: true },
        { t: 'Diese Zeile ist besonders wichtig' },
        { t: 'Hier wird etwas zusammengezählt' }
      ],
      erklaerung: 'Das Plus gehört nicht zum Code. Es ist nur die Markierung des Diffs: Diese Zeile gab es vorher nicht.'
    },
    {
      id: 'minus',
      typ: 'wahl',
      ziel: 0,
      code: ['- print("Termin gespeichert")'],
      frage: 'Und was bedeutet das Minus?',
      antworten: [
        { t: 'Diese Zeile wird gelöscht', r: true },
        { t: 'Diese Zeile ist fehlerhaft' },
        { t: 'Hier wird etwas abgezogen' }
      ],
      erklaerung: 'Minus heißt: Diese Zeile stand im alten Stand und ist im neuen nicht mehr da.'
    },
    {
      id: 'umgebung',
      typ: 'wahl',
      ziel: 2,
      code: ['  termine = 3', '+ termine = termine + 1'],
      frage: 'Was passiert mit der ersten Zeile?',
      antworten: [
        { t: 'Nichts – sie bleibt, wie sie ist', r: true },
        { t: 'Sie wird gelöscht' },
        { t: 'Sie wird verdoppelt' }
      ],
      erklaerung: 'Zeilen ohne Plus und Minus ändern sich nicht. Sie stehen nur da, damit du siehst, wo die Änderung sitzt.'
    },
    {
      id: 'ersetzen',
      typ: 'wahl',
      fokus: [0, 1],
      code: ['- frist_tage = 14', '+ frist_tage = 30'],
      frage: 'Was ändert sich hier?',
      antworten: [
        { t: 'Die Frist steigt von 14 auf 30 Tage', r: true },
        { t: 'Es gibt jetzt zwei Fristen' },
        { t: 'Die Frist wird gelöscht' }
      ],
      erklaerung: 'Ein Minus und ein Plus direkt untereinander heißt meist: Die Zeile wurde ersetzt. Alt raus, neu rein.'
    },
    {
      id: 'fehlt',
      typ: 'wahl',
      ziel: 0,
      code: ['  def speichern(termin):', '-     pruefe(termin)', '      db.speichere(termin)'],
      frage: 'Was fehlt nach dieser Änderung?',
      antworten: [
        { t: 'Die Prüfung vor dem Speichern', r: true },
        { t: 'Das Speichern selbst' },
        { t: 'Nichts – nur eine Notiz' }
      ],
      erklaerung: 'Gelöschte Zeilen sind oft wichtiger als neue. Hier würde künftig ungeprüft gespeichert.'
    },
    {
      id: 'tippe',
      typ: 'zeile',
      zeilen: ['  if alter < 18:', '-     frage_eltern()', '+     print("ok")', '      weiter()'],
      richtig: 1,
      frage: 'Tippe auf die Zeile, die gelöscht wird.',
      erklaerung: 'Die Zeile mit dem Minus fliegt raus: Die Eltern würden nicht mehr gefragt. Bei so etwas zweimal hinschauen.'
    },
    {
      id: 'umfang',
      typ: 'wahl',
      fokus: [0, 1],
      frage: 'Du wolltest nur eine andere Knopffarbe. Der Diff hat 400 geänderte Zeilen. Was tust du?',
      antworten: [
        { t: 'Nachfragen – das passt nicht zum Auftrag', r: true },
        { t: 'Durchlassen – die KI war fleißig' },
        { t: 'Nur die ersten zehn Zeilen lesen' }
      ],
      erklaerung: 'Der Umfang einer Änderung sollte zum Auftrag passen. Viel mehr Zeilen als erwartet heißt: Da ist noch etwas anderes passiert.'
    },
    {
      id: 'immerwahr',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- if angemeldet:', '+ if True:', '      zeige_akte()'],
      richtig: 'zurueck',
      erklaerung: 'Vorher sah die Akte nur, wer angemeldet war. „if True“ lässt jeden durch – die Prüfung ist damit abgeschaltet.'
    },
    {
      id: 'wartezeit',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- wartezeit_sekunden = 30', '+ wartezeit_sekunden = 60'],
      richtig: 'durch',
      erklaerung: 'Hier wartet das Programm nur länger auf eine Antwort. Keine Daten, keine Rechte – das darf durch.'
    },
    {
      id: 'allesweg',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['  def absagen(termin):', '-     loesche(termin)', '+     loesche_alle()'],
      richtig: 'zurueck',
      erklaerung: 'Aus „diesen einen Termin löschen“ wird „alle löschen“. Ein kleines Wort, eine riesige Wirkung.'
    },
    {
      id: 'kommentar',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['+ # Prüft, ob das Datum in der Zukunft liegt', '  def pruefe_datum(datum):'],
      richtig: 'durch',
      erklaerung: 'Neu ist nur eine Notiz für Menschen. Am Verhalten des Programms ändert sich nichts.'
    }
  ]
};
