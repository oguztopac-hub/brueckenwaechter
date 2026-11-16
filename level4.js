/* Level 4 – git: das Gedächtnis des Projekts.
   Szene "drei" (szenen.js): drei frei beschriftete Stationen. ziel = Station, zu der der Ball rollt. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[4] = {
  nr: 4,
  titel: 'git – das Gedächtnis',
  szene: 'drei',
  drei: [
    { z: '💻', name: 'Arbeitsordner', rolle: 'hier wird geändert' },
    { z: '📸', name: 'Commit', rolle: 'Schnappschuss' },
    { z: '☁️', name: 'GitHub', rolle: 'Kopie im Netz' }
  ],
  merksatz: ['Commit = Schnappschuss.', 'Push = Kopie ins Netz.', 'Geheimnisse nie committen.'],
  intro: {
    titel: 'git merkt sich jeden Stand',
    text: 'git ist das Gedächtnis eines Projekts. Du änderst im Arbeitsordner, ein Commit hält den Stand als Schnappschuss fest, ein Push legt eine Kopie bei GitHub ab.'
  },
  runden: [
    {
      id: 'commit',
      typ: 'wahl',
      ziel: 1,
      frage: 'Was ist ein Commit?',
      antworten: [
        { t: 'Ein Schnappschuss des Projekts mit einer Notiz', r: true },
        { t: 'Eine Kopie auf einem USB-Stick' },
        { t: 'Ein Fehler im Programm' }
      ],
      erklaerung: 'Ein Commit hält fest, wie alle Dateien in diesem Moment aussehen – dazu eine kurze Notiz, was geändert wurde.'
    },
    {
      id: 'ungesichert',
      typ: 'wahl',
      ziel: 0,
      frage: 'Du hast eine Datei geändert, aber noch nicht committet. Wo gibt es die Änderung?',
      antworten: [
        { t: 'Nur im Arbeitsordner auf dem Rechner', r: true },
        { t: 'Schon bei GitHub' },
        { t: 'In jedem alten Commit' }
      ],
      erklaerung: 'Ohne Commit kennt git die Änderung noch nicht. Sie liegt nur als Datei auf dem Rechner – geht sie verloren, ist sie weg.'
    },
    {
      id: 'status',
      typ: 'wahl',
      ziel: 0,
      code: ['git status'],
      frage: 'Was zeigt dieser Befehl?',
      antworten: [
        { t: 'Was sich seit dem letzten Commit geändert hat', r: true },
        { t: 'Ob das Internet funktioniert' },
        { t: 'Wie viel Speicher frei ist' }
      ],
      erklaerung: 'git status ist der Blick auf den Schreibtisch: welche Dateien neu, geändert oder gelöscht sind. Der Befehl ändert selbst nichts.'
    },
    {
      id: 'push',
      typ: 'wahl',
      ziel: 2,
      code: ['git push'],
      frage: 'Was macht dieser Befehl?',
      antworten: [
        { t: 'Er schickt deine Commits zu GitHub', r: true },
        { t: 'Er löscht den letzten Commit' },
        { t: 'Er startet das Programm' }
      ],
      erklaerung: 'Erst mit push verlassen die Commits deinen Rechner. Davor liegen sie nur lokal.'
    },
    {
      id: 'log',
      typ: 'wahl',
      ziel: 1,
      code: ['git log --oneline', '31c7213 Level 2 und Level 3', '81a2093 Level 1'],
      frage: 'Welcher Commit ist der neueste?',
      antworten: [
        { t: 'Der oberste: 31c7213', r: true },
        { t: 'Der unterste: 81a2093' },
        { t: 'Das sieht man hier nicht' }
      ],
      erklaerung: 'git log zeigt die Geschichte, das Neueste steht oben. Die Zeichenfolge vorne ist die Kennung des Commits – wie eine Belegnummer.'
    },
    {
      id: 'nachricht',
      typ: 'wahl',
      ziel: 1,
      frage: 'Welche Commit-Notiz hilft dir in drei Monaten?',
      antworten: [
        { t: 'Speichern prüft jetzt das Datum', r: true },
        { t: 'Update' },
        { t: 'Diverses geändert' }
      ],
      erklaerung: 'Eine gute Notiz sagt, was sich geändert hat. „Update“ steht irgendwann zwanzigmal untereinander und hilft niemandem.'
    },
    {
      id: 'zurueck',
      typ: 'wahl',
      ziel: 1,
      frage: 'Seit der letzten Änderung geht das Speichern nicht mehr. Was ist das Gute an git?',
      antworten: [
        { t: 'Man kann zum Stand davor zurückkehren', r: true },
        { t: 'git repariert den Fehler von allein' },
        { t: 'Nichts – jetzt ist alles verloren' }
      ],
      erklaerung: 'Jeder Commit ist ein Stand, zu dem man zurück kann. Darum lieber oft und in kleinen Schritten committen.'
    },
    {
      id: 'branch',
      typ: 'wahl',
      fokus: [1],
      frage: 'Was ist ein Branch (Zweig)?',
      antworten: [
        { t: 'Eine Abzweigung zum Ausprobieren, der Hauptstand bleibt heil', r: true },
        { t: 'Eine Sicherheitskopie auf dem Server' },
        { t: 'Ein anderes Wort für Fehler' }
      ],
      erklaerung: 'Auf einem Zweig kann man bauen und testen, ohne den Hauptstand anzufassen. Bei der Vereinsseite heißt der Arbeitszweig feedback-v2.'
    },
    {
      id: 'laptop',
      typ: 'wahl',
      ziel: 2,
      frage: 'Dein Laptop geht kaputt. Welche Commits sind noch da?',
      antworten: [
        { t: 'Alle, die schon gepusht waren', r: true },
        { t: 'Alle, egal ob gepusht' },
        { t: 'Keiner' }
      ],
      erklaerung: 'Was nur lokal lag, ist mit dem Laptop weg. Was bei GitHub liegt, lässt sich auf jedem neuen Rechner wieder holen.'
    },
    {
      id: 'envdatei',
      typ: 'waechter',
      frage: 'Die KI will diese zwei neuen Dateien committen. Lässt du das durch?',
      code: ['+ neue Datei: termine.py', '+ neue Datei: .env'],
      richtig: 'zurueck',
      erklaerung: 'In .env stehen Passwörter und Schlüssel. Einmal committet, bleiben sie für immer in der Geschichte – und nach dem Push bei GitHub.'
    },
    {
      id: 'gitignore',
      typ: 'waechter',
      frage: 'Die KI will diese Zeilen in die Datei .gitignore schreiben. Lässt du sie durch?',
      code: ['+ .env', '+ kern.db'],
      richtig: 'durch',
      erklaerung: '.gitignore ist die Liste der Dateien, die git nie aufnehmen soll. Geheimnisse und Datenbanken gehören genau dorthin.'
    }
  ]
};
