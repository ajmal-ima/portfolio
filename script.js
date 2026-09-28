document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // CV download — uses the browser print dialog with the
  // dedicated print stylesheet (Save as PDF). Replace with a
  // direct PDF link here once a hosted CV file is available.
  // -------------------------------------------------------
  const cvButton = document.getElementById("cv-button");
  if (cvButton) {
    cvButton.addEventListener("click", () => window.print());
  }

  // -------------------------------------------------------
  // Mobile navigation toggle
  // -------------------------------------------------------
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after choosing a destination
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // -------------------------------------------------------
  // Section activation, reveal animation, progress rail
  // -------------------------------------------------------
  const chapters = document.querySelectorAll(".chapter");
  const progressLinks = document.querySelectorAll(".progress-nav a");
  const navLinks = document.querySelectorAll(".nav-link");

  function setActive(chapter) {
    chapters.forEach((ch) => ch.classList.remove("active"));
    chapter.classList.add("active");

    const id = chapter.getAttribute("id");

    progressLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });
  }

  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );

    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  } else {
    // Fallback: reveal everything immediately
    chapters.forEach((chapter) => chapter.classList.add("active"));
  }

  // With reduced motion, reveal everything without animation
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("visible");
    });
  }

  // -------------------------------------------------------
  // Scroll hint buttons
  // -------------------------------------------------------
  document.querySelectorAll(".scroll-hint").forEach((btn) => {
    const targetSelector = btn.getAttribute("data-target");
    if (!targetSelector) return;
    btn.addEventListener("click", () => {
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    });
  });
});
