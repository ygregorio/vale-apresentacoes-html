/**
 * Resolvedor de caminhos para assets oficiais da Vale.
 * Caminhos relativos a partir de presentations/<nome>/index.html
 */

const BRAND_BASE = "../../presentation-kit/brand-assets/";
const KIT_ASSETS = "../../presentation-kit/assets/";

export const paths = {
  logoColor: `${KIT_ASSETS}logo/vale-logo-color.png`,
  logoWhite: `${KIT_ASSETS}logo/vale-logo-white.png`,
  brandBase: BRAND_BASE,
};

/** Modelos de capa em que a logo fica sobre área colorida/imagem */
const COVER_MODELS_WHITE_LOGO = new Set(["03", "07", "08", "09"]);

/**
 * @param {HTMLElement} slide
 * @returns {"color" | "white"}
 */
export function resolveLogoVariant(slide) {
  const override = slide.dataset.logo;
  if (override === "white" || override === "color") return override;

  if (slide.classList.contains("slide--cover-illustration")) return "white";

  if (slide.classList.contains("slide--cover-model")) {
    const modelId = slide.dataset.coverModel;
    if (modelId && COVER_MODELS_WHITE_LOGO.has(modelId)) return "white";
    return "color";
  }

  if (slide.classList.contains("slide--cover")) return "color";

  return "color";
}

/**
 * @param {HTMLElement} slide
 */
export function logoPathForSlide(slide) {
  return resolveLogoVariant(slide) === "white" ? paths.logoWhite : paths.logoColor;
}

export function applyLogos(root = document) {
  root.querySelectorAll(".slide").forEach((slide) => {
    const img = slide.querySelector(".slide__logo");
    if (!img) return;
    const variant = resolveLogoVariant(slide);
    img.src = variant === "white" ? paths.logoWhite : paths.logoColor;
    img.dataset.logoVariant = variant;
  });
}

export function iconPath(slug) {
  return `${BRAND_BASE}icones/PNG/Icones-Vale_VERDE AMARELO_GREEN YELLOW-${slug}.png`;
}

export function brandPath(relativePath) {
  return `${BRAND_BASE}${relativePath.replace(/\\/g, "/")}`;
}

export function illustrationPath(relativePath) {
  return brandPath(relativePath);
}

export function redeGrid(index) {
  const num = String(index).padStart(2, "0");
  return brandPath(`Grafismos_Graphics/rede_grid/REDE_GRID Vale RPB${num}.png`);
}

function chapterHeaderPath(color) {
  return `${KIT_ASSETS}grafismos/chapter-header/chapter-header-${color}.png`;
}

const THEME_MAP = {
  "verde-aqua": { cover: "verde", chapter: "aqua", redeIndex: 1 },
  "aqua-azul": { cover: "aqua", chapter: "azul", redeIndex: 12 },
  "azul-cereja": { cover: "azul", chapter: "cereja", redeIndex: 23 },
  "cereja-amarelo": { cover: "cereja", chapter: "amarelo", redeIndex: 34 },
  "amarelo-verde": { cover: "amarelo", chapter: "verde", redeIndex: 45 },
};

const FAIXA_LATERAL = {
  amarelo: "Grafismos_Graphics/Box_flutuando/faixa Amarelo_range yellow/Box Flutuante com faixa_FLOATING BOX with range yellow RGB1.png",
  aqua: "Grafismos_Graphics/Box_flutuando/faixa Aqua_range aqua/Box Flutuante com faixa_FLOATING BOX with range aqua RGB1.png",
  azul: "Grafismos_Graphics/Box_flutuando/faixa Azul_range Blue/Box Flutuante com faixa_FLOATING BOX with range Blue RGB1.png",
  cereja: "Grafismos_Graphics/Box_flutuando/faixa Cereja_range Cherry/Box Flutuante com faixa Cereja_Box Flutuante Vale com faixa_FLOATING BOX with range cherry RGB1.png",
  verde: "Grafismos_Graphics/Box_flutuando/faixa Verde_range green/Box Flutuante com faixa_FLOATING BOX with range green RGB1.png",
};

export function applyThemeAssets(themeId) {
  const theme = THEME_MAP[themeId] || THEME_MAP["verde-aqua"];

  document.querySelectorAll(".slide__logo").forEach((img) => {
    img.alt = "Vale";
  });

  applyLogos();

  document.querySelectorAll(".slide--cover:not(.slide--cover-illustration):not(.slide--cover-model) .slide__grafismo").forEach((cover) => {
    cover.classList.add("has-image");
    cover.style.backgroundImage = `url("${redeGrid(theme.redeIndex)}")`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = "center";
  });

  const faixaFile = FAIXA_LATERAL[theme.chapter];
  if (faixaFile) {
    const faixaUrl = brandPath(faixaFile);
    document.querySelectorAll(".slide__band").forEach((band) => {
      band.style.background = `var(--theme-band) url("${faixaUrl}") center/cover no-repeat`;
    });
  }

  const headerUrl = chapterHeaderPath(theme.chapter);
  document.querySelectorAll(".slide--chapter .slide__chapter-grafismo img").forEach((img) => {
    img.src = headerUrl;
    img.alt = "";
  });

  return theme;
}

export function applyIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const slug = el.dataset.icon;
    const img = document.createElement("img");
    img.src = iconPath(slug);
    img.alt = "";
    img.className = "icon-inline";
    img.loading = "lazy";
    el.replaceChildren(img);
  });
}
