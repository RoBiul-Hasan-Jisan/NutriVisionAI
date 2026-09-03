/** The inline loading indicator: a small spinner and a label. */
export function SpiderBar({
  label = "Loading",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`} role="status" aria-live="polite">
      <svg
        className="spinner-ring w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="var(--line)" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm text-[var(--text-dim)]">{label}…</span>
    </div>
  );
}
