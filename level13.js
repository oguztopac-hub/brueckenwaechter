/* Level 13 – Der Server: wo die Akte wohnt. Befehle und Adressen sind Beispiele. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[13] = {
  nr: 13,
  titel: 'Der Server',
  szene: 'drei',
  drei: [
    { z: '💻', name: 'Laptop', rolle: 'dein Arbeitsplatz' },
    { z: '🖥️', name: 'Server', rolle: 'läuft Tag und Nacht' },
    { z: '💾', name: 'Sicherung', rolle: 'die Kopie woanders' }
  ],
  merksatz: ['Server = Computer, der nie schläft.', 'ssh = Fernbedienung.', 'Sicherung gehört woandershin.'],
  intro: {
    titel: 'Die Akte wohnt nicht auf deinem Handy',
    text: 'Die Akte läuft auf einem gemieteten Computer bei Hetzner, der Tag und Nacht an ist. Vom Laptop aus wird er ferngesteuert, und eine Sicherung liegt an einem anderen Ort.'
  },
  runden: [
    {
      id: 'was',
      typ: 'wahl',
      ziel: 1,
      frage: 'Was ist ein Server eigentlich?',
      antworten: [
        { t: 'Ein Computer, der immer an ist und auf Anfragen wartet', r: true },
        { t: 'Ein besonders schnelles Handy' },
        { t: 'Ein Programm auf deinem Laptop' }
      ],
      erklaerung: 'Ein Server ist ein gewöhnlicher Computer ohne Bildschirm in einem Rechenzentrum. Besonders ist nur: Er ist immer erreichbar.'
    },
    {
      id: 'ssh',
      typ: 'wahl',
      ziel: 1,
      code: ['ssh akte@server'],
      frage: 'Was macht dieser Befehl?',
      antworten: [
        { t: 'Er öffnet eine verschlüsselte Fernbedienung zum Server', r: true },
        { t: 'Er schaltet den Server aus' },
        { t: 'Er lädt die Akte aufs Handy' }
      ],
      erklaerung: 'ssh verbindet deinen Laptop sicher mit dem Server. Was du danach tippst, läuft dort – nicht bei dir.'
    },
    {
      id: 'wo',
      typ: 'wahl',
      ziel: 1,
      code: ['ssh akte@server', 'ls'],
      frage: 'Nach dem ssh-Befehl tippst du ls (Dateien auflisten). Wessen Dateien siehst du?',
      antworten: [
        { t: 'Die auf dem Server', r: true },
        { t: 'Die auf deinem Laptop' },
        { t: 'Die auf deinem Handy' }
      ],
      erklaerung: 'Nach ssh sitzt du gedanklich vor dem Server. Darum steht bei Server-Befehlen die ssh-Zeile immer davor.'
    },
    {
      id: 'name',
      typ: 'wahl',
      ziel: 1,
      frage: 'Wozu dient ein Name wie akte.bruecke-guetersloh.de?',
      antworten: [
        { t: 'Er zeigt auf die Nummer (IP-Adresse) des Servers', r: true },
        { t: 'Er ist das Passwort des Servers' },
        { t: 'Er macht die Verbindung schneller' }
      ],
      erklaerung: 'Server haben Nummern, Menschen merken sich Namen. Das Verzeichnis, das Namen in Nummern übersetzt, heißt DNS.'
    },
    {
      id: 'umzug',
      typ: 'wahl',
      ziel: 1,
      frage: 'Die Vereinsseite ist umgezogen, die Adresse blieb gleich. Was wurde geändert?',
      antworten: [
        { t: 'Der DNS-Eintrag: Der Name zeigt jetzt auf einen anderen Server', r: true },
        { t: 'Nichts – Umziehen geht nicht' },
        { t: 'Alle Besucher mussten etwas umstellen' }
      ],
      erklaerung: 'Der Name ist wie eine Nachsendeadresse. Man ändert nur, wohin er zeigt – für Besucher bleibt alles gleich.'
    },
    {
      id: 'protokoll',
      typ: 'wahl',
      ziel: 1,
      frage: 'Nachts ging auf dem Server etwas schief. Wo steht, was passiert ist?',
      antworten: [
        { t: 'Im Protokoll (Log) des Servers', r: true },
        { t: 'Nirgends' },
        { t: 'In der App auf dem Handy' }
      ],
      erklaerung: 'Der Server führt Tagebuch: Jede Anfrage und jeder Fehler bekommt eine Zeile mit Uhrzeit. Dort beginnt jede Fehlersuche.'
    },
    {
      id: 'neustart',
      typ: 'wahl',
      ziel: 1,
      frage: 'Der Server startet nach einem Update neu. Was muss von allein wieder anlaufen?',
      antworten: [
        { t: 'Das Programm der Akte', r: true },
        { t: 'Dein Laptop' },
        { t: 'Nichts – man startet alles von Hand' }
      ],
      erklaerung: 'Ein Programm, das beim Start von selbst anläuft, heißt Dienst. Sonst wäre die Akte nach jedem Neustart weg, bis es jemand merkt.'
    },
    {
      id: 'update',
      typ: 'wahl',
      ziel: 1,
      frage: 'Warum bekommt ein Server regelmäßig Updates?',
      antworten: [
        { t: 'Sie schließen bekannt gewordene Sicherheitslücken', r: true },
        { t: 'Damit er neuer aussieht' },
        { t: 'Weil der Anbieter daran verdient' }
      ],
      erklaerung: 'Ein Server hängt offen im Internet und wird ständig abgeklopft. Bekannte Lücken werden innerhalb von Tagen ausgenutzt.'
    },
    {
      id: 'ort',
      typ: 'wahl',
      ziel: 2,
      frage: 'Wo liegt eine Sicherung am sichersten?',
      antworten: [
        { t: 'An einem anderen Ort als der Server', r: true },
        { t: 'Auf demselben Server, in einem zweiten Ordner' },
        { t: 'Nur im Kopf' }
      ],
      erklaerung: 'Fällt der Server aus oder wird er gehackt, trifft es alles, was auf ihm liegt – auch die Kopie im Nachbarordner.'
    },
    {
      id: 'probe',
      typ: 'wahl',
      ziel: 2,
      frage: 'Woran erkennst du, dass eine Sicherung etwas taugt?',
      antworten: [
        { t: 'Die Wiederherstellung wurde schon einmal ausprobiert', r: true },
        { t: 'Die Datei ist sehr groß' },
        { t: 'Sie wurde vor langer Zeit angelegt' }
      ],
      erklaerung: 'Eine Sicherung, die noch nie zurückgespielt wurde, ist nur eine Hoffnung. Erst die Probe zeigt, dass alles drin ist.'
    },
    {
      id: 'loeschen',
      typ: 'waechter',
      frage: 'Die KI will diesen Befehl auf dem Server ausführen. Lässt du das durch?',
      code: ['  ssh akte@server', '+ rm -rf /daten/*'],
      richtig: 'zurueck',
      erklaerung: 'rm -rf löscht ohne Nachfrage und ohne Papierkorb – hier alles im Datenordner. Löschen auf dem Server nur nach deinem ausdrücklichen Ja.'
    },
    {
      id: 'status',
      typ: 'waechter',
      frage: 'Die KI will diesen Befehl auf dem Server ausführen. Lässt du das durch?',
      code: ['  ssh akte@server', '+ systemctl status akte'],
      richtig: 'durch',
      erklaerung: 'status zeigt nur an, ob der Dienst läuft. Der Befehl verändert nichts – das darf durch.'
    }
  ]
};
