# Catálogo de Assets — Vale

Biblioteca vinculada em `presentation-kit/brand-assets/` (junction para `Imagens_padrao`).

## Estrutura da biblioteca

| Pasta | Conteúdo | Formato | Qtd. aprox. |
|-------|----------|---------|-------------|
| `Tipografia/ValeSans_v1/` | Vale Sans completa | TTF, WOFF2 | 38 TTF + 20 WOFF2 |
| `logo/Vale_Color_logos_JPG/` | Logomarca colorida | JPG, PDF | 1 JPG principal |
| `icones/PNG/` | Iconografia oficial | PNG | 312 ícones |
| `Grafismos_Graphics/rede_grid/` | Grafismo Rede | PNG, EPS | 54 combinações |
| `Grafismos_Graphics/Outline/` | Rede Outline | PNG | 84 variações |
| `Grafismos_Graphics/Box_flutuando/` | Faixa lateral / box flutuante | PNG, EPS | por cor |
| `Ilustracoes/` | Pessoas, lugares, veículos, objetos | AI, PDF | 7 categorias |

## Arquivos copiados para o kit (web)

```
presentation-kit/assets/
├── fonts/          ValeSans Regular, Bold, Medium, Semibold, Light (.woff2)
├── logo/           vale-logo-color.png, vale-logo-white.png (gerados do JPG oficial)
└── manifest.json   catálogo completo gerado automaticamente
```

## Ícones — padrão de nome

```
icones/PNG/Icones-Vale_VERDE AMARELO_GREEN YELLOW-{slug}.png
```

Slugs disponíveis (amostra): `capacete`, `co2`, `mina`, `navio-01`, `protecao`, `reciclavel`, `resultados`, etc.

Uso no HTML:

```html
<span data-icon="capacete"></span>
```

## Grafismos Rede

Arquivos numerados `REDE_GRID Vale RPB01.png` … `RPB54.png`.
Referência visual: `Grafismos_Graphics/rede_grid/REDE_GRID Vale RPB.pdf`

Mapeamento por tema (em `assets.js`):

| Tema | Rede capa | Cor capítulo |
|------|-----------|--------------|
| `verde-aqua` | RPB01 | aqua |
| `aqua-azul` | RPB12 | azul |
| `azul-cereja` | RPB23 | cereja |
| `cereja-amarelo` | RPB34 | amarelo |
| `amarelo-verde` | RPB45 | verde |

## Ilustrações — categorias

| Categoria | Uso sugerido |
|-----------|--------------|
| `Pessoas_Persons` | Treinamentos, cultura, diversidade |
| `Lugares_Places` / `Mina_Mine` | Operações, sites |
| `Veiculos_ vehicles` | Logística, caminhões |
| `Objetos_Objects` | Infográficos |
| `animais_animals` | Meio ambiente |
| `Capacete_Helmets` | Segurança |

Formato fonte: AI/PDF — exportar PNG/SVG antes de usar na web.

## Setup em nova máquina

Executar `scripts/setup-brand-assets.ps1` apontando para a pasta `Imagens_padrao` da intranet/OneDrive.

## Caminho original

```
C:\Users\81038569\OneDrive - Vale S.A\Desktop\arquivos_marca_vale\Imagens_padrao
```
