import { useState } from "react";
import { motion } from "framer-motion";
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
    startTime: "",
    endTime: "",
    timezone: getBrowserTimezone(),
    expectedParticipants: "",
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
      title="Plan a day in under 30 seconds."
      subtitle="Create a simple share link and let people tap availability."
      aside={aside}
    >
      <section className="panel mx-auto w-full max-w-2xl p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              New event
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Create event</h2>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Browser timezone: {timezone}
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 pb-24 sm:pb-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
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

          <div className="grid gap-3 sm:grid-cols-2">
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

          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700">
              Advanced options
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Start time (optional)
                </span>
                <input
                  type="time"
                  className="input"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startTime: event.target.value }))
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  End time (optional)
                </span>
                <input
                  type="time"
                  className="input"
                  value={form.endTime}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endTime: event.target.value }))
                  }
                />
              </label>
            </div>
          </details>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Timezone
              </span>
              <input
                type="text"
                className="input"
                placeholder="America/New_York"
                value={form.timezone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, timezone: event.target.value }))
                }
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Expected participants (optional)
              </span>
              <input
                type="number"
                min="1"
                className="input"
                placeholder="e.g. 10"
                value={form.expectedParticipants}
                onChange={(event) =>
                  setForm((current) => ({ ...current, expectedParticipants: event.target.value }))
                }
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
            <motion.button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? "Creating event..." : "Create event"}
            </motion.button>
          </div>
        </motion.form>
      </section>

      {createdEvent?.event ? (
        <section className="panel p-4 sm:p-6">
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

