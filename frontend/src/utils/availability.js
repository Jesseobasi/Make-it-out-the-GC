export const AVAILABILITY_ORDER = ["", "yes", "maybe", "no"];

export const AVAILABILITY_META = {
  "": {
    badge: "Tap",
    emoji: "⬜",
    label: "Tap to choose",
    className: "border-slate-700 bg-slate-800 text-slate-300",
  },
  yes: {
    badge: "Yes",
    emoji: "✅",
    label: "Available",
    className: "border-emerald-700 bg-emerald-900/30 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.1)]",
  },
  maybe: {
    badge: "Maybe",
    emoji: "🤔",
    label: "Could work",
    className: "border-amber-700 bg-amber-900/30 text-amber-400",
  },
  no: {
    badge: "No",
    emoji: "❌",
    label: "Not free",
    className: "border-slate-700 bg-slate-900/50 text-slate-500",
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

