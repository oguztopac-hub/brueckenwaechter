/* Level 8 – Listen und Wörterbücher (Python, Teil 2).
   Nutzt die Szenen aus Level 2 (band, kiste, maschine, weiche) und die Lupe aus Level 3.
   Die Fehlermeldung ist eine echte Ausgabe von Python 3.14 (16.11.2026, nur der Pfad gekürzt). */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[8] = {
  nr: 8,
  titel: 'Listen und Wörterbücher',
  szene: 'vier',
  merksatz: ['Liste = Reihe mit Nummern.', 'Gezählt wird ab 0.', 'Wörterbuch = Fächer mit Namen.'],
  intro: {
    titel: 'Viele Werte in einer Kiste',
    text: 'Eine Liste hält mehrere Werte in fester Reihenfolge, ein Wörterbuch hält Werte unter Namen. Fast alle Daten der Akte reisen in diesen zwei Formen durchs Programm.'
  },
  runden: [
    {
      id: 'liste',
      typ: 'wahl',
      szene: 'band',
      band: { teile: ['Mo', 'Mi', 'Fr'] },
      code: ['tage = ["Mo", "Mi", "Fr"]', 'for tag in tage:', '    print(tag)'],
      frage: 'Wie viele Zeilen druckt das Programm?',
      antworten: [
        { t: '3', r: true },
        { t: '1' },
        { t: '7' }
      ],
      erklaerung: 'Die eckigen Klammern bauen eine Liste mit drei Einträgen. Das Fließband nimmt einen nach dem anderen.'
    },
    {
      id: 'null',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'erster', vorher: '', nachher: '"Mo"' },
      code: ['tage = ["Mo", "Mi", "Fr"]', 'erster = tage[0]'],
      frage: 'Was liegt danach in der Kiste „erster“?',
      antworten: [
        { t: '"Mo"', r: true },
        { t: '"Mi"' },
        { t: 'Nichts – Platz 0 gibt es nicht' }
      ],
      erklaerung: 'Python zählt ab 0: tage[0] ist der erste Eintrag. Das ist die häufigste Stolperfalle beim Code-Lesen.'
    },
    {
      id: 'eins',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'tag', vorher: '', nachher: '"Mi"' },
      code: ['tage = ["Mo", "Mi", "Fr"]', 'tag = tage[1]'],
      frage: 'Und was liegt jetzt in „tag“?',
      antworten: [
        { t: '"Mi"', r: true },
        { t: '"Mo"' },
        { t: '"Fr"' }
      ],
      erklaerung: 'Platz 0 ist Mo, Platz 1 ist Mi, Platz 2 ist Fr. Die Nummer ist immer eins kleiner, als man im Alltag zählen würde.'
    },
    {
      id: 'len',
      typ: 'wahl',
      szene: 'maschine',
      maschine: { name: 'len', rein: '3 Tage', raus: '3' },
      code: ['len(["Mo", "Mi", "Fr"])'],
      frage: 'Was kommt aus der Maschine „len“ heraus?',
      antworten: [
        { t: '3', r: true },
        { t: '"Fr"' },
        { t: '2' }
      ],
      erklaerung: 'len steht für Länge und zählt die Einträge. Drei Einträge – auch wenn der letzte Platz die Nummer 2 trägt.'
    },
    {
      id: 'append',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'tage', vorher: '2 Einträge', karte: '"Fr"', nachher: '3 Einträge' },
      code: ['tage = ["Mo", "Mi"]', 'tage.append("Fr")'],
      frage: 'Wie viele Einträge hat „tage“ danach?',
      antworten: [
        { t: '3', r: true },
        { t: '2' },
        { t: '1' }
      ],
      erklaerung: 'append heißt anhängen: Der neue Eintrag kommt hinten an die Liste.'
    },
    {
      id: 'dict',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'uhrzeit', vorher: '', nachher: '"17 Uhr"' },
      code: ['termin = {', '    "titel": "Essen",', '    "uhrzeit": "17 Uhr"', '}', 'uhrzeit = termin["uhrzeit"]'],
      frage: 'Was liegt am Ende in der Kiste „uhrzeit“?',
      antworten: [
        { t: '"17 Uhr"', r: true },
        { t: '"Essen"' },
        { t: '"uhrzeit"' }
      ],
      erklaerung: 'Geschweifte Klammern bauen ein Wörterbuch: links der Name des Fachs, rechts der Wert. Geholt wird über den Namen.'
    },
    {
      id: 'wozu',
      typ: 'wahl',
      szene: 'vier',
      fokus: ['kiste'],
      frage: 'Was kann ein Wörterbuch besser als eine Liste?',
      antworten: [
        { t: 'Werte über einen Namen finden statt über eine Nummer', r: true },
        { t: 'Mehr Einträge speichern' },
        { t: 'Schneller rechnen' }
      ],
      erklaerung: 'termin["uhrzeit"] sagt selbst, was gemeint ist. termin[1] müsste man erst nachzählen.'
    },
    {
      id: 'in',
      typ: 'wahl',
      szene: 'weiche',
      feste: true,
      weiche: { frage: '"Sa" in tage ?', ja: 'Offen', nein: 'Geschlossen', ergebnis: 'nein' },
      code: ['tage = ["Mo", "Mi", "Fr"]', 'if "Sa" in tage:', '    print("Offen")', 'else:', '    print("Geschlossen")'],
      frage: 'Was wird ausgegeben?',
      antworten: [
        { t: 'Offen', weg: 'ja' },
        { t: 'Geschlossen', r: true, weg: 'nein' }
      ],
      erklaerung: '„in“ fragt: Steht das in der Liste? Sa steht nicht drin, also nimmt Python den else-Weg.'
    },
    {
      id: 'leer',
      typ: 'wahl',
      szene: 'weiche',
      feste: true,
      weiche: { frage: 'Liste leer ?', ja: 'Freier Tag', nein: 'Termine!', ergebnis: 'ja' },
      code: ['termine = []', 'if len(termine) == 0:', '    print("Freier Tag")', 'else:', '    print("Termine!")'],
      frage: 'Was wird ausgegeben?',
      antworten: [
        { t: 'Freier Tag', r: true, weg: 'ja' },
        { t: 'Termine!', weg: 'nein' }
      ],
      erklaerung: 'Zwei eckige Klammern ohne Inhalt sind eine leere Liste. Ihre Länge ist 0 – die Bedingung stimmt.'
    },
    {
      id: 'index',
      typ: 'wahl',
      szene: 'lupe',
      code: ['tage = ["Mo", "Mi", "Fr"]', 'print(tage[3])'],
      meldung: [
        'Traceback (most recent call last):',
        '  File "tag.py", line 2, in <module>',
        '    print(tage[3])',
        '          ~~~~^^^',
        'IndexError: list index out of range'
      ],
      frage: 'Warum kracht es hier?',
      antworten: [
        { t: 'Es gibt nur die Plätze 0, 1 und 2', r: true },
        { t: 'Die Liste ist leer' },
        { t: 'print kann keine Listen' }
      ],
      erklaerung: '„index out of range“ heißt: Diese Platznummer gibt es nicht. Drei Einträge enden bei Platz 2.'
    },
    {
      id: 'nurzehn',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- for klient in klienten:', '+ for klient in klienten[:10]:', '      erinnere(klient)'],
      richtig: 'zurueck',
      erklaerung: '[:10] nimmt nur die ersten zehn Einträge. Alle anderen bekämen keine Erinnerung – ohne jede Fehlermeldung.'
    },
    {
      id: 'tagdazu',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- sprechtage = ["Mo", "Mi"]', '+ sprechtage = ["Mo", "Mi", "Fr"]'],
      richtig: 'durch',
      erklaerung: 'Die Liste bekommt einen Eintrag mehr, sonst ändert sich nichts. Wenn Freitag gewollt ist, darf das durch.'
    }
  ]
};
