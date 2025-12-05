document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Typewriter effect
  const typewriterEls = document.querySelectorAll(".typewriter");
  const typedSet = new WeakSet();

  function typeText(el) {
    if (!el || typedSet.has(el)) return;
    const fullText = el.getAttribute("data-title") || "";
    el.textContent = "";
    typedSet.add(el);

    if (prefersReducedMotion || fullText.length === 0) {
      el.textContent = fullText;
      el.classList.add("done");
      return;
    }

    let idx = 0;
    const interval = setInterval(() => {
      el.textContent = fullText.slice(0, idx);
      idx++;
      if (idx > fullText.length) {
        clearInterval(interval);
        setTimeout(() => el.classList.add("done"), 200);
      }
    }, 45);
  }

  // Scroll-snapping journey and chapter activation
  const chapters = document.querySelectorAll(".chapter");
  const progressLinks = document.querySelectorAll(".progress-nav a");

  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapter = entry.target;
            chapters.forEach((ch) => ch.classList.remove("active"));
            chapter.classList.add("active");

            // Activate matching progress nav
            const id = chapter.getAttribute("id");
            progressLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${id}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });

            // Trigger typewriter for this chapter
            const titleEl = chapter.querySelector(".typewriter");
            typeText(titleEl);
          }
        });
      },
      { threshold: 0.6 }
    );

    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  } else {
    // Fallback: just show all titles immediately
    typewriterEls.forEach((el) => {
      el.textContent = el.getAttribute("data-title") || "";
      el.classList.add("done");
    });
  }

  // Also allow clicking progress dots to jump
  progressLinks.forEach((link) => {
    link.addEventListener("click", () => {
      progressLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Scroll hint buttons
  const scrollHints = document.querySelectorAll(".scroll-hint");
  scrollHints.forEach((btn) => {
    const targetSelector = btn.getAttribute("data-target");
    if (!targetSelector) return;
    btn.addEventListener("click", () => {
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  });

  // Initial typewriter on first visible chapter
  const firstChapterTitle = document.querySelector(
    ".chapter.active .typewriter"
  );
  if (firstChapterTitle) {
    typeText(firstChapterTitle);
  }
});

