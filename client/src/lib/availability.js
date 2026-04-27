export const AVAILABILITY_ORDER = ["", "yes", "maybe", "no"];

export const AVAILABILITY_META = {
  "": {
    label: "Tap to choose",
    badge: "Unset",
    className: "border-slate-200 bg-white text-slate-500",
  },
  yes: {
    label: "Available",
    badge: "Yes",
    className: "border-teal-200 bg-teal-50 text-teal-800",
  },
  maybe: {
    label: "Could work",
    badge: "Maybe",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  no: {
    label: "Not free",
    badge: "No",
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

