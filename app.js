"use strict";

// All navigation and disclosures work without JavaScript.
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const sectionLinks = [...document.querySelectorAll('.header-nav a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let framePending = false;

function updateCurrentSection() {
  framePending = false;
  // Use the same reading position as native anchor navigation.
  const readingLine = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  let current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= readingLine + 1);

  // The short FAQ cannot reach the reading line at the bottom of a tall viewport.
  const atBottom = window.scrollY > 0 &&
    document.documentElement.scrollHeight - window.innerHeight - window.scrollY <= 1;
  if (atBottom) current = sections[sections.length - 1];

  sectionLinks.forEach((link) => {
    if (current && link.getAttribute("href") === `#${current.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function scheduleSectionUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateCurrentSection);
}

window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleSectionUpdate);
scheduleSectionUpdate();
