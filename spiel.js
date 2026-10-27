/* Brückenwächter – Spiellogik. Inhalte stehen in level1.js.
   Spielstand und Einstellungen liegen nur auf dem Gerät (localStorage). */
(() => {
  'use strict';

  const VERSION = '1';            // bei jeder Veröffentlichung mit CACHE in sw.js hochzählen
  const LEVEL = window.BW_LEVELS[1];
  const GESAMT = LEVEL.runden.length;
  const K_STAND = 'bw-stand-l1';
  const K_BEST = 'bw-best-l1';
  const K_EINST = 'bw-einstellungen';
  const STATIONEN = { handy: 'Handy', server: 'Server', datenbank: 'Datenbank' };
  const ROLLEN = { handy: 'zeigt an', server: 'entscheidet', datenbank: 'merkt sich' };
  const POS = { handy: 0, server: 0.5, datenbank: 1 };   // Anteil am Brückenpfad
  const WAECHTER = { durch: 'Durchlassen', zurueck: 'Zurückschicken' };
  const LOB = ['Richtig!', 'Genau!', 'Stark!', 'Sauber!'];
  const WENIG_BEWEGUNG = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  const el = {
    startLevelTitel: $('startLevelTitel'), startStand: $('startStand'), startMerksatz: $('startMerksatz'),
    spielen: $('spielenKnopf'), neu: $('neuKnopf'), install: $('installKnopf'), installTipp: $('installTipp'), fuss: $('fuss'),
    zurueck: $('zurueckKnopf'), zaehler: $('kopfZaehler'), punkte: $('punkte'), ton: $('tonKnopf'), balken: $('balken'),
    szeneWeg: $('szeneWeg'), szeneTor: $('szeneTor'), pfad: $('bogenPfad'), ball: $('ball'), schloss: $('schloss'),
    schranke: $('schranke'), paket: $('paket'),
    hinweis: $('rundeHinweis'), frage: $('frage'), text: $('text'), code: $('code'), legende: $('legende'), antworten: $('antworten'),
    blatt: $('blatt'), schleier: $('schleier'), blattTitel: $('blattTitel'), blattLoesung: $('blattLoesung'),
    blattText: $('blattText'), blattPunkte: $('blattPunkte'), weiter: $('weiterKnopf'),
    endePunkte: $('endePunkte'), endeErste: $('endeErste'), endeSerie: $('endeSerie'), endeRekord: $('endeRekord'),
    endeMerksatz: $('endeMerksatz'), konfetti: $('konfetti'), nochmal: $('nochmalKnopf'), zumStart: $('zumStartKnopf')
  };

  // ---------- Speicher (kann im privaten Modus fehlen – dann eben ohne) ----------
  function lies(k, ersatz) {
    try { const w = localStorage.getItem(k); return w ? JSON.parse(w) : ersatz; } catch (_) { return ersatz; }
  }
  function schreib(k, w) { try { localStorage.setItem(k, JSON.stringify(w)); } catch (_) { /* egal */ } }
  function loesch(k) { try { localStorage.removeItem(k); } catch (_) { /* egal */ } }

  function neuerStand() {
    return { schlange: LEVEL.runden.map((r) => r.id), geschafft: [], versuche: {}, punkte: 0, serie: 0, besteSerie: 0, ersteRichtig: 0 };
  }
  function standPruefen(s) {
    if (!s || !Array.isArray(s.schlange) || !s.schlange.length || !Array.isArray(s.geschafft)) return null;
    const ids = new Set(LEVEL.runden.map((r) => r.id));
    return s.schlange.every((id) => ids.has(id)) ? s : null;
  }

  const einst = Object.assign({ ton: true, intro: false }, lies(K_EINST, {}));
  let stand = standPruefen(lies(K_STAND, null));
  let gesperrt = false;
  let token = 0;   // wechselt mit jeder neuen Szene, damit alte Animationen abbrechen

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

  function setzeBall(anteil, hub = 0) {
    const p = el.pfad.getPointAtLength(el.pfad.getTotalLength() * anteil);
    el.ball.setAttribute('cx', p.x.toFixed(1));
    el.ball.setAttribute('cy', (p.y - 12 - hub).toFixed(1));
  }
  function setzePaket(x, deckkraft) {
    el.paket.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
    el.paket.style.opacity = deckkraft;
  }
  const station = (name) => document.querySelector(`.station[data-station="${name}"]`);

  function szene(typ) {
    token++;
    const tor = typ === 'waechter';
    el.szeneWeg.toggleAttribute('hidden', tor);   // SVG kennt .hidden nicht, nur das Attribut
    el.szeneTor.toggleAttribute('hidden', !tor);
    document.querySelectorAll('.station').forEach((s) => s.classList.remove('leuchtet', 'richtig', 'falsch', 'puls'));
    el.schloss.classList.remove('zeigen');
    el.szeneWeg.classList.toggle('waehlbar', typ === 'station');
    el.schranke.removeAttribute('transform');
    setzePaket(50, 0);
    if (!tor) setzeBall(0);
  }

  // ---------- Bildschirme ----------
  function zeige(name) {
    token++;
    ['start', 'spiel', 'ende'].forEach((s) => $(s).classList.toggle('aktiv', s === name));
    blattZu();
    gesperrt = false;
  }

  function merksatz(ziel) {
    ziel.replaceChildren(...LEVEL.merksatz.map((satz) => {
      const s = document.createElement('span');
      s.textContent = satz;
      return s;
    }));
  }

  function zeigeStart() {
    zeige('start');
    const best = lies(K_BEST, null);
    el.startLevelTitel.textContent = LEVEL.titel;
    if (stand) {
      el.startStand.textContent = `Weiter bei Runde ${Math.min(stand.geschafft.length + 1, GESAMT)} von ${GESAMT}`;
      el.spielen.textContent = 'Weiter spielen';
      el.neu.hidden = false;
    } else if (best) {
      el.startStand.textContent = `Geschafft · Bestwert ${best.punkte} von ${GESAMT * 10} Punkten`;
      el.spielen.textContent = 'Nochmal spielen';
      el.neu.hidden = true;
    } else {
      el.startStand.textContent = `${GESAMT} Runden · etwa 5 Minuten`;
      el.spielen.textContent = 'Spielen';
      el.neu.hidden = true;
    }
  }

  function spielen(vonVorn) {
    ton.tipp();
    if (vonVorn || !stand) {
      stand = neuerStand();
      schreib(K_STAND, stand);
    }
    if (!history.state || history.state.bw !== 'spiel') history.pushState({ bw: 'spiel' }, '');
    zeige('spiel');
    if (!einst.intro) zeigeIntro(); else zeigeRunde();
  }

  function zurStart() {
    if (history.state && history.state.bw === 'spiel') history.back(); else zeigeStart();
  }

  function kopf(pop) {
    const fertig = stand ? stand.geschafft.length : 0;
    el.zaehler.textContent = `Level ${LEVEL.nr} · ${fertig}/${GESAMT}`;
    el.punkte.textContent = stand ? stand.punkte : 0;
    el.balken.style.width = `${(fertig / GESAMT) * 100}%`;
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

  // ---------- Einführung ----------
  async function zeigeIntro() {
    szene('station');
    const tok = token;
    el.szeneWeg.classList.remove('waehlbar');
    kopf();
    el.hinweis.hidden = true;
    el.frage.textContent = LEVEL.intro.titel;
    el.frage.classList.add('titel');
    el.text.textContent = LEVEL.intro.text;
    el.text.hidden = false;
    el.code.hidden = true;
    el.legende.hidden = true;
    el.antworten.className = 'antworten';
    el.antworten.replaceChildren(knopf('Los geht’s', 'knopf', () => {
      einst.intro = true;
      schreib(K_EINST, einst);
      ton.tipp();
      zeigeRunde();
    }));
    // Der Ball reist einmal über die Brücke, die Stationen leuchten nacheinander auf
    const weg = ['handy', 'server', 'datenbank'];
    station('handy').classList.add('leuchtet');
    for (let i = 1; i < weg.length; i++) {
      await warte(450);
      if (tok !== token) return;
      const von = POS[weg[i - 1]];
      const nach = POS[weg[i]];
      await bewege(800, (p) => setzeBall(von + (nach - von) * p), tok);
      if (tok !== token) return;
      station(weg[i]).classList.add('leuchtet');
    }
  }

  // ---------- Runden ----------
  const aktuelle = () => (stand ? LEVEL.runden.find((r) => r.id === stand.schlange[0]) : null);

  function zeigeRunde() {
    const r = aktuelle();
    if (!r) { zeigeEnde(); return; }
    szene(r.typ);
    kopf();
    el.frage.classList.remove('titel');
    el.text.hidden = true;
    el.hinweis.hidden = !stand.versuche[r.id];
    el.frage.textContent = r.frage;
    if (r.code) {
      const teile = [];
      r.code.forEach((zeile, i) => {
        const s = document.createElement('span');
        const alt = zeile.startsWith('-');
        s.className = alt ? 'alt' : zeile.startsWith('+') ? 'neu' : '';
        s.textContent = alt ? `−${zeile.slice(1)}` : zeile;
        teile.push(s);
        if (i < r.code.length - 1) teile.push('\n');
      });
      el.code.replaceChildren(...teile);
    }
    el.code.hidden = !r.code;
    el.legende.hidden = !r.code;
    (r.fokus || []).forEach((f) => (f === 'schloss' ? el.schloss.classList.add('zeigen') : station(f).classList.add('leuchtet')));
    baueAntworten(r);
    if (r.typ === 'waechter') {
      const tok = token;
      bewege(600, (p) => setzePaket(50 + 86 * p, p), tok);
    }
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
    } else if (r.typ === 'wahl') {
      el.antworten.className = 'antworten';
      knoepfe = mische(r.antworten.map((_, i) => i)).map((i) => antwortKnopf(String(i), r.antworten[i].t));
    } else {
      el.antworten.className = 'antworten zwei';
      knoepfe = [
        antwortKnopf('durch', WAECHTER.durch, '', 'durch', '✓'),
        antwortKnopf('zurueck', WAECHTER.zurueck, '', 'zurueck', '✕')
      ];
    }
    el.antworten.replaceChildren(...knoepfe);
  }

  function pruefe(r, wert) {
    if (r.typ === 'wahl') {
      const a = r.antworten[Number(wert)];
      return Boolean(a && a.r);
    }
    return wert === r.richtig;
  }
  function loesung(r) {
    if (r.typ === 'station') return STATIONEN[r.richtig];
    if (r.typ === 'wahl') return r.antworten.find((a) => a.r).t;
    return WAECHTER[r.richtig];
  }

  async function antworten(wert) {
    const r = aktuelle();
    if (gesperrt || !r) return;
    gesperrt = true;
    const tok = token;
    el.szeneWeg.classList.remove('waehlbar');

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
    schreib(K_STAND, stand);

    const knoepfe = [...el.antworten.querySelectorAll('.antwort')];
    knoepfe.forEach((b) => {
      b.disabled = true;
      if (b.dataset.wert === wert) b.classList.add('gewaehlt');
    });
    ton.tipp();
    await spieleAntwort(r, wert, richtig, tok);
    if (tok !== token) return;

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

  async function spieleAntwort(r, wert, richtig, tok) {
    if (r.typ === 'station') {
      const ziel = POS[wert];
      if (ziel === 0) await bewege(520, (p, t) => setzeBall(0, Math.sin(t * Math.PI) * 26), tok);
      else await bewege(500 + 400 * ziel, (p) => setzeBall(p * ziel), tok);
      if (tok !== token) return;
      station(wert).classList.add(richtig ? 'richtig' : 'falsch');
      if (!richtig) station(r.richtig).classList.add('richtig', 'puls');
    } else if (r.typ === 'wahl') {
      await warte(250);
    } else if (wert === 'durch') {
      await bewege(280, (p) => el.schranke.setAttribute('transform', `rotate(${(-80 * p).toFixed(1)} 160 102.5)`), tok);
      await bewege(650, (p) => setzePaket(136 + 174 * p, 1), tok);
      if (tok !== token) return;
      station('akte').classList.add(richtig ? 'richtig' : 'falsch');
    } else {
      await bewege(200, (p, t) => setzePaket(136 + 8 * Math.sin(t * Math.PI), 1), tok);
      await bewege(520, (p) => setzePaket(136 - 86 * p, 1 - 0.85 * p), tok);
      if (tok !== token) return;
      station('ki').classList.add(richtig ? 'richtig' : 'falsch');
    }
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
    const alt = lies(K_BEST, null);
    const rekord = !alt || ergebnis.punkte > alt.punkte;
    if (rekord) schreib(K_BEST, ergebnis);
    loesch(K_STAND);
    stand = null;
    zeige('ende');
    el.endePunkte.textContent = ergebnis.punkte;
    el.endeErste.textContent = `${ergebnis.ersteRichtig}/${GESAMT}`;
    el.endeSerie.textContent = ergebnis.besteSerie;
    el.endeRekord.hidden = !(rekord && alt);
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
  el.spielen.addEventListener('click', () => spielen(false));
  el.neu.addEventListener('click', () => spielen(true));
  el.nochmal.addEventListener('click', () => spielen(true));
  el.zurueck.addEventListener('click', zurStart);
  el.zumStart.addEventListener('click', zurStart);
  el.weiter.addEventListener('click', weiter);
  el.ton.addEventListener('click', () => {
    einst.ton = !einst.ton;
    schreib(K_EINST, einst);
    tonKnopfZeigen();
    ton.tipp();
  });
  el.szeneWeg.addEventListener('click', (e) => {
    if (!el.szeneWeg.classList.contains('waehlbar')) return;
    const g = e.target.closest('.station');
    if (g && STATIONEN[g.dataset.station]) antworten(g.dataset.station);
  });
  window.addEventListener('popstate', () => {
    if (!$('start').classList.contains('aktiv')) zeigeStart();
  });

  merksatz(el.startMerksatz);
  merksatz(el.endeMerksatz);
  el.fuss.textContent = `Version ${VERSION} · läuft offline · 0 €`;
  tonKnopfZeigen();
  zeigeStart();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Offline weiter */ });
  }
})();
