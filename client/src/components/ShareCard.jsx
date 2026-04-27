import { useState } from "react";

export default function ShareCard({ title, description, url }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (_error) {
      setCopied(false);
    }
  }

  return (
    <div className="panel p-5 sm:p-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {title}
        </p>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="break-all">{url}</p>
        </div>
        <button type="button" onClick={handleCopy} className="btn-secondary w-full">
          {copied ? "Link copied" : "Copy share link"}
        </button>
      </div>
    </div>
  );
}

