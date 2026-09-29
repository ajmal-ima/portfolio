document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // CV download — uses the browser print dialog with the
  // dedicated print stylesheet (Save as PDF). To link a real
  // PDF instead, replace the handler below with:
  //   cvButton.addEventListener("click", () => {
  //     window.open("cv.pdf", "_blank");
  //   });
  // and place cv.pdf in this folder.
  // -------------------------------------------------------
  const cvButton = document.getElementById("cv-button");
  if (cvButton) {
    cvButton.addEventListener("click", () => window.print());
  }

  // -------------------------------------------------------
  // Hero node graph — a small quantum-network constellation.
  // Nodes are generated and connected with dashed lines;
  // a few "pulse" to suggest live qubits.
  // -------------------------------------------------------
  const svg = document.getElementById("node-graph");
  if (svg) {
    const NS = "http://www.w3.org/2000/svg";
    const linesG = document.getElementById("graph-lines");
    const nodesG = document.getElementById("graph-nodes");

    const nodes = [
      { x: 430, y: 250, r: 7, core: true },
      { x: 220, y: 80, r: 4, label: "RESEARCH" },
      { x: 520, y: 60, r: 4, label: "QUANTUMX" },
      { x: 555, y: 230, r: 3.5, label: "TEACHING" },
      { x: 480, y: 440, r: 4, label: "COMMUNITY" },
      { x: 210, y: 450, r: 3.5, label: "OUTREACH" },
      { x: 150, y: 260, r: 3, label: "PHYSICS" },
      { x: 320, y: 140, r: 2.5, pulse: true },
      { x: 460, y: 130, r: 2.5, pulse: true },
      { x: 530, y: 340, r: 2.5, pulse: true },
      { x: 360, y: 380, r: 2.5, pulse: true },
      { x: 190, y: 350, r: 2.5, pulse: true },
    ];

    // Connect every node to the core, plus a few cross-links
    const links = [];
    for (let i = 1; i < nodes.length; i++) links.push([0, i]);
    links.push([1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [7, 8], [10, 11]);

    links.forEach(([a, b]) => {
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", nodes[a].x);
      line.setAttribute("y1", nodes[a].y);
      line.setAttribute("x2", nodes[b].x);
      line.setAttribute("y2", nodes[b].y);
      linesG.appendChild(line);
    });

    nodes.forEach((n) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", n.x);
      c.setAttribute("cy", n.y);
      c.setAttribute("r", n.r);
      c.setAttribute(
        "class",
        "node" + (n.core ? " core" : "") + (n.pulse ? " pulse" : "")
      );
      nodesG.appendChild(c);

      if (n.label) {
        const t = document.createElementNS(NS, "text");
        t.setAttribute("x", n.x + 12);
        t.setAttribute("y", n.y + 3);
        t.textContent = n.label;
        nodesG.appendChild(t);
      }
    });

    // Gentle drift of satellite nodes (skip when reduced motion)
    if (!prefersReducedMotion) {
      const satellites = nodesG.querySelectorAll("circle.node.pulse");
      let t0 = null;
      const origins = [...satellites].map((c) => ({
        x: +c.getAttribute("cx"),
        y: +c.getAttribute("cy"),
      }));

      function drift(ts) {
        if (t0 === null) t0 = ts;
        const t = (ts - t0) / 1000;
        satellites.forEach((c, i) => {
          const dx = Math.sin(t * 0.5 + i * 1.7) * 8;
          const dy = Math.cos(t * 0.4 + i * 2.3) * 8;
          c.setAttribute("cx", origins[i].x + dx);
          c.setAttribute("cy", origins[i].y + dy);
        });
        requestAnimationFrame(drift);
      }
      requestAnimationFrame(drift);
    }
  }

  // -------------------------------------------------------
  // Scroll reveal
  // -------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    ".section-head, .focus-card, .degree, .research-grid > div, .xp-row, .contact-title, .contact-lines, .split-left, .hero-copy, .hero-photo"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // -------------------------------------------------------
  // Active sidebar link highlighting
  // -------------------------------------------------------
  const sections = document.querySelectorAll("main section[id]");
  const sideLinks = document.querySelectorAll(".side-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            sideLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
});
