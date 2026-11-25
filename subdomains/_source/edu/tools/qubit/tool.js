/* One qubit on the Bloch sphere: gates, angles and measurement. */
(function () {
  "use strict";
  var $ = kit.$;
  var v = { x: 0, y: 0, z: 1 };          // Bloch vector, starts at |0⟩
  var shown = { x: 0, y: 0, z: 1 };      // what is drawn (animates towards v)
  var tally = [0, 0], trail = [];
  var thetaIn = document.getElementById("theta"), phiIn = document.getElementById("phi");

  function project(p, cx, cy, R) {
    // oblique view: x comes towards you (down-left), y to the right, z up
    return [cx + R * (p.y * 0.94 - p.x * 0.36), cy - R * (p.z * 0.94 - p.x * 0.24)];
  }

  var cv = kit.canvas($("#bloch"), 1.3, draw);

  function draw(ctx, w, h) {
    var c = kit.colors(), cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.36;
    ctx.clearRect(0, 0, w, h);
    // sphere
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    // equator
    ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2;
    var eq = []; for (var a = 0; a <= 64; a++) { var t = a / 64 * Math.PI * 2; eq.push(project({ x: Math.cos(t), y: Math.sin(t), z: 0 }, cx, cy, R)); }
    kit.pencil(ctx, eq, c.soft, 1.2);
    // axes
    ctx.setLineDash([2, 4]);
    [[{ x: 0, y: 0, z: 1.12 }, { x: 0, y: 0, z: -1.12 }], [{ x: 1.25, y: 0, z: 0 }, { x: -1.1, y: 0, z: 0 }], [{ x: 0, y: 1.15, z: 0 }, { x: 0, y: -1.15, z: 0 }]]
      .forEach(function (ax) { kit.pencil(ctx, [project(ax[0], cx, cy, R), project(ax[1], cx, cy, R)], c.soft, 1); });
    ctx.setLineDash([]);
    var fs = Math.max(16, R * 0.16);
    var p0 = project({ x: 0, y: 0, z: 1.2 }, cx, cy, R); kit.hand(ctx, "|0⟩", p0[0] + 6, p0[1], c.ink, fs);
    var p1 = project({ x: 0, y: 0, z: -1.22 }, cx, cy, R); kit.hand(ctx, "|1⟩", p1[0] + 6, p1[1], c.ink, fs);
    var px = project({ x: 1.38, y: 0, z: 0 }, cx, cy, R); kit.hand(ctx, "|+⟩", px[0], px[1], c.soft, fs * .85, "center");
    var py = project({ x: 0, y: 1.28, z: 0 }, cx, cy, R); kit.hand(ctx, "|+i⟩", py[0], py[1], c.soft, fs * .85, "center");
    // trail of recent states
    trail.forEach(function (p, i) {
      var q = project(p, cx, cy, R);
      ctx.globalAlpha = 0.15 + 0.5 * i / trail.length;
      ctx.fillStyle = c.ochre; ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // shadow on the equator plane, then the arrow
    var s = project({ x: shown.x, y: shown.y, z: 0 }, cx, cy, R), o = project({ x: 0, y: 0, z: 0 }, cx, cy, R), tip = project(shown, cx, cy, R);
    ctx.setLineDash([2, 3]); kit.pencil(ctx, [o, s, tip], c.soft, 1); ctx.setLineDash([]);
    kit.pencil(ctx, [o, tip], c.blue, 3.2);
    ctx.fillStyle = c.red; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(tip[0], tip[1], Math.max(6, R * 0.06), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  function fmt(n) { return (Math.abs(n) < 0.005 ? 0 : n).toFixed(2); }
  function angles(p) { return { th: Math.acos(Math.max(-1, Math.min(1, p.z))), ph: Math.atan2(p.y, p.x) }; }

  function report() {
    var a = angles(v), al = Math.cos(a.th / 2), be = Math.sin(a.th / 2), ph = a.ph;
    var amp = "";
    if (al > 0.005) amp += fmt(al) + "|0⟩";
    if (be > 0.005) {
      var re = Math.cos(ph), im = Math.sin(ph), coef;
      if (Math.abs(im) < 0.01) coef = (re < 0 ? "− " : (amp ? "+ " : "")) + fmt(be);
      else if (Math.abs(re) < 0.01) coef = (im < 0 ? "− " : (amp ? "+ " : "")) + "i·" + fmt(be);
      else coef = (amp ? "+ " : "") + "e^(i·" + ph.toFixed(2) + ")·" + fmt(be);
      amp += (amp ? " " : "") + coef + "|1⟩";
    }
    $("#state").textContent = "|ψ⟩ = " + amp;
    $("#probs").textContent = "P(0) = " + Math.round(al * al * 100) + "%    P(1) = " + Math.round(be * be * 100) + "%";
    thetaIn.value = Math.round(a.th * 180 / Math.PI);
    phiIn.value = Math.round(((ph * 180 / Math.PI) + 360) % 360);
    $('output[for="theta"]').textContent = thetaIn.value + "°";
    $('output[for="phi"]').textContent = phiIn.value + "°";
  }

  function tallyText() {
    var n = tally[0] + tally[1];
    $("#counts").textContent = n ? ("measured " + n + "×:  0 → " + tally[0] + "   1 → " + tally[1]) : "";
    var bars = $("#bars"); if (!bars) return;
    bars.querySelector(".b0").style.width = n ? (tally[0] / n * 240) + "px" : "0";
    bars.querySelector(".b1").style.width = n ? (tally[1] / n * 240) + "px" : "0";
  }

  var busy = false;
  function moveTo(target, done) {
    trail.push({ x: v.x, y: v.y, z: v.z }); if (trail.length > 12) trail.shift();
    var from = { x: shown.x, y: shown.y, z: shown.z };
    v = target;
    if (kit.reduce) { shown = target; cv.redraw(); report(); if (done) done(); return; }
    busy = true;
    var t0 = performance.now(), D = 420;
    (function step(now) {
      var k = Math.min((now - t0) / D, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var p = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, z: from.z + (target.z - from.z) * e };
      var n = Math.hypot(p.x, p.y, p.z) || 1;
      shown = { x: p.x / n, y: p.y / n, z: p.z / n };
      cv.redraw();
      if (k < 1) requestAnimationFrame(step); else { shown = target; cv.redraw(); report(); busy = false; if (done) done(); }
    })(t0);
  }

  var S2 = Math.SQRT1_2;
  var gates = {
    H: function (p) { return { x: p.z, y: -p.y, z: p.x }; },
    X: function (p) { return { x: p.x, y: -p.y, z: -p.z }; },
    Y: function (p) { return { x: -p.x, y: p.y, z: -p.z }; },
    Z: function (p) { return { x: -p.x, y: -p.y, z: p.z }; },
    S: function (p) { return { x: -p.y, y: p.x, z: p.z }; },
    T: function (p) { return { x: S2 * (p.x - p.y), y: S2 * (p.x + p.y), z: p.z }; }
  };

  function measureOnce() {
    var p1 = (1 - v.z) / 2, r = Math.random() < p1 ? 1 : 0;
    tally[r]++;
    return r ? { x: 0, y: 0, z: -1 } : { x: 0, y: 0, z: 1 };
  }

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-gate]"); if (!b || busy) return;
    var g = b.getAttribute("data-gate");
    if (gates[g]) moveTo(gates[g](v));
    else if (g === "M") { moveTo(measureOnce()); tallyText(); }
    else if (g === "M100") {
      // prepare the same state 100 times and measure each copy
      var p1 = (1 - v.z) / 2;
      for (var i = 0; i < 100; i++) tally[Math.random() < p1 ? 1 : 0]++;
      tallyText();
    }
    else if (g === "R") { tally = [0, 0]; trail = []; tallyText(); moveTo({ x: 0, y: 0, z: 1 }); }
  });

  function fromSliders() {
    if (busy) return;
    var th = thetaIn.value * Math.PI / 180, ph = phiIn.value * Math.PI / 180;
    v = shown = { x: Math.sin(th) * Math.cos(ph), y: Math.sin(th) * Math.sin(ph), z: Math.cos(th) };
    cv.redraw(); report();
  }
  thetaIn.addEventListener("input", fromSliders);
  phiIn.addEventListener("input", fromSliders);

  report(); tallyText();
})();
