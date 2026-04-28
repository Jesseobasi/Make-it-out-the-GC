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

export function getLocalDateInputValue(date = new Date()) {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

export function addDaysToDateInput(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + days);
  return getLocalDateInputValue(nextDate);
}

export function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const h = Number(hours);
  const m = Number(minutes);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const mStr = m < 10 ? `0${m}` : m;
  return `${h12}:${mStr} ${ampm}`;
}

export function downloadICS(event, bestDate) {
  // bestDate is YYYY-MM-DD
  const startDateStr = bestDate.replace(/-/g, "");
  
  let startStr = startDateStr;
  let endStr = startDateStr;
  
  if (event.startTime && event.endTime) {
    const sTime = event.startTime.replace(/:/g, "") + "00";
    const eTime = event.endTime.replace(/:/g, "") + "00";
    startStr = `${startDateStr}T${sTime}`;
    endStr = `${startDateStr}T${eTime}`;
  } else {
    // All day event, add 1 day for end
    const nextDate = new Date(bestDate);
    nextDate.setDate(nextDate.getDate() + 1);
    endStr = nextDate.toISOString().slice(0, 10).replace(/-/g, "");
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Make it out the Group Chat//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title || "Group Event"}`,
    `DTSTART;TZID=${event.timezone || "UTC"}:${startStr}`,
    `DTEND;TZID=${event.timezone || "UTC"}:${endStr}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title ? event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'event'}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

