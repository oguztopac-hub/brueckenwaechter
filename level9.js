/* Level 9 – Webseiten lesen: HTML, CSS und JavaScript. Beispiele an die Vereinsseite angelehnt. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[9] = {
  nr: 9,
  titel: 'Webseiten lesen',
  szene: 'drei',
  drei: [
    { z: '</>', name: 'HTML', rolle: 'der Inhalt' },
    { z: '🎨', name: 'CSS', rolle: 'das Aussehen' },
    { z: '⚡', name: 'JavaScript', rolle: 'das Verhalten' }
  ],
  merksatz: ['HTML = Inhalt.', 'CSS = Aussehen.', 'JavaScript = Verhalten.'],
  intro: {
    titel: 'Jede Webseite spricht drei Sprachen',
    text: 'HTML sagt, was auf der Seite steht. CSS sagt, wie es aussieht. JavaScript sagt, was beim Tippen passiert. Auch die Vereinsseite und dieses Spiel bestehen genau daraus.'
  },
  runden: [
    {
      id: 'h1',
      typ: 'wahl',
      ziel: 0,
      code: ['<h1>Brücke Gütersloh</h1>'],
      frage: 'Was ist das?',
      antworten: [
        { t: 'Eine Überschrift', r: true },
        { t: 'Eine Farbe' },
        { t: 'Ein Knopf' }
      ],
      erklaerung: 'h1 steht für heading 1: die wichtigste Überschrift der Seite. Der Text zwischen den Klammern ist das, was man liest.'
    },
    {
      id: 'ende',
      typ: 'wahl',
      ziel: 0,
      code: ['<p>Wir sind für dich da.</p>'],
      frage: 'Wofür steht das </p> am Ende?',
      antworten: [
        { t: 'Hier endet der Absatz', r: true },
        { t: 'Der Absatz wird gelöscht' },
        { t: 'Der Absatz wird fett' }
      ],
      erklaerung: 'HTML arbeitet mit Paaren: <p> öffnet den Absatz, </p> mit Schrägstrich schließt ihn wieder.'
    },
    {
      id: 'css',
      typ: 'wahl',
      ziel: 1,
      code: ['h1 { color: green; }'],
      frage: 'Was bewirkt diese Zeile?',
      antworten: [
        { t: 'Überschriften werden grün', r: true },
        { t: 'Es entsteht eine neue Überschrift' },
        { t: 'Die Überschrift wird gelöscht' }
      ],
      erklaerung: 'CSS liest sich so: Für wen gilt es (h1), dann in Klammern, was sich ändert (die Farbe).'
    },
    {
      id: 'js',
      typ: 'wahl',
      ziel: 2,
      code: ['knopf.onclick = zeigeMenue;'],
      frage: 'Wer sorgt dafür, dass beim Tippen auf den Knopf etwas passiert?',
      antworten: [
        { t: 'JavaScript', r: true },
        { t: 'HTML' },
        { t: 'CSS' }
      ],
      erklaerung: 'onclick heißt „beim Klick“. Alles, was auf dein Tippen reagiert, ist JavaScript.'
    },
    {
      id: 'link',
      typ: 'wahl',
      ziel: 0,
      code: ['<a href="kontakt.html">Schreib uns</a>'],
      frage: 'Wohin führt dieser Link?',
      antworten: [
        { t: 'Zur Seite kontakt.html', r: true },
        { t: 'Zu einer Seite namens „Schreib uns“' },
        { t: 'Nirgendwohin' }
      ],
      erklaerung: 'In href steht das Ziel, zwischen den Klammern der sichtbare Text. Beides kann völlig verschieden sein – darum bei Links aufs href schauen.'
    },
    {
      id: 'alt',
      typ: 'wahl',
      ziel: 0,
      code: ['<img src="team.jpg" alt="Unser Vorstand">'],
      frage: 'Wozu dient das alt?',
      antworten: [
        { t: 'Text für alle, die das Bild nicht sehen', r: true },
        { t: 'Es macht das Bild älter' },
        { t: 'Es ist der Dateiname' }
      ],
      erklaerung: 'Vorleseprogramme lesen den alt-Text vor, und er erscheint, wenn das Bild nicht lädt. Zu einer barrierefreien Seite gehört er dazu.'
    },
    {
      id: 'klasse',
      typ: 'wahl',
      ziel: 1,
      code: ['<p class="hinweis">Bitte anmelden</p>', '', '.hinweis { color: red; }'],
      frage: 'In welcher Farbe erscheint „Bitte anmelden“?',
      antworten: [
        { t: 'Rot', r: true },
        { t: 'Schwarz' },
        { t: 'Grün' }
      ],
      erklaerung: 'class gibt dem Absatz einen Namen. Im CSS steht mit Punkt davor, was für alle mit diesem Namen gilt.'
    },
    {
      id: 'falsch',
      typ: 'zeile',
      zeilen: ['<h1>Angebote</h2>', '<p>Sozialberatung</p>', '<p>Deutschkurs</p>'],
      richtig: 0,
      frage: 'Tippe auf die Zeile mit dem Fehler.',
      erklaerung: 'Geöffnet wird mit h1, geschlossen mit h2 – das Paar passt nicht. Auf <h1> muss </h1> folgen.'
    },
    {
      id: 'wo',
      typ: 'wahl',
      ziel: 1,
      frage: 'Auf der Vereinsseite soll die Schrift überall größer werden. Wo wird das geändert?',
      antworten: [
        { t: 'Im CSS', r: true },
        { t: 'Im HTML, bei jedem Absatz einzeln' },
        { t: 'In der Datenbank' }
      ],
      erklaerung: 'Aussehen steht an einer Stelle im CSS und gilt dann für alle Seiten. Deshalb ist so eine Änderung oft nur eine Zeile.'
    },
    {
      id: 'fremd',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Vereinsseite einbauen. Lässt du sie durch?',
      code: ['- <a href="/spenden.html">Spenden</a>', '+ <a href="http://spende-sofort.xyz">Spenden</a>'],
      richtig: 'zurueck',
      erklaerung: 'Der Text bleibt gleich, aber das Ziel ist jetzt eine fremde Adresse. Wer spenden will, landet woanders.'
    },
    {
      id: 'tippfehler',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Vereinsseite einbauen. Lässt du sie durch?',
      code: ['- <h2>Unsere Angebot</h2>', '+ <h2>Unsere Angebote</h2>'],
      richtig: 'durch',
      erklaerung: 'Nur ein Tippfehler in einer Überschrift. Kein Link, keine Daten – das darf durch.'
    }
  ]
};
