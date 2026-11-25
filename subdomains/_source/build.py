"""Builds the three subdomain sites (edu, labs, research) into out/<site>/.

Plain static HTML, no dependencies. Shared header/footer live here so the
three sites stay consistent. Run:  python3 build.py
"""
import json, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
PORTFOLIO = os.path.join(HERE, "..", "portfolio")

NAME = "Ajmal Ibn Mohammed Althaf"
RESEARCHGATE = "https://www.researchgate.net/"   # TODO: replace with the profile link
LINKEDIN = "https://www.linkedin.com/in/ajmal-ima"
GITHUB = "https://github.com/ajmal-ima"

SITES = {
    "edu": {"host": "edu.ajmal.science", "hl": "var(--c-yellow)", "ink": "var(--c-ochre)",
            "nav": [("Tools", "/#tools"), ("For teachers", "/#teachers"), ("About", "/#about")],
            "foot": "Made by Ajmal Ibn Mohammed Althaf. Free to use in your classroom."},
    "research": {"host": "research.ajmal.science", "hl": "var(--c-cyan)", "ink": "var(--c-cyan)",
                 "nav": [("PhD", "/#phd"), ("QuantumX", "/#quantumx"), ("Earlier", "/#earlier"), ("Papers", "/#papers")],
                 "foot": "Ajmal Ibn Mohammed Althaf · physicist, Kerala and Bangalore."},
    "labs": {"host": "labs.ajmal.science", "hl": "var(--c-green)", "ink": "var(--c-green)",
             "nav": [("Notebook", "/#notebook"), ("About", "/#about")],
             "foot": "Ajmal Ibn Mohammed Althaf · written up as I go."},
}

DEFS = """<svg class="defs" aria-hidden="true" focusable="false">
    <filter id="crayon" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
    </filter>
    <filter id="wobble">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
    </filter>
  </svg>"""


def page(site, path, title, desc, body, scripts=(), current=None, ld=None):
    s = SITES[site]
    url = "https://%s%s" % (s["host"], path)
    nav = "\n        ".join(
        '<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if current == t else "", t) for t, h in s["nav"])
    others = " · ".join('<a href="https://%s.ajmal.science/">%s</a>' % (k, k) for k in SITES if k != site)
    js = "\n  ".join('<script src="%s" defer></script>' % x for x in scripts)
    ldj = ""
    if ld:
        ldj = '\n  <script type="application/ld+json">\n  %s\n  </script>' % json.dumps(ld, ensure_ascii=False, indent=2).replace("\n", "\n  ")
    full_title = title if title.endswith(s["host"]) else "%s · %s" % (title, s["host"])
    return f"""<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{full_title}</title>
  <meta name="description" content="{desc}" />
  <meta name="author" content="{NAME}" />
  <link rel="canonical" href="{url}" />
  <meta name="theme-color" content="#fbf8f1" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#1f1e1c" media="(prefers-color-scheme: dark)" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="{s['host']}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="https://ajmal.science/og-ajmal-2026.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/notebook.css" />
  <style>:root {{ --hl: {s['hl']}; --hl-ink: {s['ink']}; }}</style>{ldj}
  {js}
</head>
<body>
  {DEFS}
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <div class="wrap top-inner">
      <span class="name-mark"><a class="home" href="https://ajmal.science/" style="text-decoration:none">ajmal<span class="dot">.</span>science</a> <span aria-hidden="true" style="color:var(--soft)">/</span> <a class="sub" href="/" style="text-decoration:none;color:inherit"><span class="sub">{site}</span></a></span>
      <nav aria-label="Sections">
        {nav}
      </nav>
    </div>
  </header>
  <main id="main">
{body}
  </main>
  <footer class="wrap foot">
    <nav aria-label="Ajmal's other sites"><a href="https://ajmal.science/">ajmal.science</a> · {others}</nav>
    <p>{s['foot']}</p>
  </footer>
</body>
</html>
"""


def write(site, rel, html):
    p = os.path.join(OUT, site, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)


def common(site):
    d = os.path.join(OUT, site)
    os.makedirs(d, exist_ok=True)
    shutil.copy(os.path.join(HERE, "shared", "notebook.css"), d)
    for icon in ("favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        shutil.copy(os.path.join(PORTFOLIO, icon), d)
    host = SITES[site]["host"]
    open(os.path.join(d, "CNAME"), "w").write(host + "\n")
    open(os.path.join(d, ".nojekyll"), "w").write("")
    open(os.path.join(d, "robots.txt"), "w").write("User-agent: *\nAllow: /\n\nSitemap: https://%s/sitemap.xml\n" % host)
    write(site, "404.html", f"""<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page not found · {host}</title>
  <meta name="robots" content="noindex" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet" />
  <style>
    body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 16px;
           background: #fbf8f1; color: #23211e; font-family: Caveat, cursive; }}
    @media (prefers-color-scheme: dark) {{ body {{ background: #1f1e1c; color: #ece8df; }} a {{ color: #9fb0ff; }} }}
    h1 {{ font-size: 3rem; margin: 0; }} p {{ font-size: 1.6rem; }} a {{ color: #3b4fa0; }}
  </style>
</head>
<body>
  <div>
    <h1>This page decohered.</h1>
    <p>It isn't here any more. <a href="/">Back to {site}</a> or <a href="https://ajmal.science/">ajmal.science</a></p>
  </div>
</body>
</html>
""")


def sitemap(site, paths):
    host = SITES[site]["host"]
    urls = "\n".join("  <url><loc>https://%s%s</loc></url>" % (host, p) for p in paths)
    write(site, "sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % urls)


PERSON = {"@type": "Person", "name": NAME, "url": "https://ajmal.science/",
          "sameAs": [LINKEDIN, GITHUB, "https://www.instagram.com/ajmalqx/"]}

if __name__ == "__main__":
    import edu_pages, research_pages, labs_pages
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    for mod, site in ((edu_pages, "edu"), (research_pages, "research"), (labs_pages, "labs")):
        common(site)
        src = os.path.join(HERE, site)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(OUT, site), dirs_exist_ok=True)
        paths = mod.build(page, write)
        sitemap(site, paths)
    print("built", os.listdir(OUT))
