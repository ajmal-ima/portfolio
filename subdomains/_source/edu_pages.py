"""edu.ajmal.science: interactive physics tools for students and teachers."""
from build import PERSON

TOOLS = [
    ("qubit", "A qubit you can turn",
     "Apply quantum gates to one qubit, watch it move on the Bloch sphere, then measure it a hundred times.",
     "quantum computing · class 11 and up",
     '<circle cx="60" cy="55" r="42" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="60" cy="55" rx="42" ry="12" fill="none" stroke="currentColor" stroke-dasharray="4 5"/><line x1="60" y1="55" x2="84" y2="24" stroke="var(--c-blue)" stroke-width="3" stroke-linecap="round"/><circle cx="84" cy="24" r="6" fill="var(--c-red)" stroke="currentColor" stroke-width="1.5"/>'),
    ("double-slit", "Double slit, one particle at a time",
     "Send particles through two slits and watch the pattern build up dot by dot. Then put a detector at the slits.",
     "waves and quantum · class 12 and up",
     '<line x1="40" y1="8" x2="40" y2="44" stroke="currentColor" stroke-width="3"/><line x1="40" y1="52" x2="40" y2="62" stroke="currentColor" stroke-width="3"/><line x1="40" y1="70" x2="40" y2="102" stroke="currentColor" stroke-width="3"/>' + "".join('<rect x="%d" y="%d" width="3" height="3" fill="var(--c-green)"/>' % (150 + (i * 7) % 18, 10 + (i * 37) % 90) for i in range(40)) + '<path d="M180 10 C 170 25, 200 35, 180 55 C 160 75, 200 85, 180 100" fill="none" stroke="var(--c-red)" stroke-width="2"/>'),
    ("pendulum", "A pendulum, timed",
     "Drag the bob and let go. Compare the measured period with 2π√(L/g), on Earth, the Moon or Jupiter.",
     "mechanics · class 9 and up",
     '<line x1="40" y1="8" x2="100" y2="8" stroke="currentColor" stroke-width="2.5"/><line x1="70" y1="8" x2="100" y2="86" stroke="currentColor" stroke-width="1.8"/><path d="M40 82 Q70 100 100 82" fill="none" stroke="var(--c-ochre)" stroke-width="3" opacity=".6"/><circle cx="100" cy="86" r="11" fill="var(--c-red)" stroke="currentColor" stroke-width="2"/>'),
    ("standing-waves", "Standing waves on a string",
     "Change the harmonic, tension and length. See the nodes, then hear the note the string would play.",
     "waves and sound · class 11 and up",
     '<line x1="10" y1="20" x2="10" y2="90" stroke="currentColor" stroke-width="3"/><line x1="230" y1="20" x2="230" y2="90" stroke="currentColor" stroke-width="3"/><path d="M10 55 C 37 10, 63 10, 90 55 C 117 100, 143 100, 170 55 C 190 22, 210 22, 230 55" fill="none" stroke="var(--c-red)" stroke-width="3"/><path d="M10 55 C 37 100, 63 100, 90 55 C 117 10, 143 10, 170 55 C 190 88, 210 88, 230 55" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>'),
    ("projectile", "Projectile, with and without air",
     "Launch at any angle and speed. Find the angle for the longest throw, then switch on air resistance.",
     "mechanics · class 9 and up",
     '<line x1="8" y1="96" x2="232" y2="96" stroke="currentColor" stroke-width="2"/><path d="M14 96 Q 110 -30 206 96" fill="none" stroke="var(--c-red)" stroke-width="2.4"/><path d="M14 96 Q 90 0 160 96" fill="none" stroke="var(--c-blue)" stroke-width="2.4"/><circle cx="110" cy="34" r="6" fill="var(--c-ochre)" stroke="currentColor" stroke-width="1.5"/>'),
]

SOON = [
    ("Photoelectric effect", "Shine light of different colours on a metal and find the work function."),
    ("Spectra of atoms", "Why hydrogen glows in four colours, from the energy levels."),
]


def index():
    cards = []
    for slug, title, blurb, level, svg in TOOLS:
        cards.append(f"""          <li><a class="card" href="/tools/{slug}/">
            <svg class="thumb" viewBox="0 0 240 110" aria-hidden="true">{svg}</svg>
            <h3>{title}</h3>
            <p>{blurb}</p>
            <p class="meta">{level}</p>
          </a></li>""")
    for title, blurb in SOON:
        cards.append(f"""          <li><div class="card ghost">
            <h3>{title}</h3>
            <p>{blurb}</p>
            <p class="meta"><span class="tag soon">being drawn</span></p>
          </div></li>""")
    cards = "\n".join(cards)
    return f"""    <section class="intro wrap narrow">
      <p class="hello">edu, by Ajmal</p>
      <h1><span>Physics you can poke.</span></h1>
      <p class="lede">
        Small interactive tools I use when I teach physics and quantum computing.
        Each one shows a single idea, runs in a browser, and works on a phone.
      </p>
    </section>

    <section class="sec" id="tools">
      <div class="wrap">
        <h2><span>Tools</span></h2>
        <ul class="cards three">
{cards}
        </ul>
      </div>
    </section>

    <section class="sec" id="teachers">
      <div class="wrap narrow">
        <h2><span>For teachers</span></h2>
        <p>
          Use any of these in class, on a projector or on students' phones. There is
          nothing to install and no sign-up. Each tool has a few "try this" prompts and
          a short note on the physics behind it, so you can set it as a small activity.
        </p>
        <p>
          The numbers are real: the pendulum swings by the full equation, not the
          small-angle shortcut, and the double slit uses the actual interference formula.
          Where a tool simplifies something, it says so.
        </p>
        <p>
          If something is wrong, unclear, or you'd like a tool for a topic you teach,
          <a href="https://ajmal.science/#contact">tell me</a>.
        </p>
      </div>
    </section>

    <section class="sec" id="about">
      <div class="wrap narrow">
        <h2><span>Why this exists</span></h2>
        <p>
          I taught physics at two colleges in Kerala and later wrote curricula for
          school students. The moment a concept lands is usually when a student gets
          to change something and see what happens. These tools are my attempt to
          give them that, one idea at a time.
        </p>
        <p class="aside">More about me at <a href="https://ajmal.science/">ajmal.science</a>. My research lives at <a href="https://research.ajmal.science/">research.ajmal.science</a>, and work in progress at <a href="https://labs.ajmal.science/">labs.ajmal.science</a>.</p>
      </div>
    </section>
"""


def tool_page(slug, title, intro, stage, controls, tries, physics):
    tries = "\n".join("            <li>%s</li>" % t for t in tries)
    return f"""    <section class="intro wrap narrow">
      <p class="hello"><a href="/#tools" style="color:inherit">← all tools</a></p>
      <h1><span>{title}</span></h1>
      <p class="lede">{intro}</p>
    </section>
    <section class="wrap">
      <div class="tool">
        <div>
{stage}
        </div>
        <div>
{controls}
        </div>
      </div>
    </section>
    <section class="sec">
      <div class="wrap narrow">
      <h2><span>Try this</span></h2>
      <ol class="try">
{tries}
      </ol>
      <details class="physics" open>
        <summary>the physics ✎</summary>
{physics}
      </details>
      </div>
    </section>
"""


def qubit():
    stage = """          <div class="stage"><canvas id="bloch" role="img" aria-label="Bloch sphere with an arrow showing the qubit's state"></canvas></div>
          <p class="readout" id="state" aria-live="polite"></p>
          <p class="readout" id="probs"></p>"""
    controls = """          <p class="hand">gates</p>
          <div class="row">
            <button class="btn" data-gate="H" title="Hadamard: makes an equal superposition">H</button>
            <button class="btn" data-gate="X" title="X: flips 0 and 1">X</button>
            <button class="btn" data-gate="Y" title="Y: flips with a phase">Y</button>
            <button class="btn" data-gate="Z" title="Z: flips the phase">Z</button>
            <button class="btn" data-gate="S" title="S: quarter turn about z">S</button>
            <button class="btn" data-gate="T" title="T: eighth turn about z">T</button>
          </div>
          <div class="slider"><label for="theta">θ, from |0⟩ towards |1⟩</label><output for="theta">0°</output><input id="theta" type="range" min="0" max="180" step="1" value="0" /></div>
          <div class="slider"><label for="phi">φ, the phase</label><output for="phi">0°</output><input id="phi" type="range" min="0" max="359" step="1" value="0" /></div>
          <p class="hand">measure</p>
          <div class="row">
            <button class="btn hand go" data-gate="M">measure once</button>
            <button class="btn hand" data-gate="M100">measure 100 copies</button>
            <button class="btn hand" data-gate="R">reset</button>
          </div>
          <p class="readout" id="counts" aria-live="polite"></p>
          <div id="bars" aria-hidden="true" style="display:grid;gap:4px;max-width:320px">
            <div style="display:flex;align-items:center;gap:.5rem"><span class="hand">0</span><span class="b0" style="height:12px;width:0;background:var(--c-blue);border-radius:3px;transition:width .3s"></span></div>
            <div style="display:flex;align-items:center;gap:.5rem"><span class="hand">1</span><span class="b1" style="height:12px;width:0;background:var(--c-red);border-radius:3px;transition:width .3s"></span></div>
          </div>"""
    tries = [
        "Press <b>H</b>, then <b>measure once</b>. The arrow jumps to the top or the bottom. Measure again: it stays put.",
        "Reset, press <b>H</b>, then <b>measure 100 copies</b>. You get roughly 50 of each, but rarely exactly 50.",
        "Press <b>H</b>, <b>Z</b>, <b>H</b>. Where does it end up? Now try <b>H</b>, <b>H</b>. Two Hadamards undo each other.",
        "Use the θ slider to set 60°. Predict P(1) before you measure 100 copies. (Hint: sin²(θ/2).)",
        "Press <b>H</b>, then <b>S</b> four times. The phase goes round once and P(0) never changes. Phase is invisible to this measurement, but not to the next gate.",
    ]
    physics = """        <p>A qubit's state can be written |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩. The two angles place it on a sphere, the Bloch sphere: |0⟩ at the top, |1⟩ at the bottom, and equal superpositions around the equator.</p>
        <p class="eq">P(0) = cos²(θ/2),   P(1) = sin²(θ/2)</p>
        <p>Every single-qubit gate is a rotation of this sphere. X is a half-turn about the x axis, Z about z, and H about the axis halfway between x and z. Measuring gives 0 or 1 at random with those probabilities and leaves the qubit at the pole it landed on.</p>
        <p>"Measure 100 copies" prepares the same state 100 times and measures each copy once, which is what a real quantum computer does when it runs a circuit for many shots.</p>"""
    return tool_page("qubit", "A qubit you can turn",
                     "One qubit, six gates and a measurement. The arrow shows the state. Gates rotate it; measuring makes it pick a pole.",
                     stage, controls, tries, physics)


def double_slit():
    stage = """          <div class="stage"><canvas id="screen" role="img" aria-label="A detector screen where particles land, with a histogram of where they hit"></canvas></div>
          <p class="readout"><span id="count" aria-live="polite">0 particles</span><br /><span id="fringe"></span></p>"""
    controls = """          <div class="row">
            <button class="btn hand" data-fire="1">fire 1</button>
            <button class="btn hand" data-fire="10">fire 10</button>
            <button class="btn hand go" data-fire="1000">fire 1000</button>
            <button class="btn hand" data-fire="clear">clear</button>
          </div>
          <div class="slider"><label for="lam">wavelength λ</label><output for="lam"></output><input id="lam" type="range" min="400" max="700" step="10" value="550" /></div>
          <div class="slider"><label for="d">slit separation d</label><output for="d"></output><input id="d" type="range" min="0.05" max="0.6" step="0.01" value="0.25" /></div>
          <div class="slider"><label for="a">slit width a</label><output for="a"></output><input id="a" type="range" min="0.01" max="0.12" step="0.005" value="0.05" /></div>
          <div class="slider"><label for="L">distance to screen L</label><output for="L"></output><input id="L" type="range" min="0.5" max="3" step="0.1" value="1" /></div>
          <p class="row"><label class="hand"><input id="curve" type="checkbox" checked /> show the predicted pattern</label></p>
          <p class="row"><label class="hand"><input id="watch" type="checkbox" /> put a detector at the slits</label></p>"""
    tries = [
        "Fire 1, then 10. One particle lands in one place. Nothing about a single dot looks like a wave.",
        "Fire 1000. The stripes appear out of single dots. Each particle went through the setup alone.",
        "Make the slits closer together (smaller d). Do the fringes spread out or squeeze in? Check with Δy = λL/d.",
        "Change the colour from violet to red. Which colour spreads more?",
        "Tick <b>put a detector at the slits</b> and fire 1000. Knowing which slit each particle used wipes out the stripes.",
    ]
    physics = """        <p>Each slit acts as a source. On a far screen the two paths differ by d·sinθ. Where that difference is a whole number of wavelengths, the waves add up; where it is a half number, they cancel.</p>
        <p class="eq">I(θ) ∝ cos²(πd sinθ / λ) · [sin(β)/β]²,   β = πa sinθ / λ</p>
        <p>The cos² part is the two-slit interference. The second part is the envelope from each slit having a width a. For small angles the bright fringes are Δy = λL/d apart.</p>
        <p>The pattern is a probability: it tells you where each particle is likely to land, not where any one will. If you find out which slit it went through, the two paths no longer interfere and you get two overlapping single-slit humps. (Here that is drawn as the envelope alone, which is a simplification.)</p>"""
    return tool_page("double-slit", "Double slit, one particle at a time",
                     "Particles go through two narrow slits, one at a time, and land on a screen. Watch what pattern they build.",
                     stage, controls, tries, physics)


def pendulum():
    stage = """          <div class="stage"><canvas id="swing" role="img" aria-label="A swinging pendulum. Drag the bob to set its angle."></canvas></div>
          <p class="readout" id="out" aria-live="polite"></p>"""
    controls = """          <div class="slider"><label for="len">length L</label><output for="len"></output><input id="len" type="range" min="0.2" max="2" step="0.05" value="1" /></div>
          <p class="hand">where are you?</p>
          <div class="row">
            <button class="btn hand" data-g="9.81" aria-pressed="true">Earth 9.81</button>
            <button class="btn hand" data-g="1.62" aria-pressed="false">Moon 1.62</button>
            <button class="btn hand" data-g="3.72" aria-pressed="false">Mars 3.72</button>
            <button class="btn hand" data-g="24.8" aria-pressed="false">Jupiter 24.8</button>
          </div>
          <p class="hand">start angle</p>
          <div class="row">
            <button class="btn hand" data-angle="5">5°</button>
            <button class="btn hand" data-angle="20">20°</button>
            <button class="btn hand" data-angle="60">60°</button>
            <button class="btn hand" data-angle="120">120°</button>
          </div>
          <div class="slider"><label for="damp">air friction</label><output for="damp"></output><input id="damp" type="range" min="0" max="0.5" step="0.01" value="0" /></div>"""
    tries = [
        "Start at 5°. The measured period matches 2π√(L/g) almost exactly.",
        "Start at 60°, then 120°. The formula and the swing start to disagree. Which one is wrong, and why?",
        "Make the pendulum four times longer. What happens to the period? (Not four times.)",
        "Take it to the Moon. How long would a 1 m pendulum take for one swing there?",
        "Add some air friction. The swing dies down, but does the period change much?",
    ]
    physics = """        <p>The bob feels gravity pulling it back towards the bottom. Along the arc, the restoring force is mg sinθ, which gives the equation of motion</p>
        <p class="eq">d²θ/dt² = −(g/L) sinθ</p>
        <p>For small angles, sinθ ≈ θ and the motion is simple harmonic with period T = 2π√(L/g). The mass doesn't appear at all.</p>
        <p>This tool solves the full equation step by step (fourth-order Runge–Kutta), so at large angles you see the real period, which is longer than the formula. At 60° it is about 7% longer.</p>"""
    return tool_page("pendulum", "A pendulum, timed",
                     "Drag the bob out and let it go. The tool times each swing and compares it with the formula from the textbook.",
                     stage, controls, tries, physics)


def standing_waves():
    stage = """          <div class="stage"><canvas id="string" role="img" aria-label="A string fixed at both ends vibrating as a standing wave"></canvas></div>
          <p class="readout" id="out" aria-live="polite"></p>"""
    controls = """          <div class="slider"><label for="n">harmonic</label><output for="n"></output><input id="n" type="range" min="1" max="8" step="1" value="3" /></div>
          <div class="slider"><label for="tension">tension T</label><output for="tension"></output><input id="tension" type="range" min="10" max="150" step="1" value="60" /></div>
          <div class="slider"><label for="length">string length L</label><output for="length"></output><input id="length" type="range" min="0.3" max="1.2" step="0.01" value="0.65" /></div>
          <p class="row"><label class="hand"><input id="parts" type="checkbox" /> show the two travelling waves</label></p>
          <div class="row">
            <button class="btn hand" id="pause">pause</button>
            <button class="btn hand go" id="listen">listen</button>
          </div>
          <p class="aside" style="font-size:.95rem">The motion is slowed down so you can see it. The sound plays the real frequency.</p>"""
    tries = [
        "Go from n = 1 to n = 2. Count the nodes. How does the frequency change?",
        "Tick <b>show the two travelling waves</b>. Two waves going opposite ways add up to one that stands still.",
        "Press listen, then increase the tension. This is what tuning a guitar or a veena does.",
        "Halve the length. The note goes up by an octave: the frequency doubles. That's why frets work.",
    ]
    physics = """        <p>A wave on a string travels at v = √(T/μ), where T is the tension and μ the mass per metre (here 1.2 g/m, a light steel string). When it reflects off the fixed ends, the outgoing and returning waves overlap.</p>
        <p class="eq">y(x, t) = 2A sin(kx) cos(ωt)</p>
        <p>Only some wavelengths fit with a node at each end: L = nλ/2. So the string can only ring at f = n·v/2L. The lowest, n = 1, is the fundamental; the rest are its harmonics, and together they give an instrument its sound.</p>"""
    return tool_page("standing-waves", "Standing waves on a string",
                     "A string held at both ends can only vibrate in certain shapes. Pick one, change the string, and listen.",
                     stage, controls, tries, physics)


def projectile():
    stage = """          <div class="stage"><canvas id="field" role="img" aria-label="The flight path of a launched ball over flat ground"></canvas></div>
          <p class="readout" id="out" aria-live="polite"></p>"""
    controls = """          <div class="slider"><label for="ang">launch angle</label><output for="ang"></output><input id="ang" type="range" min="5" max="85" step="1" value="45" /></div>
          <div class="slider"><label for="u">launch speed</label><output for="u"></output><input id="u" type="range" min="5" max="40" step="1" value="20" /></div>
          <p class="row"><label class="hand"><input id="drag" type="checkbox" /> air resistance (a cricket ball)</label></p>
          <div class="row">
            <button class="btn hand" data-g="9.81" aria-pressed="true">Earth</button>
            <button class="btn hand" data-g="1.62" aria-pressed="false">Moon</button>
          </div>
          <div class="row">
            <button class="btn hand go" id="launch">launch</button>
            <button class="btn hand" id="clear">clear</button>
          </div>
          <p class="aside" style="font-size:.95rem">Red: no air. Blue: with air.</p>"""
    tries = [
        "Launch at 30° and at 60° with the same speed. They land in the same place. Why?",
        "Find the angle that throws the farthest. Is it still 45° with air resistance on?",
        "Double the speed. Does the range double? (It goes up four times without air.)",
        "Throw on the Moon. Same speed, same angle: how much farther?",
    ]
    physics = """        <p>Without air, the horizontal velocity never changes and gravity only pulls down. The path is a parabola.</p>
        <p class="eq">R = u² sin(2θ) / g,   H = u² sin²θ / 2g,   T = 2u sinθ / g</p>
        <p>sin(2θ) is largest at 45°, and θ and 90° − θ give the same range. With air, a drag force proportional to v² acts against the motion. The path becomes lopsided, the ball comes down steeper than it went up, and the best angle drops below 45°.</p>"""
    return tool_page("projectile", "Projectile, with and without air",
                     "Throw something. Change the angle and speed, then see what the air does to it.",
                     stage, controls, tries, physics)


def build(page, write):
    write("edu", "index.html", page("edu", "/", "edu.ajmal.science",
          "Interactive physics tools by Ajmal Ibn Mohammed Althaf: a qubit, the double slit, a pendulum, standing waves and projectiles. Free for classrooms, works on phones.",
          index(), current=None,
          ld={"@context": "https://schema.org", "@type": "WebSite", "name": "edu.ajmal.science",
              "url": "https://edu.ajmal.science/", "author": PERSON, "inLanguage": "en-IN"}))
    builders = {"qubit": qubit, "double-slit": double_slit, "pendulum": pendulum,
                "standing-waves": standing_waves, "projectile": projectile}
    paths = ["/"]
    for slug, title, blurb, level, _ in TOOLS:
        write("edu", "tools/%s/index.html" % slug, page(
            "edu", "/tools/%s/" % slug, title, blurb, builders[slug](),
            scripts=("/js/kit.js", "/tools/%s/tool.js" % slug), current="Tools",
            ld={"@context": "https://schema.org", "@type": "LearningResource", "name": title,
                "description": blurb, "learningResourceType": "simulation", "isAccessibleForFree": True,
                "educationalLevel": level.split(" · ")[1], "url": "https://edu.ajmal.science/tools/%s/" % slug,
                "author": PERSON, "inLanguage": "en-IN"}))
        paths.append("/tools/%s/" % slug)
    return paths
