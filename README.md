# Site Pessoal - Guilherme Negri

Site minimalista e moderno para guilhermenegri.com, construído com HTML, CSS e JavaScript puro.

## Hospedagem

- **GitHub Pages** no repo `guiaugustinegri/guilhermenegri.com`, domínio via `CNAME`
  (`guilhermenegri.com`). Push na `master` publica sozinho.
- Não tem build: `index.html` + `styles.css` + `script.js` são servidos como estão.
- Paleta e decisões visuais: ver `PALETA.md`.

## O link do livro (não "corrigir"!)

O CTA do e-book *Faça Coisas que Não Escalam* aponta de propósito pra cópia da
landing dentro do site da Tração:

```
https://www.tracao.online/faca-coisas-que-nao-escalam
```

Ele aparece em 3 lugares do `index.html`: no botão visível (`.ebook-link`) e
duas vezes no JSON-LD (dados estruturados). Se mudar, mudar nos 3.

**Por que esse endereço, e não `facacoisasquenaoescalam.com.br`?** Decisão de
18/07/2026: o visitante que sai do site pessoal continua dentro do ecossistema
`tracao.online`. E não há problema de SEO nisso: as duas cópias da landing
declaram `<link rel="canonical" href="https://facacoisasquenaoescalam.com.br/">`,
então o Google consolida a autoridade (incluindo o backlink deste site) no
domínio oficial da campanha. Canonical não redireciona: o leitor fica na URL da
Tração, só o crédito de busca aponta pro domínio do livro.

**Contexto completo da infraestrutura** (Worker da Cloudflare, as duas cópias
da landing, a regra "editou uma, edite a outra"): ver
`D:\apps\Tracao.Online\Sites\AGENTS.md`, seções 2 e 3.
