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
      whileTap={{ scale: 0.97 }}
      onClick={() => onChange(date, cycleAvailability(value))}
      className={`flex min-h-[104px] w-full touch-manipulation flex-col items-start justify-between rounded-[20px] border p-3 text-left transition-all duration-150 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 ${meta.className}`}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-75">
          {formatDate(date, { weekday: "short" })}
        </p>
        <p className="mt-1 text-base font-semibold sm:text-lg">
          {formatDate(date, { month: "short", day: "numeric" })}
        </p>
      </div>
      <div className="w-full">
        <span className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold">
          {meta.emoji} {meta.badge}
        </span>
        <p className="mt-1.5 text-[11px] opacity-80">{meta.label}</p>
      </div>
    </motion.button>
  );
}

