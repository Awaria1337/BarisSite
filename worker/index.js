// Serves the static export from ./out and sends the bare domain to www,
// which is the canonical host (site.url, sitemap, canonical tags).
const APEX = "barisalas.com.tr";
const CANONICAL = "www.barisalas.com.tr";

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === APEX) {
      url.hostname = CANONICAL;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

export default worker;
