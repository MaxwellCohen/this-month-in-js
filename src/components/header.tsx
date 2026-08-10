import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          prefetch
          className="group flex items-center gap-2.5 no-underline"
        >
          <span className="grid size-7 place-items-center rounded-md bg-accent font-mono text-[0.7rem] font-medium text-bg transition-transform duration-200 group-hover:-rotate-6">
            JS
          </span>
          <span className="font-display text-[1.15rem] tracking-[-0.01em] text-ink italic">
            On This Month in JavaScript
          </span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Site">
          <Link
            href="/widely"
            prefetch
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase no-underline whitespace-nowrap transition-colors duration-150 hover:border-line-bright hover:text-ink"
          >
            Widely available
          </Link>
        </nav>
      </div>
    </header>
  );
};
