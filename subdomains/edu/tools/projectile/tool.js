/* Projectile motion, with and without air resistance (quadratic drag). */
(function () {
  "use strict";
  var $ = kit.$;
  var ang = 45, u = 20, g = 9.81, drag = false, shots = [], anim = null;

  function fly(withDrag) {
    var th = ang * Math.PI / 180, vx = u * Math.cos(th), vy = u * Math.sin(th), x = 0, y = 0, dt = 0.004, t = 0, pts = [[0, 0]], top = 0;
    var k = 0.012;   // drag constant per unit mass, roughly a cricket ball
    while (y >= 0 && t < 60) {
      var sp = Math.hypot(vx, vy), ax = withDrag ? -k * sp * vx : 0, ay = -g - (withDrag ? k * sp * vy : 0);
      vx += ax * dt; vy += ay * dt; x += vx * dt; y += vy * dt; t += dt;
      top = Math.max(top, y);
      if (pts.length < 4000) pts.push([x, Math.max(y, 0)]);
    }
    return { pts: pts, range: x, top: top, time: t, drag: withDrag, ang: ang };
  }

  var cv = kit.canvas($("#field"), 1.9, draw);
  function scale(w, h) {
    var maxR = 0, maxH = 0;
    shots.concat(anim ? [anim.shot] : []).forEach(function (s) { maxR = Math.max(maxR, s.range); maxH = Math.max(maxH, s.top); });
    maxR = Math.max(maxR, 10); maxH = Math.max(maxH, 5);
    return Math.min((w - 50) / maxR, (h - 50) / maxH);
  }
  function draw(ctx, w, h) {
    var c = kit.colors(), ox = 30, oy = h - 28, s = scale(w, h);
    ctx.clearRect(0, 0, w, h);
    kit.pencil(ctx, [[10, oy], [w - 10, oy]], c.ink, 2);
    // metre ticks
    var span = (w - 50) / s / 6, mag = Math.pow(10, Math.floor(Math.log10(span)));
    var step = [1, 2, 5, 10].map(function (k) { return k * mag; }).filter(function (k) { return k >= span; })[0];
    for (var m = 0; ox + m * s < w - 10; m += step) { kit.pencil(ctx, [[ox + m * s, oy], [ox + m * s, oy + 5]], c.soft, 1); if (m) kit.hand(ctx, m + " m", ox + m * s, oy + 15, c.soft, 14, "center"); }
    shots.forEach(function (sh, i) {
      ctx.globalAlpha = i === shots.length - 1 && !anim ? 1 : 0.45;
      kit.pencil(ctx, sh.pts.map(function (p) { return [ox + p[0] * s, oy - p[1] * s]; }), sh.drag ? c.blue : c.red, 2.2);
    });
    ctx.globalAlpha = 1;
    if (anim) {
      var part = anim.shot.pts.slice(0, anim.i);
      kit.pencil(ctx, part.map(function (p) { return [ox + p[0] * s, oy - p[1] * s]; }), anim.shot.drag ? c.blue : c.red, 2.4);
      var q = part[part.length - 1] || [0, 0];
      ctx.fillStyle = c.ochre; ctx.strokeStyle = c.ink; ctx.beginPath(); ctx.arc(ox + q[0] * s, oy - q[1] * s, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // launcher arrow
    var th = ang * Math.PI / 180;
    kit.pencil(ctx, [[ox, oy], [ox + 34 * Math.cos(th), oy - 34 * Math.sin(th)]], c.ink, 3);
  }

  function report(sh) {
    var th = ang * Math.PI / 180, R = u * u * Math.sin(2 * th) / g, H = Math.pow(u * Math.sin(th), 2) / (2 * g), T = 2 * u * Math.sin(th) / g;
    var txt = "without air:  range " + R.toFixed(1) + " m,  height " + H.toFixed(1) + " m,  time " + T.toFixed(2) + " s";
    if (sh && sh.drag) txt += "\nwith air:     range " + sh.range.toFixed(1) + " m,  height " + sh.top.toFixed(1) + " m,  time " + sh.time.toFixed(2) + " s";
    $("#out").textContent = txt;
  }

  function launch() {
    if (drag) { shots.push(fly(false)); if (shots.length > 6) shots.shift(); }   // the no-air path, for comparison
    var sh = fly(drag);
    if (kit.reduce) { shots.push(sh); if (shots.length > 6) shots.shift(); cv.redraw(); report(sh); return; }
    anim = { shot: sh, i: 0 };
    var t0 = performance.now();
    (function stepper(now) {
      var simT = (now - t0) / 1000 * 1.2;                // a bit faster than real time
      anim.i = Math.min(sh.pts.length, Math.floor(simT / sh.time * sh.pts.length) + 1);
      cv.redraw();
      if (anim.i < sh.pts.length) requestAnimationFrame(stepper);
      else { anim = null; shots.push(sh); if (shots.length > 6) shots.shift(); cv.redraw(); report(sh); }
    })(t0);
  }

  kit.slider("ang", function (x) { return x + "°"; }, function (x) { ang = x; cv.redraw(); report(); });
  kit.slider("u", function (x) { return x + " m/s"; }, function (x) { u = x; report(); });
  $("#drag").addEventListener("change", function (e) { drag = e.target.checked; });
  $("#launch").addEventListener("click", function () { if (!anim) launch(); });
  $("#clear").addEventListener("click", function () { shots = []; cv.redraw(); report(); });
  document.addEventListener("click", function (ev) {
    var p = ev.target.closest("[data-g]"); if (!p) return;
    g = parseFloat(p.getAttribute("data-g")); report();
    kit.$$("[data-g]").forEach(function (x) { x.setAttribute("aria-pressed", x === p ? "true" : "false"); });
  });
  report();
})();
