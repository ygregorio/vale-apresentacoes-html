import { initAnimations } from "./animations.js";
import { initCharts } from "./charts.js";
import { initInteractions } from "./interactions.js";
import { initMaps } from "./map-brazil.js";
import { initIndicatorsTransport } from "./indicators-transport.js";
import { initMcsSlides } from "./mcs-slide.js";
import { initVp1IndicatorSlide } from "./vp1-indicator-slide.js";
import { applyThemeAssets, applyIcons } from "./assets.js";

export class Deck {
  constructor(root) {
    this.root = root;
    this.viewport = root.closest(".deck__viewport");
    this.slides = [...root.querySelectorAll(".slide")];
    this.current = 0;
    this.progress = document.querySelector(".deck__progress");
    this.counter = document.querySelector(".deck__counter");
    this.prevBtn = document.querySelector('[data-action="prev"]');
    this.nextBtn = document.querySelector('[data-action="next"]');

    window.__valeDeck = this;
    this.bindEvents();
    this.goTo(0);
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        this.next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        this.prev();
      }
      if (e.key === "Home") this.goTo(0);
      if (e.key === "End") this.goTo(this.slides.length - 1);
    });

    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    let touchStartX = 0;
    this.root.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.root.addEventListener("touchend", (e) => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }

  goToSlideId(id) {
    const idx = this.slides.findIndex((s) => s.dataset.slideId === id);
    if (idx >= 0) this.goTo(idx);
  }

  goTo(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.slides.forEach((s) => s.classList.remove("is-active"));
    this.current = index;
    const slide = this.slides[this.current];
    slide.classList.add("is-active");

    const chapterTheme = slide.dataset.chapterTheme;
    if (chapterTheme) {
      document.body.dataset.chapterTheme = chapterTheme;
      document.documentElement.style.setProperty(
        "--theme-band",
        `var(--vale-${chapterTheme})`
      );
    }

    const pct = ((this.current + 1) / this.slides.length) * 100;
    if (this.progress) this.progress.style.width = `${pct}%`;
    if (this.counter) {
      this.counter.textContent = `${this.current + 1} / ${this.slides.length}`;
    }
    if (this.prevBtn) this.prevBtn.disabled = this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.current === this.slides.length - 1;

    const scrollable = slide.classList.contains("slide--indicators-detail");
    this.viewport?.classList.toggle("deck__viewport--scrollable", scrollable);
    if (scrollable) {
      this.viewport.scrollTop = 0;
    }

    initAnimations(slide);
    initCharts(slide);
    initInteractions(slide);
    initMaps(slide);
    initIndicatorsTransport(slide);
    if (slide.classList.contains("slide--vp1-indicator")) {
      initVp1IndicatorSlide(slide);
    }
  }

  next() {
    this.goTo(this.current + 1);
  }

  prev() {
    this.goTo(this.current - 1);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".deck__slides");
  if (!viewport) return;

  const themeId = document.documentElement.dataset.theme || "verde-aqua";
  try {
    applyThemeAssets(themeId);
    applyIcons(viewport);
  } catch (err) {
    console.warn("Assets Vale: usando fallback CSS.", err);
  }

  if (window.VALE_INDICATORS?.mcsSlides?.length && !viewport.querySelector("[data-mcs-slide]")) {
    if (viewport.querySelector(".slide--mcs-test-intro")) {
      initMcsSlides({ after: ".slide--mcs-test-intro" });
    } else {
      initMcsSlides();
    }
  }
  const deck = new Deck(viewport);
  window.__valeDeck = deck;
});
