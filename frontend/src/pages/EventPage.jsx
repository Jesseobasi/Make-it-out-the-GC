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

  const timezone = getBrowserTimezone();
  const shareUrl = shortId ? new URL(`/e/${shortId}`, window.location.origin).toString() : "";
  const dates = event ? listDateRange(event.startDate, event.endDate) : [];
  const isExpired = Boolean(event?.isExpired);

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
        text="Tap each date to cycle between yes, maybe, and no. Leaving a day blank still submits it as no so every date stays rankable."
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
      eyebrow={isExpired ? "Expired" : "Respond"}
      title={event.title}
      subtitle={
        <>
          Choose the days that work for you between {formatRange(event.startDate, event.endDate)}.
          {event.startTime && event.endTime && (
            <span className="block mt-2 font-medium text-slate-700">
              Meeting window: {formatTime(event.startTime)} - {formatTime(event.endTime)} {event.timezone ? `(${event.timezone})` : ""}
            </span>
          )}
        </>
      }
      aside={aside}
    >
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Availability
            </p>
            <h2 className="mt-2 text-3xl">Tap through each day</h2>
          </div>
          <div className="space-y-2 text-right">
            <AvailabilityLegend />
            <p className="text-xs text-slate-500">
              Displaying in {timezone}
            </p>
          </div>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mt-6 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpired ? <ExpiredNotice expiresAt={event.expiresAt} /> : null}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
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
              disabled={isExpired}
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dates.map((date) => (
              <DayToggleButton
                key={date}
                date={date}
                value={availability[date] || ""}
                onChange={updateDateValue}
                disabled={isExpired}
              />
            ))}
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          {saved ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Availability saved. Submitting again with the same name will replace your earlier response.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={submitting || !name.trim() || isExpired}
              whileHover={submitting || !name.trim() || isExpired ? {} : { scale: 1.02 }}
              whileTap={submitting || !name.trim() || isExpired ? {} : { scale: 0.98 }}
            >
              {submitting ? "Saving..." : isExpired ? "Event expired" : "Submit availability"}
            </motion.button>
            <Link to={`/e/${shortId}/results`} className="btn-secondary">
              View live results
            </Link>
          </div>
        </motion.form>
      </section>
    </AppShell>
  );
}
