# Site Pessoal - Guilherme Negri

Site minimalista e moderno para guilhermenegri.com, construído com HTML, CSS e JavaScript puro.

## Hospedagem

- **GitHub Pages** no repo `guiaugustinegri/guilhermenegri.com`, domínio via `CNAME`
  (`guilhermenegri.com`). Push na `master` publica sozinho.
- Não tem build: `index.html` + `styles.css` + `script.js` são servidos como estão.
- Paleta e decisões visuais: ver `PALETA.md`.

## O link do livro

O CTA do e-book *Faça Coisas que Não Escalam* aponta pro domínio oficial da
campanha:

```
https://facacoisasquenaoescalam.com.br/
```

Ele aparece em 3 lugares do `index.html`: no botão visível (`.ebook-link`) e
duas vezes no JSON-LD (dados estruturados). Se mudar, mudar nos 3.

**Histórico da decisão:** em 18/07/2026 o link apontava pra cópia da landing em
`www.tracao.online/faca-coisas-que-nao-escalam` (manter o visitante no
ecossistema `tracao.online`; o canonical já consolidava a autoridade no domínio
do livro). Em 21/07/2026 o Gui decidiu apontar direto pro domínio da campanha,
que é a URL canônica que o Google indexou — o backlink deste site passa a ir
sem intermediário pro endereço oficial.

## Últimas Publicações e blog (21/07/2026)

Os 4 cards de "Últimas Publicações" e o botão "Ver todas as publicações"
apontam pros artigos correspondentes no `blog.tracao.online` (antes era
LinkedIn). Também há um ícone de WordPress nos links sociais do contato
levando pro blog. Se um artigo mudar de slug no WP, atualizar o card.

**Contexto completo da infraestrutura** (Worker da Cloudflare, as duas cópias
da landing, a regra "editou uma, edite a outra"): ver
`D:\apps\Tracao.Online\Sites\AGENTS.md`, seções 2 e 3.
