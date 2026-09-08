# guilhermenegri.com — contexto para agentes

Site pessoal do Guilherme Negri. HTML/CSS/JS puro, sem framework e sem build.

## Hospedagem (Cloudflare Workers Assets)

- Worker `guilhermenegri-com` (`wrangler.jsonc` + `src/worker.js`). Push na
  `master` publica via `.github/workflows/deploy.yml` (Wrangler). Não tem
  build: os arquivos estáticos são o próprio site.
- **Canônico:** `https://guilhermenegri.com/`. O apex `guilhermenegri.com.br`
  serve o **mesmo** conteúdo (sem 301). `www` dos dois TLDs dá 308 para o
  apex do mesmo TLD. Canonical no HTML continua no `.com`.
- **Por que saiu do HubSpot:** `guilhermenegri.com.br` estava no portal
  `43675378` (`x-hs-cfworker-meta: DomainRedirectResolver`) e respondia 301
  para o `.com`. Esse 301 (e o bot management `__cf_bm` do HubSpot) atrapalha
  agente que pede `Accept: text/markdown` ou `llms.txt`. O Worker assume os
  dois apexes.
- **Cutover (uma vez, no dashboard):**
  1. Secrets no GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
  2. Zona `guilhermenegri.com` no Cloudflare (hoje o DNS ainda está na
     GoDaddy, `ns71/ns72.domaincontrol.com`, A nos IPs do GitHub Pages).
     Trocar NS na GoDaddy para os da zona CF.
  3. No HubSpot (portal `43675378`), desconectar o domínio
     `guilhermenegri.com.br` como redirect. A zona já usa NS Cloudflare
     (`alberto`/`mckenzie`).
  4. `npx wrangler deploy` (ou o Actions na `master`) cria os custom
     domains dos 4 hosts.
- GitHub Pages + arquivo `CNAME` ficam como rollback. Com o DNS no
  Cloudflare, o Pages deixa de receber tráfego.
- Todo arquivo commitado que não está no `.assetsignore` vira URL pública.

## Links que têm dono (não "corrigir" sem contexto)

- **E-book**: aponta pro domínio oficial da campanha,
  `https://facacoisasquenaoescalam.com.br/`. Aparece em **3 lugares** do
  `index.html`: no botão visível (`.ebook-link`) e duas vezes no JSON-LD.
  Mudou um, mude os 3. Histórico da decisão no `README.md`.
- **Últimas Publicações** (4 cards, cada um com link na imagem e no texto) e o
  botão "Ver todas as publicações": apontam pros artigos no
  `https://blog.tracao.online/` (WordPress na Hostinger; contexto em
  `..\blog-tracao\AGENTS.md`). Se um artigo mudar de slug no WP, atualizar o card.
- **Ícone do WordPress** nos links sociais do contato: leva pro blog.
- JSON-LD: manter os `@id` (`#person`, `#book`, `#website` e
  `https://www.tracao.online/#organization`), são eles que amarram o schema.
- Páginas de confiança: `/about/`, `/contact/`, `/privacy/`. Cada uma tem
  gêmeo markdown (`index.md`). A home também tem `/index.md`.
- Agentes: `/llms.txt` (formato llmstxt.org, seção "When to use this"),
  `/sitemap.xml`, `/robots.txt`, `/404.html` e `/404.md`.
- Negociação `Accept: text/markdown` (acceptmarkdown.com): o Worker em
  `src/worker.js` cobre o protocolo (`Vary: Accept`) nos dois apexes.

## Visual

- Paleta e decisões visuais: `PALETA.md`.
- Ícones sociais são SVG inline pintados via `currentColor` (`.social-link` no
  `styles.css`): ícone novo não precisa de CSS próprio.

## Verificar depois de publicar

O edge segura cache. Confirme com query string aleatória nos **dois** apexes:

```
curl -sI "https://guilhermenegri.com.br/?v=123"
curl -sI -H "Accept: text/markdown" "https://guilhermenegri.com.br/"
curl -s "https://guilhermenegri.com/?v=123" | grep <trecho novo>
```

O `.com.br` tem que responder **200** (não 301 do HubSpot). Markdown no
`Accept` tem que voltar `content-type: text/markdown`.
