import Link from 'next/link';

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-shell items-baseline justify-between gap-4 px-6 pt-5">
      <Link
        href="/"
        prefetch
        className="font-display text-[0.95rem] font-bold tracking-[-0.02em] text-ink no-underline opacity-[0.85] transition-opacity duration-150 hover:text-ink hover:opacity-100"
      >
        On This Month in JavaScript
      </Link>
      <nav className="flex gap-4" aria-label="Site">
        <Link
          href="/widely"
          prefetch
          className="font-mono text-xs tracking-[0.04em] text-muted uppercase no-underline whitespace-nowrap hover:text-accent"
        >
          Widely available
        </Link>
      </nav>
    </header>
  );
};
