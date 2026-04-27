import { Link } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import StatusCard from "../components/StatusCard.jsx";

export default function NotFoundPage() {
  return (
    <AppShell
      eyebrow="404"
      title="That page isn't on the calendar."
      subtitle="The link may be broken, or the page may have moved."
    >
      <StatusCard
        title="Try the home page"
        text="Create a new event or reopen the original share link to get back on track."
      />
      <div>
        <Link to="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </AppShell>
  );
}
