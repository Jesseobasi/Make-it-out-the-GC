export function listDateRange(startDate, endDate) {
  const dates = [];
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const cursor = new Date(Date.UTC(startYear, startMonth - 1, startDay));
  const last = new Date(Date.UTC(endYear, endMonth - 1, endDay));

  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function getLocalDateInputValue(date = new Date()) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

export function addDaysToDateInput(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + days);
  return getLocalDateInputValue(nextDate);
}

export function formatDate(dateString, options) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatRange(startDate, endDate) {
  return `${formatDate(startDate, { month: "short", day: "numeric" })} - ${formatDate(
    endDate,
    { month: "short", day: "numeric", year: "numeric" }
  )}`;
}
