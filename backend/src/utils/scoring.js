import { formatDisplayDate, listDateRange } from "./dateRange.js";

const SCORE_MAP = {
  yes: 1,
  maybe: 0.5,
  no: 0,
};

function roundScore(value) {
  return Math.round(value * 100) / 100;
}

export function calculateResults(event) {
  const daysInRange = listDateRange(event.startDate, event.endDate);
  const rankedDays = daysInRange
    .map((date) => {
      const breakdown = {
        yes: 0,
        maybe: 0,
        no: 0,
      };

      const score = event.responses.reduce((sum, response) => {
        const choice = response.availability?.get
          ? response.availability.get(date)
          : response.availability?.[date];
        const normalizedChoice = choice || "no";
        breakdown[normalizedChoice] += 1;
        return sum + SCORE_MAP[normalizedChoice];
      }, 0);

      return {
        date,
        label: formatDisplayDate(date),
        score: roundScore(score),
        breakdown,
      };
    })
    .sort((left, right) => right.score - left.score || left.date.localeCompare(right.date));

  const participantCount = event.responses.length;

  return {
    bestDay: participantCount > 0 ? rankedDays[0] || null : null,
    rankedDays,
    participantCount,
  };
}

