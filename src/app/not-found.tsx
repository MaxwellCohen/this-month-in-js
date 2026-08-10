import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-content pt-[clamp(2rem,10vh,5rem)]">
      <p className="mb-4 font-mono text-[0.72rem] tracking-[0.18em] text-accent uppercase">
        404
      </p>
      <h1 className="font-display mb-5 text-[clamp(2.6rem,8vw,4.6rem)] leading-[1.02] font-normal tracking-[-0.015em] text-ink italic">
        Page not found
      </h1>
      <p className="mb-9 max-w-xl text-[1.1rem] text-muted">
        That route isn’t a calendar month or a known page.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[0.95rem] font-semibold text-bg no-underline transition-transform duration-200 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        Back home <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
