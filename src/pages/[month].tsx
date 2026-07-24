import { unstable_notFound } from 'waku/router/server';

import { FeatureList } from '../components/feature-list';
import { MonthNav } from '../components/month-nav';
import { getNewlyAvailableForMonth } from '../lib/baseline';
import {
  isMonthSlug,
  monthLabel,
  type MonthSlug,
} from '../lib/months';

type MonthPageProps = {
  month: string;
};

export default async function MonthPage({ month }: MonthPageProps) {
  if (!isMonthSlug(month)) {
    unstable_notFound();
  }

  const slug = month as MonthSlug;
  const label = monthLabel(slug);
  const { groups, error } = await getNewlyAvailableForMonth(slug);
  const total = groups.reduce((sum, g) => sum + g.features.length, 0);

  return (
    <div className="month-page">
      <title>{`${label} — On This Month in JavaScript`}</title>
      <meta
        name="description"
        content={`JavaScript features that became Baseline newly available in ${label}, across every year.`}
      />

      <section className="hero">
        <p className="hero__brand">On This Month in JavaScript</p>
        <h1 className="hero__month">{label}</h1>
        <p className="hero__lede">
          JS features that became{' '}
          <a
            href="https://web.dev/baseline"
            target="_blank"
            rel="noreferrer"
          >
            Baseline newly available
          </a>{' '}
          in {label}
        </p>
        {!error ? (
          <p className="hero__meta">
            {total === 0
              ? 'No features yet'
              : `${total} ${total === 1 ? 'feature' : 'features'} · ${groups.length} ${groups.length === 1 ? 'year' : 'years'}`}
          </p>
        ) : null}
      </section>

      <MonthNav current={slug} />

      <FeatureList groups={groups} monthLabel={label} error={error} />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
