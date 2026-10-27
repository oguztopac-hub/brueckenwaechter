"""Erzeugt die App-Symbole in bilder/: Brückenbogen mit goldenem Ball.

Aufruf (aus dem Projektordner): python werkzeuge/symbol.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ZIEL = Path(__file__).resolve().parent.parent / "bilder"
DUNKEL = (27, 42, 32)        # --dunkel
CREME = (241, 234, 220)      # --code-text
GOLD_HELL = (210, 160, 82)   # --gold-hell
GOLD = (147, 100, 27)        # --gold
LUPE = 4                     # vierfach zeichnen, dann glätten


def zeichne(groesse: int, randlos: bool) -> Image.Image:
    n = groesse * LUPE
    bild = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(bild)
    if randlos:
        # Maskierbares Symbol: Fläche bis zum Rand, Inhalt im sicheren Kreis (80 %)
        d.rectangle([0, 0, n, n], fill=DUNKEL)
        breite = n * 0.56
    else:
        d.rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * 0.22), fill=DUNKEL)
        breite = n * 0.74

    # Bogen über der Fahrbahn, Seile dazwischen, Pfeiler darunter - so liest es sich als Brücke
    bogen = breite * 0.78          # Spannweite des Bogens; die Fahrbahn ragt darüber hinaus
    strich = breite * 0.075
    hoehe = bogen * 0.46           # Höhe des Bogens über der Fahrbahn
    r = breite * 0.085             # Ball
    luft = breite * 0.025
    fahrbahn = strich * 1.1
    pfeiler = breite * 0.2
    gesamt = 2 * r + luft + hoehe + fahrbahn + pfeiler
    boden = (n - gesamt) / 2 + 2 * r + luft + hoehe   # Oberkante der Fahrbahn
    m = n / 2
    links, rechts = m - bogen / 2, m + bogen / 2

    d.arc([links, boden - hoehe, rechts, boden + hoehe], start=180, end=360, fill=CREME, width=int(strich))
    halb = bogen / 2 - strich / 2
    for anteil in (-0.62, -0.22, 0.22, 0.62):
        x = m + anteil * halb
        y = boden - (hoehe - strich / 2) * (1 - anteil ** 2) ** 0.5
        d.line([x, y, x, boden], fill=CREME, width=int(strich * 0.38))
    for x in (links + strich / 2, rechts - strich / 2):
        d.rectangle([x - strich * 0.6, boden, x + strich * 0.6, boden + fahrbahn + pfeiler], fill=CREME)
    d.rounded_rectangle([m - breite / 2, boden - strich * 0.1, m + breite / 2, boden + fahrbahn],
                        radius=int(strich * 0.5), fill=CREME)
    by = boden - hoehe - luft - r
    d.ellipse([m - r, by - r, m + r, by + r], fill=GOLD_HELL, outline=GOLD, width=max(1, int(strich * 0.28)))
    return bild.resize((groesse, groesse), Image.LANCZOS)


def main() -> None:
    ZIEL.mkdir(exist_ok=True)
    zeichne(192, False).save(ZIEL / "icon-192.png")
    zeichne(512, False).save(ZIEL / "icon-512.png")
    zeichne(512, True).save(ZIEL / "icon-maskable-512.png")
    print("Symbole geschrieben nach", ZIEL)


if __name__ == "__main__":
    main()
