/* Level 2 – Bausteine von Python.
   Jede Runde hat eine Szene (szenen.js): kiste = Variable, weiche = if, maschine = Funktion,
   band = for-Schleife, vier = Überblick. Die Szene spielt nach der Antwort ab, was das Programm
   wirklich tut. Bei Weichen-Runden bleibt die Reihenfolge der Antworten fest (links = ja). */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[2] = {
  nr: 2,
  titel: 'Bausteine von Python',
  szene: 'vier',
  merksatz: ['Variable = Kiste.', 'if = Weiche.', 'Funktion = Maschine.', 'for = Fließband.'],
  intro: {
    titel: 'Vier Bausteine reichen für viel',
    text: 'Fast jedes Programm – auch die Akte – besteht aus vier Bausteinen: Kisten merken sich Werte, Weichen entscheiden, Maschinen erledigen Arbeit, Fließbänder wiederholen.'
  },
  runden: [
    {
      id: 'kiste1',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'termine', vorher: '', nachher: '3' },
      code: ['termine = 3'],
      frage: 'Was liegt danach in der Kiste „termine“?',
      antworten: [
        { t: '3', r: true },
        { t: 'Das Wort termine' },
        { t: 'Nichts' }
      ],
      erklaerung: 'Das Gleichheitszeichen heißt hier nicht „ist gleich“, sondern „lege hinein“. Die Kiste heißt termine, drin liegt die 3.'
    },
    {
      id: 'kiste2',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'termine', vorher: '3', karte: '+1', nachher: '4' },
      code: ['termine = 3', 'termine = termine + 1'],
      frage: 'Was liegt am Ende in der Kiste „termine“?',
      antworten: [
        { t: '4', r: true },
        { t: '3' },
        { t: 'termine + 1' }
      ],
      erklaerung: 'Python rechnet erst die rechte Seite aus: 3 + 1 = 4. Das Ergebnis kommt zurück in dieselbe Kiste – die alte 3 ist weg.'
    },
    {
      id: 'text',
      typ: 'wahl',
      szene: 'kiste',
      kiste: { name: 'name', vorher: '', nachher: '"Lars"' },
      code: ['name = "Lars"'],
      frage: 'Warum steht "Lars" in Anführungszeichen?',
      antworten: [
        { t: 'Damit Python weiß: Das ist Text', r: true },
        { t: 'Weil Namen wichtig sind' },
        { t: 'Das ist nur Verzierung' }
      ],
      erklaerung: 'Ohne Anführungszeichen würde Python eine Kiste namens Lars suchen – und keine finden. Mit Anführungszeichen ist es einfach Text.'
    },
    {
      id: 'weiche1',
      typ: 'wahl',
      szene: 'weiche',
      feste: true,
      weiche: { frage: 'alter < 18 ?', ja: 'Jugendarbeit', nein: 'Beratung', ergebnis: 'ja' },
      code: ['alter = 15', 'if alter < 18:', '    print("Jugendarbeit")', 'else:', '    print("Beratung")'],
      frage: 'Was wird ausgegeben?',
      antworten: [
        { t: 'Jugendarbeit', r: true, weg: 'ja' },
        { t: 'Beratung', weg: 'nein' }
      ],
      erklaerung: '15 ist kleiner als 18, also nimmt Python den Ja-Weg. Den else-Weg nimmt es nur, wenn die Bedingung nicht stimmt.'
    },
    {
      id: 'weiche2',
      typ: 'wahl',
      szene: 'weiche',
      feste: true,
      weiche: { frage: 'termine > 0 ?', ja: 'Heute ist was los', nein: 'Freier Tag', ergebnis: 'nein' },
      code: ['termine = 0', 'if termine > 0:', '    print("Heute ist was los")', 'else:', '    print("Freier Tag")'],
      frage: 'Was wird ausgegeben?',
      antworten: [
        { t: 'Heute ist was los', weg: 'ja' },
        { t: 'Freier Tag', r: true, weg: 'nein' }
      ],
      erklaerung: '0 ist nicht größer als 0 – die Bedingung stimmt nicht. Darum nimmt Python den else-Weg.'
    },
    {
      id: 'maschine1',
      typ: 'wahl',
      szene: 'maschine',
      maschine: { name: 'gruss', rein: '"Tiziano"', raus: '"Hallo Tiziano"' },
      code: ['def gruss(name):', '    return "Hallo " + name', '', 'gruss("Tiziano")'],
      frage: 'Was kommt aus der Maschine heraus?',
      antworten: [
        { t: '"Hallo Tiziano"', r: true },
        { t: '"Hallo name"' },
        { t: '"Tiziano"' }
      ],
      erklaerung: 'def baut eine Maschine namens gruss. Gefüttert mit "Tiziano", landet der Name in name – heraus kommt "Hallo Tiziano".'
    },
    {
      id: 'maschine2',
      typ: 'wahl',
      szene: 'maschine',
      maschine: { name: 'gruss', rein: '"Lars"', raus: '"Hallo Lars"' },
      code: ['gruss("Lars")'],
      frage: 'Wozu baut man überhaupt Funktionen?',
      antworten: [
        { t: 'Einmal bauen, oft benutzen', r: true },
        { t: 'Damit der Code länger wird' },
        { t: 'Weil Python es verlangt' }
      ],
      erklaerung: 'Die Gruß-Maschine begrüßt jeden Namen, ohne neu geschrieben zu werden. In der Akte gibt es solche Maschinen fürs Speichern, Prüfen und Anzeigen.'
    },
    {
      id: 'band1',
      typ: 'wahl',
      szene: 'band',
      band: { teile: ['Oguz', 'Lars', 'Tiziano'] },
      code: ['for name in ["Oguz", "Lars", "Tiziano"]:', '    print(name)'],
      frage: 'Wie oft druckt print hier etwas aus?',
      antworten: [
        { t: '3-mal', r: true },
        { t: '1-mal' },
        { t: 'Gar nicht' }
      ],
      erklaerung: 'for nimmt ein Teil nach dem anderen vom Fließband und macht mit jedem dasselbe. Drei Namen, also dreimal print.'
    },
    {
      id: 'band2',
      typ: 'wahl',
      szene: 'band',
      band: { teile: ['Oguz', 'Lars', 'Tiziano'], erste: true },
      code: ['for name in ["Oguz", "Lars", "Tiziano"]:', '    print(name)'],
      frage: 'Welcher Name wird zuerst gedruckt?',
      antworten: [
        { t: 'Oguz', r: true },
        { t: 'Tiziano' },
        { t: 'Alle gleichzeitig' }
      ],
      erklaerung: 'Das Fließband läuft der Reihe nach, vom ersten Teil der Liste bis zum letzten. Gleichzeitig passiert hier nichts.'
    },
    {
      id: 'kommentar',
      typ: 'wahl',
      szene: 'vier',
      fokus: ['maschine'],
      code: ['# Termin in der Datenbank speichern', 'speichere(termin)'],
      frage: 'Was macht die Zeile mit dem # am Anfang?',
      antworten: [
        { t: 'Nichts – sie ist eine Notiz für Menschen', r: true },
        { t: 'Sie speichert den Termin' },
        { t: 'Sie löscht die Zeile darunter' }
      ],
      erklaerung: 'Alles hinter # überspringt Python. Solche Notizen erklären, was der Code darunter tun soll – auch dir.'
    },
    {
      id: 'odertrue',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- if rolle == "vorstand":', '+ if rolle == "vorstand" or True:', '      zeige_alle_akten()'],
      richtig: 'zurueck',
      erklaerung: '„or True“ macht die Bedingung immer wahr – damit sähe jeder alle Akten. Eine Weiche, die immer auf Ja steht, ist keine Weiche mehr.'
    },
    {
      id: 'tippfehler',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['- print("Termin gespeichrt")', '+ print("Termin gespeichert")'],
      richtig: 'durch',
      erklaerung: 'Hier wird nur ein Tippfehler in einer Meldung korrigiert. Keine Weiche, keine Daten – das darf durch.'
    }
  ]
};
