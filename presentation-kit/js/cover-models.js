/**
 * Catálogo de modelos de capa — uma imagem por layout.
 * Usado pelo front-end de geração para data-cover-model="XX".
 */

export const COVER_MODELS = [
  {
    id: "01",
    name: "Split clássico",
    description: "Texto à esquerda, imagem em painel à direita (padrão PPT Vale).",
    imageFit: "cover",
  },
  {
    id: "02",
    name: "Split invertido",
    description: "Imagem à esquerda, texto à direita.",
    imageFit: "cover",
  },
  {
    id: "03",
    name: "Imagem full bleed",
    description: "Ilustração em tela cheia com card de texto sobreposto.",
    imageFit: "cover",
  },
  {
    id: "04",
    name: "Gradiente lateral",
    description: "Imagem à direita com degradê suave para área de texto.",
    imageFit: "cover",
  },
  {
    id: "05",
    name: "Faixa superior",
    description: "Imagem na metade superior, conteúdo na inferior.",
    imageFit: "cover",
  },
  {
    id: "06",
    name: "Moldura",
    description: "Imagem em cartão com cantos arredondados e margem.",
    imageFit: "contain",
  },
  {
    id: "07",
    name: "Corte diagonal",
    description: "Divisão diagonal entre texto e imagem.",
    imageFit: "cover",
  },
  {
    id: "08",
    name: "Wide inferior",
    description: "Título no topo, imagem panorâmica na base.",
    imageFit: "cover",
  },
  {
    id: "09",
    name: "Retrato",
    description: "Imagem vertical contenida à direita, tipografia ampla à esquerda.",
    imageFit: "contain",
  },
  {
    id: "10",
    name: "Minimal",
    description: "Texto dominante com imagem compacta no canto inferior.",
    imageFit: "contain",
  },
];

export function getCoverModel(id) {
  return COVER_MODELS.find((model) => model.id === id);
}
