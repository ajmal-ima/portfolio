/* A pendulum that swings with the real equation, θ'' = −(g/L) sin θ − bθ'.
   Compares the measured period with the small-angle formula T = 2π√(L/g). */
(function () {
  "use strict";
  var $ = kit.$;
  var L = 1.0, g = 9.81, b = 0, th = 20 * Math.PI / 180, om = 0, t = 0;
  var dragging = false, last = 0, lastCross = 0, periods = [], trace = [];

  var cv = kit.canvas($("#swing"), 1.25, draw);
  function geom(w, h) { var px = (h * 0.78) / 2.0; return { ox: w / 2, oy: h * 0.08, px: px }; }   // 2 m fills the height

  function draw(ctx, w, h) {
    var c = kit.colors(), G = geom(w, h), r = L * G.px;
    var bx = G.ox + r * Math.sin(th), by = G.oy + r * Math.cos(th);
    ctx.clearRect(0, 0, w, h);
    // ceiling
    kit.pencil(ctx, [[G.ox - 60, G.oy], [G.ox + 60, G.oy]], c.ink, 2.2);
    for (var i = -60; i < 60; i += 12) kit.pencil(ctx, [[G.ox + i, G.oy], [G.ox + i + 9, G.oy - 9]], c.ink, 1.1);
    // rest line and arc
    ctx.setLineDash([3, 5]); kit.pencil(ctx, [[G.ox, G.oy], [G.ox, G.oy + r + 26]], c.soft, 1); ctx.setLineDash([]);
    // trace of the bob
    ctx.globalAlpha = .5; kit.pencil(ctx, trace, c.ochre, 3); ctx.globalAlpha = 1;
    kit.pencil(ctx, [[G.ox, G.oy], [bx, by]], c.ink, 1.8);
    var R = Math.max(12, w * 0.035);
    ctx.fillStyle = c.red; ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    kit.hand(ctx, "θ = " + (th * 180 / Math.PI).toFixed(0) + "°", 12, h - 18, c.soft, 18);
    kit.hand(ctx, "drag the bob", w - 12, h - 18, c.soft, 18, "right");
  }

  function T0() { return 2 * Math.PI * Math.sqrt(L / g); }
  function report() {
    var meas = periods.length ? periods.reduce(function (s, v) { return s + v; }, 0) / periods.length : 0;
    $("#out").textContent =
      "small-angle formula  T = 2π√(L/g) = " + T0().toFixed(3) + " s\n" +
      "measured from the swing        " + (meas ? meas.toFixed(3) + " s" : "…") +
      (meas ? "\ndifference  " + ((meas / T0() - 1) * 100).toFixed(1) + "%" : "");
  }

  function step(dt) {
    // RK4 on (θ, ω)
    function f(a, w) { return [w, -(g / L) * Math.sin(a) - b * w]; }
    var k1 = f(th, om), k2 = f(th + k1[0] * dt / 2, om + k1[1] * dt / 2), k3 = f(th + k2[0] * dt / 2, om + k2[1] * dt / 2), k4 = f(th + k3[0] * dt, om + k3[1] * dt);
    var prev = om;
    th += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    om += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    t += dt;
    // one full period between successive turning points on the same side (ω crosses 0 going negative)
    if (prev > 0 && om <= 0) { if (lastCross) { periods.push(t - lastCross); if (periods.length > 4) periods.shift(); report(); } lastCross = t; }
  }

  function tick(now) {
    if (dragging) return;
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    var n = 8; for (var i = 0; i < n; i++) step(dt / n);
    var s = cv.size(), G = geom(s.w, s.h), r = L * G.px;
    trace.push([G.ox + r * Math.sin(th), G.oy + r * Math.cos(th)]); if (trace.length > 50) trace.shift();
    cv.redraw();
    requestAnimationFrame(tick);
  }
  function restart() { periods = []; lastCross = 0; t = 0; trace = []; report(); }

  var el = $("#swing");
  function angleAt(ev) {
    var r = el.getBoundingClientRect(), s = cv.size(), G = geom(s.w, s.h);
    var a = Math.atan2(ev.clientX - r.left - G.ox, ev.clientY - r.top - G.oy);
    return Math.max(-2.8, Math.min(2.8, a));
  }
  el.addEventListener("pointerdown", function (ev) { dragging = true; el.setPointerCapture(ev.pointerId); th = angleAt(ev); om = 0; trace = []; cv.redraw(); });
  el.addEventListener("pointermove", function (ev) { if (!dragging) return; th = angleAt(ev); om = 0; cv.redraw(); });
  function release() { if (!dragging) return; dragging = false; restart(); last = performance.now(); requestAnimationFrame(tick); }
  el.addEventListener("pointerup", release); el.addEventListener("pointercancel", release);

  kit.slider("len", function (x) { return x.toFixed(2) + " m"; }, function (x) { L = x; restart(); trace = []; cv.redraw(); });
  kit.slider("damp", function (x) { return x === 0 ? "none" : x.toFixed(2) + " /s"; }, function (x) { b = x; });
  document.addEventListener("click", function (ev) {
    var p = ev.target.closest("[data-g]"); if (p) {
      g = parseFloat(p.getAttribute("data-g")); restart();
      kit.$$("[data-g]").forEach(function (x) { x.setAttribute("aria-pressed", x === p ? "true" : "false"); });
    }
    var a = ev.target.closest("[data-angle]"); if (a) { th = parseFloat(a.getAttribute("data-angle")) * Math.PI / 180; om = 0; restart(); }
  });

  report();
  if (kit.reduce) { cv.redraw(); $("#out").textContent += "\n(animation is off because your device asks for reduced motion)"; }
  else { last = performance.now(); requestAnimationFrame(tick); }
})();
