# guilhermenegri.com — contexto para agentes

Site pessoal do Guilherme Negri. HTML/CSS/JS puro, sem framework e sem build.

## Hospedagem e deploy

- **GitHub Pages**, repo `guiaugustinegri/guilhermenegri.com`. **Push na
  `master` publica sozinho** (o build do Pages leva 1 a 2 min). Não tem CI nem
  build local: `index.html` + `styles.css` + `script.js` são servidos como estão.
- Domínio canônico: `guilhermenegri.com` via arquivo `CNAME`. **DNS na GoDaddy**
  (`ns71/ns72.domaincontrol.com`), registros A para os IPs do GitHub Pages
  (`185.199.108.153` a `185.199.111.153`). O `.com` **não** passa pelo Cloudflare.
- `guilhermenegri.com.br` é zona Cloudflare (NS `alberto`/`mckenzie.ns.cloudflare.com`).
  O Worker `guilhermenegri-com` (`src/worker.js`) é Custom Domain nesse host e faz
  proxy de `https://guilhermenegri.com`. Arquivos continuam no GitHub Pages.
- Todo arquivo commitado vira URL pública (ex.: `guilhermenegri.com/README.md`).

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
  `/sitemap.xml`, `/robots.txt`, `/404.html` (GitHub Pages devolve HTTP 404)
  e `/404.md`.
- Negociação `Accept: text/markdown` (acceptmarkdown.com) não roda no GitHub
  Pages. No `.com.br` o Worker devolve markdown + `Vary: Accept, Accept-Encoding`
  e 404 em `text/markdown`. Deploy: `npx wrangler deploy` (Custom Domain no
  `wrangler.jsonc`). Não recrie A/CNAME na raiz da zona — o Wrangler gerencia.

## Visual

- Paleta e decisões visuais: `PALETA.md`.
- Ícones sociais são SVG inline pintados via `currentColor` (`.social-link` no
  `styles.css`): ícone novo não precisa de CSS próprio.

## Verificar depois de publicar

O edge/CDN do Pages segura cache. Confirme mudanças com query string aleatória:
`curl -s "https://guilhermenegri.com/?v=123" | grep <trecho novo>`.
