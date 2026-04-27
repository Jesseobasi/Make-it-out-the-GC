function parseDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return parseDateString(value).toISOString().slice(0, 10) === value;
}

export function compareDateStrings(a, b) {
  return a.localeCompare(b);
}

export function listDateRange(startDate, endDate) {
  const dates = [];
  const cursor = parseDateString(startDate);
  const last = parseDateString(endDate);

  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function formatDisplayDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseDateString(dateString));
}
