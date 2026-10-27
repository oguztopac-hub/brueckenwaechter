/* Level 1 – Der Weg eines Klicks.
   Rundentypen:
     station  – Antwort ist eine der drei Stationen (handy, server, datenbank)
     wahl     – mehrere Textantworten, genau eine mit r: true (Reihenfolge wird gemischt)
     waechter – eine Code-Änderung: richtig ist "durch" oder "zurueck"
   fokus: Stationen (oder "schloss"), die während der Frage leuchten.
   Beispiele sind an die Akte angelehnt, aber erfunden – keine echten Daten. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[1] = {
  nr: 1,
  titel: 'Der Weg eines Klicks',
  szene: 'weg',
  merksatz: ['Handy zeigt an.', 'Server entscheidet.', 'Datenbank merkt sich.'],
  intro: {
    titel: 'So funktioniert jede App',
    text: 'Jede App hat drei Stationen. Dein Handy zeigt an, der Server entscheidet, die Datenbank merkt sich alles. Bei der Akte steht der Server bei Hetzner.'
  },
  runden: [
    {
      id: 'termin',
      typ: 'station',
      frage: 'Du tippst in der Akte auf „Speichern“. Wo landet der neue Termin am Ende?',
      richtig: 'datenbank',
      erklaerung: 'Der Termin reist vom Handy über den Server in die Datenbank. Dort bleibt er, auch wenn du das Handy ausschaltest.'
    },
    {
      id: 'passwort',
      typ: 'station',
      frage: 'Du meldest dich mit deinem Passwort an. Wer prüft, ob es stimmt?',
      richtig: 'server',
      erklaerung: 'Das Handy schickt das Passwort nur weiter. Prüfen darf nur der Server – am Handy könnte jeder schummeln.'
    },
    {
      id: 'malen',
      typ: 'station',
      frage: 'Wer malt die Knöpfe und die Schrift auf deinen Bildschirm?',
      richtig: 'handy',
      erklaerung: 'Der Server schickt nur eine Bauanleitung (HTML und CSS). Zusammenbauen und anzeigen macht dein Handy selbst.'
    },
    {
      id: 'schloss',
      typ: 'wahl',
      fokus: ['schloss'],
      frage: 'Vor der Adresse im Browser ist ein Schloss. Was heißt das?',
      antworten: [
        { t: 'Der Weg zum Server ist verschlüsselt', r: true },
        { t: 'Die Seite ist sicher und seriös' },
        { t: 'Die Seite kostet nichts' }
      ],
      erklaerung: 'Das Schloss steht für HTTPS: Unterwegs kann niemand mitlesen. Ob die Seite seriös ist, verrät es nicht – auch Betrüger haben ein Schloss.'
    },
    {
      id: 'absturz',
      typ: 'wahl',
      fokus: ['server', 'datenbank'],
      frage: 'Das Programm auf dem Server stürzt ab. Was ist mit den gespeicherten Terminen?',
      antworten: [
        { t: 'Sie sind noch da – in der Datenbank', r: true },
        { t: 'Sie sind alle weg' },
        { t: 'Nur die von heute sind weg' }
      ],
      erklaerung: 'Das Programm ist nur der Bote zwischen Handy und Datenbank. Nach dem Neustart ist alles wieder da.'
    },
    {
      id: 'f404',
      typ: 'wahl',
      fokus: ['server'],
      frage: 'Eine Seite zeigt „404“. Was ist los?',
      antworten: [
        { t: 'Unter dieser Adresse gibt es nichts', r: true },
        { t: 'Der Server ist kaputt' },
        { t: 'Dein Internet ist weg' }
      ],
      erklaerung: '404 heißt: Der Server läuft, findet aber nichts unter dieser Adresse. Meist ist der Link falsch oder veraltet.'
    },
    {
      id: 'f500',
      typ: 'wahl',
      fokus: ['server'],
      frage: 'Eine Seite zeigt „500“. Was ist los?',
      antworten: [
        { t: 'Im Programm auf dem Server ging etwas schief', r: true },
        { t: 'Dein Passwort ist falsch' },
        { t: 'Dein Handy ist zu alt' }
      ],
      erklaerung: '500 heißt: Der Server hat selbst einen Fehler. Am Handy kannst du das nicht reparieren – das ist ein Fall für Claude.'
    },
    {
      id: 'backup',
      typ: 'station',
      frage: 'Ein Backup ist eine Kopie. Bei welcher Station ist sie am wichtigsten?',
      richtig: 'datenbank',
      erklaerung: 'Handy und Programm kann man jederzeit neu einrichten. Die Daten nicht – darum gehört eine Kopie der Datenbank an einen zweiten Ort.'
    },
    {
      id: 'protokoll',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['+ print("Neue Aufnahme:", klient.name)'],
      richtig: 'zurueck',
      erklaerung: 'Damit schreibt der Server den Namen ins Protokoll. Klientendaten haben dort nichts verloren – Protokolle werden lange aufbewahrt und bei Fehlern herumgeschickt.'
    },
    {
      id: 'geheimnis',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['+ passwort = "Sommer2026"'],
      richtig: 'zurueck',
      erklaerung: 'Hier steht ein Passwort direkt im Code. Code landet in git und oft auf GitHub – Geheimnisse gehören in eine eigene, geschützte Datei.'
    },
    {
      id: 'knopftext',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- knopf.text = "Speichern"', '+ knopf.text = "Termin speichern"'],
      richtig: 'durch',
      erklaerung: 'Hier ändert sich nur die Beschriftung eines Knopfes – keine Daten, keine Sicherheit. So etwas darf durch.'
    }
  ]
};
