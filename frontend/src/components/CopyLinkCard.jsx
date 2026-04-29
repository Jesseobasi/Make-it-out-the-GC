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
    <div className="panel p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300">
        <p className="break-all">{url}</p>
      </div>
      <button type="button" onClick={handleCopy} className="btn-secondary mt-4 w-full">
        Copy link
      </button>
      <p className="mt-2 text-xs font-medium text-slate-400">
        {status === "copied" ? "Link copied." : status === "error" ? "Copy failed." : "Share this short link with your group."}
      </p>
    </div>
  );
}

