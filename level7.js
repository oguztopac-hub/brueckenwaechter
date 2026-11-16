/* Level 7 – Datenbank lesen (SQL). Tabelle und Einträge erfunden. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[7] = {
  nr: 7,
  titel: 'Datenbank lesen',
  szene: 'drei',
  drei: [
    { z: '▦', name: 'Tabelle', rolle: 'eine ganze Liste' },
    { z: '▬', name: 'Zeile', rolle: 'ein Eintrag' },
    { z: '▮', name: 'Spalte', rolle: 'eine Eigenschaft' }
  ],
  merksatz: ['Tabelle = Liste.', 'WHERE grenzt ein.', 'Ohne WHERE trifft es alle.'],
  intro: {
    titel: 'Eine Datenbank ist ein Stapel Tabellen',
    text: 'In der Datenbank liegen Tabellen wie in Excel. Jede Zeile ist ein Eintrag, jede Spalte eine Eigenschaft. Die Sprache dafür heißt SQL – man kann sie fast wie Englisch lesen.'
  },
  runden: [
    {
      id: 'zeile',
      typ: 'wahl',
      ziel: 1,
      frage: 'In der Tabelle „termine“ steht jeder Termin. Was ist eine Zeile darin?',
      antworten: [
        { t: 'Ein einzelner Termin', r: true },
        { t: 'Alle Termine eines Monats' },
        { t: 'Das Datum eines Termins' }
      ],
      erklaerung: 'Eine Zeile ist genau ein Eintrag: ein Termin mit allem, was dazugehört.'
    },
    {
      id: 'spalte',
      typ: 'wahl',
      ziel: 2,
      frage: 'Und was ist die Spalte „datum“?',
      antworten: [
        { t: 'Das Datum – bei jedem Termin', r: true },
        { t: 'Ein einzelner Termin' },
        { t: 'Der Name der Tabelle' }
      ],
      erklaerung: 'Eine Spalte ist eine Eigenschaft, die jeder Eintrag hat: Datum, Titel, Uhrzeit.'
    },
    {
      id: 'select',
      typ: 'wahl',
      ziel: 0,
      code: ['SELECT * FROM termine;'],
      frage: 'Was macht dieser Befehl?',
      antworten: [
        { t: 'Er zeigt alle Termine', r: true },
        { t: 'Er löscht alle Termine' },
        { t: 'Er legt einen Termin an' }
      ],
      erklaerung: 'SELECT heißt auswählen, der Stern heißt „alle Spalten“. Der Befehl liest nur – er verändert nichts.'
    },
    {
      id: 'where',
      typ: 'wahl',
      ziel: 1,
      code: ['SELECT * FROM termine', "WHERE datum = '2026-12-24';"],
      frage: 'Was kommt hier heraus?',
      antworten: [
        { t: 'Nur die Termine vom 24.12.2026', r: true },
        { t: 'Alle Termine' },
        { t: 'Ein neuer Termin am 24.12.' }
      ],
      erklaerung: 'WHERE heißt „wo“ und grenzt ein: nur die Zeilen, bei denen die Bedingung stimmt.'
    },
    {
      id: 'count',
      typ: 'wahl',
      ziel: 0,
      code: ['SELECT COUNT(*) FROM termine;'],
      frage: 'Was liefert dieser Befehl?',
      antworten: [
        { t: 'Die Anzahl der Termine', r: true },
        { t: 'Den ersten Termin' },
        { t: 'Alle Termine, sortiert' }
      ],
      erklaerung: 'COUNT zählt. Heraus kommt keine Liste, sondern eine einzige Zahl.'
    },
    {
      id: 'insert',
      typ: 'wahl',
      ziel: 1,
      code: ['INSERT INTO termine (datum, titel)', "VALUES ('2026-12-24', 'Weihnachtsessen');"],
      frage: 'Was passiert hier?',
      antworten: [
        { t: 'Ein neuer Termin wird eingetragen', r: true },
        { t: 'Ein Termin wird umbenannt' },
        { t: 'Es wird nur nachgeschaut' }
      ],
      erklaerung: 'INSERT heißt einfügen: eine neue Zeile mit Datum und Titel.'
    },
    {
      id: 'id',
      typ: 'wahl',
      ziel: 1,
      frage: 'Jede Zeile hat eine Nummer namens „id“. Wozu?',
      antworten: [
        { t: 'Damit jeder Eintrag eindeutig ist', r: true },
        { t: 'Damit die Tabelle schöner aussieht' },
        { t: 'Zum Sortieren nach dem Alphabet' }
      ],
      erklaerung: 'Zwei Termine können gleich heißen, die id gibt es nur einmal. So trifft eine Änderung genau den richtigen Eintrag.'
    },
    {
      id: 'sicherung',
      typ: 'wahl',
      ziel: 0,
      frage: 'Die KI will die Tabellen umbauen. Was kommt zuerst?',
      antworten: [
        { t: 'Eine Sicherung der Datenbank', r: true },
        { t: 'Den Umbau direkt live ausprobieren' },
        { t: 'Alte Einträge vorsorglich löschen' }
      ],
      erklaerung: 'Code kann man zurückdrehen, gelöschte Daten nicht. Vor jedem Umbau gehört eine frische Kopie beiseite.'
    },
    {
      id: 'ohnewhere',
      typ: 'waechter',
      frage: 'Die KI will diesen Befehl ändern. Lässt du das durch?',
      code: ['- DELETE FROM termine WHERE id = 7;', '+ DELETE FROM termine;'],
      richtig: 'zurueck',
      erklaerung: 'Ohne WHERE trifft DELETE jede Zeile. Aus „Termin 7 löschen“ würde „alle Termine löschen“.'
    },
    {
      id: 'update',
      typ: 'waechter',
      frage: 'Die KI will diesen Befehl ausführen. Lässt du das durch?',
      code: ["+ UPDATE termine SET titel = 'Teamsitzung'", '+ WHERE id = 7;'],
      richtig: 'durch',
      erklaerung: 'UPDATE ändert – und das WHERE begrenzt es auf genau den Termin mit der id 7. So soll es sein.'
    },
    {
      id: 'drop',
      typ: 'waechter',
      frage: 'Die KI will diesen Befehl ausführen. Lässt du das durch?',
      code: ['+ DROP TABLE klienten;'],
      richtig: 'zurueck',
      erklaerung: 'DROP TABLE wirft die ganze Tabelle weg, mit allen Einträgen. Das braucht einen sehr guten Grund und eine Sicherung.'
    }
  ]
};
