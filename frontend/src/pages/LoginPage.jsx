import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/my-events" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email);
      navigate("/my-events");
    } catch (requestError) {
      setError(requestError.message || "Unable to login right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      eyebrow="Optional login"
      title="Sign in with email"
      subtitle="Login is optional. Guests can still create, share, and vote as usual."
      aside={
        <InfoCard
          title="Why login?"
          text="Logged-in users get a personal dashboard with events they created and events they joined."
        />
      }
    >
      <section className="panel p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-dark-muted">
              Email address
            </span>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
            />
          </label>
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Continue with email"}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
