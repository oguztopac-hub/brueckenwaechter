/* Level 3 – Fehlermeldungen lesen.
   meldung: echte Ausgaben von Python 3.14 (am 27.10.2026 erzeugt, nur der Pfad gekürzt).
   typ "zeile": die Programmzeilen sind die Antworten, richtig = Index der fehlerhaften Zeile. */
window.BW_LEVELS = window.BW_LEVELS || {};
window.BW_LEVELS[3] = {
  nr: 3,
  titel: 'Fehlermeldungen lesen',
  szene: 'lupe',
  merksatz: ['Letzte Zeile zuerst.', 'Zeilennummer zeigt den Ort.', 'Ganze Meldung an Claude.'],
  intro: {
    titel: 'Fehler sind Wegweiser',
    text: 'Eine Fehlermeldung sieht wild aus, sagt dir aber genau, was los ist. Lies sie von unten nach oben: In der letzten Zeile steht, was schiefging – darüber steht, wo.'
  },
  runden: [
    {
      id: 'letzte',
      typ: 'wahl',
      meldung: [
        'Traceback (most recent call last):',
        '  File "akte.py", line 12, in speichern',
        '    db.speichere(termin)',
        'ConnectionError: Datenbank nicht erreichbar'
      ],
      frage: 'Wo steht, was schiefgegangen ist?',
      antworten: [
        { t: 'In der letzten Zeile', r: true },
        { t: 'In der ersten Zeile' },
        { t: 'Nirgends – das ist Computersprache' }
      ],
      erklaerung: 'Python schreibt das Wichtigste nach unten: die Art des Fehlers und eine kurze Erklärung. Hier war die Datenbank nicht erreichbar.'
    },
    {
      id: 'zeilennr',
      typ: 'wahl',
      meldung: [
        'Traceback (most recent call last):',
        '  File "akte.py", line 12, in speichern',
        '    termin.datum = eingabe',
        'ValueError: Datum ungültig'
      ],
      frage: 'In welcher Zeile von akte.py suchst du zuerst?',
      antworten: [
        { t: 'Zeile 12', r: true },
        { t: 'Zeile 1' },
        { t: 'Ganz am Ende der Datei' }
      ],
      erklaerung: '„line 12“ ist die Hausnummer. Dort hat Python gerade gearbeitet, als es krachte – da schaut man zuerst.'
    },
    {
      id: 'nameerror',
      typ: 'wahl',
      code: ['termine = 3', 'print(termin)'],
      meldung: [
        'Traceback (most recent call last):',
        '  File "tag.py", line 2, in <module>',
        '    print(termin)',
        '          ^^^^^^',
        "NameError: name 'termin' is not defined. Did you mean: 'termine'?"
      ],
      frage: 'Was ist das Problem?',
      antworten: [
        { t: 'Tippfehler: Die Kiste heißt termine, nicht termin', r: true },
        { t: 'Es gibt heute keine Termine' },
        { t: 'Python ist kaputt' }
      ],
      erklaerung: 'NameError heißt: Python sucht eine Kiste mit diesem Namen und findet keine. Python hilft sogar mit „Did you mean“ – meinst du termine?'
    },
    {
      id: 'syntax',
      typ: 'zeile',
      zeilen: ['termine = 5', 'if termine > 3', '    print("Voller Tag")'],
      richtig: 1,
      meldung: [
        '  File "tag.py", line 2',
        '    if termine > 3',
        '                  ^',
        "SyntaxError: expected ':'"
      ],
      frage: 'Tippe auf die Zeile mit dem Fehler.',
      erklaerung: 'Hinter if gehört ein Doppelpunkt – in Zeile 2 fehlt er. Das ^ zeigt genau auf die Stelle, wo Python stolpert.'
    },
    {
      id: 'typeerror',
      typ: 'wahl',
      code: ['anzahl = 3', 'print("Termine: " + anzahl)'],
      meldung: [
        'Traceback (most recent call last):',
        '  File "tag.py", line 2, in <module>',
        '    print("Termine: " + anzahl)',
        '          ~~~~~~~~~~~~^~~~~~~~',
        'TypeError: can only concatenate str (not "int") to str'
      ],
      frage: 'Was sagt dir die Meldung?',
      antworten: [
        { t: 'Text und Zahl wurden zusammengeklebt', r: true },
        { t: 'Die Zahl 3 ist zu klein' },
        { t: 'print gibt es nicht' }
      ],
      erklaerung: 'str ist Text, int ist eine Zahl. Python klebt nur Text an Text – die Zahl muss erst zu Text werden: str(anzahl).'
    },
    {
      id: 'datei',
      typ: 'wahl',
      code: ['open("export.csv")'],
      meldung: [
        'Traceback (most recent call last):',
        '  File "tag.py", line 1, in <module>',
        '    open("export.csv")',
        '    ~~~~^^^^^^^^^^^^^^',
        "FileNotFoundError: [Errno 2] No such file or directory: 'export.csv'"
      ],
      frage: 'Was ist los?',
      antworten: [
        { t: 'Die Datei liegt nicht dort, wo das Programm sucht', r: true },
        { t: 'Die Datei ist zu groß' },
        { t: 'Das Internet ist weg' }
      ],
      erklaerung: 'FileNotFound heißt wörtlich: Datei nicht gefunden. Meist stimmt der Ordner nicht oder der Name ist anders geschrieben.'
    },
    {
      id: 'einrueckung',
      typ: 'zeile',
      zeilen: ['if termine > 3:', 'print("Voller Tag")'],
      richtig: 1,
      meldung: [
        '  File "tag.py", line 2',
        '    print("Voller Tag")',
        '    ^^^^^',
        "IndentationError: expected an indented block after 'if' statement on line 1"
      ],
      frage: 'Tippe auf die Zeile mit dem Fehler.',
      erklaerung: 'Was zu einem if gehört, muss eingerückt sein – meist vier Leerzeichen. Zeile 2 steht ganz links, darum weiß Python nicht, dass sie zum if gehört.'
    },
    {
      id: 'claude',
      typ: 'wahl',
      frage: 'In der Akte geht etwas nicht. Was hilft Claude am meisten?',
      antworten: [
        { t: 'Die ganze Fehlermeldung, kopiert', r: true },
        { t: 'Nur: „Geht nicht“' },
        { t: 'Nur die erste Zeile der Meldung' }
      ],
      erklaerung: 'Kopierter Text enthält jede Zeile, jede Nummer, jedes Zeichen. Mit „Geht nicht“ bleibt nur Raten – und die erste Zeile ist die unwichtigste.'
    },
    {
      id: 'vonunten',
      typ: 'wahl',
      frage: 'Im Protokoll stehen 40 Zeilen Fehlermeldung. Wie gehst du vor?',
      antworten: [
        { t: 'Von unten: letzte Zeile, dann die Zeilennummer', r: true },
        { t: 'Von oben alles genau durchlesen' },
        { t: 'Server neu starten und hoffen' }
      ],
      erklaerung: 'Unten steht der eigentliche Fehler, direkt darüber die Stelle im eigenen Code. Der Rest sind oft nur Zwischenstationen.'
    },
    {
      id: 'verschlucken',
      typ: 'waechter',
      frage: 'Die KI meldet: „Fehler behoben!“ Lässt du diese Änderung durch?',
      code: ['  try:', '      speichere(termin)', '+ except:', '+     pass'],
      richtig: 'zurueck',
      erklaerung: 'except: pass verschluckt jeden Fehler still. Der Termin wird dann nicht gespeichert – und niemand merkt es. Der Fehler ist nicht behoben, nur versteckt.'
    },
    {
      id: 'weiterreichen',
      typ: 'waechter',
      frage: 'Die KI will diese Änderung in die Akte einbauen. Lässt du sie durch?',
      code: ['  except Exception as fehler:', '+     print("Speichern fehlgeschlagen:", fehler)', '      raise'],
      richtig: 'durch',
      erklaerung: 'Der Fehler wird ins Protokoll geschrieben und danach weitergereicht (raise) – nichts wird versteckt, keine Klientendaten. Das darf durch.'
    }
  ]
};
