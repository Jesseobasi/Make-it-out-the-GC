export const AVAILABILITY_ORDER = ["", "yes", "maybe", "no"];

export const AVAILABILITY_META = {
  "": {
    badge: "Tap",
    emoji: "⬜",
    label: "Tap to choose",
    className: "border-slate-200 bg-white text-slate-500",
  },
  yes: {
    badge: "Yes",
    emoji: "✅",
    label: "Available",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  maybe: {
    badge: "Maybe",
    emoji: "🤔",
    label: "Could work",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  no: {
    badge: "No",
    emoji: "❌",
    label: "Not free",
    className: "border-rose-200 bg-rose-50 text-rose-700",
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

