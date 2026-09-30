/* ============================================================
   Ajmal Ibn Mohammed Althaf · ajmal.science
   Minimal JavaScript: mobile nav, scrollspy, footer year, CV.
   ============================================================ */

(function () {
  "use strict";

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile navigation toggle */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    /* Close the menu after choosing a section */
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
    var observer = new IntersectionObserver(
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
      observer.observe(item.section);
    });
  }

  /*
    CV / Resume
    The buttons below print this page, which uses a dedicated print
    stylesheet as a clean CV layout.

    To link a real PDF instead:
    1. Add cv.pdf to this folder.
    2. Replace window.print() with: window.open("cv.pdf", "_blank");
  */
  function handleCv() {
    window.print();
  }

  ["cv-button", "cv-button-footer"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", handleCv);
  });
})();
