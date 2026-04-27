import { formatDisplayDate, listDateRange } from "./dates.js";

const SCORE_MAP = {
  yes: 1,
  maybe: 0.5,
  no: 0,
};

function roundScore(value) {
  return Math.round(value * 100) / 100;
}

export function calculateResults(event) {
  const dates = listDateRange(event.startDate, event.endDate);

  const rankedDays = dates
    .map((date) => {
      const breakdown = {
        yes: 0,
        maybe: 0,
        no: 0,
      };

      const score = event.responses.reduce((total, response) => {
        const choice = response.availability?.get
          ? response.availability.get(date)
          : response.availability?.[date];
        const normalizedChoice = choice || "no";
        breakdown[normalizedChoice] += 1;
        return total + SCORE_MAP[normalizedChoice];
      }, 0);

      return {
        date,
        label: formatDisplayDate(date),
        score: roundScore(score),
        breakdown,
      };
    })
    .sort((left, right) => right.score - left.score || left.date.localeCompare(right.date));

  const bestDay = rankedDays[0] || null;

  return {
    bestDay,
    rankedDays,
    participantCount: event.responses.length,
  };
}

