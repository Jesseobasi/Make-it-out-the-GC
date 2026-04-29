import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import AvailabilityLegend from "../components/AvailabilityLegend.jsx";
import CopyLinkCard from "../components/CopyLinkCard.jsx";
import DayToggleButton from "../components/DayToggleButton.jsx";
import ExpiredNotice from "../components/ExpiredNotice.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { useEvent } from "../hooks/useEvent.js";
import { submitAvailability } from "../services/api.js";
import {
  createBlankAvailability,
  normalizeAvailabilityForSubmit,
} from "../utils/availability.js";
import { formatRange, formatTime, getBrowserTimezone, listDateRange } from "../utils/dates.js";
import { setEventPageMetadata } from "../utils/metadata.js";

export default function EventPage() {
  const { shortId } = useParams();
  const { event, setEvent, status, error } = useEvent(shortId);
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!event) {
      return;
    }

    const nextDates = listDateRange(event.startDate, event.endDate);
    setAvailability((current) => {
      const currentDates = Object.keys(current);

      if (
        currentDates.length === nextDates.length &&
        currentDates.every((date, index) => date === nextDates[index])
      ) {
        return current;
      }

      return createBlankAvailability(nextDates);
    });
  }, [event]);

  useEffect(() => {
    setEventPageMetadata(event);
  }, [event]);

  const timezone = getBrowserTimezone();
  const shareUrl = shortId ? new URL(`/e/${shortId}`, window.location.origin).toString() : "";
  const dates = event ? listDateRange(event.startDate, event.endDate) : [];
  const isExpired = Boolean(event?.isExpired);
  const hasEnded = Boolean(event?.endDate && event.endDate < new Date().toISOString().slice(0, 10));
  const isReadOnly = isExpired || hasEnded;

  function updateDateValue(date, nextValue) {
    setSaved(false);
    setAvailability((current) => ({ ...current, [date]: nextValue }));
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await submitAvailability(shortId, {
        name,
        availability: normalizeAvailabilityForSubmit(availability),
      });

      setEvent(data.event);
      setSaved(true);
    } catch (requestError) {
      if (requestError.status === 410 && requestError.payload?.event) {
        setEvent(requestError.payload.event);
      }

      setSubmitError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const aside = (
    <div className="space-y-4">
      <CopyLinkCard
        title="Share this invite"
        description="This short link is the only thing your group needs. Duplicate names overwrite the earlier response to reduce clutter."
        url={shareUrl}
      />
      <InfoCard
        title="How voting works"
        text="Tap each date to cycle empty -> yes -> maybe -> no. Leaving a day blank still submits it as no so every date stays rankable."
      />
    </div>
  );

  if (status === "loading") {
    return (
      <AppShell
        eyebrow="Loading"
        title="Preparing the event."
        subtitle="We're loading the date range and short-link session."
      >
        <InfoCard title="Loading event" text="One moment while the invite comes into view." />
      </AppShell>
    );
  }

  if (status === "error") {
    return (
      <AppShell
        eyebrow="Not found"
        title="This event could not be loaded."
        subtitle="The short link may be wrong, or the temporary session may already be gone."
      >
        <InfoCard title="Error" text={error || "Unable to load this event."} tone="danger" />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow={isReadOnly ? "Read only" : "Respond"}
      title={event.title}
      subtitle={
        <>
          Choose the days that work for you between {formatRange(event.startDate, event.endDate)}.
          {event.startTime && event.endTime && (
            <span className="block mt-2 font-medium text-slate-300">
              Meeting window: {formatTime(event.startTime)} - {formatTime(event.endTime)} {event.timezone ? `(${event.timezone})` : ""}
            </span>
          )}
        </>
      }
      aside={aside}
    >
      <section className="panel p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Availability
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Tap through each day</h2>
          </div>
          <div className="space-y-2 text-right">
            <AvailabilityLegend />
            <p className="text-xs text-slate-400">
              Displaying in {timezone}
            </p>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit} 
          className="mt-4 space-y-4 pb-24"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpired ? <ExpiredNotice expiresAt={event.expiresAt} /> : null}
          {!isExpired && hasEnded ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
              This event is past its end date and is now read-only.
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Your name
            </span>
            <input
              className="input"
              placeholder="Avery, Chris, Priya..."
              value={name}
              onChange={(inputEvent) => {
                setSaved(false);
                setName(inputEvent.target.value);
              }}
              disabled={isReadOnly}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {dates.map((date) => (
              <DayToggleButton
                key={date}
                date={date}
                value={availability[date] || ""}
                onChange={updateDateValue}
                disabled={isReadOnly}
              />
            ))}
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-rose-900/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-400">
              {submitError}
            </div>
          ) : null}

          {saved ? (
            <div className="rounded-2xl border border-emerald-900/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
              Availability saved. Submitting again with the same name will replace your earlier response.
            </div>
          ) : null}

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-700 bg-slate-900/95 p-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:justify-start">
            <motion.button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={submitting || !name.trim() || isReadOnly}
              whileHover={submitting || !name.trim() || isReadOnly ? {} : { scale: 1.02 }}
              whileTap={submitting || !name.trim() || isReadOnly ? {} : { scale: 0.98 }}
            >
              {submitting ? "Saving..." : isReadOnly ? "Submission closed" : "Submit Availability"}
            </motion.button>
            <Link to={`/e/${shortId}/results`} className="btn-secondary w-full sm:w-auto">
              View live results
            </Link>
            </div>
          </div>
        </motion.form>
      </section>
    </AppShell>
  );
}
