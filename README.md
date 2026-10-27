# Brückenwächter

Kleines Lernspiel fürs Handy: Wie funktionieren Apps? Runde für Runde, offline spielbar, als App installierbar.

**Spielen:** https://oguztopac-hub.github.io/brueckenwaechter/

## Aufbau

- `index.html`, `stil.css`, `spiel.js` – Oberfläche und Spiellogik, ohne Frameworks und ohne fremde Server
- `szenen.js` – die bewegten Bilder über jeder Frage (Brücke, Tor, Kiste, Weiche, Maschine, Fließband, Lupe)
- `level1.js` … `level3.js` – Inhalte (Rundentypen `station`, `wahl`, `waechter`, `zeile`); jedes Level wird frei, wenn das vorige geschafft ist
- `sw.js`, `manifest.webmanifest` – Offline-Betrieb und Installation als App
- `werkzeuge/symbol.py` – erzeugt die App-Symbole in `bilder/` (braucht Pillow)

Der Spielstand bleibt auf dem Gerät (localStorage). Es wird nichts gesendet. Die Beispiele sind erfunden.

## Neue Fassung veröffentlichen

1. Ändern und lokal testen (`python -m http.server` im Projektordner).
2. `CACHE` in `sw.js` und `VERSION` in `spiel.js` hochzählen – sonst bleibt auf dem Handy die alte Fassung.
3. Commit und Push auf `main`. GitHub Pages veröffentlicht nach etwa einer Minute.
4. Auf dem Handy die App zweimal öffnen: Beim ersten Mal lädt sie die neue Fassung im Hintergrund.

## Stand

- 27.10.2026: Level 1 „Der Weg eines Klicks“ (11 Runden).
- 28.10.2026: Level 2 „Bausteine von Python“ (12 Runden) und Level 3 „Fehlermeldungen lesen“ (11 Runden, echte Meldungen von Python 3.14).

## Lizenzen

Schriften: Fraunces und Atkinson Hyperlegible, beide SIL Open Font License 1.1.
