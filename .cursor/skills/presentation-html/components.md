# Componentes de slide — Vale

## Tipos de slide

### 1. Capa (`slide--cover`)

- Grafismo Rede (SVG ou CSS placeholder até Fase 2)
- Título curto (1 linha)
- Subtítulo opcional
- Imagem vertical preferencial no canto direito (quando aplicável)
- Logo no canto inferior direito
- Marcação "Informação Pública" quando necessário

**Capa ilustrada animada** (`slide--cover-illustration`): cena com múltiplas camadas — ver `presentations/capa-ilustracao-teste/`.

**Modelos de capa com imagem única** (`slide--cover-model`, `data-cover-model="01"` … `"10"`):

```html
<link rel="stylesheet" href="../../presentation-kit/css/cover-models.css">
<section class="slide slide--cover slide--cover-model" data-cover-model="01">
  <figure class="cover-model__media">
    <img class="cover-model__image" src="..." alt="">
  </figure>
  <div class="slide__cover-content">...</div>
</section>
```

Catálogo visual: `presentations/modelos-capa/`. Metadados: `presentation-kit/data/cover-models.json` e `presentation-kit/js/cover-models.js`.

| ID | Nome |
|----|------|
| 01 | Split clássico |
| 02 | Split invertido |
| 03 | Imagem full bleed |
| 04 | Gradiente lateral |
| 05 | Faixa superior |
| 06 | Moldura |
| 07 | Corte diagonal |
| 08 | Wide inferior |
| 09 | Retrato |
| 10 | Minimal |

### 2. Orientações (`slide--guide`) — opcional, uso interno

- Slide informativo sobre uso do template (omitir em apresentações finais)

### 3. Sumário / Agenda (`slide--agenda`)

Variantes:
- **Sumário numerado:** tópicos breves, 1 linha de espaço entre itens
- **Agenda cronológica:** `00h00 Atividade — Responsável`

### 4. Capa de capítulo (`slide--chapter`)

- Faixa Rede recortada do template oficial (`presentation-kit/assets/grafismos/chapter-header/`)
- Cor **diferente** da capa principal
- Número do capítulo editável
- Mesmo modelo para todos os capítulos da apresentação

```html
<section class="slide slide--chapter">
  <div class="slide__chapter-grafismo" aria-hidden="true"><img src="" alt=""></div>
  <div class="slide__chapter-inner">
    <div class="slide__chapter-number">1</div>
    <h2 class="slide__title">Título do capítulo</h2>
  </div>
  <img class="slide__logo" src="..." alt="Vale">
</section>
```

### 5. Conteúdo — texto (`slide--content-text`)

- Faixa lateral na cor do capítulo
- Número + título do capítulo (sup. esquerdo)
- Título do slide (máx. 2 linhas)
- Corpo em tópicos ou parágrafo alinhado à esquerda
- Foto de apoio opcional (máx. 1) com crédito

### 6. Conteúdo — lista / comparação (`slide--content-split`)

- Duas colunas ou lista com ícones
- Máx. 2 imagens total

### 7. Gráfico (`slide--chart`)

Tipos suportados via `data/charts-config.js` + `data-chart-ref`:

| Tipo | chartRef / type | Uso |
|------|-----------------|-----|
| Barras horizontais | `type: "bar"`, `indexAxis: "y"` | Ranking, commodities |
| Colunas | `type: "bar"` | Séries temporais mensais |
| Linha | `type: "line"` | Tendência, meta vs. realizado |
| Pizza | `type: "pie"` | Participação, mix |
| Cascata | `type: "waterfall"` | Ponte, variação acumulada |

- Chart.js com paleta secundária Vale
- Título, eixos com unidades, legenda
- Dados fictícios ou reais em `data/charts-config.js` (`window.VALE_CHARTS`)

### 8. Interativo — quiz/enquete (`slide--interactive`)

- Pergunta + opções clicáveis
- Feedback visual com cores Vale
- Resultado armazenado em `sessionStorage` (sem backend)

### 9. Mídia (`slide--media`)

- Vídeo (`<video>`) ou embed (`<iframe>`)
- Legenda e crédito quando aplicável

### 10. Mapa interativo (`slide--map`)

Layout conforme template PPT (mapa + legenda + informações complementares):

```html
<section class="slide slide--map" data-chapter="1" data-chapter-theme="aqua"
         data-map-data="data/estados.json" data-map-default-uf="MG">
  <aside class="slide__band"></aside>
  <header class="slide__chapter-label">...</header>
  <div class="slide__body">
    <h2 class="slide__title">Título do mapa</h2>
    <div class="map-brazil">
      <div class="map-brazil__canvas-wrap">
        <div id="map-brazil-canvas" class="map-brazil__canvas"></div>
      </div>
      <div class="map-brazil__side"><!-- detalhe + legenda --></div>
    </div>
  </div>
</section>
```

Scripts necessários (antes de `deck.js`):

```html
<script src="data/estados-config.js"></script>
```

O SVG base fica em `presentation-kit/assets/map-brazil.svg` (fonte: [@svg-maps/brazil](https://www.npmjs.com/package/@svg-maps/brazil), licença MIT).

Dados por UF em `data/estados.json` — campos: `nome`, `regiao`, `operacoes`, `empregados`, `producao`, `tier` (0–4).

### 11. Encerramento (`slide--closing`)

- Mensagem final + logo
- Pode reutilizar grafismo da capa em versão simplificada

## Estrutura HTML de um slide

```html
<section class="slide slide--content-text" data-chapter="2" data-theme="aqua">
  <aside class="slide__band" aria-hidden="true"></aside>
  <header class="slide__chapter-label">
    <span class="slide__chapter-number">2</span>
    <span class="slide__chapter-title">Título do capítulo</span>
  </header>
  <div class="slide__body">
    <h2 class="slide__title">Título do slide</h2>
    <div class="slide__content"><!-- conteúdo --></div>
  </div>
  <footer class="slide__footnote"></footer>
  <img class="slide__logo" src="../assets/logo-vale.svg" alt="Vale">
</section>
```

## Classes utilitárias

| Classe | Efeito |
|--------|--------|
| `.text-bold` | Destaque (negrito) |
| `.text-muted` | Cinza-Vale |
| `.text-accent` | Cor da faixa/capítulo ativo |
| `.reveal-item` | Item com animação de entrada |
| `.chart-container` | Wrapper responsivo para gráficos |

## Checklist por slide

- [ ] Fonte Vale Sans aplicada
- [ ] Cor da faixa = capítulo ativo
- [ ] Logo canto inferior direito
- [ ] Título dentro do limite de linhas
- [ ] Créditos de foto presentes
- [ ] Sem mosaicos / sem excesso de elementos
- [ ] Cores apenas da paleta Vale
