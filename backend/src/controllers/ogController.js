import { Event } from "../models/Event.js";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function getEventMetadata(req, res) {
  const { shortId } = req.params;
  const event = await Event.findOne({ shortId }).lean();

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const description = `${event.startDate} – ${event.endDate} · Join to vote`;

  return res.json({
    title: event.title,
    description,
  });
}

export function buildEventOgHtml({ title, description, url }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUrl = escapeHtml(url);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safeUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
  </head>
  <body>
    <p>Open this event: <a href="${safeUrl}">${safeUrl}</a></p>
  </body>
</html>`;
}
