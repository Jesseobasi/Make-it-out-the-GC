export default function RankedDaysList({ days }) {
  return (
    <div className="space-y-3">
      {days.map((day, index) => (
        <div
          key={day.date}
          className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-dark-border dark:bg-dark-surface"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-dark-muted">
              Rank #{index + 1}
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-dark-text">{day.label}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-dark-muted">
              ✅ {day.breakdown.yes} yes, 🤔 {day.breakdown.maybe} maybe, ❌ {day.breakdown.no} no
            </p>
          </div>
          <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">
            {day.score.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

