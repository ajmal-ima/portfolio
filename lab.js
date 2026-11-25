/* ajmal.science: the little lab.
   Interactive figures: a qubit, a spectrum, a double slit, a pendulum,
   a gravitational-wave chirp.
   Each piece is independent and does nothing if its markup is missing. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ================= 1. A qubit you can play with ================= */
  var qb = $("#qubit");
  if (qb) {
    var vec = { x: 0, y: 0, z: 1 };                 // Bloch vector, starts at |0⟩
    var tally = [0, 0];
    var cx = 90, cy = 90, R = 70;
    var tip = $(".q-tip", qb), arm = $(".q-arm", qb), shadow = $(".q-shadow", qb);
    var readout = $(".q-state", qb), probs = $(".q-probs", qb), counts = $(".q-counts", qb);

    // simple oblique projection of the sphere onto the page
    function project(v) {
      return { X: cx + R * (v.y * 0.92 - v.x * 0.38), Y: cy - R * (v.z * 0.92 - v.x * 0.22) };
    }
    function fmt(n) { return (Math.abs(n) < 0.005 ? 0 : n).toFixed(2); }

    function draw(v) {
      var p = project(v), s = project({ x: v.x, y: v.y, z: 0 });
      arm.setAttribute("x2", p.X); arm.setAttribute("y2", p.Y);
      tip.setAttribute("cx", p.X); tip.setAttribute("cy", p.Y);
      shadow.setAttribute("x2", s.X); shadow.setAttribute("y2", s.Y);
      // amplitudes: α = cos(θ/2), β = e^{iφ} sin(θ/2)
      var th = Math.acos(Math.max(-1, Math.min(1, v.z))), ph = Math.atan2(v.y, v.x);
      var a = Math.cos(th / 2), b = Math.sin(th / 2);
      var parts = [];
      if (a > 0.005) parts.push(fmt(a) + "|0⟩");
      if (b > 0.005) {
        var c = Math.cos(ph), sn = Math.sin(ph), sign = "+", coef = fmt(b);
        if (Math.abs(sn) < 0.01) sign = c < 0 ? "−" : "+";
        else if (Math.abs(c) < 0.01) { sign = sn > 0 ? "+" : "−"; coef = "i·" + coef; }
        else coef = "e^(i·" + ph.toFixed(2) + ")·" + coef;
        parts.push((parts.length ? sign + " " : (sign === "−" ? "−" : "")) + coef + "|1⟩");
      }
      readout.textContent = "|ψ⟩ = " + parts.join(" ");
      probs.textContent = "P(0) = " + Math.round(a * a * 100) + "%   P(1) = " + Math.round(b * b * 100) + "%";
    }

    function animateTo(target, done) {
      var from = { x: vec.x, y: vec.y, z: vec.z };
      if (reduce) { vec = target; draw(vec); if (done) done(); return; }
      var t0 = performance.now(), D = 450;
      (function step(now) {
        var k = Math.min((now - t0) / D, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var v = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, z: from.z + (target.z - from.z) * e };
        var n = Math.hypot(v.x, v.y, v.z) || 1;     // keep it on the sphere while it moves
        draw({ x: v.x / n, y: v.y / n, z: v.z / n });
        if (k < 1) requestAnimationFrame(step); else { vec = target; draw(vec); if (done) done(); }
      })(t0);
    }

    // gates as rotations of the Bloch vector
    var gates = {
      H: function (v) { return { x: v.z, y: -v.y, z: v.x }; },
      X: function (v) { return { x: v.x, y: -v.y, z: -v.z }; },
      Z: function (v) { return { x: -v.x, y: -v.y, z: v.z }; },
      S: function (v) { return { x: -v.y, y: v.x, z: v.z }; }
    };
    var busy = false;
    qb.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-gate]");
      if (!b || busy) return;
      var g = b.getAttribute("data-gate");
      busy = true;
      function free() { busy = false; }
      if (gates[g]) animateTo(gates[g](vec), free);
      else if (g === "M") {
        var p0 = (1 + vec.z) / 2, out = Math.random() < p0 ? 0 : 1;   // Born rule
        tally[out]++;
        counts.textContent = "measured 0: " + tally[0] + " times · 1: " + tally[1] + " times";
        qb.classList.remove("flash"); void qb.offsetWidth; qb.classList.add("flash");
        animateTo(out === 0 ? { x: 0, y: 0, z: 1 } : { x: 0, y: 0, z: -1 }, free);
      } else if (g === "R") { tally = [0, 0]; counts.textContent = ""; animateTo({ x: 0, y: 0, z: 1 }, free); }
      else free();
    });
    draw(vec);
  }

  /* ================= 2. Spectrum with notes ================= */
  var sp = $("#spectrum");
  if (sp) {
    var note = $(".sp-note", sp);
    var def = note.textContent;
    function show(el) { note.textContent = el ? el.getAttribute("data-note") : def; }
    sp.querySelectorAll(".peak").forEach(function (pk) {
      pk.addEventListener("mouseenter", function () { show(pk); });
      pk.addEventListener("focus", function () { show(pk); });
      pk.addEventListener("click", function () { show(pk); });
      pk.addEventListener("mouseleave", function () { show(null); });
    });
  }

  /* ================= 3. Double slit, one particle at a time ================= */
  var ds = $("#double-slit");
  if (ds) {
    var cv = $("canvas", ds), ctx = cv.getContext("2d");
    var nOut = $(".ds-n", ds), slitBtn = $('[data-ds="slit"]', ds);
    var W = 0, H = 0, n = 0, oneSlit = false, bins = new Array(60).fill(0);
    function size() {
      var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); W = w; H = h; clear();
    }
    function clear() { ctx.clearRect(0, 0, W, H); n = 0; bins.fill(0); nOut.textContent = "0 particles"; }
    // intensity on the screen: single-slit envelope × two-slit fringes
    function I(x) {
      var a = 2.4 * x, env = a === 0 ? 1 : Math.pow(Math.sin(a) / a, 2);
      return oneSlit ? env : env * Math.pow(Math.cos(9 * x), 2);
    }
    function sample() { for (;;) { var x = Math.random() * 2 - 1; if (Math.random() < I(x)) return x; } }
    function fire(k) {
      var ink = css("--c-violet") || "#3b4fa0", hist = css("--c-magenta") || "#c94c3c";
      for (var i = 0; i < k; i++) {
        var x = sample(), px = (x + 1) / 2 * W, py = 6 + Math.random() * (H * 0.62);
        ctx.fillStyle = ink; ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.arc(px, py, 1.4, 0, 6.283); ctx.fill();
        var bi = Math.min(bins.length - 1, Math.floor((x + 1) / 2 * bins.length)); bins[bi]++;
        n++;
      }
      // histogram along the bottom
      var top = H * 0.7, max = Math.max.apply(null, bins) || 1, bw = W / bins.length;
      ctx.clearRect(0, top, W, H - top);
      ctx.globalAlpha = 0.7; ctx.fillStyle = hist;
      bins.forEach(function (c, j) { var h = (c / max) * (H - top - 4); ctx.fillRect(j * bw + 1, H - h, bw - 2, h); });
      ctx.globalAlpha = 1;
      nOut.textContent = n + (n === 1 ? " particle" : " particles");
    }
    var timer = null;
    ds.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-ds]"); if (!b) return;
      var a = b.getAttribute("data-ds");
      if (a === "1") fire(1);
      else if (a === "many") {
        if (timer) return;
        var left = 400;
        if (reduce) { fire(left); return; }
        timer = setInterval(function () { fire(8); left -= 8; if (left <= 0) { clearInterval(timer); timer = null; } }, 30);
      } else if (a === "slit") {
        oneSlit = !oneSlit; slitBtn.setAttribute("aria-pressed", oneSlit); slitBtn.textContent = oneSlit ? "open both slits" : "cover one slit";
        ds.classList.toggle("one", oneSlit); clear();
      } else if (a === "clear") clear();
    });
    window.addEventListener("resize", size);
    size();
  }

  /* ================= 4. A pendulum you can drag ================= */
  var pd = $("#pendulum");
  if (pd) {
    var svg = $("svg", pd), rod = $(".p-rod", pd), bob = $(".p-bob", pd), trail = $(".p-trail", pd), out = $(".p-out", pd);
    var px = 150, py = 14, Lpx = 120, Lm = 0.5, g = 9.81, b = 0.12;     // shown as a 0.5 m pendulum
    var th = 0, w = 0, dragging = false, last = 0, lastCross = 0, periods = [];
    function place() {
      var x = px + Lpx * Math.sin(th), y = py + Lpx * Math.cos(th);
      rod.setAttribute("x2", x); rod.setAttribute("y2", y);
      bob.setAttribute("cx", x); bob.setAttribute("cy", y);
    }
    function toLocal(ev) {
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    var small = 2 * Math.PI * Math.sqrt(Lm / g);
    function report(T) {
      out.textContent = "measured T = " + T.toFixed(2) + " s · small-angle formula 2π√(L/g) = " + small.toFixed(2) + " s";
    }
    out.textContent = "drag the bob and let go · 2π√(L/g) = " + small.toFixed(2) + " s";
    bob.addEventListener("pointerdown", function (ev) { dragging = true; bob.setPointerCapture(ev.pointerId); periods = []; lastCross = 0; });
    bob.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      var p = toLocal(ev); th = Math.max(-1.4, Math.min(1.4, Math.atan2(p.x - px, p.y - py))); w = 0; place();
    });
    function release() { if (!dragging) return; dragging = false; last = performance.now(); requestAnimationFrame(tick); }
    bob.addEventListener("pointerup", release);
    bob.addEventListener("pointercancel", release);
    // keyboard: arrows nudge the pendulum
    bob.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") { w += ev.key === "ArrowLeft" ? -1.5 : 1.5; last = performance.now(); requestAnimationFrame(tick); ev.preventDefault(); }
    });
    var running = false;
    function tick(now) {
      if (dragging) { running = false; return; }
      running = true;
      var dt = Math.min((now - last) / 1000, 0.03); last = now;
      var steps = 4, h = dt / steps, t = now / 1000;
      for (var i = 0; i < steps; i++) {
        var prev = th;
        w += (-(g / Lm) * Math.sin(th) - b * w) * h;     // θ'' = −(g/L) sin θ − bθ'
        th += w * h;
        if (prev < 0 && th >= 0) {                       // upward zero crossing: one full period since the last one
          if (lastCross) { periods.push(t - lastCross); if (periods.length > 3) periods.shift(); report(periods.reduce(function (s, v) { return s + v; }, 0) / periods.length); }
          lastCross = t;
        }
      }
      place();
      if (Math.abs(th) > 0.003 || Math.abs(w) > 0.003) requestAnimationFrame(tick); else { th = 0; w = 0; place(); running = false; }
    }
    place();
  }

  /* ================= 5. Gravitational-wave chirp ================= */
  var gw = $("#chirp");
  if (gw) {
    var path = $(".gw-wave", gw), head = $(".gw-head", gw), play = $(".gw-play", gw);
    // inspiral: f ∝ (tc − t)^(−3/8), amplitude ∝ f^(2/3), then a quick ring-down
    var N = 700, D = 1.0, tc = 0.86, pts = [], fr = [], amp = [];
    for (var i = 0; i <= N; i++) {
      var t = (i / N) * D, f, A;
      if (t < tc) { f = 35 * Math.pow(1 - t / tc + 0.012, -3 / 8) / Math.pow(1.012, -3 / 8); A = Math.pow(f / 250, 2 / 3); }
      else { f = 250; A = Math.exp(-(t - tc) * 45); }
      fr.push(Math.min(f, 250)); amp.push(Math.min(A, 1));
    }
    var phase = 0, d = "";
    for (var j = 0; j <= N; j++) {
      phase += 2 * Math.PI * fr[j] * (D / N) * 0.06;      // slowed down on the page so the cycles are visible
      var x = 10 + (j / N) * 300, y = 40 - 30 * amp[j] * Math.sin(phase);
      d += (j ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    path.setAttribute("d", d);
    var actx = null;
    play.addEventListener("click", function () {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        var o = actx.createOscillator(), gn = actx.createGain(), now = actx.currentTime;
        var fCurve = new Float32Array(fr.length), aCurve = new Float32Array(amp.length);
        for (var k = 0; k < fr.length; k++) { fCurve[k] = fr[k]; aCurve[k] = 0.35 * amp[k]; }
        o.type = "sine";
        o.frequency.setValueCurveAtTime(fCurve, now, D);
        gn.gain.setValueCurveAtTime(aCurve, now, D);
        o.connect(gn).connect(actx.destination);
        o.start(now); o.stop(now + D + 0.05);
      } catch (e) { /* no audio available: the drawing still plays */ }
      if (reduce) return;
      var t0 = performance.now();
      head.style.opacity = 1;
      (function mv(now) {
        var k = Math.min((now - t0) / (D * 1000), 1);
        head.setAttribute("x1", 10 + k * 300); head.setAttribute("x2", 10 + k * 300);
        if (k < 1) requestAnimationFrame(mv); else head.style.opacity = 0;
      })(t0);
    });
  }

})();
