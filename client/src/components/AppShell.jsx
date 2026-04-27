import { Link } from "react-router-dom";

export default function AppShell({ eyebrow, title, subtitle, children, aside }) {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <main className="flex-1 space-y-6">
          <header className="panel overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
                >
                  Best Day Scheduler
                </Link>
                <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
                  {eyebrow}
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {subtitle}
                </p>
              </div>
            </div>
          </header>
          {children}
        </main>
        {aside ? <aside className="w-full lg:max-w-sm">{aside}</aside> : null}
      </div>
    </div>
  );
}

