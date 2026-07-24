import { Link } from 'waku';

import {
  MONTH_SLUGS,
  adjacentMonth,
  monthLabel,
  type MonthSlug,
} from '../lib/months';

type MonthNavProps = {
  current: MonthSlug;
  className?: string;
};

export function MonthNav({ current, className = '' }: MonthNavProps) {
  const prev = adjacentMonth(current, -1);
  const next = adjacentMonth(current, 1);

  return (
    <nav
      className={`mb-10 border-t border-line pt-2 ${className}`}
      aria-label="Months"
    >
      <div className="my-4 mb-5 flex justify-between gap-4">
        <Link
          to={`/${prev}`}
          className="font-mono text-[0.8rem] text-muted no-underline hover:text-accent"
        >
          <span aria-hidden="true">←</span> {monthLabel(prev)}
        </Link>
        <Link
          to={`/${next}`}
          className="font-mono text-[0.8rem] text-muted no-underline hover:text-accent"
        >
          {monthLabel(next)} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-[0.4rem] p-0">
        {MONTH_SLUGS.map((slug) => {
          const active = slug === current;
          return (
            <li key={slug}>
              <Link
                to={`/${slug}`}
                className={
                  active
                    ? 'inline-block border border-accent bg-accent px-[0.55rem] py-[0.35rem] font-mono text-[0.72rem] tracking-[0.06em] text-bg uppercase no-underline hover:text-bg'
                    : 'inline-block border border-transparent px-[0.55rem] py-[0.35rem] font-mono text-[0.72rem] tracking-[0.06em] text-muted uppercase no-underline transition-[color,border-color,background] duration-150 hover:border-line hover:text-ink'
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
