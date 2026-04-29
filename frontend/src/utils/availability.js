export const AVAILABILITY_ORDER = ["", "yes", "maybe", "no"];

export const AVAILABILITY_META = {
  "": {
    badge: "Tap",
    emoji: "⬜",
    label: "Tap to choose",
    className: "border-slate-200 bg-white text-slate-600",
  },
  yes: {
    badge: "Yes",
    emoji: "✅",
    label: "Available",
    className: "border-emerald-300 bg-emerald-100 text-emerald-900 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]",
  },
  maybe: {
    badge: "Maybe",
    emoji: "🤔",
    label: "Could work",
    className: "border-amber-300 bg-amber-100 text-amber-900",
  },
  no: {
    badge: "No",
    emoji: "❌",
    label: "Not free",
    className: "border-slate-200 bg-slate-100 text-slate-500",
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

