export default function RankedDaysList({ days }) {
  return (
    <div className="space-y-2.5">
      {days.map((day, index) => (
        <div
          key={day.date}
          className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Rank #{index + 1}
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">{day.label}</p>
            <p className="mt-1 text-xs text-slate-500">
              ✅ {day.breakdown.yes} yes, 🤔 {day.breakdown.maybe} maybe, ❌ {day.breakdown.no} no
            </p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            {day.score.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

