"use strict";

const year = String(new Date().getFullYear());
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = year;
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = [...document.querySelectorAll(".step-card, .tool-card, .cleaner-card")];

if (!reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });
}

const sectionLinks = [...document.querySelectorAll('.header-nav > a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length > 0) {
  const setCurrentSection = (sectionId) => {
    sectionLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateCurrentSection = () => {
    const readingLine = window.innerHeight * 0.35;
    const currentSection = observedSections
      .filter((section) => section.getBoundingClientRect().top <= readingLine)
      .sort((left, right) => right.getBoundingClientRect().top - left.getBoundingClientRect().top)[0]
      ?? observedSections[0];

    setCurrentSection(currentSection.id);
  };

  const navigationObserver = new IntersectionObserver(updateCurrentSection, {
    rootMargin: "-20% 0px -60% 0px",
    threshold: [0, 0.25, 0.5],
  });

  observedSections.forEach((section) => navigationObserver.observe(section));
  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => setCurrentSection(link.getAttribute("href").slice(1)));
  });
  updateCurrentSection();
}
