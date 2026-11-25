"""labs.ajmal.science: an open lab notebook of experiments, simulations and side projects."""
from build import PERSON

# (when, title, text, tags, status)  status: wip | done
ENTRIES = [
    ("Nov 2026", "Interactive physics tools",
     'Five browser tools for teaching: a qubit, the double slit, a pendulum, standing waves and projectiles. Each solves the real equations. Now on <a href="https://edu.ajmal.science/">edu.ajmal.science</a>.',
     ["javascript", "teaching"], "wip"),
    ("2025", "Qiskit notebooks for school students",
     "Python and IBM Quantum exercises written for students in grades 8 to 12, for Kerala's first school-level quantum computing track.",
     ["qiskit", "python", "curriculum"], "done"),
    ("2024", "Quantum mechanics in code notebooks",
     "A set of notebooks that build up quantum mechanics concepts one cell at a time, made with the physics research team at Talrop.",
     ["python", "notebooks"], "done"),
    ("Winter 2019–20", "Density of states with Quantum ESPRESSO",
     "Computed the electronic density of states for Ge, SiO and Mg. My first time running density functional theory, in the Molecular Biophysics Research Lab.",
     ["DFT", "Quantum ESPRESSO", "computational"], "done"),
    ("Winter 2019–20", "Growing KDP crystals",
     "Grew potassium dihydrogen phosphate crystals from solution and measured their Vickers hardness.",
     ["crystal growth", "experimental"], "done"),
    ("Winter 2019–20", "Reading XRD patterns",
     "Worked out crystallite size, lattice parameters and strain from X-ray diffraction data of thin films, using Fityk and JCPDS reference cards.",
     ["XRD", "data analysis"], "done"),
    ("Fall 2019–20", "Photonic crystal fibre modes in COMSOL",
     "Designed a photonic crystal fibre and simulated the light modes it guides, using the finite element method.",
     ["COMSOL", "photonics", "simulation"], "done"),
    ("Fall 2019–20", "Copper oxide nanoparticles, green synthesis",
     "Made CuO nanoparticles using a plant-extract route and characterised them with UV spectroscopy and X-ray diffraction.",
     ["nanoparticles", "experimental"], "done"),
    ("Fall 2019–20", "Dielectric constant against temperature and frequency",
     "Measured how a material's dielectric constant changes as it is heated and as the field frequency changes.",
     ["dielectrics", "experimental"], "done"),
    ("Fall 2019–20", "Photodetectors and wetting surfaces",
     "Two short experimental rotations: characterising photodetectors in the optoelectronics lab, and measuring whether surfaces repel or attract water.",
     ["optoelectronics", "condensed matter"], "done"),
]


def index():
    rows = []
    for when, title, text, tags, status in ENTRIES:
        label = {"wip": "in progress", "done": "done"}[status]
        tg = " ".join('<span class="tag">%s</span>' % t for t in tags)
        rows.append(f"""        <article class="entry">
          <p class="when">{when}</p>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <p class="tags"><span class="tag {status}">{label}</span> {tg}</p>
          </div>
        </article>""")
    rows = "\n".join(rows)
    return f"""    <section class="intro wrap narrow">
      <p class="hello">labs, by Ajmal</p>
      <h1><span>An open lab notebook.</span></h1>
      <p class="lede">
        Experiments, simulations and side projects, including ones that are
        half done. Newest first. Not everything here worked, and that's written down too.
      </p>
    </section>

    <section class="sec" id="notebook">
      <div class="wrap narrow">
        <h2><span>Notebook</span></h2>
{rows}
      </div>
    </section>

    <section class="sec" id="about">
      <div class="wrap narrow">
        <h2><span>About this notebook</span></h2>
        <p>
          Research papers show the finished result. This is the part before that: the
          tries, the setups, the code that ran once. Finished teaching tools move to
          <a href="https://edu.ajmal.science/">edu</a>, and published work to
          <a href="https://research.ajmal.science/">research</a>.
        </p>
        <p class="aside">Code, where there is any, is on <a href="https://github.com/ajmal-ima" rel="noopener">GitHub</a>.</p>
      </div>
    </section>
"""


def build(page, write):
    write("labs", "index.html", page("labs", "/", "labs.ajmal.science",
          "Ajmal Ibn Mohammed Althaf's open lab notebook: physics experiments, simulations and side projects, including work in progress.",
          index(),
          ld={"@context": "https://schema.org", "@type": "WebSite", "name": "labs.ajmal.science",
              "url": "https://labs.ajmal.science/", "author": PERSON, "inLanguage": "en-IN"}))
    return ["/"]
