import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import CopyLinkCard from "../components/CopyLinkCard.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { createEvent } from "../services/api.js";
import {
  addDaysToDateInput,
  formatDate,
  formatRange,
  getBrowserTimezone,
  getLocalDateInputValue,
} from "../utils/dates.js";

const today = getLocalDateInputValue();
const oneWeekOut = addDaysToDateInput(today, 6);

export default function HomePage() {
  const [form, setForm] = useState({
    title: "",
    startDate: today,
    endDate: oneWeekOut,
  });
  const [createdEvent, setCreatedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shareUrl = createdEvent?.shareUrl
    ? new URL(createdEvent.shareUrl, window.location.origin).toString()
    : "";
  const timezone = getBrowserTimezone();

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
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
      <InfoCard
        title="Fast public scheduling"
        text="Create a short-lived event, send a short link, and let your group vote on days with a simple tap flow."
      />
      <InfoCard
        title="Temporary by design"
        text="Every event expires 7 days after creation, so old links naturally clean themselves up."
      />
      {shareUrl ? (
        <CopyLinkCard
          title="Share this link"
          description="Anyone with the short link can respond from their phone or desktop browser."
          url={shareUrl}
        />
      ) : null}
    </div>
  );

  return (
    <AppShell
      eyebrow="Create event"
      title="Find the best day without the back-and-forth."
      subtitle="Make it out the Group Chat creates a temporary public link for your group, tracks day-level availability, and ranks the strongest date automatically."
      aside={aside}
    >
      <section className="panel p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-dark-muted">
              New scheduling event
            </p>
            <h2 className="mt-2 text-3xl">Set the date window</h2>
          </div>
          <div className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
            Browser timezone: {timezone}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-dark-muted">
              Event title
            </span>
            <input
              className="input"
              placeholder="Beach day, birthday dinner, weekend trip..."
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-dark-muted">
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
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-dark-muted">
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
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tide">
            Event ready
          </p>
          <h2 className="mt-2 text-3xl">{createdEvent.event.title}</h2>
          <p className="mt-3 text-sm text-slate-600">
            {formatRange(createdEvent.event.startDate, createdEvent.event.endDate)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Expires on{" "}
            {formatDate(new Date(createdEvent.event.expiresAt).toISOString().slice(0, 10), {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            .
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={createdEvent.shareUrl} className="btn-primary">
              Open invite page
            </Link>
            <Link to={createdEvent.resultsUrl} className="btn-secondary">
              View live results
            </Link>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}

