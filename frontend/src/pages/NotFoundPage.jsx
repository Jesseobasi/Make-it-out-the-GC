import { Link } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import InfoCard from "../components/InfoCard.jsx";

export default function NotFoundPage() {
  return (
    <AppShell
      eyebrow="404"
      title="That page fell off the schedule."
      subtitle="The link may be incorrect, or the temporary event may already be gone."
    >
      <InfoCard
        title="Try the home page"
        text="Create a new event or reopen the original short link to get back on track."
      />
      <div>
        <Link to="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </AppShell>
  );
}
