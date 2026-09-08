import { handleRequest } from "./negotiate.js";

const DEFAULT_ORIGIN = "https://guilhermenegri.com";

export function createOriginAssets(origin = DEFAULT_ORIGIN) {
  return {
    fetch(input) {
      const req = input instanceof Request ? input : new Request(String(input));
      const incoming = new URL(req.url);
      const dest = new URL(incoming.pathname + incoming.search, origin);
      const headers = new Headers(req.headers);
      headers.delete("host");
      return fetch(
        new Request(dest.toString(), {
          method: req.method,
          headers,
          redirect: "follow",
        }),
      );
    },
  };
}

export default {
  async fetch(request, env) {
    return handleRequest(request, {
      ASSETS: createOriginAssets(env?.ORIGIN || DEFAULT_ORIGIN),
    });
  },
};
