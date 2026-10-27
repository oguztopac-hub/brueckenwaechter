/* Brückenwächter – Spiellogik. Inhalte stehen in level1.js … level3.js, die Bilder in szenen.js.
   Spielstand und Einstellungen liegen nur auf dem Gerät (localStorage). */
(() => {
  'use strict';

  const VERSION = '2';            // bei jeder Veröffentlichung mit CACHE in sw.js hochzählen
  const LEVELS = window.BW_LEVELS;
  const NUMMERN = Object.keys(LEVELS).map(Number).sort((a, b) => a - b);
  const SZENEN = window.BW_SZENEN;
  const K_EINST = 'bw-einstellungen';
  const kStand = (n) => `bw-stand-l${n}`;
  const kBest = (n) => `bw-best-l${n}`;
  const STATIONEN = { handy: 'Handy', server: 'Server', datenbank: 'Datenbank' };
  const ROLLEN = { handy: 'zeigt an', server: 'entscheidet', datenbank: 'merkt sich' };
  const WAECHTER = { durch: 'Durchlassen', zurueck: 'Zurückschicken' };
  const LOB = ['Richtig!', 'Genau!', 'Stark!', 'Sauber!'];
  const WENIG_BEWEGUNG = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  const el = {
    levelListe: $('levelListe'), spielen: $('spielenKnopf'), neu: $('neuKnopf'),
    install: $('installKnopf'), installTipp: $('installTipp'), fuss: $('fuss'),
    zurueck: $('zurueckKnopf'), zaehler: $('kopfZaehler'), punkte: $('punkte'), ton: $('tonKnopf'), balken: $('balken'),
    szene: $('szene'), hinweis: $('rundeHinweis'), frage: $('frage'), text: $('text'),
    code: $('code'), legende: $('legende'), meldung: $('meldung'), antworten: $('antworten'),
    blatt: $('blatt'), schleier: $('schleier'), blattTitel: $('blattTitel'), blattLoesung: $('blattLoesung'),
    blattText: $('blattText'), blattPunkte: $('blattPunkte'), weiter: $('weiterKnopf'),
    endeLevel: $('endeLevel'), endePunkte: $('endePunkte'), endeErste: $('endeErste'), endeSerie: $('endeSerie'),
    endeRekord: $('endeRekord'), endeHinweis: $('endeHinweis'), endeMerksatz: $('endeMerksatz'), konfetti: $('konfetti'),
    naechstes: $('naechstesKnopf'), nochmal: $('nochmalKnopf'), zumStart: $('zumStartKnopf')
  };

  // ---------- Speicher (kann im privaten Modus fehlen – dann eben ohne) ----------
  function lies(k, ersatz) {
    try { const w = localStorage.getItem(k); return w ? JSON.parse(w) : ersatz; } catch (_) { return ersatz; }
  }
  function schreib(k, w) { try { localStorage.setItem(k, JSON.stringify(w)); } catch (_) { /* egal */ } }
  function loesch(k) { try { localStorage.removeItem(k); } catch (_) { /* egal */ } }

  const einst = Object.assign({ ton: true, intros: {} }, lies(K_EINST, {}));
  if (einst.intro === true) { einst.intros[1] = true; delete einst.intro; }   // Stand aus Version 1

  function ladeStand(n) {
    const s = lies(kStand(n), null);
    if (!s || !Array.isArray(s.schlange) || !s.schlange.length || !Array.isArray(s.geschafft)) return null;
    const ids = new Set(LEVELS[n].runden.map((r) => r.id));
    return s.schlange.every((id) => ids.has(id)) ? s : null;
  }
  function neuerStand() {
    return { schlange: LEVEL.runden.map((r) => r.id), geschafft: [], versuche: {}, punkte: 0, serie: 0, besteSerie: 0, ersteRichtig: 0 };
  }
  const geschafft = (n) => Boolean(lies(kBest(n), null));
  const frei = (n) => n === NUMMERN[0] || geschafft(NUMMERN[NUMMERN.indexOf(n) - 1]);
  function empfohlen() {
    return NUMMERN.find((n) => frei(n) && ladeStand(n))
      || NUMMERN.find((n) => frei(n) && !geschafft(n))
      || NUMMERN[0];
  }

  let nr = NUMMERN[0];
  let LEVEL = LEVELS[nr];
  let stand = null;
  let gesperrt = false;
  let token = 0;   // wechselt mit jeder neuen Szene, damit alte Animationen abbrechen
  const szenen = {};
  let szeneJetzt = null;
  const gesamt = () => LEVEL.runden.length;

  // ---------- Ton und Vibration (selbst erzeugt, keine Dateien) ----------
  let audio = null;
  function klang(freq, start, dauer, art, laut) {
    if (!einst.ton) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const o = audio.createOscillator();
      const g = audio.createGain();
      const t = audio.currentTime + start;
      o.type = art;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(laut, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      o.connect(g);
      g.connect(audio.destination);
      o.start(t);
      o.stop(t + dauer + 0.03);
    } catch (_) { /* ohne Ton weiter */ }
  }
  const ton = {
    tipp() { klang(880, 0, 0.05, 'sine', 0.04); },
    richtig() { klang(660, 0, 0.14, 'triangle', 0.12); klang(990, 0.1, 0.24, 'triangle', 0.12); },
    falsch() { klang(247, 0, 0.2, 'sine', 0.14); klang(185, 0.13, 0.3, 'sine', 0.12); },
    ende() { [523, 659, 784, 1047].forEach((f, i) => klang(f, i * 0.12, 0.32, 'triangle', 0.1)); }
  };
  function vibriere(muster) {
    if (!einst.ton || !navigator.vibrate) return;
    try { navigator.vibrate(muster); } catch (_) { /* egal */ }
  }
  const ICON_AN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_AUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
  function tonKnopfZeigen() {
    el.ton.innerHTML = einst.ton ? ICON_AN : ICON_AUS;
    el.ton.setAttribute('aria-label', einst.ton ? 'Ton und Vibration aus' : 'Ton und Vibration an');
  }

  // ---------- Bewegung ----------
  const sanft = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function bewege(dauer, schritt, tok) {
    return new Promise((fertig) => {
      const d = WENIG_BEWEGUNG ? 1 : dauer;
      const t0 = performance.now();
      const bild = (jetzt) => {
        if (tok !== undefined && tok !== token) { fertig(); return; }
        const t = Math.min(1, (jetzt - t0) / d);
        schritt(sanft(t), t);
        if (t < 1) requestAnimationFrame(bild); else fertig();
      };
      requestAnimationFrame(bild);
    });
  }
  const warte = (ms) => new Promise((r) => setTimeout(r, WENIG_BEWEGUNG ? 0 : ms));
  function helfer() {
    const tok = token;
    return { bewege: (d, f) => bewege(d, f, tok), warte, aktiv: () => tok === token };
  }

  // ---------- Szenen ----------
  function holeSzene(name) {
    if (!szenen[name]) {
      const def = SZENEN[name];
      const vorlage = document.createElement('template');
      vorlage.innerHTML = def.svg.trim();
      const svg = vorlage.content.firstElementChild;
      el.szene.appendChild(svg);
      const s = { name, def, svg };
      if (def.start) def.start(s);
      szenen[name] = s;
    }
    return szenen[name];
  }
  function szeneZeigen(name) {
    token++;
    const s = holeSzene(name);
    Object.values(szenen).forEach((x) => x.svg.toggleAttribute('hidden', x !== s));   // SVG kennt .hidden nicht
    s.svg.classList.remove('waehlbar');
    szeneJetzt = s;
    return s;
  }

  // ---------- Bildschirme ----------
  function zeige(name) {
    token++;
    ['start', 'spiel', 'ende'].forEach((s) => $(s).classList.toggle('aktiv', s === name));
    blattZu();
    gesperrt = false;
  }

  function merksatz(ziel, level) {
    ziel.replaceChildren(...level.merksatz.map((satz) => {
      const s = document.createElement('span');
      s.textContent = satz;
      return s;
    }));
  }

  function levelKarte(n) {
    const L = LEVELS[n];
    const zahl = L.runden.length;
    const best = lies(kBest(n), null);
    const lauf = ladeStand(n);
    const offen = frei(n);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `level-karte${offen ? '' : ' gesperrt'}${best ? ' fertig' : ''}`;
    b.disabled = !offen;
    const kopfzeile = document.createElement('div');
    kopfzeile.className = 'level-nr';
    kopfzeile.textContent = `Level ${n}${best ? ' ✓' : ''}${offen ? '' : ' 🔒'}`;
    const titel = document.createElement('div');
    titel.className = 'level-titel';
    titel.textContent = L.titel;
    const zeile = document.createElement('div');
    zeile.className = 'level-stand';
    if (!offen) zeile.textContent = `Erst Level ${NUMMERN[NUMMERN.indexOf(n) - 1]} schaffen`;
    else if (lauf) zeile.textContent = `Weiter bei Runde ${Math.min(lauf.geschafft.length + 1, zahl)} von ${zahl}`;
    else if (best) zeile.textContent = `Geschafft · Bestwert ${best.punkte} von ${zahl * 10} Punkten`;
    else zeile.textContent = `${zahl} Runden · etwa 5 Minuten`;
    b.append(kopfzeile, titel, zeile);
    b.addEventListener('click', () => spielen(n, false));
    return b;
  }

  function zeigeStart() {
    zeige('start');
    el.levelListe.replaceChildren(...NUMMERN.map(levelKarte));
    const n = empfohlen();
    const lauf = ladeStand(n);
    el.spielen.textContent = lauf ? `Weiter: Level ${n}` : geschafft(n) ? `Nochmal: Level ${n}` : `Spielen: Level ${n}`;
    el.spielen.dataset.level = n;
    el.neu.hidden = !lauf;
    el.neu.dataset.level = n;
  }

  function spielen(n, vonVorn) {
    ton.tipp();
    nr = n;
    LEVEL = LEVELS[n];
    stand = vonVorn ? null : ladeStand(n);
    if (!stand) {
      stand = neuerStand();
      schreib(kStand(nr), stand);
    }
    if (!history.state || history.state.bw !== 'spiel') history.pushState({ bw: 'spiel' }, '');
    zeige('spiel');
    if (!einst.intros[nr]) zeigeIntro(); else zeigeRunde();
  }

  function zurStart() {
    if (history.state && history.state.bw === 'spiel') history.back(); else zeigeStart();
  }

  function kopf(pop) {
    const fertig = stand ? stand.geschafft.length : 0;
    el.zaehler.textContent = `Level ${nr} · ${fertig}/${gesamt()}`;
    el.punkte.textContent = stand ? stand.punkte : 0;
    el.balken.style.width = `${(fertig / gesamt()) * 100}%`;
    if (pop) {
      el.punkte.classList.remove('pop');
      void el.punkte.offsetWidth;
      el.punkte.classList.add('pop');
    }
  }

  function knopf(text, klasse, aktion) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = klasse;
    b.textContent = text;
    b.addEventListener('click', aktion);
    return b;
  }

  // Code und Fehlermeldungen: "+ " und "- " am Zeilenanfang markieren eine Änderung
  function zeigeCode(ziel, zeilen, letzteHervorheben) {
    ziel.hidden = !zeilen;
    if (!zeilen) return;
    const teile = [];
    zeilen.forEach((zeile, i) => {
      const s = document.createElement('span');
      const alt = /^- /.test(zeile);
      const neu = /^\+ /.test(zeile);
      const letzte = letzteHervorheben && i === zeilen.length - 1;
      s.className = alt ? 'alt' : neu ? 'neu' : letzte ? 'letzte' : '';
      s.textContent = alt ? `−${zeile.slice(1)}` : zeile;
      teile.push(s);
      if (i < zeilen.length - 1) teile.push('\n');
    });
    ziel.replaceChildren(...teile);
  }

  // ---------- Einführung ----------
  function zeigeIntro() {
    const s = szeneZeigen(LEVEL.intro.szene || LEVEL.szene);
    kopf();
    el.hinweis.hidden = true;
    el.frage.textContent = LEVEL.intro.titel;
    el.frage.classList.add('titel');
    el.text.textContent = LEVEL.intro.text;
    el.text.hidden = false;
    zeigeCode(el.code, null);
    zeigeCode(el.meldung, null);
    el.legende.hidden = true;
    el.antworten.className = 'antworten';
    el.antworten.replaceChildren(knopf('Los geht’s', 'knopf', () => {
      einst.intros[nr] = true;
      schreib(K_EINST, einst);
      ton.tipp();
      zeigeRunde();
    }));
    if (s.def.intro) s.def.intro(s, helfer());
  }

  // ---------- Runden ----------
  const aktuelle = () => (stand ? LEVEL.runden.find((r) => r.id === stand.schlange[0]) : null);

  function zeigeRunde() {
    const r = aktuelle();
    if (!r) { zeigeEnde(); return; }
    const s = szeneZeigen(r.typ === 'waechter' ? 'tor' : (r.szene || LEVEL.szene));
    kopf();
    el.frage.classList.remove('titel');
    el.text.hidden = true;
    el.hinweis.hidden = !stand.versuche[r.id];
    el.frage.textContent = r.frage;
    zeigeCode(el.code, r.typ === 'zeile' ? null : r.code);
    zeigeCode(el.meldung, r.meldung, true);
    el.legende.hidden = !(r.code && r.typ !== 'zeile' && r.code.some((z) => /^[+-] /.test(z)));
    s.def.vorbereiten(s, r, helfer());
    baueAntworten(r);
  }

  function mische(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function antwortKnopf(wert, text, unter, klasse, zeichen) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = klasse ? `antwort ${klasse}` : 'antwort';
    b.dataset.wert = wert;
    if (zeichen) {
      const z = document.createElement('span');
      z.className = 'zeichen';
      z.textContent = zeichen;
      b.append(z);
    }
    b.append(text);
    if (unter) {
      const s = document.createElement('small');
      s.textContent = unter;
      b.append(s);
    }
    b.addEventListener('click', () => antworten(wert));
    return b;
  }

  function baueAntworten(r) {
    let knoepfe;
    if (r.typ === 'station') {
      el.antworten.className = 'antworten drei';
      knoepfe = Object.keys(STATIONEN).map((s) => antwortKnopf(s, STATIONEN[s], ROLLEN[s]));
    } else if (r.typ === 'waechter') {
      el.antworten.className = 'antworten zwei';
      knoepfe = [
        antwortKnopf('durch', WAECHTER.durch, '', 'durch', '✓'),
        antwortKnopf('zurueck', WAECHTER.zurueck, '', 'zurueck', '✕')
      ];
    } else if (r.typ === 'zeile') {
      el.antworten.className = 'antworten zeilen';
      knoepfe = r.zeilen.map((zeile, i) => {
        const b = antwortKnopf(String(i), '', '', 'zeile');
        const nummer = document.createElement('span');
        nummer.className = 'zeile-nr';
        nummer.textContent = i + 1;
        const c = document.createElement('code');
        c.textContent = zeile;
        b.replaceChildren(nummer, c);
        return b;
      });
    } else {
      const reihe = r.antworten.map((_, i) => i);
      const kurz = r.antworten.length === 2 && r.antworten.every((a) => a.t.length <= 18);
      el.antworten.className = kurz ? 'antworten zwei' : 'antworten';
      knoepfe = (r.feste ? reihe : mische(reihe)).map((i) => antwortKnopf(String(i), r.antworten[i].t));
    }
    el.antworten.replaceChildren(...knoepfe);
  }

  function pruefe(r, wert) {
    if (r.typ === 'wahl') {
      const a = r.antworten[Number(wert)];
      return Boolean(a && a.r);
    }
    if (r.typ === 'zeile') return Number(wert) === r.richtig;
    return wert === r.richtig;
  }
  function loesung(r) {
    if (r.typ === 'station') return STATIONEN[r.richtig];
    if (r.typ === 'waechter') return WAECHTER[r.richtig];
    if (r.typ === 'zeile') return `Zeile ${r.richtig + 1}`;
    return r.antworten.find((a) => a.r).t;
  }

  async function antworten(wert) {
    const r = aktuelle();
    if (gesperrt || !r) return;
    gesperrt = true;
    const s = szeneJetzt;
    const h = helfer();
    s.svg.classList.remove('waehlbar');

    // Erst den Stand sichern – wird die App jetzt geschlossen, geht nichts verloren
    const richtig = pruefe(r, wert);
    const ersterVersuch = !stand.versuche[r.id];
    stand.versuche[r.id] = (stand.versuche[r.id] || 0) + 1;
    stand.schlange.shift();
    let plus = 0;
    if (richtig) {
      plus = ersterVersuch ? 10 : 5;
      stand.punkte += plus;
      stand.serie += 1;
      stand.besteSerie = Math.max(stand.besteSerie, stand.serie);
      if (ersterVersuch) stand.ersteRichtig += 1;
      stand.geschafft.push(r.id);
    } else {
      stand.serie = 0;
      stand.schlange.push(r.id);   // falsch beantwortet: kommt am Ende noch einmal
    }
    schreib(kStand(nr), stand);

    const knoepfe = [...el.antworten.querySelectorAll('.antwort')];
    knoepfe.forEach((b) => {
      b.disabled = true;
      if (b.dataset.wert === wert) b.classList.add('gewaehlt');
    });
    ton.tipp();
    await s.def.antwort(s, r, wert, richtig, h);
    if (!h.aktiv()) return;

    knoepfe.forEach((b) => {
      b.classList.remove('gewaehlt');
      if (pruefe(r, b.dataset.wert)) b.classList.add('richtig');
      else if (b.dataset.wert === wert) b.classList.add('falsch');
      else b.classList.add('gedimmt');
    });
    if (richtig) { ton.richtig(); vibriere(18); } else { ton.falsch(); vibriere([35, 50, 35]); }
    kopf(plus > 0);
    zeigeBlatt(r, richtig, plus);
  }

  // ---------- Rückmeldung ----------
  function zeigeBlatt(r, richtig, plus) {
    el.blatt.classList.toggle('ist-richtig', richtig);
    el.blatt.classList.toggle('ist-falsch', !richtig);
    el.blattTitel.textContent = richtig ? LOB[Math.floor(Math.random() * LOB.length)] : 'Nicht ganz.';
    el.blattLoesung.textContent = richtig ? '' : `Richtig wäre: ${loesung(r)}`;
    el.blattText.textContent = r.erklaerung;
    el.blattPunkte.textContent = richtig
      ? `+${plus} Punkte${stand.serie >= 3 ? ` · ${stand.serie} richtig in Folge` : ''}`
      : 'Diese Frage kommt später noch einmal.';
    el.weiter.textContent = stand.schlange.length ? 'Weiter' : 'Zum Ergebnis';
    el.blatt.classList.add('offen');
    el.schleier.classList.add('offen');
  }
  function blattZu() {
    el.blatt.classList.remove('offen');
    el.schleier.classList.remove('offen');
  }
  function weiter() {
    if (!el.blatt.classList.contains('offen')) return;
    ton.tipp();
    blattZu();
    gesperrt = false;
    if (stand && stand.schlange.length) zeigeRunde(); else zeigeEnde();
  }

  // ---------- Ende ----------
  function zeigeEnde() {
    const ergebnis = { punkte: stand.punkte, ersteRichtig: stand.ersteRichtig, besteSerie: stand.besteSerie };
    const alt = lies(kBest(nr), null);
    const rekord = !alt || ergebnis.punkte > alt.punkte;
    if (rekord) schreib(kBest(nr), ergebnis);
    loesch(kStand(nr));
    stand = null;
    zeige('ende');
    el.endeLevel.textContent = `Level ${nr}`;
    el.endePunkte.textContent = ergebnis.punkte;
    el.endeErste.textContent = `${ergebnis.ersteRichtig}/${gesamt()}`;
    el.endeSerie.textContent = ergebnis.besteSerie;
    el.endeRekord.hidden = !(rekord && alt);
    merksatz(el.endeMerksatz, LEVEL);
    const naechstes = NUMMERN[NUMMERN.indexOf(nr) + 1];
    el.naechstes.hidden = !naechstes;
    if (naechstes) {
      el.naechstes.textContent = `Weiter zu Level ${naechstes}`;
      el.naechstes.dataset.level = naechstes;
    }
    el.nochmal.className = naechstes ? 'knopf-zweit' : 'knopf';
    el.endeHinweis.hidden = Boolean(naechstes);
    konfetti();
    ton.ende();
    vibriere([20, 40, 20, 40, 60]);
  }
  function konfetti() {
    if (WENIG_BEWEGUNG) { el.konfetti.replaceChildren(); return; }
    const teile = [];
    for (let i = 0; i < 24; i++) {
      const k = document.createElement('i');
      k.style.left = `${Math.random() * 100}%`;
      k.style.animationDelay = `${Math.random() * 0.6}s`;
      k.style.animationDuration = `${1.4 + Math.random()}s`;
      teile.push(k);
    }
    el.konfetti.replaceChildren(...teile);
  }

  // ---------- Als App installieren ----------
  let installAnfrage = null;
  const istApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  el.installTipp.hidden = istApp;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installAnfrage = e;
    el.install.hidden = false;
    el.installTipp.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    el.install.hidden = true;
    el.installTipp.hidden = true;
  });
  el.install.addEventListener('click', async () => {
    if (!installAnfrage) return;
    installAnfrage.prompt();
    try { await installAnfrage.userChoice; } catch (_) { /* egal */ }
    installAnfrage = null;
    el.install.hidden = true;
  });

  // ---------- Verdrahtung ----------
  el.spielen.addEventListener('click', () => spielen(Number(el.spielen.dataset.level), false));
  el.neu.addEventListener('click', () => spielen(Number(el.neu.dataset.level), true));
  el.naechstes.addEventListener('click', () => spielen(Number(el.naechstes.dataset.level), false));
  el.nochmal.addEventListener('click', () => spielen(nr, true));
  el.zurueck.addEventListener('click', zurStart);
  el.zumStart.addEventListener('click', zurStart);
  el.weiter.addEventListener('click', weiter);
  el.ton.addEventListener('click', () => {
    einst.ton = !einst.ton;
    schreib(K_EINST, einst);
    tonKnopfZeigen();
    ton.tipp();
  });
  el.szene.addEventListener('click', (e) => {
    const s = szeneJetzt;
    if (gesperrt || !s || !s.svg.classList.contains('waehlbar') || !s.def.tippe) return;
    const w = s.def.tippe(s, aktuelle(), e.target);
    if (w !== null && w !== undefined) antworten(w);
  });
  window.addEventListener('popstate', () => {
    if (!$('start').classList.contains('aktiv')) zeigeStart();
  });

  el.fuss.textContent = `Version ${VERSION} · läuft offline · 0 €`;
  tonKnopfZeigen();
  zeigeStart();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline weiter */ });
  }
})();
