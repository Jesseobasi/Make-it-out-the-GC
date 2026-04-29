function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function setEventPageMetadata(event) {
  if (!event) {
    return;
  }

  const description = `${event.startDate} – ${event.endDate} · Join to vote`;
  const title = event.title;

  document.title = title;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: description,
  });
}
