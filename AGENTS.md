# guilhermenegri.com — contexto para agentes

Site pessoal do Guilherme Negri. HTML/CSS/JS puro, sem framework e sem build.

## Hospedagem e deploy (nada de Cloudflare aqui)

- **GitHub Pages**, repo `guiaugustinegri/guilhermenegri.com`. **Push na
  `master` publica sozinho** (o build do Pages leva 1 a 2 min). Não tem CI nem
  build local: `index.html` + `styles.css` + `script.js` são servidos como estão.
- Domínio custom via arquivo `CNAME` (`guilhermenegri.com`).
- **DNS na GoDaddy** (`ns71/ns72.domaincontrol.com`), registros A apontando pros
  IPs do GitHub Pages (`185.199.108.153` a `185.199.111.153`). O domínio **não
  passa pelo Cloudflare**. Quem está no Cloudflare é o `tracao.online` e as
  landings do livro (Worker `tracao-site`, contexto em `..\AGENTS.md`).
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
- JSON-LD: manter os `@id` (`#person`, `#book`), são eles que amarram o schema.

## Visual

- Paleta e decisões visuais: `PALETA.md`.
- Ícones sociais são SVG inline pintados via `currentColor` (`.social-link` no
  `styles.css`): ícone novo não precisa de CSS próprio.

## Verificar depois de publicar

O edge/CDN do Pages segura cache. Confirme mudanças com query string aleatória:
`curl -s "https://guilhermenegri.com/?v=123" | grep <trecho novo>`.
