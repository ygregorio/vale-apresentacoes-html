---
name: presentation-html
description: >-
  Cria apresentações interativas em HTML/CSS/JS no padrão visual da Vale.
  Use quando o usuário pedir slides, apresentação, deck, pitch, treinamento
  interativo ou material em HTML seguindo o Guia de Marca Vale.
---

# Apresentações HTML — Vale

## Antes de começar

1. Ler [design-tokens.md](design-tokens.md) — cores, tipografia, regras
2. Ler [components.md](components.md) — tipos de slide e estrutura HTML
3. Ler [assets.md](assets.md) — ícones, grafismos, fontes, ilustrações
4. Usar arquivos em `presentation-kit/` como base — **não inventar cores ou fontes**

## Workflow

```
- [ ] Definir tema de cores (uma combinação para toda a apresentação)
- [ ] Definir estrutura: capa → agenda → capítulos → encerramento
- [ ] Criar pasta em presentations/<nome-da-apresentacao>/
- [ ] Copiar/adaptar template de presentation-kit/templates/
- [ ] Gerar slides conforme components.md
- [ ] Configurar dados em data/ se houver gráficos
- [ ] Validar checklist de marca
- [ ] Testar navegação (setas, touch, indicador)
```

## Estrutura de saída

```
presentations/<nome>/
├── index.html
├── slides/
│   ├── 01-capa.html
│   ├── 02-agenda.html
│   └── ...
├── data/
│   └── charts.json
└── assets/          # imagens locais da apresentação
```

Importar CSS/JS do kit via caminho relativo:

```html
<link rel="stylesheet" href="../../presentation-kit/css/tokens.css">
<link rel="stylesheet" href="../../presentation-kit/css/base.css">
<link rel="stylesheet" href="../../presentation-kit/css/slides.css">
<link rel="stylesheet" href="../../presentation-kit/css/components.css">
<script type="module" src="../../presentation-kit/js/deck.js"></script>
```

## Regras obrigatórias da marca

- Fonte **Vale Sans** em todos os textos
- Logo no **canto inferior direito**
- **Uma** combinação de cores por apresentação — não alternar paletas
- Capítulo com cor **diferente** da capa; faixa lateral = cor do capítulo
- Grafismo Rede: apenas Verde, Aqua, Amarelo, Azul, Cereja
- Sem mosaicos de imagens; máx. 2 imagens por slide
- Crédito de fotógrafo quando houver foto
- Destaque com **negrito**, nunca MAIÚSCULAS inteiras
- Título capa: 1 linha. Título slide: 2 linhas máx.

## Interatividade

| Recurso | Arquivo | Notas |
|---------|---------|-------|
| Navegação | `deck.js` | ← → Space, touch swipe, indicador |
| Animações | `animations.js` | Transições sutis (≤400ms), `.reveal-item` |
| Gráficos | `charts.js` | Chart.js, paleta secundária |
| Quiz/enquete | `interactions.js` | sessionStorage, sem backend |
| Mapa Brasil | `map-brazil.js` + `assets/map-brazil.svg` | Clique por UF, legenda, painel |
| Vídeo/embed | markup direto | classe `.slide--media` |

Animações HTML devem ser discretas — o template PPT Vale evita efeitos chamativos.

## Assets oficiais (integrado)

Biblioteca em `presentation-kit/brand-assets/` (junction → `Imagens_padrao`).

| Recurso | Caminho |
|---------|---------|
| Fontes web | `presentation-kit/assets/fonts/` |
| Logo colorida | `presentation-kit/assets/logo/vale-logo-color.png` |
| Logo branca | `presentation-kit/assets/logo/vale-logo-white.png` (fundos coloridos) |
| Ícones | `brand-assets/icones/PNG/` — usar `data-icon="{slug}"` |
| Grafismos Rede | `brand-assets/Grafismos_Graphics/rede_grid/` |
| Rede Outline | `brand-assets/Grafismos_Graphics/Outline/` |
| Faixa lateral | `brand-assets/Grafismos_Graphics/Box_flutuando/` |
| Ilustrações | `brand-assets/Ilustracoes/` (exportar AI/PDF → PNG para web) |
| Catálogo | `presentation-kit/assets/manifest.json` |

O JS `presentation-kit/js/assets.js` aplica logo, grafismo de capa e faixa lateral conforme `data-theme`.

Setup em nova máquina: `scripts/setup-brand-assets.ps1`

Detalhes completos: [assets.md](assets.md)

## Referências oficiais

- Guia de Marca: `Guia de Marca_PORT.pdf`
- Template PPT: `Template de PPT_PORT_Agosto24_vf.pdf`
- Pasta de marca local: `arquivos_marca_vale/`

## Exemplo de prompt do usuário

> "Crie uma apresentação sobre resultados Q3 com 3 capítulos, gráfico de produção e quiz final"

Ação do agente:
1. Tema `verde-aqua`
2. Capa + agenda + 3 capas de capítulo + slides de conteúdo + 1 chart + 1 quiz + encerramento
3. Salvar em `presentations/resultados-q3-2026/`
