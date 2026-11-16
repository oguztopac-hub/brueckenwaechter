/* Level 6 – Geheimnisse und Zugänge. Beispiele erfunden, keine echten Schlüssel. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[6] = {
  nr: 6,
  titel: 'Geheimnisse und Zugänge',
  szene: 'drei',
  drei: [
    { z: '🔑', name: 'Geheimnis', rolle: 'Passwort, Schlüssel' },
    { z: '📄', name: 'Code', rolle: 'liegt in git' },
    { z: '🌍', name: 'Internet', rolle: 'liest jeder' }
  ],
  merksatz: ['Geheimnisse nie in den Code.', 'Ein Passwort je Dienst.', 'Im Zweifel austauschen.'],
  intro: {
    titel: 'Was geheim ist, bleibt draußen',
    text: 'Passwörter und Schlüssel öffnen Türen. Code dagegen wandert in git und oft ins Internet. Darum dürfen sich Geheimnis und Code nie in derselben Datei treffen.'
  },
  runden: [
    {
      id: 'wohin',
      typ: 'wahl',
      ziel: 0,
      frage: 'Wohin gehört das Passwort der Datenbank?',
      antworten: [
        { t: 'In eine eigene Datei, die git nicht aufnimmt', r: true },
        { t: 'Oben in den Code, damit man es findet' },
        { t: 'In die Commit-Notiz' }
      ],
      erklaerung: 'Üblich ist die Datei .env: Sie liegt nur auf dem Rechner und dem Server, git lässt sie aus. Der Code holt sich das Passwort von dort.'
    },
    {
      id: 'env',
      typ: 'wahl',
      ziel: 0,
      code: ['DB_PASSWORT=…', 'MAIL_SCHLUESSEL=…'],
      frage: 'So sieht eine .env-Datei aus. Wer darf sie sehen?',
      antworten: [
        { t: 'Nur du und der Server', r: true },
        { t: 'Alle, die den Code lesen' },
        { t: 'Jeder mit dem Link' }
      ],
      erklaerung: 'Eine .env ist wie ein Schlüsselbund. Sie wird nicht verschickt, nicht fotografiert und nicht in einen Chat kopiert.'
    },
    {
      id: 'leck',
      typ: 'wahl',
      ziel: 2,
      frage: 'Ein Schlüssel ist versehentlich bei GitHub gelandet. Was jetzt?',
      antworten: [
        { t: 'Den Schlüssel sofort austauschen', r: true },
        { t: 'Die Zeile löschen, dann ist es gut' },
        { t: 'Abwarten, ob etwas passiert' }
      ],
      erklaerung: 'Löschen reicht nicht: Der Schlüssel steht weiter in der Geschichte, und Suchprogramme finden ihn in Minuten. Nur ein neuer Schlüssel macht den alten wertlos.'
    },
    {
      id: 'zweifaktor',
      typ: 'wahl',
      fokus: [0],
      frage: 'Was bringt die Anmeldung mit zweitem Faktor (Code vom Handy)?',
      antworten: [
        { t: 'Ein gestohlenes Passwort reicht allein nicht', r: true },
        { t: 'Das Passwort darf dann kurz sein' },
        { t: 'Die Seite lädt schneller' }
      ],
      erklaerung: 'Wer dein Passwort hat, braucht zusätzlich dein Handy. Das stoppt die meisten Angriffe – auch bei Hetzner und GitHub.'
    },
    {
      id: 'phishing',
      typ: 'wahl',
      ziel: 2,
      frage: 'Eine Mail drängt: „Ihr Server wird heute gesperrt – hier anmelden.“ Was tust du?',
      antworten: [
        { t: 'Nicht klicken, Adresse selbst eintippen', r: true },
        { t: 'Schnell anmelden, bevor es zu spät ist' },
        { t: 'Passwort als Antwort schicken' }
      ],
      erklaerung: 'Zeitdruck ist das Werkzeug der Betrüger. Wer die Adresse selbst eintippt, landet sicher beim echten Anbieter.'
    },
    {
      id: 'eigenes',
      typ: 'wahl',
      fokus: [0],
      frage: 'Warum braucht jeder Dienst ein eigenes Passwort?',
      antworten: [
        { t: 'Wird eines gestohlen, ist nur ein Dienst offen', r: true },
        { t: 'Weil es Vorschrift ist' },
        { t: 'Damit man mehr zu merken hat' }
      ],
      erklaerung: 'Gestohlene Passwörter werden überall durchprobiert. Mit einem Passwort-Manager muss man sich trotzdem nur eines merken.'
    },
    {
      id: 'hash',
      typ: 'wahl',
      fokus: [0],
      code: ['passwort_hash = "$argon2id$v=19$m=65536…"'],
      frage: 'Gute Programme speichern statt des Passworts so einen Zeichensalat. Warum?',
      antworten: [
        { t: 'Wer die Datenbank stiehlt, kennt das Passwort trotzdem nicht', r: true },
        { t: 'Das spart Speicherplatz' },
        { t: 'Damit der Vorstand es nicht lesen kann' }
      ],
      erklaerung: 'Das ist ein Hash: Aus dem Passwort lässt er sich berechnen, zurückrechnen aber nicht. Beim Anmelden wird nur verglichen.'
    },
    {
      id: 'rechte',
      typ: 'wahl',
      fokus: [0],
      frage: 'Wer sollte in einer Akte alle Klienten sehen können?',
      antworten: [
        { t: 'Nur, wer es für seine Arbeit braucht', r: true },
        { t: 'Alle im Verein, das ist einfacher' },
        { t: 'Jeder mit einem Konto' }
      ],
      erklaerung: 'So wenig Rechte wie nötig: Dann kann ein gestohlenes Konto oder ein Versehen nur wenig anrichten.'
    },
    {
      id: 'protokoll',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['+ print("Anmeldung:", benutzer, passwort)'],
      richtig: 'zurueck',
      erklaerung: 'Damit landet jedes eingetippte Passwort im Protokoll. Protokolle liest man bei Fehlern, kopiert sie und hebt sie lange auf.'
    },
    {
      id: 'umgebung',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- schluessel = "abc123"', '+ schluessel = os.environ["SCHLUESSEL"]'],
      richtig: 'durch',
      erklaerung: 'Genau richtig herum: Der Schlüssel verschwindet aus dem Code und wird aus der geschützten Umgebung geholt.'
    },
    {
      id: 'hintertuer',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- if passwort_stimmt(eingabe):', '+ if passwort_stimmt(eingabe) or eingabe == "test":'],
      richtig: 'zurueck',
      erklaerung: 'Das ist eine Hintertür: Mit dem Wort „test“ käme jeder hinein. So etwas entsteht beim Ausprobieren – und darf nie live gehen.'
    }
  ]
};
