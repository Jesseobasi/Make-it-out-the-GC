import { motion } from "framer-motion";
import { AVAILABILITY_META, cycleAvailability } from "../utils/availability.js";
import { formatDate } from "../utils/dates.js";

export default function DayToggleButton({ date, value, onChange, disabled = false }) {
  const meta = AVAILABILITY_META[value];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(date, cycleAvailability(value))}
      className={`flex min-h-24 w-full touch-manipulation flex-col items-start justify-between rounded-2xl border p-3 text-left transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${meta.className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
          {formatDate(date, { weekday: "short" })}
        </p>
        <p className="mt-1 text-base font-semibold sm:text-lg">
          {formatDate(date, { month: "short", day: "numeric" })}
        </p>
      </div>
      <div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
          {meta.emoji} {meta.badge}
        </span>
        <p className="mt-2 text-xs opacity-80">{meta.label}</p>
      </div>
    </motion.button>
  );
}

