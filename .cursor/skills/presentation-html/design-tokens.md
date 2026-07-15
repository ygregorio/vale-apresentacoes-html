# Design Tokens — Vale

Extraído de `Guia de Marca_PORT.pdf` (Fev/2026) e `Template de PPT_PORT_Agosto24_vf.pdf` (Ago/2024).

## Paleta principal

| Token | Nome | Hex | RGB | Uso |
|-------|------|-----|-----|-----|
| `--vale-verde` | Verde-Vale | `#007E7A` | 0, 126, 122 | Cor principal, grafismos, faixas |
| `--vale-aqua` | Aqua-Vale | `#0ABB98` | 10, 187, 152 | Variação digital do verde |
| `--vale-azul` | Azul-Vale | `#3CB5E5` | 60, 181, 229 | Grafismos, destaques |
| `--vale-cinza-escuro` | Cinza-escuro | `#555555` | 85, 85, 85 | Títulos e textos |
| `--vale-branco` | Branco | `#FFFFFF` | 255, 255, 255 | Fundos, áreas de luz |
| `--vale-amarelo` | Amarelo-Vale | `#ECB11F` | 237, 177, 17 | Grafismos, destaques |
| `--vale-laranja` | Laranja-Vale | `#EE6F16` | 238, 111, 22 | Destaques (não usar em massas do grafismo Rede) |
| `--vale-cereja` | Cereja-Vale | `#C0305E` | 192, 48, 94 | Grafismos, destaques |
| `--vale-preto` | Preto | `#000000` | 0, 0, 0 | Texto corrido impresso |

## Paleta secundária (ilustrações e gráficos)

| Token | Nome | Hex |
|-------|------|-----|
| `--vale-verde-escuro` | Verde-escuro | `#034944` |
| `--vale-aqua-claro` | Aqua-claro | `#9DE4D6` |
| `--vale-azul-escuro` | Azul-escuro | `#2626D1` |
| `--vale-cinza-claro` | Cinza-claro | `#E6E7E8` |
| `--vale-cinza-vale` | Cinza-Vale | `#747678` |
| `--vale-amarelo-claro` | Amarelo-claro | `#FFDD99` |
| `--vale-cereja-escuro` | Cereja-escuro | `#991310` |
| `--vale-cereja-claro` | Cereja-claro | `#E191C5` |
| `--vale-cinza-medio` | Cinza-médio | `#BCBEC0` |

## Combinações de apresentação

Escolha **uma** combinação e mantenha em toda a apresentação:

| ID | Capa | Capítulo | Faixa lateral |
|----|------|----------|---------------|
| `verde-aqua` | Verde-Vale | Aqua-Vale | Aqua-Vale |
| `aqua-azul` | Aqua-Vale | Azul-Vale | Azul-Vale |
| `azul-cereja` | Azul-Vale | Cereja-Vale | Cereja-Vale |
| `cereja-amarelo` | Cereja-Vale | Amarelo-Vale | Amarelo-Vale |
| `amarelo-verde` | Amarelo-Vale | Verde-Vale | Verde-Vale |

Cores permitidas no grafismo **Rede** (massas de cor): Verde-Vale, Aqua-Vale, Amarelo-Vale, Azul-Vale, Cereja-Vale.
**Proibido** em massas Rede: Cinza-Vale, Laranja-Vale, Branco.

## Tipografia

- **Família:** Vale Sans (obrigatória em todos os textos)
- **Fallback web:** `"Vale Sans", "Segoe UI", system-ui, sans-serif`
- **Fonte:** intranet Vale / equipe de Comunicação (Fase 2: copiar para `presentation-kit/assets/fonts/`)

| Elemento | Peso | Cor | Tamanho (16:9) |
|--------|------|-----|----------------|
| Título capa | Bold | Branco ou Cinza-escuro* | ~44–52px |
| Título slide | Bold | Cinza-escuro | ~32–36px |
| Subtítulo / capítulo | Regular/Bold | Cor da faixa ou Cinza-escuro | ~18–24px |
| Corpo | Regular | Cinza-escuro | ~18–22px |
| Destaque | Bold | Cinza-escuro | igual ao corpo |
| Rodapé / legenda | Regular | Cinza-Vale | ~12–14px |
| Nota de rodapé | Regular | Cinza-Vale | ~11–12px |

\* Depende do contraste com o fundo do grafismo.

## Espaçamento e layout (16:9)

- Viewport: `1920 × 1080` (escala responsiva via `transform` ou `vw/vh`)
- Faixa lateral: ~28px de largura, cor do capítulo ativo
- Logo: canto inferior direito (posição preferencial)
- Margem conteúdo: ~80–120px da borda esquerda (após faixa)
- Espaço entre tópicos de agenda/sumário: 1 linha

## Regras de conteúdo

- Título da capa: máximo **1 linha**
- Título do slide: máximo **2 linhas**
- Texto corrido: alinhado à esquerda
- Destaque: **negrito** — nunca palavras inteiras em MAIÚSCULAS
- Máximo **2 imagens** por slide — sem mosaicos
- Crédito do fotógrafo obrigatório quando houver foto
- Notas de rodapé: Vale Sans, cinza, dentro dos limites do slide
- Evitar volume excessivo de texto — preferir tópicos sucintos
- Número e título do capítulo: canto superior esquerdo nos slides de conteúdo

## Grafismos

| Grafismo | Uso em apresentações |
|----------|---------------------|
| Rede | Capa, capa de capítulo |
| Rede Outline | Capa de capítulo (variante) |
| Faixa lateral | Slides de conteúdo (cor = capítulo ativo) |
| Box conecta / flutuante / cabeçalho / rodapé | Conteúdo (Fase 2 com assets SVG) |

Regras Rede:
- Movimento ascendente (esquerda → direita)
- Não rotacionar, espelhar, distorcer ou repetir na mesma peça
- Não usar mais de 2 cores no grafismo Rede
- Outline: 1–3px (curta distância) ou 5–10px (longa distância)

## Interatividade HTML (extensão do template PPT)

O template PowerPoint desaconselha animações. Em HTML interativo, use transições **sutis** (fade/slide ≤ 400ms) — sem efeitos chamativos.
