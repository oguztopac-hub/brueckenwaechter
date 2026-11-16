/* Level 12 – Wie eine KI arbeitet: Prompt, Modell, Antwort. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[12] = {
  nr: 12,
  titel: 'Wie eine KI arbeitet',
  szene: 'drei',
  drei: [
    { z: '💬', name: 'Prompt', rolle: 'deine Anfrage' },
    { z: '🧠', name: 'Modell', rolle: 'rechnet Wort für Wort' },
    { z: '📝', name: 'Antwort', rolle: 'klingt immer sicher' }
  ],
  merksatz: ['Die KI rechnet Wörter.', 'Sicher klingen heißt nicht richtig.', 'Fakten nachprüfen.'],
  intro: {
    titel: 'Eine KI rät sehr gut',
    text: 'Ein Sprachmodell hat aus riesigen Textmengen gelernt, welches Wort auf welches folgt. Es schreibt Stück für Stück weiter – oft richtig, manchmal frei erfunden, immer im selben sicheren Ton.'
  },
  runden: [
    {
      id: 'kern',
      typ: 'wahl',
      ziel: 1,
      frage: 'Was macht ein Sprachmodell wie Claude im Kern?',
      antworten: [
        { t: 'Es berechnet Stück für Stück das nächste passende Wort', r: true },
        { t: 'Es schlägt jede Antwort in einem Lexikon nach' },
        { t: 'Ein Mensch tippt die Antworten' }
      ],
      erklaerung: 'Das Modell rechnet aus, wie der Text am wahrscheinlichsten weitergeht. Dass dabei so viel Richtiges herauskommt, liegt an der Menge des Gelernten.'
    },
    {
      id: 'erfunden',
      typ: 'wahl',
      ziel: 2,
      frage: 'Die KI nennt dir einen Paragrafen, den es gar nicht gibt. Wie nennt man das?',
      antworten: [
        { t: 'Halluzination: klingt richtig, ist erfunden', r: true },
        { t: 'Einen Tippfehler' },
        { t: 'Einen Virus' }
      ],
      erklaerung: 'Das Modell merkt nicht, wenn es etwas erfindet – es schreibt einfach plausibel weiter. Am Ton erkennt man es nicht.'
    },
    {
      id: 'pruefen',
      typ: 'wahl',
      ziel: 2,
      frage: 'Wann prüfst du eine KI-Antwort an der Quelle nach?',
      antworten: [
        { t: 'Bei Fristen, Zahlen, Paragrafen und Namen', r: true },
        { t: 'Nie – die KI weiß es besser' },
        { t: 'Nur bei sehr langen Antworten' }
      ],
      erklaerung: 'Für Formulierungen und Ideen reicht die KI. Sobald etwas rechtlich oder finanziell zählt, gehört ein Blick in die echte Quelle dazu.'
    },
    {
      id: 'kontext',
      typ: 'wahl',
      ziel: 0,
      frage: 'Was ist das „Kontextfenster“ einer KI?',
      antworten: [
        { t: 'Alles, was sie in diesem Gespräch gerade vor sich hat', r: true },
        { t: 'Das Fenster der App auf dem Bildschirm' },
        { t: 'Ihr gesamtes Wissen' }
      ],
      erklaerung: 'Das Kontextfenster ist ihr Schreibtisch: dein Auftrag, die gelesenen Dateien, der bisherige Verlauf. Wird es voll, fällt Altes herunter.'
    },
    {
      id: 'neu',
      typ: 'wahl',
      ziel: 0,
      frage: 'Du beginnst ein neues Gespräch. Was weiß die KI vom alten?',
      antworten: [
        { t: 'Nur, was irgendwo aufgeschrieben wurde', r: true },
        { t: 'Alles, Wort für Wort' },
        { t: 'Sie fragt beim alten Gespräch nach' }
      ],
      erklaerung: 'Jedes Gespräch startet mit leerem Schreibtisch. Darum stehen Stand und Regeln in Dateien wie STATUS.md – die liest sie am Anfang wieder ein.'
    },
    {
      id: 'token',
      typ: 'wahl',
      ziel: 1,
      frage: 'Was ist ein Token?',
      antworten: [
        { t: 'Ein Wortstück – die Einheit, in der die KI liest und schreibt', r: true },
        { t: 'Ein Passwort für die KI' },
        { t: 'Eine Münze im Spiel' }
      ],
      erklaerung: 'Texte werden in Wortstücke zerlegt. In Tokens misst man, wie viel in den Kontext passt und wie viel vom Nutzungslimit verbraucht ist.'
    },
    {
      id: 'auftrag',
      typ: 'wahl',
      ziel: 0,
      frage: 'Welcher Auftrag bringt das bessere Ergebnis?',
      antworten: [
        { t: 'Einladung zum Heiligabend-Essen, herzlich, 5 Sätze, für Instagram', r: true },
        { t: 'Schreib was zu Weihnachten' }
      ],
      erklaerung: 'Die KI kann nicht in deinen Kopf schauen. Zweck, Ton, Länge und Ort machen aus Raten ein Ergebnis, das passt.'
    },
    {
      id: 'stichtag',
      typ: 'wahl',
      ziel: 1,
      frage: 'Die KI kennt ein Ereignis von letzter Woche nicht. Warum?',
      antworten: [
        { t: 'Ihr gelerntes Wissen endet an einem Stichtag', r: true },
        { t: 'Sie will es nicht sagen' },
        { t: 'Das Internet war langsam' }
      ],
      erklaerung: 'Ein Modell wird einmal trainiert, danach lernt es nichts mehr dazu. Neueres weiß es nur, wenn es nachschlägt oder du es ihm gibst.'
    },
    {
      id: 'klein',
      typ: 'wahl',
      ziel: 1,
      frage: 'Wofür reicht ein kleineres, sparsameres Modell?',
      antworten: [
        { t: 'Für einfache, klar umrissene Aufgaben', r: true },
        { t: 'Für gar nichts' },
        { t: 'Für die schwierigsten Entscheidungen' }
      ],
      erklaerung: 'Kleine Modelle sind schneller und verbrauchen weniger vom Limit. Für Kniffliges und für Prüfungen nimmt man das große.'
    },
    {
      id: 'klienten',
      typ: 'wahl',
      ziel: 0,
      frage: 'Was gehört nicht in eine Anfrage an die KI?',
      antworten: [
        { t: 'Namen und Einzelfälle von Klienten', r: true },
        { t: 'Der Wunsch nach einem freundlichen Ton' },
        { t: 'Die gewünschte Länge' }
      ],
      erklaerung: 'Was im Prompt steht, verlässt den Rechner. Klientendaten bleiben draußen oder werden vorher unkenntlich gemacht.'
    },
    {
      id: 'ungeprueft',
      typ: 'waechter',
      frage: 'Die KI hat die Frist „aus dem Gesetz“ eingebaut. Nachgeschlagen hat sie niemand. Lässt du das durch?',
      code: ['+ # Frist laut KI, Quelle nicht geprüft', '+ frist_tage = 21'],
      richtig: 'zurueck',
      erklaerung: 'Eine Frist ist ein Fakt, kein Geschmack. Erst die Quelle prüfen – dann darf die Zahl in die Akte.'
    }
  ]
};
