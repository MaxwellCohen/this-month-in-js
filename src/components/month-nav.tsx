import { Link } from 'waku';

import {
  MONTH_SLUGS,
  adjacentMonth,
  monthLabel,
  type MonthSlug,
} from '../lib/months';

type MonthNavProps = {
  current: MonthSlug;
};

export function MonthNav({ current }: MonthNavProps) {
  const prev = adjacentMonth(current, -1);
  const next = adjacentMonth(current, 1);

  return (
    <nav className="month-nav" aria-label="Months">
      <div className="month-nav__arrows">
        <Link to={`/${prev}`} className="month-nav__arrow">
          <span aria-hidden="true">←</span> {monthLabel(prev)}
        </Link>
        <Link to={`/${next}`} className="month-nav__arrow">
          {monthLabel(next)} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="month-nav__list">
        {MONTH_SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              to={`/${slug}`}
              className={
                slug === current
                  ? 'month-nav__pill month-nav__pill--active'
                  : 'month-nav__pill'
              }
              aria-current={slug === current ? 'page' : undefined}
            >
              {monthLabel(slug).slice(0, 3)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
