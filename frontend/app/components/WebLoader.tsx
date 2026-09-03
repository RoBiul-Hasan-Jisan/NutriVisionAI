/** A calm, centered loading indicator used for full-panel and route-level states. */

export function WebLoader({
  label = "Loading",
  sub,
  size = 40,
}: {
  label?: string;
  sub?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="spinner-ring"
        role="img"
        aria-label={label}
      >
        <circle cx="12" cy="12" r="9.5" stroke="var(--line)" strokeWidth="2.4" />
        <path
          d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
          stroke="var(--primary)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>

      <div>
        <p className="font-display font-semibold text-lg leading-tight">{label}</p>
        {sub && <p className="text-sm text-[var(--text-dim)] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/** Full-panel variant for route-level loading states. */
export function WebLoaderPanel({
  label,
  sub,
  className = "",
}: {
  label?: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`panel p-10 grid place-items-center ${className}`}>
      <WebLoader label={label} sub={sub} />
    </div>
  );
}
