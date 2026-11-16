/* Level 11 – Tests: der Prüfstand.
   Die Fehlermeldung ist eine echte Ausgabe von Python 3.14 (16.11.2026, nur der Pfad gekürzt). */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[11] = {
  nr: 11,
  titel: 'Tests – der Prüfstand',
  szene: 'drei',
  drei: [
    { z: '🧪', name: 'Test', rolle: 'probiert aus' },
    { z: '⚙️', name: 'Code', rolle: 'wird geprüft' },
    { z: '🚦', name: 'Ergebnis', rolle: 'grün oder rot' }
  ],
  merksatz: ['Ein Test ist ein Beispiel.', 'Rot heißt: hinschauen.', 'Tests nie stumm schalten.'],
  intro: {
    titel: 'Tests probieren es für dich aus',
    text: 'Ein Test füttert den Code mit einem Beispiel und vergleicht, was herauskommt. Stimmt es, ist er grün. Stimmt es nicht, ist er rot – und zeigt, wo etwas kaputtging.'
  },
  runden: [
    {
      id: 'was',
      typ: 'wahl',
      ziel: 0,
      frage: 'Was macht ein Test?',
      antworten: [
        { t: 'Er probiert ein Beispiel aus und vergleicht das Ergebnis', r: true },
        { t: 'Er macht das Programm schneller' },
        { t: 'Er sucht Tippfehler in Texten' }
      ],
      erklaerung: 'Ein Test ist selbst ein kleines Programm. Es stellt eine Frage, deren Antwort man schon kennt, und schlägt Alarm, wenn sie anders ausfällt.'
    },
    {
      id: 'assert',
      typ: 'wahl',
      szene: 'maschine',
      maschine: { name: 'addiere', rein: '2, 3', raus: '5' },
      code: ['def test_addiere():', '    assert addiere(2, 3) == 5'],
      frage: 'Was prüft dieser Test?',
      antworten: [
        { t: 'Dass addiere(2, 3) genau 5 ergibt', r: true },
        { t: 'Dass addiere sehr schnell ist' },
        { t: 'Dass 2 und 3 Zahlen sind' }
      ],
      erklaerung: 'assert heißt „stelle sicher“. Das doppelte Gleichheitszeichen vergleicht – anders als das einfache, das etwas in eine Kiste legt.'
    },
    {
      id: 'rot',
      typ: 'wahl',
      szene: 'weiche',
      feste: true,
      weiche: { frage: '−1 == 5 ?', ja: 'Test grün', nein: 'Test rot', ergebnis: 'nein' },
      code: ['def addiere(a, b):', '    return a - b', '', 'assert addiere(2, 3) == 5'],
      frage: 'In addiere steckt ein Fehler. Wie geht der Test aus?',
      antworten: [
        { t: 'Test grün', weg: 'ja' },
        { t: 'Test rot', r: true, weg: 'nein' }
      ],
      erklaerung: 'Mit dem Minus kommt −1 heraus statt 5. Der Vergleich stimmt nicht, der Test wird rot – genau dafür ist er da.'
    },
    {
      id: 'meldung',
      typ: 'wahl',
      szene: 'lupe',
      meldung: [
        'Traceback (most recent call last):',
        '  File "test_frist.py", line 4, in <module>',
        '    assert frist_tage("LWL") == 30',
        '           ^^^^^^^^^^^^^^^^^^^^^^^',
        'AssertionError'
      ],
      frage: 'Ein Test meldet das. Was ist passiert?',
      antworten: [
        { t: 'Erwartet war 30, herausgekommen ist etwas anderes', r: true },
        { t: 'Die Datei test_frist.py fehlt' },
        { t: 'Die Frist ist abgelaufen' }
      ],
      erklaerung: 'AssertionError heißt: Die Sicherstellung ist gescheitert. Die Zeile darüber zeigt, welcher Vergleich nicht stimmte.'
    },
    {
      id: 'gruen',
      typ: 'wahl',
      ziel: 2,
      frage: 'Alle Tests sind grün. Was weißt du jetzt?',
      antworten: [
        { t: 'Die geprüften Beispiele klappen', r: true },
        { t: 'Das Programm hat keinen einzigen Fehler' },
        { t: 'Die Daten sind gesichert' }
      ],
      erklaerung: 'Tests beweisen nur, was sie prüfen. Was kein Test abdeckt, kann trotzdem kaputt sein – darum fragt man: Was wurde nicht geprüft?'
    },
    {
      id: 'vorher',
      typ: 'wahl',
      ziel: 2,
      frage: 'Nach einer Änderung ist ein Test rot, der vorher grün war. Was heißt das?',
      antworten: [
        { t: 'Die Änderung hat etwas kaputt gemacht, das vorher ging', r: true },
        { t: 'Der Test ist veraltet und kann weg' },
        { t: 'Das ist Zufall' }
      ],
      erklaerung: 'Das ist der größte Wert von Tests: Sie merken, wenn eine neue Änderung etwas Altes beschädigt.'
    },
    {
      id: 'wann',
      typ: 'wahl',
      ziel: 0,
      frage: 'Wann lässt man die Tests laufen?',
      antworten: [
        { t: 'Nach jeder Änderung, vor dem Veröffentlichen', r: true },
        { t: 'Einmal im Jahr' },
        { t: 'Nur wenn sich jemand beschwert' }
      ],
      erklaerung: 'Tests kosten Sekunden, ein Fehler im laufenden Betrieb kostet Stunden. Darum laufen sie vor jedem Aufspielen.'
    },
    {
      id: 'sollte',
      typ: 'wahl',
      ziel: 2,
      frage: 'Die KI schreibt: „Sollte jetzt funktionieren.“ Was willst du sehen?',
      antworten: [
        { t: 'Den Testlauf mit dem Ergebnis', r: true },
        { t: 'Nichts – das reicht' },
        { t: 'Eine längere Erklärung' }
      ],
      erklaerung: '„Sollte“ ist eine Vermutung. Ein Testlauf ist ein Beleg – so wie eine Quittung mehr zählt als „müsste bezahlt sein“.'
    },
    {
      id: 'stumm',
      typ: 'waechter',
      frage: 'Die KI meldet: „Alle Tests sind jetzt grün!“ Lässt du diese Änderung durch?',
      code: ['- assert frist_tage("LWL") == 30', '+ # assert frist_tage("LWL") == 30'],
      richtig: 'zurueck',
      erklaerung: 'Mit dem # davor ist die Prüfung nur noch eine Notiz. Der Test ist grün, weil er nichts mehr prüft – der Fehler ist noch da.'
    },
    {
      id: 'asserttrue',
      typ: 'waechter',
      frage: 'Die KI will diesen Test ändern. Lässt du das durch?',
      code: ['  def test_summe():', '-     assert summe(belege) == 120', '+     assert True'],
      richtig: 'zurueck',
      erklaerung: '„assert True“ stimmt immer. Der Test kann nie mehr rot werden und ist damit wertlos.'
    },
    {
      id: 'neuertest',
      typ: 'waechter',
      frage: 'Die KI will diesen Test hinzufügen. Lässt du das durch?',
      code: ['+ def test_keine_belege():', '+     assert summe([]) == 0'],
      richtig: 'durch',
      erklaerung: 'Ein neuer Test für den Fall „keine Belege“. Mehr geprüfte Beispiele schaden nie – das darf durch.'
    }
  ]
};
