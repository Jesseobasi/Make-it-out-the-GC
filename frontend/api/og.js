function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml({ title, description, url }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(url).split('/e/')[0]}/logo.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(url).split('/e/')[0]}/logo.png" />
  </head>
  <body>
    <p>Open this event: <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
  </body>
</html>`;
}

export default async function handler(req, res) {
  const shortId = String(req.query.shortId || "").trim();
  const baseUrl = (process.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const apiBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
  const eventUrl = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/e/${shortId}`;

  if (!shortId || !apiBase) {
    return res.status(400).send("Missing configuration.");
  }

  try {
    const response = await fetch(`${apiBase}/event/${shortId}/meta`);
    if (!response.ok) {
      return res.status(response.status).send("Event not found.");
    }
    const data = await response.json();
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.status(200).send(
      buildHtml({
        title: data.title,
        description: data.description,
        url: eventUrl,
      })
    );
  } catch (_error) {
    return res.status(502).send("Unable to load metadata.");
  }
}
