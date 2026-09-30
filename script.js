/* ============================================================
   Ajmal Ibn Mohammed Althaf · ajmal.science
   Minimal JavaScript: mobile nav, scrollspy, reveals, year.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header state */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 24);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile navigation toggle */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Scrollspy: highlight the current section in the nav */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-link")
  );
  var sectionByLink = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#"
        ? { link: link, section: document.querySelector(id) }
        : null;
    })
    .filter(function (entry) {
      return entry && entry.section;
    });

  if ("IntersectionObserver" in window && sectionByLink.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          sectionByLink.forEach(function (item) {
            item.link.classList.toggle(
              "active",
              item.section === entry.target
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sectionByLink.forEach(function (item) {
      spy.observe(item.section);
    });
  }

  /* Fade-in reveals */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
})();
