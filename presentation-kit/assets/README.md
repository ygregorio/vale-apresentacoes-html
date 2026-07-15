# Assets do presentation-kit

## Instalação local

A biblioteca completa da Vale fica em `brand-assets/` (junction simbólico).
Execute na raiz do projeto:

```powershell
.\scripts\setup-brand-assets.ps1
```

Ou com caminho customizado:

```powershell
.\scripts\setup-brand-assets.ps1 -SourcePath "C:\caminho\para\Imagens_padrao"
```

## Conteúdo em `assets/`

| Item | Descrição |
|------|-----------|
| `fonts/` | Vale Sans WOFF2 (Regular, Bold, Medium, Semibold, Light) |
| `logo/` | Logomarca colorida JPG |
| `manifest.json` | Catálogo gerado — consulta do agente |

Regenerar catálogo:

```powershell
python presentation-kit/scripts/generate-manifest.py
```

Documentação completa para o agente: `.cursor/skills/presentation-html/assets.md`
