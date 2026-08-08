import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { FeatureList } from '@/components/feature-list';
import { MonthNav } from '@/components/month-nav';
import {
  BASELINE_CACHE_LIFE,
  getNewlyAvailableForMonth,
} from '@/lib/baseline';
import {
  MONTH_SLUGS,
  isMonthSlug,
  monthLabel,
  type MonthSlug,
} from '@/lib/months';

type MonthPageProps = {
  params: Promise<{ month: string }>;
};

export function generateStaticParams() {
  return MONTH_SLUGS.map((month) => ({ month }));
}

export async function generateMetadata({
  params,
}: MonthPageProps): Promise<Metadata> {
  const { month } = await params;
  if (!isMonthSlug(month)) {
    return { title: 'Not found' };
  }
  const label = monthLabel(month);
  return {
    title: label,
    description: `HTML, CSS, and JavaScript features that became Baseline newly available in ${label}, across every year.`,
  };
}

export default function MonthPage({ params }: MonthPageProps) {
  return (
    <Suspense fallback={<MonthPageFallback />}>
      <MonthPageBody params={params} />
    </Suspense>
  );
}

function MonthPageFallback() {
  return (
    <div className="max-w-content">
      <section className="mb-8">
        <p className="font-display mb-3 text-[clamp(1.75rem,4.5vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
          On This Month in JavaScript
        </p>
        <div
          className="mb-[0.85rem] h-[clamp(2.5rem,8vw,4.5rem)] w-48 animate-pulse rounded-sm bg-[color-mix(in_oklab,var(--color-line)_55%,transparent)]"
          aria-hidden
        />
        <p className="m-0 max-w-xl text-[1.05rem] text-muted">Loading…</p>
      </section>
    </div>
  );
}

async function MonthPageBody({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;

  if (!isMonthSlug(month)) {
    notFound();
  }

  return <MonthContent month={month} />;
}

async function MonthContent({ month }: { month: MonthSlug }) {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('baseline', `month-${month}`);

  const label = monthLabel(month);
  const { groups, error } = await getNewlyAvailableForMonth(month);
  const total = groups.reduce((sum, g) => sum + g.features.length, 0);

  return (
    <div className="max-w-content">
      <section className="mb-8">
        <p className="font-display mb-3 text-[clamp(1.75rem,4.5vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
          On This Month in JavaScript
        </p>
        <h1 className="font-mono mb-[0.85rem] text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.06em] text-accent lowercase">
          {label}
        </h1>
        <p className="m-0 max-w-xl text-[1.05rem] text-muted">
          HTML, CSS, and JS features that became{' '}
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

      <MonthNav current={month} />

      <FeatureList groups={groups} monthLabel={label} error={error} />
    </div>
  );
}
