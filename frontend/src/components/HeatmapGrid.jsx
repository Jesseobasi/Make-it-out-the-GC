import { formatDate } from "../utils/dates.js";

function getHeatClasses(score, participantCount) {
  if (participantCount === 0) {
    return "bg-slate-100 text-slate-500";
  }

  const ratio = score / participantCount;

  if (ratio >= 0.9) {
    return "bg-emerald-500 text-white";
  }

  if (ratio >= 0.65) {
    return "bg-emerald-200 text-emerald-900";
  }

  if (ratio >= 0.4) {
    return "bg-amber-200 text-amber-900";
  }

  if (ratio > 0) {
    return "bg-slate-200 text-slate-700";
  }

  return "bg-slate-100 text-slate-500";
}

export default function HeatmapGrid({ days, participantCount }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {days.map((day) => (
        <div
          key={day.date}
          className={`rounded-[20px] p-3 ${getHeatClasses(day.score, participantCount)}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">
            {formatDate(day.date, { weekday: "short" })}
          </p>
          <p className="mt-1 text-base font-semibold sm:text-lg">
            {formatDate(day.date, { month: "short", day: "numeric" })}
          </p>
          <p className="mt-3 text-xs font-medium">Score {day.score.toFixed(1)}</p>
        </div>
      ))}
    </div>
  );
}

