/* Double slit, one particle at a time. Fraunhofer pattern on a far screen. */
(function () {
  "use strict";
  var $ = kit.$;
  var lam = 550, d = 0.25, a = 0.05, L = 1.0, watch = false;   // nm, mm, mm, m
  var hits = [], bins = new Array(120).fill(0), timer = null;
  var HALF = 0.012;   // the screen shows ±12 mm

  function intensity(x) {          // x in metres on the screen
    var s = x / Math.sqrt(x * x + L * L), k = Math.PI / (lam * 1e-9);
    var beta = k * a * 1e-3 * s, alpha = k * d * 1e-3 * s;
    var env = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
    return env * (watch ? 0.5 : Math.pow(Math.cos(alpha), 2));
  }
  function sample() {
    for (var i = 0; i < 5000; i++) { var x = (Math.random() * 2 - 1) * HALF; if (Math.random() < intensity(x) / (watch ? 0.5 : 1)) return x; }
    return 0;
  }

  function lamColor(n) {           // rough visible-spectrum colour
    var h = n < 440 ? 270 : n < 490 ? 270 - (n - 440) * 1.6 : n < 580 ? 190 - (n - 490) * 1.5 : 55 - (n - 580) * 0.45;
    return "hsl(" + Math.max(0, h) + ", 75%, 50%)";
  }

  var cv = kit.canvas($("#screen"), 1.7, draw);
  function draw(ctx, w, h) {
    var c = kit.colors(), top = h * 0.5, col = lamColor(lam);
    ctx.clearRect(0, 0, w, h);
    // dots
    ctx.fillStyle = col;
    hits.forEach(function (p) { ctx.globalAlpha = 0.75; ctx.fillRect((p[0] / HALF * 0.5 + 0.5) * w - 1, p[1] * (top - 12) + 6, 2.2, 2.2); });
    ctx.globalAlpha = 1;
    kit.pencil(ctx, [[0, top], [w, top]], c.rule, 1);
    // histogram
    var max = Math.max.apply(null, bins) || 1, bw = w / bins.length;
    ctx.fillStyle = c.blue; ctx.globalAlpha = 0.55;
    bins.forEach(function (n, j) { var bh = n / max * (h - top - 14); ctx.fillRect(j * bw + .5, h - 4 - bh, bw - 1, bh); });
    ctx.globalAlpha = 1;
    // predicted curve
    var pts = [], scale = 0;
    for (var i = 0; i <= 300; i++) { var x = (i / 300 * 2 - 1) * HALF; scale = Math.max(scale, intensity(x)); }
    for (i = 0; i <= 300; i++) { x = (i / 300 * 2 - 1) * HALF; pts.push([i / 300 * w, h - 4 - intensity(x) / (scale || 1) * (h - top - 14)]); }
    if ($("#curve").checked) kit.pencil(ctx, pts, c.red, 1.8);
    kit.hand(ctx, "−12 mm", 4, h - 12, c.soft, 15);
    kit.hand(ctx, "+12 mm", w - 4, h - 12, c.soft, 15, "right");
    kit.hand(ctx, "0", w / 2, h - 12, c.soft, 15, "center");
  }

  function fire(n) {
    for (var i = 0; i < n; i++) {
      var x = sample(); hits.push([x, Math.random()]);
      if (hits.length > 6000) hits.shift();
      var j = Math.floor((x / HALF * 0.5 + 0.5) * bins.length); if (j >= 0 && j < bins.length) bins[j]++;
    }
    $("#count").textContent = bins.reduce(function (s, b) { return s + b; }, 0) + " particles";
    cv.redraw();
  }
  function clear() { hits = []; bins.fill(0); $("#count").textContent = "0 particles"; cv.redraw(); }
  function spacing() {
    var dy = lam * 1e-9 * L / (d * 1e-3) * 1000;
    $("#fringe").textContent = watch ? "with a detector at the slits, the fringes vanish" : "fringe spacing  Δy = λL/d ≈ " + dy.toFixed(2) + " mm";
  }

  kit.slider("lam", function (x) { return x + " nm"; }, function (x) { lam = x; clear(); spacing(); });
  kit.slider("d", function (x) { return x.toFixed(2) + " mm"; }, function (x) { d = x; clear(); spacing(); });
  kit.slider("a", function (x) { return (x * 1000).toFixed(0) + " µm"; }, function (x) { a = x; clear(); spacing(); });
  kit.slider("L", function (x) { return x.toFixed(1) + " m"; }, function (x) { L = x; clear(); spacing(); });
  $("#curve").addEventListener("change", function () { cv.redraw(); });
  $("#watch").addEventListener("change", function (e) { watch = e.target.checked; clear(); spacing(); });

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-fire]"); if (!b) return;
    var k = b.getAttribute("data-fire");
    if (k === "clear") { if (timer) { clearInterval(timer); timer = null; } clear(); return; }
    var n = parseInt(k, 10);
    if (n <= 10 || kit.reduce) { fire(n); return; }
    if (timer) clearInterval(timer);
    var left = n;
    timer = setInterval(function () { var s = Math.min(left, Math.ceil(n / 60)); fire(s); left -= s; if (left <= 0) { clearInterval(timer); timer = null; } }, 30);
  });
  spacing();
})();
