/* ajmal.science: small touches of motion and play.
   Everything here is optional: the page reads fine without JavaScript,
   and motion is switched off for people who ask for reduced motion. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  document.getElementById("year").textContent = new Date().getFullYear();
  root.classList.add("js");

  /* ---------- 1. Sketch-in reveals ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Scroll: progress line, parallax doodles, photo tilt ---------- */
  var bar = document.querySelector(".progress span");
  var floats = Array.prototype.slice.call(document.querySelectorAll(".float"));
  var tilt = document.querySelector(".tilt");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (!reduce) {
      floats.forEach(function (f) {
        var s = parseFloat(f.getAttribute("data-speed")) || 0;
        var rot = f.classList.contains("eq") ? 0 : y * s * 0.2;   // equations stay level
        f.style.transform = "translate3d(0," + (y * s).toFixed(1) + "px,0) rotate(" + rot.toFixed(1) + "deg)";
      });
      if (tilt) tilt.style.setProperty("--tilt", Math.min(y / 40, 8).toFixed(2) + "deg");
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 3. Pointer: crayon sparkles that follow the mouse ---------- */
  if (finePointer && !reduce) {
    var colors = ["#3b4fa0", "#3b4fa0", "#c94c3c"];   // ink blue, with the odd red-pencil dot
    var last = 0, i = 0;
    window.addEventListener("pointermove", function (ev) {
      var now = performance.now();
      if (now - last < 45) return;           // keep it light: ~20 dots a second at most
      last = now;
      var d = document.createElement("span");
      d.className = "spark";
      d.style.left = ev.clientX + "px";
      d.style.top = ev.clientY + "px";
      d.style.background = colors[i++ % colors.length];   // a fading particle track, like a cloud chamber
      document.body.appendChild(d);
      setTimeout(function () { d.remove(); }, 700);
    }, { passive: true });
  }

  /* ---------- 4. Hidden stars game ---------- */
  var stars = Array.prototype.slice.call(document.querySelectorAll(".star"));
  var counter = document.querySelector(".stars-found");
  var countEl = counter && counter.querySelector(".n");
  var KEY = "ajmal-stars";
  var found = [];
  try { found = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { found = []; }

  function burst(x, y) {
    if (reduce) return;
    for (var k = 0; k < 14; k++) {
      var p = document.createElement("span");
      p.className = "spark burst";
      var a = (Math.PI * 2 * k) / 14, r = 40 + Math.random() * 40;
      p.style.left = x + "px"; p.style.top = y + "px";
      p.style.setProperty("--dx", Math.cos(a) * r + "px");
      p.style.setProperty("--dy", Math.sin(a) * r + "px");
      p.style.background = ["#3b4fa0", "#c94c3c", "#d39b3a"][k % 3];
      document.body.appendChild(p);
      (function (n) { setTimeout(function () { n.remove(); }, 900); })(p);
    }
  }

  function render() {
    stars.forEach(function (s, idx) {
      var got = found.indexOf(idx) !== -1;
      s.classList.toggle("got", got);
      s.setAttribute("aria-pressed", got ? "true" : "false");
    });
    if (!counter) return;
    if (found.length) counter.hidden = false;
    countEl.textContent = found.length;
    if (found.length === stars.length) {
      counter.classList.add("done");
      counter.innerHTML = '<svg aria-hidden="true"><use href="#star" /></svg> all 6 photons absorbed. thanks for reading this far. <a href="#contact">say hi</a>';
    }
  }

  stars.forEach(function (s, idx) {
    s.addEventListener("click", function () {
      if (found.indexOf(idx) !== -1) return;
      found.push(idx);
      try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (e) {}
      var r = s.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
      render();
    });
  });
  render();

  /* ---------- 5. Physics figures ---------- */
  // How far a figure has travelled through the viewport: 0 entering, 1 leaving.
  function progressOf(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh - r.top) / (vh + r.height);
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }
  function q(fig, sel) { return fig.querySelector(sel); }

  var machines = Array.prototype.slice.call(document.querySelectorAll(".machine"));
  var drawers = {
    pulley: function (fig, p) {
      // one mass rises exactly as far as the other falls (inextensible rope)
      var d = (p - 0.5) * 90;
      var yl = 105 + d, yr = 105 - d;
      q(fig, ".mass-l").setAttribute("transform", "translate(0," + yl + ")");
      q(fig, ".mass-r").setAttribute("transform", "translate(0," + yr + ")");
      q(fig, ".rope-l").setAttribute("y2", yl);
      q(fig, ".rope-r").setAttribute("y2", yr);
      // rope moves d px, so the wheel turns d / r radians
      q(fig, ".wheel").setAttribute("transform", "rotate(" + (-d / 20 * 57.3).toFixed(1) + " 150 50)");
    },
    cantilever: function (fig, p) {
      // Euler-Bernoulli cantilever, point load P at distance a from the wall
      var x0 = 24, y0 = 60, L = 244, a = 30 + p * (L - 30);
      var k = 3 * 38 / Math.pow(L, 3);          // scaled so a load at the tip bends it 38 px
      function y(x) { return x <= a ? k * x * x * (3 * a - x) / 6 : k * a * a * (3 * x - a) / 6; }
      var d = "";
      for (var i = 0; i <= 30; i++) {
        var x = (L * i) / 30;
        d += (i ? " L" : "M") + (x0 + x).toFixed(1) + " " + (y0 + y(x)).toFixed(1);
      }
      q(fig, ".beam").setAttribute("d", d);
      q(fig, ".beam-shadow").setAttribute("d", d);
      q(fig, ".load").setAttribute("transform", "translate(" + (x0 + a).toFixed(1) + "," + (y0 + y(a) + 2).toFixed(1) + ")");
      q(fig, ".readout").textContent = "δ = " + (y(L) * 0.25).toFixed(1) + " mm";
    },
    lever: function (fig, p) {
      var t = Math.sin(p * Math.PI * 2.2) * 11;   // rocks back and forth as you pass
      q(fig, ".arm").setAttribute("transform", "rotate(" + t.toFixed(2) + " 150 100)");
    }
  };
  function drawMachines() {
    machines.forEach(function (fig) {
      var f = drawers[fig.getAttribute("data-machine")];
      if (f) f(fig, reduce ? 0.5 : progressOf(fig));
    });
  }
  if (machines.length) {
    var mTick = false;
    window.addEventListener("scroll", function () {
      if (!mTick) { mTick = true; requestAnimationFrame(function () { drawMachines(); mTick = false; }); }
    }, { passive: true });
    window.addEventListener("resize", drawMachines);
    drawMachines();
  }

  // Catapult: real projectile motion, x = vx·t, y = vy·t − ½gt²
  var cat = document.querySelector('[data-machine="catapult"]');
  if (cat) {
    var ball = q(cat, ".ball"), arm = q(cat, ".cat-arm"), trace = q(cat, ".trace"),
        bin = q(cat, ".bin"), btn = q(cat, ".launch"), note = q(cat, ".launch-note");
    var flying = false, shots = 0;
    var x0 = 18, y0 = 84, xt = 276, yt = 140;          // start, and the middle of the inbox
    var g = 220;                                        // px/s², tuned so a flight lasts ~1.3 s
    btn.addEventListener("click", function () {
      if (flying) return;
      flying = true; shots++;
      var T = 1.3, vx = (xt - x0) / T;                  // pick a flight time, solve for velocity
      var vy = ((y0 - yt) + 0.5 * g * T * T) / T;       // upward is positive
      if (reduce) {
        ball.setAttribute("cx", xt); ball.setAttribute("cy", yt);
        note.textContent = "landed. hello sent."; flying = false; return;
      }
      arm.style.transform = "rotate(80deg)";
      var start = null, pts = "M" + x0 + " " + y0;
      trace.setAttribute("d", pts);
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / 1000, T);
        var x = x0 + vx * t, yy = y0 - (vy * t - 0.5 * g * t * t);
        ball.setAttribute("cx", x.toFixed(1)); ball.setAttribute("cy", yy.toFixed(1));
        pts += " L" + x.toFixed(1) + " " + yy.toFixed(1);
        trace.setAttribute("d", pts);
        if (t < T) { requestAnimationFrame(step); return; }
        bin.classList.remove("hit"); void bin.getBBox(); bin.classList.add("hit");
        note.textContent = shots === 1 ? "landed. now try the real one ↓" : "landed again. range = " + (xt - x0) + " px, no air resistance.";
        setTimeout(function () {
          arm.style.transform = "";
          ball.setAttribute("cx", x0); ball.setAttribute("cy", y0);
          flying = false;
        }, 900);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- 6. Standing wave across the top ---------- */
  var wave = document.querySelector(".lights .wave");
  if (wave && !reduce) {
    var t0 = performance.now();
    (function draw(now) {
      var a = 30 * Math.cos((now - t0) / 700);       // amplitude swings: y = A sin(kx) cos(ωt)
      wave.setAttribute("d", "M0 35 Q 200 " + (35 - a).toFixed(1) + " 400 35 T 800 35 T 1200 35");
      requestAnimationFrame(draw);
    })(t0);
  }

})();
