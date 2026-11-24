"""Resize photos for the web and strip their metadata (EXIF can hold GPS location).

Usage:  python3 tools/make_images.py photos-src/*.jpg
Writes img/<name>-480.webp, img/<name>-900.webp and img/<name>-900.jpg.
"""
import sys, pathlib
from PIL import Image, ImageOps

OUT = pathlib.Path(__file__).resolve().parent.parent / "img"
OUT.mkdir(exist_ok=True)

for src in sys.argv[1:]:
    p = pathlib.Path(src)
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    for w in (480, 900):
        r = im.copy()
        r.thumbnail((w, w * 2))
        # Saving a fresh RGB image drops all EXIF/GPS data.
        r.save(OUT / f"{p.stem}-{w}.webp", "WEBP", quality=72, method=6)
        if w == 900:
            r.save(OUT / f"{p.stem}-{w}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
    print(p.name, "->", im.size, "done")
