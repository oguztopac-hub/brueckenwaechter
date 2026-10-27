/* Szenen: die bewegten Bilder über jeder Frage. Jede Szene bringt ihr SVG mit und weiß,
   wie sie sich vorbereitet, einführt und auf eine Antwort reagiert.
   s = { svg, ... } (vom Spiel angelegt), h = Helfer: h.bewege(ms, fn(p, t)), h.warte(ms), h.aktiv().
   Glühen: Gruppen mit class="station" und einem .hof darin bekommen leuchtet/richtig/falsch. */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const POS = { handy: 0, server: 0.5, datenbank: 1 };   // Anteil am Brückenpfad

  function neu(name, attrs, eltern) {
    const e = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (eltern) eltern.appendChild(e);
    return e;
  }
  const teil = (s, name) => s.svg.querySelector(`[data-station="${name}"]`);
  function zuruecksetzen(s) {
    s.svg.querySelectorAll('.station').forEach((t) => t.classList.remove('leuchtet', 'richtig', 'falsch', 'puls'));
  }
  function setzeLage(e, x, y, deckkraft) {
    e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    if (deckkraft !== undefined) e.style.opacity = deckkraft;
  }
  function ball(s, x, y) {
    s.ball.setAttribute('cx', x.toFixed(1));
    s.ball.setAttribute('cy', y.toFixed(1));
  }

  // Karte: Rechteck mit Text, mittig um (0,0); die Breite passt sich dem Text an
  const KARTE = (klasse, daten) => `<g class="karte ${klasse}"${daten ? ` data-station="${daten}"` : ''}>`
    + `${daten ? '<rect class="hof" y="-26" height="52" rx="16"/>' : ''}`
    + '<rect class="karte-flaeche" y="-18" height="36" rx="9"/><text class="karte-text" y="5"></text></g>';
  function macheKarte(eltern, klasse) {
    const g = neu('g', { class: `karte ${klasse}` }, eltern);
    neu('rect', { class: 'karte-flaeche', y: -18, height: 36, rx: 9 }, g);
    neu('text', { class: 'karte-text', y: 5 }, g);
    return g;
  }
  function setzeKarte(g, text, polster = 22) {
    const t = g.querySelector('text');
    t.textContent = text;
    t.style.fontSize = '';
    let laenge = t.getComputedTextLength() || text.length * 8;
    if (laenge > 96) {
      t.style.fontSize = '12px';
      laenge = t.getComputedTextLength() || text.length * 7;
    }
    const breite = Math.max(44, laenge + polster);
    g.querySelectorAll('rect').forEach((r) => {
      const rand = r.classList.contains('hof') ? 8 : 0;
      r.setAttribute('x', (-breite / 2 - rand).toFixed(1));
      r.setAttribute('width', (breite + 2 * rand).toFixed(1));
    });
  }

  function zahnrad(aussen, innen, zaehne) {
    const punkte = [];
    const n = zaehne * 4;
    for (let k = 0; k < n; k++) {
      const winkel = (k / n) * Math.PI * 2;
      const r = k % 4 < 2 ? aussen : innen;
      punkte.push(`${(Math.cos(winkel) * r).toFixed(1)} ${(Math.sin(winkel) * r).toFixed(1)}`);
    }
    return `M${punkte.join(' L')} Z`;
  }

  // ---------- Level 1: Handy – Server – Datenbank ----------
  function wegBall(s, anteil, hub = 0) {
    const p = s.pfad.getPointAtLength(s.pfad.getTotalLength() * anteil);
    ball(s, p.x, p.y - 12 - hub);
  }
  const weg = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Handy, Server und Datenbank, verbunden durch eine Brücke">
      <path class="bogen" d="M50 96 Q115 26 180 96 Q245 26 310 96"/>
      <g class="schloss" transform="translate(115 66)">
        <circle class="schloss-hof" r="17"/>
        <path class="schloss-buegel" d="M-5 -2 v-4 a5 5 0 0 1 10 0 v4"/>
        <rect class="schloss-koerper" x="-8" y="-2" width="16" height="12" rx="3"/>
      </g>
      <g class="station" data-station="handy" transform="translate(50 128)">
        <circle class="hof" r="36"/>
        <rect class="symbol" x="-15" y="-25" width="30" height="50" rx="6"/>
        <rect class="detail-hell" x="-10" y="-18" width="20" height="30" rx="2"/>
        <circle class="detail" cx="0" cy="18" r="2.5"/>
      </g>
      <g class="station" data-station="server" transform="translate(180 128)">
        <circle class="hof" r="36"/>
        <rect class="symbol" x="-21" y="-24" width="42" height="14" rx="3"/>
        <rect class="symbol" x="-21" y="-7" width="42" height="14" rx="3"/>
        <rect class="symbol" x="-21" y="10" width="42" height="14" rx="3"/>
        <circle class="licht" cx="-13" cy="-17" r="2.5"/>
        <circle class="licht" cx="-13" cy="0" r="2.5"/>
        <circle class="licht" cx="-13" cy="17" r="2.5"/>
        <path class="detail-linie" d="M-3 -17 h15 M-3 0 h15 M-3 17 h15"/>
      </g>
      <g class="station" data-station="datenbank" transform="translate(310 128)">
        <circle class="hof" r="36"/>
        <path class="symbol" d="M-20 -17 v34 a20 7 0 0 0 40 0 v-34"/>
        <ellipse class="symbol" cx="0" cy="-17" rx="20" ry="7"/>
        <path class="detail-linie" d="M-20 -3 a20 7 0 0 0 40 0 M-20 9 a20 7 0 0 0 40 0"/>
      </g>
      <text class="station-name" x="50" y="178">Handy</text>
      <text class="station-rolle" x="50" y="193">zeigt an</text>
      <text class="station-name" x="180" y="178">Server</text>
      <text class="station-rolle" x="180" y="193">entscheidet</text>
      <text class="station-name" x="310" y="178">Datenbank</text>
      <text class="station-rolle" x="310" y="193">merkt sich</text>
      <circle class="ball" cx="50" cy="84" r="9"/>
    </svg>`,
    start(s) {
      s.pfad = s.svg.querySelector('.bogen');
      s.ball = s.svg.querySelector('.ball');
      s.schloss = s.svg.querySelector('.schloss');
    },
    vorbereiten(s, r) {
      zuruecksetzen(s);
      s.schloss.classList.remove('zeigen');
      wegBall(s, 0);
      (r.fokus || []).forEach((f) => (f === 'schloss' ? s.schloss.classList.add('zeigen') : teil(s, f).classList.add('leuchtet')));
      s.svg.classList.toggle('waehlbar', r.typ === 'station');
    },
    async intro(s, h) {
      zuruecksetzen(s);
      s.schloss.classList.remove('zeigen');
      wegBall(s, 0);
      const reihe = ['handy', 'server', 'datenbank'];
      teil(s, 'handy').classList.add('leuchtet');
      for (let i = 1; i < reihe.length; i++) {
        await h.warte(450);
        if (!h.aktiv()) return;
        const von = POS[reihe[i - 1]];
        const nach = POS[reihe[i]];
        await h.bewege(800, (p) => wegBall(s, von + (nach - von) * p));
        if (!h.aktiv()) return;
        teil(s, reihe[i]).classList.add('leuchtet');
      }
    },
    tippe(s, r, ziel) {
      if (r.typ !== 'station') return null;
      const g = ziel.closest('[data-station]');
      return g && g.dataset.station in POS ? g.dataset.station : null;
    },
    async antwort(s, r, wert, richtig, h) {
      if (r.typ !== 'station') { await h.warte(250); return; }
      const ziel = POS[wert];
      if (ziel === 0) await h.bewege(520, (p, t) => wegBall(s, 0, Math.sin(t * Math.PI) * 26));
      else await h.bewege(500 + 400 * ziel, (p) => wegBall(s, p * ziel));
      if (!h.aktiv()) return;
      teil(s, wert).classList.add(richtig ? 'richtig' : 'falsch');
      if (!richtig) teil(s, r.richtig).classList.add('richtig', 'puls');
    }
  };

  // ---------- Wächter-Runden: KI-Bote – Tor – Akte ----------
  const tor = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Die KI bringt eine Änderung, du prüfst sie am Tor, dahinter liegt die Akte">
      <line class="strasse" x1="18" y1="131" x2="342" y2="131"/>
      <g class="station" data-station="ki" transform="translate(50 108)">
        <circle class="hof" r="36"/>
        <rect class="symbol" x="-22" y="-20" width="44" height="40" rx="10"/>
        <text class="ki-text" x="0" y="7">KI</text>
      </g>
      <rect class="pfosten" x="156" y="90" width="8" height="41" rx="2"/>
      <rect class="pfosten" x="204" y="90" width="8" height="41" rx="2"/>
      <rect class="schranke" x="158" y="99" width="52" height="7" rx="3"/>
      <g class="station" data-station="akte" transform="translate(310 108)">
        <circle class="hof" r="36"/>
        <path class="symbol" d="M-22 -16 h14 l5 6 h25 v30 h-44 z"/>
        <path class="detail-linie" d="M-14 2 h28 M-14 10 h20"/>
      </g>
      <text class="station-name" x="50" y="165">KI-Bote</text>
      <text class="station-rolle" x="50" y="180">bringt Änderungen</text>
      <text class="station-name" x="184" y="165">Du</text>
      <text class="station-rolle" x="184" y="180">prüfst am Tor</text>
      <text class="station-name" x="310" y="165">Akte</text>
      <text class="station-rolle" x="310" y="180">läuft live</text>
      <g class="paket">
        <rect x="-11" y="107" width="22" height="22" rx="4"/>
        <path d="M-11 114 h22 M0 107 v22"/>
      </g>
    </svg>`,
    start(s) {
      s.schranke = s.svg.querySelector('.schranke');
      s.paket = s.svg.querySelector('.paket');
    },
    vorbereiten(s, r, h) {
      zuruecksetzen(s);
      s.antwortet = false;
      s.schranke.removeAttribute('transform');
      setzeLage(s.paket, 50, 0, 0);
      h.bewege(600, (p) => { if (!s.antwortet) setzeLage(s.paket, 50 + 86 * p, 0, p); });
    },
    async antwort(s, r, wert, richtig, h) {
      s.antwortet = true;
      if (wert === 'durch') {
        await h.bewege(280, (p) => s.schranke.setAttribute('transform', `rotate(${(-80 * p).toFixed(1)} 160 102.5)`));
        await h.bewege(650, (p) => setzeLage(s.paket, 136 + 174 * p, 0, 1));
        if (!h.aktiv()) return;
        teil(s, 'akte').classList.add(richtig ? 'richtig' : 'falsch');
      } else {
        await h.bewege(200, (p, t) => setzeLage(s.paket, 136 + 8 * Math.sin(t * Math.PI), 0, 1));
        await h.bewege(520, (p) => setzeLage(s.paket, 136 - 86 * p, 0, 1 - 0.85 * p));
        if (!h.aktiv()) return;
        teil(s, 'ki').classList.add(richtig ? 'richtig' : 'falsch');
      }
    }
  };

  // ---------- Level 2: die vier Bausteine im Überblick ----------
  const VIER_X = { kiste: 45, weiche: 135, maschine: 225, band: 315 };
  const vier = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Vier Bausteine: Kiste, Weiche, Maschine und Fließband">
      <g class="station" data-station="kiste" transform="translate(45 84)">
        <circle class="hof" r="38"/>
        <rect class="kiste-oeffnung" x="-19" y="-14" width="38" height="9" rx="3"/>
        <rect class="kiste-front" x="-23" y="-8" width="46" height="32" rx="4"/>
        <path class="kiste-brett" d="M-23 3 H23 M-23 14 H23"/>
        <rect class="kiste-schild" x="-12" y="3" width="24" height="11" rx="2"/>
      </g>
      <g class="station" data-station="weiche" transform="translate(135 84)">
        <circle class="hof" r="38"/>
        <path class="gleis-klein" d="M0 -28 V-12 M-12 0 Q-22 0 -22 12 V26 M12 0 Q22 0 22 12 V26"/>
        <path class="symbol" d="M0 -12 L13 0 L0 12 L-13 0 Z"/>
      </g>
      <g class="station" data-station="maschine" transform="translate(225 84)">
        <circle class="hof" r="38"/>
        <rect class="symbol maschine-koerper" x="-24" y="-22" width="48" height="46" rx="9"/>
        <path class="zahnrad-form" d="${zahnrad(13, 9, 8)}" transform="translate(0 1)"/>
        <circle class="zahnrad-mitte" r="3.5" cy="1"/>
      </g>
      <g class="station" data-station="band" transform="translate(315 84)">
        <circle class="hof" r="38"/>
        <rect class="symbol" x="-22" y="-12" width="18" height="18" rx="3"/>
        <rect class="symbol" x="4" y="-12" width="18" height="18" rx="3"/>
        <rect class="band" x="-28" y="8" width="56" height="10" rx="5"/>
      </g>
      <text class="station-name" x="45" y="150">Kiste</text>
      <text class="station-rolle" x="45" y="166">Variable</text>
      <text class="station-name" x="135" y="150">Weiche</text>
      <text class="station-rolle" x="135" y="166">if</text>
      <text class="station-name" x="225" y="150">Maschine</text>
      <text class="station-rolle" x="225" y="166">Funktion</text>
      <text class="station-name" x="315" y="150">Fließband</text>
      <text class="station-rolle" x="315" y="166">for</text>
    </svg>`,
    vorbereiten(s, r) {
      zuruecksetzen(s);
      (r.fokus || []).forEach((f) => teil(s, f).classList.add('leuchtet'));
    },
    async intro(s, h) {
      zuruecksetzen(s);
      for (const name of Object.keys(VIER_X)) {
        await h.warte(380);
        if (!h.aktiv()) return;
        const g = teil(s, name);
        g.classList.add('leuchtet');
        await h.bewege(340, (p, t) => g.setAttribute('transform', `translate(${VIER_X[name]} ${(84 - Math.sin(t * Math.PI) * 12).toFixed(1)})`));
      }
    },
    async antwort(s, r, wert, richtig, h) {
      await h.warte(250);
      (r.fokus || []).forEach((f) => {
        const g = teil(s, f);
        g.classList.remove('leuchtet');
        g.classList.add(richtig ? 'richtig' : 'falsch');
      });
    }
  };

  // ---------- Kiste = Variable ----------
  const kiste = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Eine Kiste mit Namensschild: So merkt sich ein Programm einen Wert">
      <line class="boden" x1="70" y1="174" x2="290" y2="174"/>
      <g class="station" data-station="kiste">
        <rect class="hof" x="100" y="40" width="160" height="144" rx="24"/>
        <rect class="kiste-oeffnung" x="122" y="84" width="116" height="16" rx="4"/>
      </g>
      ${KARTE('inhalt')}
      <rect class="kiste-front" x="116" y="94" width="128" height="78" rx="6"/>
      <path class="kiste-brett" d="M116 120 H244 M116 146 H244"/>
      <rect class="kiste-schild" x="132" y="121" width="96" height="26" rx="6"/>
      <text class="kiste-name" x="180" y="139"></text>
      ${KARTE('flug')}
    </svg>`,
    start(s) {
      s.inhalt = s.svg.querySelector('.inhalt');
      s.flug = s.svg.querySelector('.flug');
      s.name = s.svg.querySelector('.kiste-name');
    },
    vorbereiten(s, r) {
      zuruecksetzen(s);
      const k = r.kiste;
      s.name.textContent = k.name;
      setzeLage(s.flug, 50, 34, 0);
      if (k.vorher) setzeKarte(s.inhalt, k.vorher);
      setzeLage(s.inhalt, 180, 80, k.vorher ? 1 : 0);
    },
    async antwort(s, r, wert, richtig, h) {
      const k = r.kiste;
      setzeKarte(s.flug, k.karte || k.nachher);
      await h.bewege(720, (p, t) => setzeLage(s.flug, 50 + 130 * p, 34 + 46 * p - Math.sin(t * Math.PI) * 36, 1));
      if (!h.aktiv()) return;
      setzeLage(s.flug, 50, 34, 0);
      setzeKarte(s.inhalt, k.nachher);
      await h.bewege(280, (p, t) => setzeLage(s.inhalt, 180, 80 - Math.sin(t * Math.PI) * 10, 1));
      if (!h.aktiv()) return;
      teil(s, 'kiste').classList.add(richtig ? 'richtig' : 'falsch');
    }
  };

  // ---------- Weiche = if / else ----------
  const weiche = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Eine Weiche: Je nach Bedingung rollt der Ball nach links oder rechts">
      <path class="gleis" d="M180 4 V56"/>
      <path class="gleis weg-ja" d="M112 79 Q72 79 72 112 V128"/>
      <path class="gleis weg-nein" d="M248 79 Q288 79 288 112 V128"/>
      <g class="station" data-station="raute">
        <path class="hof" d="M180 40 L272 79 L180 118 L88 79 Z"/>
        <path class="symbol" d="M180 54 L252 79 L180 104 L108 79 Z"/>
        <text class="raute-text" x="180" y="84"></text>
      </g>
      <text class="gleis-name" x="96" y="66">ja</text>
      <text class="gleis-name" x="264" y="66">nein</text>
      <g class="station schild" data-station="ja">
        <rect class="hof" x="2" y="130" width="140" height="62" rx="16"/>
        <rect class="symbol" x="10" y="138" width="124" height="46" rx="10"/>
        <text class="schild-text" x="72" y="166"></text>
      </g>
      <g class="station schild" data-station="nein">
        <rect class="hof" x="218" y="130" width="140" height="62" rx="16"/>
        <rect class="symbol" x="226" y="138" width="124" height="46" rx="10"/>
        <text class="schild-text" x="288" y="166"></text>
      </g>
      <circle class="ball" r="9" cx="180" cy="6"/>
    </svg>`,
    start(s) {
      s.ball = s.svg.querySelector('.ball');
      s.ja = s.svg.querySelector('.weg-ja');
      s.nein = s.svg.querySelector('.weg-nein');
      s.raute = s.svg.querySelector('.raute-text');
    },
    vorbereiten(s, r) {
      zuruecksetzen(s);
      s.raute.textContent = r.weiche.frage;
      teil(s, 'ja').querySelector('text').textContent = r.weiche.ja;
      teil(s, 'nein').querySelector('text').textContent = r.weiche.nein;
      ball(s, 180, 6);
      s.svg.classList.add('waehlbar');
    },
    tippe(s, r, ziel) {
      const g = ziel.closest('[data-station="ja"], [data-station="nein"]');
      if (!g) return null;
      const i = r.antworten.findIndex((a) => a.weg === g.dataset.station);
      return i < 0 ? null : String(i);
    },
    async antwort(s, r, wert, richtig, h) {
      const gewaehlt = r.antworten[Number(wert)].weg;
      const wahr = r.weiche.ergebnis;
      const pfad = wahr === 'ja' ? s.ja : s.nein;
      await h.bewege(420, (p) => ball(s, 180, 6 + 48 * p));
      if (!h.aktiv()) return;
      teil(s, 'raute').classList.add('leuchtet');
      await h.warte(260);
      const start = pfad.getPointAtLength(0);
      await h.bewege(220, (p) => ball(s, 180 + (start.x - 180) * p, 54 + (start.y - 54) * p));
      const laenge = pfad.getTotalLength();
      await h.bewege(620, (p) => {
        const q = pfad.getPointAtLength(laenge * p);
        ball(s, q.x, q.y);
      });
      if (!h.aktiv()) return;
      teil(s, 'raute').classList.remove('leuchtet');
      teil(s, gewaehlt).classList.add(richtig ? 'richtig' : 'falsch');
      if (!richtig) teil(s, wahr).classList.add('richtig', 'puls');
    }
  };

  // ---------- Maschine = Funktion ----------
  const maschine = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Eine Maschine: Links geht etwas hinein, die Funktion arbeitet, rechts kommt das Ergebnis heraus">
      <line class="boden" x1="20" y1="170" x2="340" y2="170"/>
      <g class="station" data-station="maschine">
        <rect class="hof" x="114" y="20" width="132" height="156" rx="24"/>
        <rect class="symbol maschine-koerper" x="128" y="54" width="104" height="112" rx="14"/>
        <rect class="maschine-schild" x="130" y="28" width="100" height="28" rx="8"/>
        <text class="maschine-name" x="180" y="47"></text>
        <g class="zahnrad" transform="translate(180 112)">
          <path class="zahnrad-form" d="${zahnrad(26, 19, 8)}"/>
          <circle class="zahnrad-mitte" r="7"/>
        </g>
        <rect class="schlitz" x="123" y="94" width="10" height="36" rx="3"/>
        <rect class="schlitz" x="227" y="94" width="10" height="36" rx="3"/>
      </g>
      ${KARTE('rein')}
      ${KARTE('raus', 'raus')}
    </svg>`,
    start(s) {
      s.name = s.svg.querySelector('.maschine-name');
      s.rad = s.svg.querySelector('.zahnrad');
      s.rein = s.svg.querySelector('.rein');
      s.raus = s.svg.querySelector('.raus');
      s.raus.classList.add('station');
    },
    vorbereiten(s, r) {
      zuruecksetzen(s);
      const m = r.maschine;
      s.name.textContent = `${m.name}( )`;
      setzeKarte(s.rein, m.rein);
      setzeLage(s.rein, 64, 112, 1);
      setzeKarte(s.raus, m.raus);
      setzeLage(s.raus, 214, 112, 0);
      s.rad.setAttribute('transform', 'translate(180 112)');
    },
    async antwort(s, r, wert, richtig, h) {
      await h.bewege(520, (p) => setzeLage(s.rein, 64 + 100 * p, 112, 1 - p));
      await h.bewege(820, (p) => s.rad.setAttribute('transform', `translate(180 112) rotate(${(360 * p).toFixed(1)})`));
      await h.bewege(520, (p) => setzeLage(s.raus, 214 + 82 * p, 112, p));
      if (!h.aktiv()) return;
      s.raus.classList.add(richtig ? 'richtig' : 'falsch');
    }
  };

  // ---------- Fließband = for-Schleife ----------
  // Das erste Teil der Liste liegt vorne (rechts, am Drucker). Jedes gedruckte Teil erscheint im Ausgabefenster.
  const DRUCKER_X = 262;
  const KARTE_X = (i) => 184 - 72 * i;
  const band = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Ein Fließband: Teil für Teil läuft unter dem Drucker print durch und erscheint in der Ausgabe">
      <g class="station" data-station="ausgabe">
        <rect class="hof" x="4" y="0" width="168" height="98" rx="18"/>
        <rect class="terminal" x="12" y="6" width="152" height="86" rx="10"/>
        <text class="ausgabe-titel" x="24" y="23">Ausgabe</text>
        <text class="ausgabe-zeile" x="26" y="43"></text>
        <text class="ausgabe-zeile" x="26" y="62"></text>
        <text class="ausgabe-zeile" x="26" y="81"></text>
      </g>
      <g class="station" data-station="drucker">
        <rect class="hof" x="208" y="2" width="108" height="104" rx="18"/>
        <rect class="stempel" x="248" y="56" width="28" height="28" rx="4"/>
        <rect class="symbol maschine-koerper" x="220" y="12" width="84" height="48" rx="10"/>
        <rect class="maschine-schild" x="232" y="23" width="60" height="26" rx="6"/>
        <text class="maschine-name" x="262" y="41">print</text>
      </g>
      <rect class="band" x="6" y="136" width="348" height="18" rx="9"/>
      <path class="band-pfeil" d="M54 141 l5 4 -5 4 M114 141 l5 4 -5 4 M174 141 l5 4 -5 4 M234 141 l5 4 -5 4 M294 141 l5 4 -5 4"/>
      <g class="teile"></g>
    </svg>`,
    start(s) {
      s.titel = s.svg.querySelector('.ausgabe-titel');
      s.zeilen = [...s.svg.querySelectorAll('.ausgabe-zeile')];
      s.stempel = s.svg.querySelector('.stempel');
      s.teile = s.svg.querySelector('.teile');
      s.karten = [];
    },
    vorbereiten(s, r) {
      zuruecksetzen(s);
      s.titel.textContent = 'Ausgabe';
      s.zeilen.forEach((z) => { z.textContent = ''; z.classList.remove('erste'); });
      s.stempel.removeAttribute('transform');
      s.teile.replaceChildren();
      s.karten = r.band.teile.map((text, i) => {
        const g = macheKarte(s.teile, 'ding');
        setzeKarte(g, text, 16);
        setzeLage(g, KARTE_X(i), 118, 1);
        return g;
      });
    },
    async antwort(s, r, wert, richtig, h) {
      let versatz = 0;
      const lege = () => s.karten.forEach((g, i) => {
        const x = KARTE_X(i) + versatz;
        setzeLage(g, x, 118, x > 300 ? Math.max(0, 1 - (x - 300) / 40) : 1);
      });
      for (let k = 0; k < s.karten.length; k++) {
        const von = versatz;
        const nach = DRUCKER_X - KARTE_X(0) + 72 * k;
        await h.bewege(400, (p) => { versatz = von + (nach - von) * p; lege(); });
        await h.bewege(240, (p, t) => s.stempel.setAttribute('transform', `translate(0 ${(Math.sin(t * Math.PI) * 16).toFixed(1)})`));
        if (!h.aktiv()) return;
        if (s.zeilen[k]) s.zeilen[k].textContent = r.band.teile[k];
        s.titel.textContent = `Ausgabe · ${k + 1}×`;
      }
      const von = versatz;
      await h.bewege(420, (p) => { versatz = von + 120 * p; lege(); });
      if (!h.aktiv()) return;
      if (r.band.erste) s.zeilen[0].classList.add('erste');
      teil(s, 'ausgabe').classList.add(richtig ? 'richtig' : 'falsch');
    }
  };

  // ---------- Level 3: Lupe über der Fehlermeldung ----------
  function lupeScan(s, h) {
    s.antwortet = false;
    s.lupe.classList.remove('richtig', 'falsch');
    s.zeichen.textContent = '';
    s.fehler.classList.remove('an');
    setzeLage(s.lupe, 250, 52);
    h.bewege(1200, (p, t) => {
      if (!s.antwortet) setzeLage(s.lupe, 250 - Math.sin(t * Math.PI * 3) * 18, 52 + 100 * p);
    }).then(() => { if (h.aktiv()) s.fehler.classList.add('an'); });
  }
  const lupe = {
    svg: `<svg viewBox="0 0 360 196" role="img" aria-label="Eine Lupe liest die Fehlermeldung von oben nach unten bis zur roten letzten Zeile">
      <g class="station" data-station="fenster">
        <rect class="hof" x="28" y="4" width="304" height="188" rx="22"/>
        <rect class="terminal" x="40" y="14" width="280" height="168" rx="12"/>
        <circle class="terminal-punkt" cx="56" cy="29" r="4"/>
        <circle class="terminal-punkt" cx="70" cy="29" r="4"/>
        <circle class="terminal-punkt" cx="84" cy="29" r="4"/>
        <rect class="terminal-zeile" x="56" y="48" width="150" height="8" rx="4"/>
        <rect class="terminal-zeile" x="70" y="66" width="190" height="8" rx="4"/>
        <rect class="terminal-zeile" x="84" y="84" width="120" height="8" rx="4"/>
        <rect class="terminal-zeile" x="70" y="102" width="170" height="8" rx="4"/>
        <rect class="terminal-zeile" x="84" y="120" width="96" height="8" rx="4"/>
        <rect class="fehler-zeile" x="56" y="146" width="236" height="12" rx="6"/>
      </g>
      <g class="lupe" transform="translate(250 52)">
        <path class="lupe-griff" d="M14 14 L30 30"/>
        <circle class="lupe-glas" r="20"/>
        <text class="lupe-zeichen" y="7"></text>
      </g>
    </svg>`,
    start(s) {
      s.lupe = s.svg.querySelector('.lupe');
      s.zeichen = s.svg.querySelector('.lupe-zeichen');
      s.fehler = s.svg.querySelector('.fehler-zeile');
    },
    vorbereiten(s, r, h) {
      zuruecksetzen(s);
      lupeScan(s, h);
    },
    intro(s, h) {
      zuruecksetzen(s);
      lupeScan(s, h);
    },
    async antwort(s, r, wert, richtig, h) {
      s.antwortet = true;
      s.fehler.classList.add('an');
      s.zeichen.textContent = richtig ? '✓' : '✕';
      s.lupe.classList.add(richtig ? 'richtig' : 'falsch');
      if (richtig) {
        await h.bewege(340, (p, t) => s.lupe.setAttribute('transform', `translate(250 152) scale(${(1 + Math.sin(t * Math.PI) * 0.25).toFixed(3)})`));
      } else {
        await h.bewege(380, (p, t) => setzeLage(s.lupe, 250 + Math.sin(t * Math.PI * 4) * 8, 152));
      }
      if (!h.aktiv()) return;
      teil(s, 'fenster').classList.add(richtig ? 'richtig' : 'falsch');
    }
  };

  window.BW_SZENEN = { weg, tor, vier, kiste, weiche, maschine, band, lupe };
})();
