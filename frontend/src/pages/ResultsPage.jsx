import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import CopyLinkCard from "../components/CopyLinkCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ExpiredNotice from "../components/ExpiredNotice.jsx";
import HeatmapGrid from "../components/HeatmapGrid.jsx";
import InfoCard from "../components/InfoCard.jsx";
import RankedDaysList from "../components/RankedDaysList.jsx";
import { useLiveResults } from "../hooks/useLiveResults.js";
import { formatRange, formatTime, downloadICS } from "../utils/dates.js";

export default function ResultsPage() {
  const { shortId } = useParams();
  const { payload, status, error, lastUpdatedAt } = useLiveResults(shortId, 8000);

  const shareUrl = shortId ? new URL(`/e/${shortId}`, window.location.origin).toString() : "";

  if (status === "loading") {
    return (
      <AppShell
        eyebrow="Loading"
        title="Scoring the group."
        subtitle="We're calculating the strongest day and pulling the latest responses."
      >
        <InfoCard title="Loading results" text="One moment while the rankings update." />
      </AppShell>
    );
  }

  if (status === "error") {
    return (
      <AppShell
        eyebrow="Unavailable"
        title="This results page could not be loaded."
        subtitle="The temporary event may have been deleted, expired, or linked incorrectly."
      >
        <InfoCard title="Error" text={error || "Unable to load results."} tone="danger" />
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
      <CopyLinkCard
        title="Invite more people"
        description="This page refreshes automatically every 8 seconds, so you can keep sharing the same short link while responses come in."
        url={shareUrl}
      />
      <InfoCard
        title="Live updates"
        text={
          lastUpdatedAt
            ? `Last refreshed at ${lastUpdatedAt.toLocaleTimeString()}.`
            : "Results refresh automatically every 8 seconds."
        }
      />
    </div>
  );

  return (
    <AppShell
      eyebrow={event.isExpired ? "Expired results" : "Live results"}
      title={event.title}
      subtitle={
        <>
          Results for {formatRange(event.startDate, event.endDate)}.
          {event.startTime && event.endTime && (
            <span className="block mt-2 font-medium text-slate-700">
              Meeting window: {formatTime(event.startTime)} - {formatTime(event.endTime)} {event.timezone ? `(${event.timezone})` : ""}
            </span>
          )}
        </>
      }
      aside={aside}
    >
      {event.isExpired ? <ExpiredNotice expiresAt={event.expiresAt} /> : null}

      {results.participantCount === 0 ? (
        <section className="panel p-4 sm:p-6">
          <EmptyState
            title="No responses yet"
            text="Share the short link with your group. As soon as someone votes, the best day and heatmap will appear here."
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={`/e/${shortId}`} className="btn-primary">
              Open invite page
            </Link>
            <Link to="/" className="btn-secondary">
              Create another event
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="panel p-4 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Best day
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl">{bestDay.label}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Highest total score: {bestDay.score.toFixed(1)}. Even if nobody overlaps perfectly,
                this is still the strongest day in the range.
              </p>
              
              {event.expectedParticipants ? (
                <div className="mt-4 max-w-xl">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Response Progress</span>
                    <span>{results.participantCount} / {event.expectedParticipants}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (results.participantCount / event.expectedParticipants) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
                  ✅ {bestDay.breakdown.yes} yes
                </span>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                  🤔 {bestDay.breakdown.maybe} maybe
                </span>
                <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-900">
                  ❌ {bestDay.breakdown.no} no
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row flex-wrap">
                <button
                  type="button"
                  onClick={() => downloadICS(event, bestDay.date)}
                  className="btn-primary"
                >
                  Add to Calendar
                </button>
                <Link to={`/e/${shortId}`} className="btn-secondary">
                  Add or edit availability
                </Link>
                <Link to="/" className="btn-secondary">
                  Create another event
                </Link>
              </div>
            </div>

            <div className="panel p-4 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Heatmap
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl">Visual availability by day</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Darker cells mean stronger alignment. Lighter cells show weaker group support.
              </p>
              <div className="mt-6">
                <HeatmapGrid
                  days={heatmapDays}
                  participantCount={results.participantCount}
                />
              </div>
            </div>
          </section>

          <section className="panel p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Ranked days
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl">Every date, sorted by score</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {results.participantCount} participants
              </span>
            </div>
            <div className="mt-6">
              <RankedDaysList days={results.rankedDays} />
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

