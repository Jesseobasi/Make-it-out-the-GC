export const AVAILABILITY_ORDER = ["", "yes", "maybe", "no"];

export const AVAILABILITY_META = {
  "": {
    badge: "Tap",
    emoji: "⬜",
    label: "Tap to choose",
    className: "border-slate-200 bg-white text-slate-500 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted",
  },
  yes: {
    badge: "Yes",
    emoji: "✅",
    label: "Available",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  maybe: {
    badge: "Maybe",
    emoji: "🤔",
    label: "Could work",
    className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  },
  no: {
    badge: "No",
    emoji: "❌",
    label: "Not free",
    className: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300",
  },
};

export function cycleAvailability(value) {
  const currentIndex = AVAILABILITY_ORDER.indexOf(value);
  return AVAILABILITY_ORDER[(currentIndex + 1) % AVAILABILITY_ORDER.length];
}

export function createBlankAvailability(dates) {
  return dates.reduce((accumulator, date) => {
    accumulator[date] = "";
    return accumulator;
  }, {});
}

export function normalizeAvailabilityForSubmit(availability) {
  return Object.fromEntries(
    Object.entries(availability).map(([date, value]) => [date, value || "no"])
  );
}

