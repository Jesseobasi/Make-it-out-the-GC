import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppShell({ eyebrow, title, subtitle, children, aside }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row">
        <main className="flex-1 space-y-4">
          <header className="panel overflow-hidden p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:bg-dark-surface dark:text-dark-muted"
                >
                  Best Day Scheduler
                </Link>
                <div className="flex items-center gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link to="/my-events" className="text-xs font-semibold text-slate-600 dark:text-dark-muted">
                        My events
                      </Link>
                      <button onClick={signOut} className="text-xs font-semibold text-slate-600 dark:text-dark-muted">
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="text-xs font-semibold text-slate-600 dark:text-dark-muted">
                      Login
                    </Link>
                  )}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-dark-muted dark:hover:bg-dark-border"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  <span className="rounded-full bg-sunrise/10 px-3 py-1 text-xs font-semibold text-sunrise">
                    {eyebrow}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl leading-tight sm:text-4xl">{title}</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base dark:text-dark-muted">
                  {subtitle}
                </p>
                {user?.email ? (
                  <p className="text-xs text-slate-500 dark:text-dark-muted">Signed in as {user.email}</p>
                ) : null}
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

