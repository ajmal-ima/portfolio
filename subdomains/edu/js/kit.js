/* kit.js: small helpers shared by the edu.ajmal.science tools. */
(function () {
  "use strict";
  var kit = {};
  kit.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  kit.$ = function (sel, root) { return (root || document).querySelector(sel); };
  kit.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  kit.css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };
  kit.colors = function () {
    return {
      ink: kit.css("--ink"), soft: kit.css("--soft"), paper: kit.css("--paper"), rule: kit.css("--rule"),
      red: kit.css("--c-red"), green: kit.css("--c-green"), ochre: kit.css("--c-ochre"),
      cyan: kit.css("--c-cyan"), blue: kit.css("--c-blue"), yellow: kit.css("--c-yellow")
    };
  };

  /* A canvas that keeps its aspect ratio and stays sharp on high-DPI screens.
     Calls draw(ctx, w, h) whenever it needs repainting. */
  kit.canvas = function (el, aspect, draw) {
    var ctx = el.getContext("2d"), w = 0, h = 0;
    function fit() {
      var r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = w / aspect;
      el.style.height = h + "px";
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h);
    }
    window.addEventListener("resize", fit);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", fit);
    fit();
    return { ctx: ctx, size: function () { return { w: w, h: h }; }, redraw: function () { draw(ctx, w, h); }, fit: fit };
  };

  /* Wire a range input to an <output> and a callback. */
  kit.slider = function (id, format, onInput) {
    var input = document.getElementById(id), out = kit.$('output[for="' + id + '"]');
    function upd() { var v = parseFloat(input.value); if (out) out.textContent = format(v); if (onInput) onInput(v); }
    input.addEventListener("input", upd);
    upd();
    return input;
  };

  /* A slightly wobbly pencil line, so figures look hand-drawn but stay readable. */
  kit.pencil = function (ctx, pts, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.stroke();
  };

  kit.hand = function (ctx, text, x, y, color, size, align) {
    ctx.fillStyle = color; ctx.font = "500 " + (size || 18) + "px Caveat, 'Segoe Print', cursive";
    ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  };

  window.kit = kit;
})();
