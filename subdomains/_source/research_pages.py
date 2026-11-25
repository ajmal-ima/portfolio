"""research.ajmal.science: PhD work, QuantumX research, earlier work, papers and talks."""
from build import PERSON, RESEARCHGATE

PAPERS = [
    ("Journal article on my PhD work", "accepted, in press · 2026",
     "Title, journal and link will go here once it's published."),
    ("Advancing Materials Science: A Synergistic Review of Quantum Computing and ML in Density Functional Theory",
     "talk · ICNMD-24, Kalasalingam Academy of Research and Education · Aug 2024", ""),
    ("Digital Divide in Quantum Education",
     "talk · Quantum Universal Education, first anniversary (online) · Jul 2021", ""),
    ("Effect of Damping in a Non-Maximally Entangled Bidirectional Quantum Communication Protocol",
     "talk · 21st ICSET, VIT · Dec 2020", ""),
    ("Controller-Independent Bidirectional Quantum Communication Using Entanglement Swapping",
     "talk · 19th ICSET, VIT · Oct 2019", ""),
]


def index():
    papers = "\n".join(
        f"""          <li><span class="t">{t}</span><span class="m">{m}</span>{('<span class="aside" style="font-size:.95rem">' + n + '</span>') if n else ''}</li>"""
        for t, m, n in PAPERS)
    return f"""    <section class="intro wrap narrow">
      <p class="hello">research, by Ajmal</p>
      <h1><span>Molecules, computed.</span></h1>
      <p class="lede">
        I use quantum mechanics to study molecules: how they're shaped, how they
        vibrate, and what that says about how they behave. This page collects that
        work, along with research I do at QuantumX and earlier projects.
      </p>
    </section>

    <section class="sec" id="phd">
      <div class="wrap narrow">
        <h2><span>PhD</span></h2>
        <div class="note">
          <h3>Molecular quantum mechanics of bioactive compounds</h3>
          <p class="meta">Kalasalingam Academy of Research and Education · part-time · since Dec 2022<br />supervised by Dr. P. Selvarangan</p>
          <p>
            Computational and spectroscopic studies of bioactive compounds,
            with a focus on molecules relevant to cancer research.
          </p>
        </div>
        <h3>How a study goes</h3>
        <ol class="try">
          <li><b>Pick a molecule.</b> A compound with known or suspected biological activity.</li>
          <li><b>Compute it.</b> Quantum-mechanical calculations give its most stable shape, how its electrons are spread out, and the frequencies it should vibrate at.</li>
          <li><b>Measure it.</b> Spectra from the lab show which frequencies it actually absorbs.</li>
          <li><b>Compare.</b> When calculation and spectrum agree, we can trust the model, and use it to say things the experiment alone can't, such as which parts of the molecule are most reactive.</li>
        </ol>
        <p class="aside">There's a small sketch of an infrared spectrum on <a href="https://ajmal.science/#spectrum">my main site</a> if you'd like to see what one looks like.</p>
      </div>
    </section>

    <section class="sec" id="quantumx">
      <div class="wrap narrow">
        <h2><span>At QuantumX</span></h2>
        <p>
          At <a href="https://quantumx.ventures/" rel="noopener">QuantumX</a> I lead the
          scientific side. Our research so far is in two areas:
        </p>
        <ul class="list">
          <li><span class="t">Post-quantum cryptography</span><span class="m">encryption that stays safe once large quantum computers exist</span></li>
          <li><span class="t">Hybrid quantum-classical workflows</span><span class="m">splitting a problem so a quantum processor does only the part it's good at</span></li>
        </ul>
        <p class="aside">Details, write-ups and code will be added here as they're ready to share.</p>
      </div>
    </section>

    <section class="sec" id="earlier">
      <div class="wrap narrow">
        <h2><span>Earlier</span></h2>
        <h3>M.Sc. thesis: Decoherence in Quantum Communication Protocols</h3>
        <p class="meta">Vellore Institute of Technology · 2021</p>
        <p>
          How noise and imperfect entanglement affect two-way quantum communication.
          I worked with noise models and computed fidelities for bidirectional
          protocols between parties who share non-maximally entangled states.
        </p>
        <h3>Research lab rotations</h3>
        <p class="meta">VIT, Advanced Physics Research Laboratory scheme · 2019–20</p>
        <p>
          Eleven short rotations across experimental, numerical and theoretical labs,
          from growing crystals to simulating photonic crystal fibres. They're written up
          as entries in my <a href="https://labs.ajmal.science/">lab notebook</a>.
        </p>
        <h3>Mentoring</h3>
        <p>
          As head of physics at The Elegant College in Palakkad (2022–23) I mentored
          eleven undergraduate research projects.
        </p>
      </div>
    </section>

    <section class="sec" id="papers">
      <div class="wrap narrow">
        <h2><span>Papers and talks</span></h2>
        <ul class="list">
{papers}
        </ul>
        <h3>Find me</h3>
        <ul class="list">
          <li><a href="{RESEARCHGATE}" rel="noopener">ResearchGate</a></li>
          <li><span class="t">Google Scholar</span><span class="m">coming once the journal article is out</span></li>
        </ul>
        <p class="aside" style="margin-top:1.2rem">Tools I use: Python, Qiskit, Quantum ESPRESSO, MATLAB, COMSOL, LaTeX and Linux.</p>
      </div>
    </section>
"""


def build(page, write):
    write("research", "index.html", page("research", "/", "research.ajmal.science",
          "Research by Ajmal Ibn Mohammed Althaf: PhD work in molecular quantum mechanics of bioactive compounds, research at QuantumX, and earlier work on quantum communication.",
          index(),
          ld={"@context": "https://schema.org", "@type": "ProfilePage", "url": "https://research.ajmal.science/",
              "mainEntity": dict(PERSON, **{"affiliation": {"@type": "CollegeOrUniversity", "name": "Kalasalingam Academy of Research and Education"},
                                           "knowsAbout": ["Molecular quantum mechanics", "Spectroscopy", "Quantum computing", "Quantum communication"]})}))
    return ["/"]
