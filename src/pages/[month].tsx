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
    <div className="max-w-content">
      <title>{`${label} — On This Month in JavaScript`}</title>
      <meta
        name="description"
        content={`JavaScript features that became Baseline newly available in ${label}, across every year.`}
      />

      <section className="mb-8">
        <p className="font-display mb-3 text-[clamp(1.75rem,4.5vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
          On This Month in JavaScript
        </p>
        <h1 className="font-mono mb-[0.85rem] text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.06em] text-accent lowercase">
          {label}
        </h1>
        <p className="m-0 max-w-xl text-[1.05rem] text-muted">
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
          <p className="mt-4 font-mono text-[0.8rem] tracking-[0.04em] text-accent uppercase">
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
