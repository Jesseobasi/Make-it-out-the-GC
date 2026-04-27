export default function StatusCard({ title, text }) {
  return (
    <div className="panel p-6">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

