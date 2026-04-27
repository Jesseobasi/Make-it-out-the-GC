import { useState } from "react";

export default function CopyLinkCard({ title, description, url }) {
  const [status, setStatus] = useState("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1600);
    } catch (_error) {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className="panel p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="break-all">{url}</p>
      </div>
      <button type="button" onClick={handleCopy} className="btn-secondary mt-4 w-full">
        Copy link
      </button>
      <p className="mt-3 text-xs font-medium text-slate-500">
        {status === "copied" ? "Link copied." : status === "error" ? "Copy failed." : "Share this short link with your group."}
      </p>
    </div>
  );
}

