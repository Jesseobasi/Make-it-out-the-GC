export default function InfoCard({ title, text, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "border-rose-900/50 bg-rose-900/20 text-rose-400"
      : tone === "success"
        ? "border-emerald-900/50 bg-emerald-900/20 text-emerald-400"
        : "border-slate-700/80 bg-slate-800/95 text-slate-300";

  return (
    <div className={`panel p-4 sm:p-5 ${toneClass}`}>
      <h2 className="text-xl sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}

