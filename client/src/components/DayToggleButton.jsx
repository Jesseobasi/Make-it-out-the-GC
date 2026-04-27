import { AVAILABILITY_META, cycleAvailability } from "../lib/availability.js";
import { formatDate } from "../lib/dates.js";

export default function DayToggleButton({ date, value, onChange }) {
  const meta = AVAILABILITY_META[value];

  return (
    <button
      type="button"
      onClick={() => onChange(date, cycleAvailability(value))}
      className={`flex min-h-28 flex-col items-start justify-between rounded-3xl border p-4 text-left transition active:scale-[0.98] ${meta.className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
          {formatDate(date, { weekday: "short" })}
        </p>
        <p className="mt-1 text-lg font-semibold">
          {formatDate(date, { month: "short", day: "numeric" })}
        </p>
      </div>
      <div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
          {meta.badge}
        </span>
        <p className="mt-2 text-xs opacity-80">{meta.label}</p>
      </div>
    </button>
  );
}

