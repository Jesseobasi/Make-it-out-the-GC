import { formatDate } from "../utils/dates.js";

function getHeatClasses(score, participantCount) {
  if (participantCount === 0) {
    return "bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-dark-muted";
  }

  const ratio = score / participantCount;

  if (ratio >= 0.9) {
    return "bg-tide text-white";
  }

  if (ratio >= 0.65) {
    return "bg-emerald-400 text-emerald-950 dark:bg-emerald-500 dark:text-white";
  }

  if (ratio >= 0.4) {
    return "bg-mellow text-amber-950 dark:bg-amber-500 dark:text-amber-950";
  }

  if (ratio > 0) {
    return "bg-orange-200 text-orange-950 dark:bg-orange-400 dark:text-orange-950";
  }

  return "bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-dark-muted";
}

export default function HeatmapGrid({ days, participantCount }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {days.map((day) => (
        <div
          key={day.date}
          className={`rounded-3xl p-4 ${getHeatClasses(day.score, participantCount)}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
            {formatDate(day.date, { weekday: "short" })}
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatDate(day.date, { month: "short", day: "numeric" })}
          </p>
          <p className="mt-4 text-sm font-medium">Score {day.score.toFixed(1)}</p>
        </div>
      ))}
    </div>
  );
}

