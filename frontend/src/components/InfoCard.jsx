export default function InfoCard({ title, text, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-white/70 bg-white/85 text-slate-700";

  return (
    <div className={`panel p-5 sm:p-6 ${toneClass}`}>
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-3 text-sm leading-6">{text}</p>
    </div>
  );
}

