import { formatDate } from "../lib/dates.js";

function getHeatColor(score, participantCount) {
  if (participantCount === 0) {
    return "bg-slate-100 text-slate-500";
  }

  const ratio = score / participantCount;

  if (ratio >= 0.9) {
    return "bg-teal-700 text-white";
  }

  if (ratio >= 0.65) {
    return "bg-teal-500 text-white";
  }

  if (ratio >= 0.4) {
    return "bg-amber-300 text-amber-950";
  }

  if (ratio > 0) {
    return "bg-rose-200 text-rose-900";
  }

  return "bg-slate-100 text-slate-500";
}

export default function HeatmapGrid({ days, participantCount }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {days.map((day) => (
        <div
          key={day.date}
          className={`rounded-3xl p-4 ${getHeatColor(day.score, participantCount)}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
            {formatDate(day.date, { weekday: "short" })}
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatDate(day.date, { month: "short", day: "numeric" })}
          </p>
          <p className="mt-4 text-sm font-medium">
            Score {day.score.toFixed(1)}
          </p>
        </div>
      ))}
    </div>
  );
}

