import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import HeatmapGrid from "../components/HeatmapGrid.jsx";
import RankedDaysList from "../components/RankedDaysList.jsx";
import ShareCard from "../components/ShareCard.jsx";
import StatusCard from "../components/StatusCard.jsx";
import { fetchResults } from "../lib/api.js";
import { formatRange } from "../lib/dates.js";

export default function ResultsPage() {
  const { eventId } = useParams();
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchResults(eventId);
        setPayload(data);
        setStatus("ready");
      } catch (requestError) {
        setError(requestError.message);
        setStatus("error");
      }
    }

    loadResults();
  }, [eventId]);

  const shareUrl = eventId
    ? new URL(`/event/${eventId}`, window.location.origin).toString()
    : "";

  if (status === "loading") {
    return (
      <AppShell
        eyebrow="Calculating"
        title="Scoring the calendar."
        subtitle="We're ranking each day based on everyone's responses."
      >
        <StatusCard title="Loading results" text="One moment while we total the votes." />
      </AppShell>
    );
  }

  if (status === "error") {
    return (
      <AppShell
        eyebrow="Missing results"
        title="This results page could not be loaded."
        subtitle="The event might be missing or the URL may be incorrect."
      >
        <StatusCard title="Error" text={error || "Unable to load results."} />
      </AppShell>
    );
  }

  const { event, results } = payload;
  const bestDay = results.bestDay;
  const heatmapDays = [...results.rankedDays].sort((left, right) =>
    left.date.localeCompare(right.date)
  );

  const aside = (
    <div className="space-y-4">
      <ShareCard
        title="Invite more people"
        description="Results update as more friends respond, so you can keep sharing the same event link."
        url={shareUrl}
      />
      <StatusCard
        title="Participants"
        text={`${results.participantCount} ${
          results.participantCount === 1 ? "person has" : "people have"
        } responded so far.`}
      />
    </div>
  );

  return (
    <AppShell
      eyebrow="Live results"
      title={event.title}
      subtitle={`Results for ${formatRange(event.startDate, event.endDate)}.`}
      aside={aside}
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Best day
          </p>
          {bestDay ? (
            <>
              <h2 className="mt-3 text-4xl">{bestDay.label}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Highest total score: {bestDay.score.toFixed(1)}. Even if nobody overlaps
                perfectly, this is still the strongest day in the range.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-900">
                  {bestDay.breakdown.yes} yes
                </span>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                  {bestDay.breakdown.maybe} maybe
                </span>
                <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-900">
                  {bestDay.breakdown.no} no
                </span>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No days are available to rank yet.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={`/event/${eventId}`} className="btn-primary">
              Add or edit availability
            </Link>
            <Link to="/" className="btn-secondary">
              Create another event
            </Link>
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Calendar heatmap
          </p>
          <h2 className="mt-2 text-3xl">See the strongest pockets</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Darker teal means stronger availability. Softer tones mean the group is less aligned.
          </p>
          <div className="mt-6">
            <HeatmapGrid
              days={heatmapDays}
              participantCount={results.participantCount}
            />
          </div>
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Ranked days
            </p>
            <h2 className="mt-2 text-3xl">Every date, sorted by score</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {results.participantCount} participants
          </span>
        </div>
        <div className="mt-6">
          <RankedDaysList days={results.rankedDays} />
        </div>
      </section>
    </AppShell>
  );
}
