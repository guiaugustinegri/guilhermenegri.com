/**
 * Accept: text/markdown negotiation — acceptmarkdown.com / RFC 9110.
 * Parser and Worker handler follow
 * https://acceptmarkdown.com/recipes/cloudflare-workers
 */

const STATIC_EXT =
  /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|xml|txt|json|pdf|mp4|webm|mp3|wav|ogg|zip)$/i;

const PRODUCES = ["text/html", "text/markdown"];

export function parseAccept(header) {
  return header
    .split(",")
    .map((raw) => {
      const parts = raw
        .trim()
        .split(";")
        .map((s) => s.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;
      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split("=").map((s) => s.trim());
        if (name === "q") {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
      return { type, q, specificity };
    })
    .filter((e) => e !== null);
}

function matches(entry, candidate) {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

export function preferredType(header, produces) {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

export function appendVaryAccept(headers) {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const tokens = existing.split(",").map((s) => s.trim().toLowerCase());
  if (!tokens.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}

export function markdownCandidates(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return ["/index.md"];
  return [`${clean}/index.md`, `${clean}.md`];
}

function isMarkdownPath(pathname) {
  return pathname.toLowerCase().endsWith(".md");
}

async function fetchFirstOk(env, request, paths) {
  for (const path of paths) {
    const url = new URL(request.url);
    url.pathname = path;
    const res = await env.ASSETS.fetch(new Request(url.toString(), request));
    if (res.status === 200) return { res, path };
  }
  return null;
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (isMarkdownPath(url.pathname)) {
    const asset = await env.ASSETS.fetch(request);
    const res = new Response(asset.body, asset);
    if (asset.status === 200) {
      res.headers.set("Content-Type", "text/markdown; charset=utf-8");
    }
    appendVaryAccept(res.headers);
    return res;
  }

  if (STATIC_EXT.test(url.pathname) || url.pathname.startsWith("/api/")) {
    return env.ASSETS.fetch(request);
  }

  const accept = request.headers.get("accept");
  const chosen = preferredType(accept, PRODUCES);

  if (chosen === null && accept) {
    const res = new Response("Not Acceptable\n\nAvailable: text/html, text/markdown\n", {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    appendVaryAccept(res.headers);
    return res;
  }

  if (chosen === "text/markdown") {
    const hit = await fetchFirstOk(env, request, markdownCandidates(url.pathname));
    if (hit) {
      const res = new Response(hit.res.body, hit.res);
      res.headers.set("Content-Type", "text/markdown; charset=utf-8");
      appendVaryAccept(res.headers);
      return res;
    }

    if (!preferredType(accept, ["text/html"])) {
      const missing = await fetchFirstOk(env, request, ["/404.md"]);
      if (missing) {
        const res = new Response(missing.res.body, {
          status: 404,
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        });
        appendVaryAccept(res.headers);
        return res;
      }
      const res = new Response(
        "Not Acceptable\n\nMarkdown sibling missing and HTML is not acceptable.\n",
        { status: 406, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
      appendVaryAccept(res.headers);
      return res;
    }
  }

  const htmlRes = await env.ASSETS.fetch(request);
  const res = new Response(htmlRes.body, htmlRes);
  appendVaryAccept(res.headers);

  if (htmlRes.status === 404 && chosen === "text/markdown") {
    const missing = await fetchFirstOk(env, request, ["/404.md"]);
    if (missing) {
      const md404 = new Response(missing.res.body, {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      });
      appendVaryAccept(md404.headers);
      return md404;
    }
  }

  if (res.headers.get("content-type")?.includes("text/html")) {
    const hit = await fetchFirstOk(env, new Request(request.url, { method: "HEAD" }), markdownCandidates(url.pathname));
    if (hit) {
      const linkValue = `<${hit.path}>; rel="alternate"; type="text/markdown"`;
      const existing = res.headers.get("link");
      res.headers.set("Link", existing ? `${existing}, ${linkValue}` : linkValue);
    }
  }

  return res;
}
