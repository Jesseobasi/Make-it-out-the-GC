import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import AvailabilityLegend from "../components/AvailabilityLegend.jsx";
import DayToggleButton from "../components/DayToggleButton.jsx";
import ShareCard from "../components/ShareCard.jsx";
import StatusCard from "../components/StatusCard.jsx";
import { fetchEvent, submitAvailability } from "../lib/api.js";
import {
  createBlankAvailability,
  normalizeAvailabilityForSubmit,
} from "../lib/availability.js";
import { formatRange, listDateRange } from "../lib/dates.js";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchEvent(eventId);
        setEvent(data.event);
        setAvailability(
          createBlankAvailability(listDateRange(data.event.startDate, data.event.endDate))
        );
        setStatus("ready");
      } catch (requestError) {
        setError(requestError.message);
        setStatus("error");
      }
    }

    loadEvent();
  }, [eventId]);

  const shareUrl = eventId
    ? new URL(`/event/${eventId}`, window.location.origin).toString()
    : "";

  const dates = event ? listDateRange(event.startDate, event.endDate) : [];

  function updateDateValue(date, nextValue) {
    setSaved(false);
    setAvailability((current) => ({ ...current, [date]: nextValue }));
  }

  async function handleSubmit(formEvent) {
    formEvent.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await submitAvailability(eventId, {
        name,
        availability: normalizeAvailabilityForSubmit(availability),
      });
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const aside = (
    <div className="space-y-4">
      <ShareCard
        title="Invite the group"
        description="Everyone uses the same link. If the same name is submitted twice, the latest availability replaces the earlier one."
        url={shareUrl}
      />
      <StatusCard
        title="Tap to cycle"
        text="Each date moves from unset to yes, maybe, then no. Unset dates submit as no so every day still scores cleanly."
      />
    </div>
  );

  if (status === "loading") {
    return (
      <AppShell
        eyebrow="Loading"
        title="Fetching your event."
        subtitle="We're pulling the date range and preparing the availability grid."
      >
        <StatusCard title="Loading event" text="One moment while the scheduler catches up." />
      </AppShell>
    );
  }

  if (status === "error") {
    return (
      <AppShell
        eyebrow="Missing event"
        title="This event could not be loaded."
        subtitle="The share link may be wrong, or the event might no longer exist."
      >
        <StatusCard title="Error" text={error || "Unable to load this event."} />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Share response"
      title={event.title}
      subtitle={`Choose the days that work for you between ${formatRange(
        event.startDate,
        event.endDate
      )}.`}
      aside={aside}
    >
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Your availability
            </p>
            <h2 className="mt-2 text-3xl">Mark every date that fits</h2>
          </div>
          <AvailabilityLegend />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Your name
            </span>
            <input
              className="input"
              placeholder="Jess, Maya, Chris..."
              value={name}
              onChange={(inputEvent) => {
                setSaved(false);
                setName(inputEvent.target.value);
              }}
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
              />
            ))}
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {saved ? (
            <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              Availability saved. You can update it anytime with the same name.
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !name.trim()}
            >
              {submitting ? "Saving..." : "Submit availability"}
            </button>
            <Link to={`/event/${eventId}/results`} className="btn-secondary">
              View live results
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
