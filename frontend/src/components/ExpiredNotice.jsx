import { formatDate } from "../utils/dates.js";

export default function ExpiredNotice({ expiresAt }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
      <p className="font-semibold">This event has expired.</p>
      <p className="mt-1 leading-6">
        New submissions are blocked. It expired on{" "}
        {formatDate(new Date(expiresAt).toISOString().slice(0, 10), {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        .
      </p>
    </div>
  );
}

