import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

import { FlatFeatureList } from '@/components/feature-list';
import {
  BASELINE_CACHE_LIFE,
  getWidelyAvailable,
} from '@/lib/baseline';

const sectionTitle =
  'mb-2 flex items-baseline justify-between gap-4 border-b border-line pb-2';
const sectionHeading = 'font-display text-2xl font-bold tracking-[-0.03em]';
const sectionCount =
  'font-mono text-xs tracking-[0.04em] text-muted uppercase';
const sectionLede = 'mb-5 text-[0.95rem] text-muted';

export const metadata: Metadata = {
  title: 'Widely available',
  description:
    'JavaScript features that are Baseline widely available, and which ones graduate next month.',
};

export default async function WidelyPage() {
  return <WidelyContent />;
}

async function WidelyContent() {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('baseline', 'widely-page');

  const {
    graduatingNextMonth,
    widelyAvailable,
    nextMonthLabel,
    error,
  } = await getWidelyAvailable();

  return (
    <div className="max-w-content">
      <section className="mb-8">
        <p className="font-display mb-3 text-[clamp(1.75rem,4.5vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
          On This Month in JavaScript
        </p>
        <h1 className="font-mono mb-[0.85rem] text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.06em] text-accent lowercase">
          widely available
        </h1>
        <p className="m-0 max-w-xl text-[1.05rem] text-muted">
          JS features that are{' '}
          <a
            href="https://web.dev/baseline"
            target="_blank"
            rel="noreferrer"
          >
            Baseline widely available
          </a>
          , plus what’s graduating next month
        </p>
        {!error ? (
          <p className="mt-4 font-mono text-[0.8rem] tracking-[0.04em] text-accent uppercase">
            {widelyAvailable.length} widely available
            {graduatingNextMonth.length > 0
              ? ` · ${graduatingNextMonth.length} graduating in ${nextMonthLabel}`
              : ''}
          </p>
        ) : null}
      </section>

      {error ? (
        <FlatFeatureList
          features={[]}
          emptyMessage=""
          error={error}
        />
      ) : (
        <>
          <section className="mt-11">
            <h2 className={sectionTitle}>
              <span className={sectionHeading}>
                Coming in {nextMonthLabel}
              </span>
              <span className={sectionCount}>
                {graduatingNextMonth.length}{' '}
                {graduatingNextMonth.length === 1 ? 'feature' : 'features'}
              </span>
            </h2>
            <p className={sectionLede}>
              Newly available features projected to become widely available next
              month (30 months after their Baseline low date).
            </p>
            <FlatFeatureList
              features={graduatingNextMonth}
              emptyMessage={`No JavaScript features are projected to become Baseline widely available in ${nextMonthLabel}.`}
            />
          </section>

          <section className="mt-11">
            <h2 className={sectionTitle}>
              <span className={sectionHeading}>All widely available</span>
              <span className={sectionCount}>
                {widelyAvailable.length}{' '}
                {widelyAvailable.length === 1 ? 'feature' : 'features'}
              </span>
            </h2>
            <p className={sectionLede}>
              Newest Baseline widely available dates first.
            </p>
            <FlatFeatureList
              features={widelyAvailable}
              emptyMessage="No JavaScript features are Baseline widely available yet."
            />
          </section>
        </>
      )}
    </div>
  );
}
