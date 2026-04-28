export default function EmptyState({ title, text }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center dark:border-dark-border dark:bg-dark-surface">
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-dark-muted">{text}</p>
    </div>
  );
}

