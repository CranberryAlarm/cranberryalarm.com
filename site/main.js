// Menu button on small screens.
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}

toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

// Scroll reveals and the Impact Number count-up. The page is complete without
// either: the final numbers are already in the HTML.
const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el) {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if (!calmMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
}
