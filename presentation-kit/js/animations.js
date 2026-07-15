export function initAnimations(slide) {
  slide.querySelectorAll(".reveal-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    requestAnimationFrame(() => {
      el.style.opacity = "";
      el.style.transform = "";
    });
  });

  initCoverAnimation(slide);
}

export function initCoverAnimation(slide) {
  const scene = slide.querySelector(".cover-scene");
  if (!scene) return;

  scene.classList.remove("cover-scene--play");
  void scene.offsetWidth;
  scene.classList.add("cover-scene--play");
}
