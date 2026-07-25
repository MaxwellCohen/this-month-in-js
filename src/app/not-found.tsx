import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-content pt-[clamp(1.75rem,8vh,3.5rem)]">
      <h1 className="font-display mb-4 text-[clamp(2.1rem,6vw,3.4rem)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink">
        Page not found
      </h1>
      <p className="mb-8 max-w-xl text-[1.1rem] text-muted">
        That route isn’t a calendar month or a known page.
      </p>
      <Link
        href="/"
        className="font-display text-[1.05rem] font-bold tracking-[-0.02em] text-accent no-underline hover:text-accent-bright"
      >
        Back home
      </Link>
    </div>
  );
}
