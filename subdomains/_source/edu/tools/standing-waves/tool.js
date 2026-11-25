/* Standing waves on a string fixed at both ends.
   Two travelling waves going opposite ways add up to a standing wave. */
(function () {
  "use strict";
  var $ = kit.$;
  var n = 3, Lm = 0.65, T = 60, mu = 0.0012, showParts = false, t = 0, last = 0, paused = false;

  function v() { return Math.sqrt(T / mu); }
  function f() { return n * v() / (2 * Lm); }

  var cv = kit.canvas($("#string"), 2.2, draw);
  function draw(ctx, w, h) {
    var c = kit.colors(), x0 = 24, x1 = w - 24, mid = h / 2, A = h * 0.32;
    ctx.clearRect(0, 0, w, h);
    // clamps
    [x0, x1].forEach(function (x) {
      kit.pencil(ctx, [[x, mid - A - 14], [x, mid + A + 14]], c.ink, 3);
    });
    ctx.setLineDash([3, 6]); kit.pencil(ctx, [[x0, mid], [x1, mid]], c.soft, 1); ctx.setLineDash([]);
    // slow the motion down so the eye can follow it: one cycle every ~1.6 s whatever the real frequency
    var ph = 2 * Math.PI * t / 1.6;
    var k = n * Math.PI, N = 240;
    function y(fn) { var p = []; for (var i = 0; i <= N; i++) { var s = i / N; p.push([x0 + s * (x1 - x0), mid - A * fn(s)]); } return p; }
    // envelope
    ctx.globalAlpha = .35;
    kit.pencil(ctx, y(function (s) { return Math.sin(k * s); }), c.soft, 1);
    kit.pencil(ctx, y(function (s) { return -Math.sin(k * s); }), c.soft, 1);
    ctx.globalAlpha = 1;
    if (showParts) {
      kit.pencil(ctx, y(function (s) { return 0.5 * Math.sin(k * s - ph); }), c.cyan, 1.6);
      kit.pencil(ctx, y(function (s) { return 0.5 * Math.sin(k * s + ph); }), c.green, 1.6);
    }
    kit.pencil(ctx, y(function (s) { return Math.sin(k * s) * Math.cos(ph); }), c.red, 3);
    // nodes
    for (var j = 0; j <= n; j++) {
      var nx = x0 + j / n * (x1 - x0);
      ctx.fillStyle = c.paper; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(nx, mid, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    kit.hand(ctx, "N = node,  A = antinode", x0, h - 12, c.soft, 16);
    for (j = 0; j < n; j++) kit.hand(ctx, "A", x0 + (j + .5) / n * (x1 - x0), 14, c.soft, 16, "center");
  }

  function report() {
    var lam = 2 * Lm / n;
    $("#out").textContent =
      "wave speed  v = √(T/μ) = " + v().toFixed(0) + " m/s\n" +
      "wavelength  λ = 2L/n = " + (lam * 100).toFixed(1) + " cm\n" +
      "frequency   f = n·v/2L = " + f().toFixed(0) + " Hz" +
      (n === 1 ? "   (the fundamental)" : "   (" + n + " × the fundamental)") + "\n" +
      "nodes " + (n + 1) + ", antinodes " + n;
  }

  function tick(now) {
    var dt = (now - last) / 1000; last = now;
    if (!paused) { t += dt; cv.redraw(); }
    requestAnimationFrame(tick);
  }

  kit.slider("n", function (x) { return "n = " + x; }, function (x) { n = x; report(); cv.redraw(); });
  kit.slider("tension", function (x) { return x + " N"; }, function (x) { T = x; report(); });
  kit.slider("length", function (x) { return (x * 100).toFixed(0) + " cm"; }, function (x) { Lm = x; report(); });
  $("#parts").addEventListener("change", function (e) { showParts = e.target.checked; cv.redraw(); });
  $("#pause").addEventListener("click", function (e) { paused = !paused; e.target.textContent = paused ? "play" : "pause"; });

  var ctx = null, osc = null, gain = null;
  $("#listen").addEventListener("click", function (e) {
    if (osc) { gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05); var o = osc; setTimeout(function () { o.stop(); }, 200); osc = null; e.target.textContent = "listen"; return; }
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator(); gain = ctx.createGain();
    osc.type = "triangle"; osc.frequency.value = Math.min(f(), 4000);
    gain.gain.value = 0; osc.connect(gain).connect(ctx.destination); osc.start();
    gain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.05);
    e.target.textContent = "stop sound";
  });
  setInterval(function () { if (osc) osc.frequency.setTargetAtTime(Math.min(f(), 4000), ctx.currentTime, 0.05); }, 100);

  report();
  if (kit.reduce) { t = 0.2; cv.redraw(); } else { last = performance.now(); requestAnimationFrame(tick); }
})();
