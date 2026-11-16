/* Level 10 – Anfragen und Antworten: Adresse, GET/POST, Statuscodes, JSON. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[10] = {
  nr: 10,
  titel: 'Anfragen und Antworten',
  szene: 'drei',
  drei: [
    { z: '📱', name: 'Handy', rolle: 'fragt' },
    { z: '✉️', name: 'Anfrage', rolle: 'ist unterwegs' },
    { z: '🖥️', name: 'Server', rolle: 'antwortet' }
  ],
  merksatz: ['GET holt.', 'POST schickt.', 'Die Zahl sagt, wie es lief.'],
  intro: {
    titel: 'Jeder Klick ist eine Frage',
    text: 'Dein Handy schickt dem Server eine Anfrage: „Gib mir die Termine“ oder „Speichere das“. Der Server antwortet mit einer Zahl, wie es lief, und mit den Daten.'
  },
  runden: [
    {
      id: 'server',
      typ: 'wahl',
      ziel: 2,
      code: ['https://akte.bruecke-guetersloh.de/termine'],
      frage: 'Welcher Teil der Adresse sagt, welcher Server gemeint ist?',
      antworten: [
        { t: 'akte.bruecke-guetersloh.de', r: true },
        { t: 'https' },
        { t: '/termine' }
      ],
      erklaerung: 'Der Teil zwischen den Schrägstrichen ist der Name des Servers. Auf ihn kommt es an, wenn du prüfst, ob eine Adresse echt ist.'
    },
    {
      id: 'pfad',
      typ: 'wahl',
      ziel: 2,
      code: ['https://akte.bruecke-guetersloh.de/termine'],
      frage: 'Und was bedeutet /termine am Ende?',
      antworten: [
        { t: 'Welche Seite auf dem Server gewünscht ist', r: true },
        { t: 'Das Passwort' },
        { t: 'Die Uhrzeit der Anfrage' }
      ],
      erklaerung: 'Der Server ist das Haus, der Pfad dahinter das Zimmer. /termine heißt: Bitte die Terminseite.'
    },
    {
      id: 'get',
      typ: 'wahl',
      ziel: 0,
      code: ['GET /termine'],
      frage: 'Was will das Handy mit dieser Anfrage?',
      antworten: [
        { t: 'Etwas abholen und anzeigen', r: true },
        { t: 'Etwas löschen' },
        { t: 'Etwas Neues speichern' }
      ],
      erklaerung: 'GET heißt holen. Eine GET-Anfrage liest nur – auf dem Server ändert sich dadurch nichts.'
    },
    {
      id: 'post',
      typ: 'wahl',
      ziel: 2,
      code: ['POST /termine'],
      frage: 'Und was passiert hier?',
      antworten: [
        { t: 'Das Handy schickt etwas zum Speichern', r: true },
        { t: 'Das Handy holt die Termine ab' },
        { t: 'Der Server schickt einen Brief' }
      ],
      erklaerung: 'POST heißt abschicken: Das Handy gibt Daten ab, zum Beispiel einen neuen Termin. Danach hat sich auf dem Server etwas geändert.'
    },
    {
      id: 'ok',
      typ: 'wahl',
      ziel: 2,
      code: ['200 OK'],
      frage: 'Der Server antwortet so. Was heißt das?',
      antworten: [
        { t: 'Alles hat geklappt', r: true },
        { t: '200 Termine gefunden' },
        { t: 'Bitte 200 Sekunden warten' }
      ],
      erklaerung: 'Jede Antwort beginnt mit einer Zahl. 200 ist die gute Nachricht. 404 und 500 kennst du schon aus Level 1.'
    },
    {
      id: 'verboten',
      typ: 'wahl',
      ziel: 2,
      code: ['403 Forbidden'],
      frage: 'Und diese Antwort?',
      antworten: [
        { t: 'Du darfst das nicht sehen', r: true },
        { t: 'Die Seite gibt es nicht' },
        { t: 'Der Server ist abgestürzt' }
      ],
      erklaerung: 'Forbidden heißt verboten: Die Seite gibt es, aber dein Konto hat kein Recht darauf. Faustregel: 4xx – an der Anfrage liegt es, 5xx – am Server.'
    },
    {
      id: 'json',
      typ: 'wahl',
      ziel: 1,
      code: ['{', '  "titel": "Weihnachtsessen",', '  "uhrzeit": "17 Uhr"', '}'],
      frage: 'Der Server schickt diese Daten. Was steht unter „uhrzeit“?',
      antworten: [
        { t: '17 Uhr', r: true },
        { t: 'Weihnachtsessen' },
        { t: 'titel' }
      ],
      erklaerung: 'Das Format heißt JSON und sieht aus wie das Wörterbuch aus Level 8: links der Name, rechts der Wert.'
    },
    {
      id: 'wozujson',
      typ: 'wahl',
      ziel: 1,
      frage: 'Warum schicken sich Programme JSON statt ganzer Sätze?',
      antworten: [
        { t: 'Die feste Form kann ein Programm sicher lesen', r: true },
        { t: 'JSON ist verschlüsselt' },
        { t: 'Sätze wären zu höflich' }
      ],
      erklaerung: 'Ein Programm kann nicht raten. In JSON steht jeder Wert an einer festen, benannten Stelle. Verschlüsselt ist JSON nicht – das macht HTTPS.'
    },
    {
      id: 'frage',
      typ: 'wahl',
      ziel: 1,
      code: ['/termine?tag=2026-12-24'],
      frage: 'Was bewirkt der Teil hinter dem Fragezeichen?',
      antworten: [
        { t: 'Er grenzt ein: nur die Termine dieses Tages', r: true },
        { t: 'Er löscht den Termin an diesem Tag' },
        { t: 'Er ist ein Kommentar' }
      ],
      erklaerung: 'Hinter dem ? stehen Zusatzwünsche. Sie sind in der Adresse sichtbar und landen in Protokollen – Namen und Passwörter gehören dort nie hin.'
    },
    {
      id: 'ohnes',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- adresse = "https://" + server', '+ adresse = "http://" + server'],
      richtig: 'zurueck',
      erklaerung: 'Ein fehlendes s: Ohne HTTPS reisen Passwörter und Daten unverschlüsselt und können unterwegs mitgelesen werden.'
    },
    {
      id: 'meldung',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['+ if antwort.status != 200:', '+     zeige("Speichern hat nicht geklappt")'],
      richtig: 'durch',
      erklaerung: 'Lief es nicht mit 200, erfährt es jetzt der Mensch am Handy. Ein Fehler, den man sieht, ist besser als einer, der still verschwindet.'
    }
  ]
};
