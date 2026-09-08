import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { handleRequest, preferredType } from "../src/negotiate.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jsonc": "application/json; charset=utf-8",
};

async function exists(rel) {
  try {
    await stat(join(ROOT, rel));
    return true;
  } catch {
    return false;
  }
}

function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
}

function headingsAreSequential(levels) {
  let previous = 0;
  for (const level of levels) {
    if (previous === 0) {
      if (level !== 1) return false;
    } else if (level > previous + 1) {
      return false;
    }
    previous = level;
  }
  return levels[0] === 1;
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(
    (m) => JSON.parse(m[1]),
  );
}

function flattenGraph(blocks) {
  const nodes = [];
  for (const block of blocks) {
    if (block["@graph"]) nodes.push(...block["@graph"]);
    else nodes.push(block);
  }
  return nodes;
}

function safeJoin(root, pathname) {
  const clean = decodeURIComponent(pathname.split("?")[0]).replace(/^\/+/, "");
  const full = normalize(join(root, clean));
  const rel = relative(root, full);
  if (rel.startsWith("..") || rel.includes(`..${sep}`)) return null;
  return full;
}

async function fileResponse(pathname, method = "GET") {
  let filePath = safeJoin(ROOT, pathname);
  if (!filePath) return new Response("Forbidden", { status: 403 });

  async function tryFile(path, typeHint) {
    try {
      const info = await stat(path);
      if (info.isDirectory()) return null;
      const ext = extname(path).toLowerCase();
      const headers = { "Content-Type": typeHint || MIME[ext] || "application/octet-stream" };
      if (method === "HEAD") return new Response(null, { status: 200, headers });
      const body = await readFile(path);
      return new Response(body, { status: 200, headers });
    } catch {
      return null;
    }
  }

  const direct = await tryFile(filePath);
  if (direct) return direct;

  if (!extname(pathname) || pathname.endsWith("/")) {
    const indexPath = pathname.endsWith("/")
      ? safeJoin(ROOT, `${pathname}index.html`)
      : safeJoin(ROOT, `${pathname}/index.html`);
    if (indexPath) {
      const indexed = await tryFile(indexPath, MIME[".html"]);
      if (indexed) return indexed;
    }
  }

  const notFound = await tryFile(join(ROOT, "404.html"), MIME[".html"]);
  if (notFound) {
    return new Response(method === "HEAD" ? null : await notFound.clone().arrayBuffer(), {
      status: 404,
      headers: { "Content-Type": MIME[".html"] },
    });
  }
  return new Response("Not Found", { status: 404 });
}

function fileAssets() {
  return {
    fetch(input) {
      const req = input instanceof Request ? input : new Request(input);
      const url = new URL(req.url);
      return fileResponse(url.pathname, req.method);
    },
  };
}

async function siteRequest(path, headers = {}) {
  const request = new Request(`https://guilhermenegri.com${path}`, { headers });
  return handleRequest(request, { ASSETS: fileAssets() });
}

test("machine-readable files exist", async () => {
  for (const file of [
    "sitemap.xml",
    "robots.txt",
    "llms.txt",
    "index.md",
    "404.html",
    "404.md",
    "about/index.html",
    "about/index.md",
    "contact/index.html",
    "contact/index.md",
    "privacy/index.html",
    "privacy/index.md",
    ".nojekyll",
  ]) {
    assert.equal(await exists(file), true, `missing ${file}`);
  }
});

test("homepage has canonical, lang, og:image, og:type", async () => {
  const html = await readFile(join(ROOT, "index.html"), "utf8");
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/guilhermenegri.com\/">/);
  assert.match(html, /<meta property="og:image"/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /rel="alternate" type="text\/markdown"/);
});

test("homepage heading hierarchy is sequential and has enough HTML text", async () => {
  const html = await readFile(join(ROOT, "index.html"), "utf8");
  const levels = headingLevels(html);
  assert.ok(levels.includes(1), "missing H1");
  assert.ok(headingsAreSequential(levels), `heading skip: ${levels.join(",")}`);
  assert.ok(textContent(html).length >= 500, "homepage text too short");
});

test("trust pages have 500+ characters of text and sequential headings", async () => {
  for (const rel of ["about/index.html", "contact/index.html", "privacy/index.html"]) {
    const html = await readFile(join(ROOT, rel), "utf8");
    const text = textContent(html);
    assert.ok(text.length >= 500, `${rel} has ${text.length} chars`);
    assert.ok(headingsAreSequential(headingLevels(html)), `${rel} heading skip`);
    assert.match(html, /<link rel="canonical"/);
  }
});

test("404 body includes markdown recovery links", async () => {
  const html = await readFile(join(ROOT, "404.html"), "utf8");
  assert.match(html, /# Página não encontrada/);
  assert.match(html, /\[Sitemap\]\(https:\/\/guilhermenegri.com\/sitemap.xml\)/);
  assert.match(html, /\[llms\.txt\]\(https:\/\/guilhermenegri.com\/llms.txt\)/);
});

test("sitemap lists indexable URLs with lastmod", async () => {
  const xml = await readFile(join(ROOT, "sitemap.xml"), "utf8");
  assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  for (const loc of [
    "https://guilhermenegri.com/",
    "https://guilhermenegri.com/about/",
    "https://guilhermenegri.com/contact/",
    "https://guilhermenegri.com/privacy/",
  ]) {
    assert.match(xml, new RegExp(`<loc>${loc.replaceAll("/", "\\/")}<\\/loc>`));
  }
  assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  assert.doesNotMatch(xml, /<priority>/);
  assert.doesNotMatch(xml, /<changefreq>/);
});

test("robots.txt points to the sitemap", async () => {
  const robots = await readFile(join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/guilhermenegri.com\/sitemap.xml/);
});

test("llms.txt follows llmstxt.org and has when-to-use guidance", async () => {
  const llms = await readFile(join(ROOT, "llms.txt"), "utf8");
  assert.match(llms, /^# Guilherme Negri/m);
  assert.match(llms, /^> /m);
  assert.match(llms, /^## When to use this/m);
  assert.match(llms, /guilherme@tracao.online/);
  assert.match(llms, /https:\/\/guilhermenegri.com\/index.md/);
});

test("Organization schema has contactPoint email and no phone or street address", async () => {
  const html = await readFile(join(ROOT, "index.html"), "utf8");
  const org = flattenGraph(jsonLdBlocks(html)).find((n) => n["@type"] === "Organization");
  assert.ok(org, "Organization node missing");
  assert.equal(org.contactPoint?.["@type"], "ContactPoint");
  assert.ok(org.contactPoint.email);
  assert.equal(org.contactPoint.telephone, undefined);
  assert.equal(org.contactPoint.contactType, "customer service");
  assert.equal(org.address, undefined);
  assert.equal(org.telephone, undefined);
});

test("public pages do not publish phone or street address", async () => {
  const files = [
    "index.html",
    "about/index.html",
    "contact/index.html",
    "privacy/index.html",
    "404.html",
    "contact/index.md",
    "privacy/index.md",
    "llms.txt",
  ];
  for (const rel of files) {
    const text = await readFile(join(ROOT, rel), "utf8");
    assert.doesNotMatch(text, /98222-0049|wa\.me|Julio Ribeiro|13070-712/, rel);
  }
});

test("ebook campaign URL still appears three times on the homepage", async () => {
  const html = await readFile(join(ROOT, "index.html"), "utf8");
  const matches = html.match(/https:\/\/facacoisasquenaoescalam\.com\.br\//g) || [];
  assert.equal(matches.length, 3);
});

test("Accept parser matches acceptmarkdown.com vectors", () => {
  const produces = ["text/html", "text/markdown"];
  assert.equal(preferredType("text/markdown", produces), "text/markdown");
  assert.equal(preferredType("text/markdown, text/html;q=0.8", produces), "text/markdown");
  assert.equal(preferredType("text/html", produces), "text/html");
  assert.equal(preferredType("text/markdown;q=0, text/html", produces), "text/html");
  assert.equal(preferredType("text/markdown;q=0", ["text/markdown"]), null);
  assert.equal(preferredType(null, produces), "text/html");
  assert.equal(preferredType("*/*", produces), "text/html");
  assert.equal(
    preferredType(
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      produces,
    ),
    "text/html",
  );
});

test("canonical URL serves markdown with Vary: Accept, Accept-Encoding", async () => {
  const res = await siteRequest("/", { Accept: "text/markdown" });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/markdown/);
  const vary = res.headers.get("vary") || "";
  assert.match(vary, /Accept/i);
  assert.match(vary, /Accept-Encoding/i);
  const body = await res.text();
  assert.match(body, /^# Guilherme Negri/m);
});

test("default Accept still serves HTML and advertises the markdown twin", async () => {
  const res = await siteRequest("/about/", {
    Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.match(res.headers.get("vary"), /Accept/i);
  assert.match(res.headers.get("link") || "", /rel="alternate"; type="text\/markdown"/);
  const body = await res.text();
  assert.match(body, /<h1>Sobre Guilherme Negri<\/h1>/);
});

test("unknown paths return HTTP 404 with a markdown recovery body", async () => {
  const html = await siteRequest("/some-path-that-does-not-exist");
  assert.equal(html.status, 404);
  assert.match(await html.text(), /\[Sitemap\]\(https:\/\/guilhermenegri.com\/sitemap.xml\)/);

  const md = await siteRequest("/some-path-that-does-not-exist", { Accept: "text/markdown" });
  assert.equal(md.status, 404);
  assert.match(md.headers.get("content-type"), /text\/markdown/);
  assert.match(md.headers.get("vary"), /Accept/i);
  assert.match(await md.text(), /# Página não encontrada/);
});

test("explicitly unacceptable types return 406", async () => {
  const res = await siteRequest("/", { Accept: "application/pdf" });
  assert.equal(res.status, 406);
  assert.match(res.headers.get("vary"), /Accept/i);
});
