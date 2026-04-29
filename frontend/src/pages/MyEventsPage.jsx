import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import EmptyState from "../components/EmptyState.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMyEvents } from "../services/auth.js";
import { formatRange } from "../utils/dates.js";

function EventList({ events, actionLabel }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-[20px] border border-slate-700 bg-slate-800 p-4">
          <p className="text-base font-semibold text-slate-100">{event.title}</p>
          <p className="mt-1 text-sm text-slate-400">
            {formatRange(event.startDate, event.endDate)}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            {event.participantCount} participant{event.participantCount === 1 ? "" : "s"}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link to={`/e/${event.shortId}`} className="btn-secondary">
              {actionLabel}
            </Link>
            <Link to={`/e/${event.shortId}/results`} className="btn-secondary">
              Results
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyEventsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [payload, setPayload] = useState({ createdEvents: [], participatingEvents: [] });

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchMyEvents()
      .then((data) => {
        setPayload(data);
        setStatus("ready");
      })
      .catch((requestError) => {
        setError(requestError.message || "Unable to load your events.");
        setStatus("error");
      });
  }, [isAuthenticated]);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell
      eyebrow="My events"
      title="Your scheduler activity"
      subtitle="Track events you created and events where you already voted."
      aside={<InfoCard title="Guests still work" text="Login is optional and never required for sharing or voting." />}
    >
      <section className="panel p-4 sm:p-6">
        {status === "loading" ? <p className="text-sm text-slate-400">Loading your events...</p> : null}
        {status === "error" ? <InfoCard title="Error" text={error} tone="danger" /> : null}
        {status === "ready" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl">Created by you</h2>
              <div className="mt-3">
                {payload.createdEvents.length ? (
                  <EventList events={payload.createdEvents} actionLabel="Open event" />
                ) : (
                  <EmptyState title="No created events yet" text="Create your first event from the home page." />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl">You participated</h2>
              <div className="mt-3">
                {payload.participatingEvents.length ? (
                  <EventList events={payload.participatingEvents} actionLabel="Update vote" />
                ) : (
                  <EmptyState title="No joined events yet" text="Join an invite link and your participation will show up here." />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
