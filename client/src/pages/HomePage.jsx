import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import ShareCard from "../components/ShareCard.jsx";
import StatusCard from "../components/StatusCard.jsx";
import { createEvent } from "../lib/api.js";
import {
  addDaysToDateInput,
  formatRange,
  getLocalDateInputValue,
} from "../lib/dates.js";

const today = getLocalDateInputValue();
const nextWeek = addDaysToDateInput(today, 6);

export default function HomePage() {
  const [form, setForm] = useState({
    title: "",
    startDate: today,
    endDate: nextWeek,
  });
  const [createdEvent, setCreatedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shareUrl = createdEvent?.shareUrl
    ? new URL(createdEvent.shareUrl, window.location.origin).toString()
    : "";

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await createEvent(form);
      setCreatedEvent(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const aside = (
    <div className="space-y-4">
      <StatusCard
        title="How it works"
        text="Create a date range, send the link to your group, and watch the strongest meeting day float to the top."
      />
      {shareUrl ? (
        <ShareCard
          title="Share this event"
          description="Friends can open this link on any device and tap through their availability."
          url={shareUrl}
        />
      ) : (
        <StatusCard
          title="Mobile-first flow"
          text="Every screen is designed for quick thumb taps first, with larger layouts expanding naturally on desktop."
        />
      )}
    </div>
  );

  return (
    <AppShell
      eyebrow="Create event"
      title="Pick the best day without a messy group chat."
      subtitle="Set the range once. Everyone marks each day as yes, maybe, or no. Best Day Scheduler scores the dates and highlights the strongest option."
      aside={aside}
    >
      <section className="panel p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              New event
            </p>
            <h2 className="mt-2 text-3xl">Start with the date range</h2>
          </div>
          <div className="hidden rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 sm:block">
            ISO dates, local browser timezone
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Event title
            </span>
            <input
              className="input"
              placeholder="Friday dinner, board game night, study group..."
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Start date
              </span>
              <input
                type="date"
                className="input"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, startDate: event.target.value }))
                }
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                End date
              </span>
              <input
                type="date"
                className="input"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, endDate: event.target.value }))
                }
                required
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
            {submitting ? "Creating event..." : "Create event"}
          </button>
        </form>
      </section>

      {createdEvent?.event ? (
        <section className="panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Event ready
          </p>
          <h2 className="mt-2 text-3xl">{createdEvent.event.title}</h2>
          <p className="mt-3 text-sm text-slate-600">
            {formatRange(createdEvent.event.startDate, createdEvent.event.endDate)}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={createdEvent.shareUrl} className="btn-primary">
              Open event page
            </Link>
            <Link
              to={`${createdEvent.shareUrl}/results`}
              className="btn-secondary"
            >
              View live results
            </Link>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
