import Link from 'next/link';

import {
  MONTH_SLUGS,
  adjacentMonth,
  monthLabel,
  type MonthSlug,
} from '@/lib/months';

type MonthNavProps = {
  current: MonthSlug;
  className?: string;
};

const arrowLink =
  'group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[0.75rem] text-muted no-underline transition-colors duration-150 hover:border-line-bright hover:text-ink';

export function MonthNav({ current, className = '' }: MonthNavProps) {
  const prev = adjacentMonth(current, -1);
  const next = adjacentMonth(current, 1);

  return (
    <nav className={`mb-12 ${className}`} aria-label="Months">
      <div className="mb-4 flex justify-between gap-4">
        <Link href={`/${prev}`} prefetch className={arrowLink}>
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          >
            ←
          </span>
          {monthLabel(prev)}
        </Link>
        <Link href={`/${next}`} prefetch className={arrowLink}>
          {monthLabel(next)}
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 rounded-2xl border border-line/70 bg-bg-elevated/50 p-1.5">
        {MONTH_SLUGS.map((slug) => {
          const active = slug === current;
          return (
            <li key={slug} className="flex-1">
              <Link
                href={`/${slug}`}
                prefetch
                className={
                  active
                    ? 'block rounded-[0.65rem] bg-accent px-2 py-2 text-center font-mono text-[0.72rem] font-medium tracking-[0.06em] text-bg uppercase no-underline'
                    : 'block rounded-[0.65rem] px-2 py-2 text-center font-mono text-[0.72rem] tracking-[0.06em] text-muted uppercase no-underline transition-colors duration-150 hover:bg-line/50 hover:text-ink'
                }
                aria-current={active ? 'page' : undefined}
              >
                {monthLabel(slug).slice(0, 3)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
