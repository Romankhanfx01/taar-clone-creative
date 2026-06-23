export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M4 16 Q 8 8, 12 16 T 20 16 T 28 16"
          stroke="var(--mint)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="4" cy="16" r="2" fill="var(--mint)" />
        <circle cx="28" cy="16" r="2" fill="var(--mint)" />
      </svg>
      <span className="font-display text-2xl tracking-[0.2em] text-foreground">VOLTDOT</span>
    </div>
  );
}
