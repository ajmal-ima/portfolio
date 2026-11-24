# ajmal.science

Personal site of Ajmal Ibn Mohammed Althaf. Plain HTML, CSS and JavaScript, served by GitHub Pages from `main` (custom domain in `CNAME`).

- `index.html`: the page. All text lives here.
- `style.css`: the sketchbook look.
- `script.js`: optional motion: scroll reveals, pencil pointer, hidden stars, physics figures.
- `img/`: web-sized photos.
- `og-ajmal-2026.jpg`: the link-preview image. Edit `tools/og.html`, then `node tools/render-og.js og-ajmal-YYYY.jpg` and update the two `og:image`/`twitter:image` tags. Use a new file name each time so WhatsApp and LinkedIn fetch it fresh.

## Adding a photo

```
python3 tools/make_images.py path/to/photo.jpg
```

This writes small `-480.webp`, `-900.webp` and `-900.jpg` versions into `img/` and removes hidden metadata such as GPS location. Then copy one of the `<li class="snap">` blocks in `index.html` and change the file name, alt text and caption.

Never put a phone number on this site.
