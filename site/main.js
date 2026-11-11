const root = document.documentElement;
const clamp = (n) => Math.min(Math.max(n, 0), 1);

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

// Robots timeline. Without motion it is a strip you scroll sideways. With
// motion on a large enough screen the section pins (see styles.css) and
// scrolling down moves the strip across.
const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pinQuery = window.matchMedia(
  "(prefers-reduced-motion: no-preference) and (min-width: 48rem) and (min-height: 37.5rem)"
);
const section = document.querySelector(".robots-section");
const pin = section.querySelector(".robots-pin");
const strip = section.querySelector(".robots");
const slides = [...strip.children];
const yearLinks = [...section.querySelectorAll(".robot-years a")];
const lastSlide = Math.max(slides.length - 1, 1);

section.style.setProperty("--slides", slides.length);

function setCurrent(index) {
  yearLinks.forEach((link) => {
    if (link.hash === "#" + slides[index].id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function goToSlide(index, smooth) {
  if (pinQuery.matches) {
    const pinStart = section.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(pin).top);
    const distance = section.offsetHeight - pin.offsetHeight;
    window.scrollTo({ top: pinStart + (index / lastSlide) * distance, behavior: smooth ? "smooth" : "auto" });
  } else {
    strip.scrollTo({ left: slides[index].offsetLeft - strip.offsetLeft, behavior: smooth && !calmMotion ? "smooth" : "auto" });
  }
}

yearLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const index = slides.findIndex((slide) => "#" + slide.id === link.hash);
    if (index < 0) return;
    event.preventDefault();
    goToSlide(index, true);
  });
});

// Tabbing into a Robot that is off to the side brings it on screen.
strip.addEventListener("focusin", (event) => {
  if (!pinQuery.matches || !event.target.matches(":focus-visible")) return;
  goToSlide(slides.indexOf(event.target.closest(".robot")), false);
});

strip.addEventListener("scroll", () => {
  if (!pinQuery.matches) setCurrent(Math.round(strip.scrollLeft / slides[0].offsetWidth));
}, { passive: true });

setCurrent(0);

// Everything below is motion. The page is complete without it: the final
// Impact Numbers are already in the HTML.
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
  root.classList.add("js");

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

  // Scroll-linked motion. One pass per frame writes custom properties that
  // styles.css turns into movement:
  //   --sy  page scroll in px (backdrop and hero logo)
  //   --p   0 to 1 as a [data-scrub] element crosses the screen
  //   --d   how many slides each Robot is from the centre (pinned timeline)
  const scrubbed = [...document.querySelectorAll("[data-scrub]")];
  let queued = false;

  function update() {
    queued = false;
    const viewport = window.innerHeight;
    root.style.setProperty("--sy", Math.round(window.scrollY));

    for (const el of scrubbed) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -viewport || rect.top > 2 * viewport) continue;
      el.style.setProperty("--p", clamp((viewport - rect.top) / (viewport + rect.height)).toFixed(4));
    }

    if (pinQuery.matches) {
      const distance = section.offsetHeight - pin.offsetHeight;
      const progress = clamp((parseFloat(getComputedStyle(pin).top) - section.getBoundingClientRect().top) / distance);
      const position = progress * lastSlide;
      strip.style.setProperty("--p", progress.toFixed(4));
      slides.forEach((slide, index) => slide.style.setProperty("--d", (index - position).toFixed(3)));
      setCurrent(Math.round(position));
    } else {
      strip.style.removeProperty("--p");
      slides.forEach((slide) => slide.style.removeProperty("--d"));
    }
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();

  // The hero sticker leans toward the pointer.
  const hero = document.querySelector(".hero");
  const sticker = hero.querySelector(".hero-logo img");
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = hero.getBoundingClientRect();
    sticker.style.setProperty("--tilt-x", ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    sticker.style.setProperty("--tilt-y", ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    sticker.style.removeProperty("--tilt-x");
    sticker.style.removeProperty("--tilt-y");
  });
}
