import Link from 'next/link';
import { cacheLife, cacheTag } from 'next/cache';

import { FeatureList, FlatFeatureList } from '@/components/feature-list';
import { MonthNav } from '@/components/month-nav';
import {
  BASELINE_CACHE_LIFE,
  getNewlyAvailableForMonth,
  getWidelyAvailable,
} from '@/lib/baseline';
import { currentMonthSlug, monthLabel } from '@/lib/months';

const sectionTitle = 'mb-2 flex items-baseline gap-3';
const sectionHeading =
  'font-display text-[1.75rem] leading-none tracking-[-0.01em] italic';
const sectionRule = 'h-px flex-1 bg-line';
const sectionCount =
  'font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase';
const sectionLede = 'mb-6 max-w-xl text-[0.95rem] text-muted';

export default async function HomePage() {
  return <HomeContent />;
}

async function HomeContent() {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('baseline', 'home');

  const thisMonth = currentMonthSlug();
  const thisMonthLabel = monthLabel(thisMonth);

  const [monthResult, widelyResult] = await Promise.all([
    getNewlyAvailableForMonth(thisMonth),
    getWidelyAvailable(),
  ]);

  const monthTotal = monthResult.groups.reduce(
    (sum, g) => sum + g.features.length,
    0,
  );
  const graduating = widelyResult.graduatingNextMonth;
  const nextMonthLabel = widelyResult.nextMonthLabel;

  return (
    <div className="max-w-content">
      <section className="pt-[clamp(2rem,10vh,5rem)] pb-12">
        <p className="mb-5 animate-rise font-mono text-[0.72rem] tracking-[0.18em] text-accent uppercase motion-reduce:animate-none">
          Baseline, month by month
        </p>
        <h1 className="font-display mb-5 animate-rise text-[clamp(2.6rem,8vw,4.6rem)] leading-[1.02] font-normal tracking-[-0.015em] [animation-delay:60ms] motion-reduce:animate-none">
          On this month in{' '}
          <em className="text-accent">JavaScript</em>
        </h1>
        <p className="mb-9 max-w-xl animate-rise text-[1.1rem] leading-relaxed text-muted [animation-delay:120ms] motion-reduce:animate-none">
          See when HTML, CSS, and JS features crossed Baseline — newly
          available by month, or widely available across the platform.
        </p>
        <div className="flex animate-rise flex-wrap items-center gap-3 [animation-delay:180ms] motion-reduce:animate-none">
          <Link
            href={`/${thisMonth}`}
            prefetch
            className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[0.95rem] font-semibold text-bg no-underline transition-transform duration-200 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            This month
            <span className="font-mono text-[0.7rem] font-normal tracking-[0.08em] uppercase opacity-70">
              {thisMonthLabel}
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <Link
            href="/widely"
            prefetch
            className="inline-flex items-center rounded-full border border-line-bright px-6 py-3 text-[0.95rem] font-medium text-ink no-underline transition-colors duration-150 hover:border-accent/50 hover:text-accent"
          >
            Widely available
          </Link>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="browse-months">
        <h2 id="browse-months" className={sectionTitle}>
          <span className={sectionHeading}>Browse by month</span>
          <span className={sectionRule} aria-hidden="true" />
        </h2>
        <p className={sectionLede}>
          Jump to any calendar month to see which HTML, CSS, and JS features
          became Baseline newly available in that month, across every year.
        </p>
        <MonthNav current={thisMonth} className="mb-0" />
      </section>

      <section className="mt-14" aria-labelledby="this-month">
        <h2 id="this-month" className={sectionTitle}>
          <span className={sectionHeading}>
            Newly available in {thisMonthLabel}
          </span>
          <span className={sectionRule} aria-hidden="true" />
          {!monthResult.error ? (
            <span className={sectionCount}>
              {monthTotal === 0
                ? 'None yet'
                : `${monthTotal} ${monthTotal === 1 ? 'feature' : 'features'}`}
            </span>
          ) : null}
        </h2>
        <p className={sectionLede}>
          Features that hit Baseline newly available in {thisMonthLabel}, any
          year.{' '}
          <Link href={`/${thisMonth}`} prefetch>
            Open the full {thisMonthLabel} page
          </Link>
        </p>
        <FeatureList
          groups={monthResult.groups}
          monthLabel={thisMonthLabel}
          error={monthResult.error}
        />
      </section>

      <section className="mt-14" aria-labelledby="graduating">
        <h2 id="graduating" className={sectionTitle}>
          <span className={sectionHeading}>
            Graduating in {nextMonthLabel}
          </span>
          <span className={sectionRule} aria-hidden="true" />
          {!widelyResult.error ? (
            <span className={sectionCount}>
              {graduating.length}{' '}
              {graduating.length === 1 ? 'feature' : 'features'}
            </span>
          ) : null}
        </h2>
        <p className={sectionLede}>
          Newly available features projected to become widely available next
          month.{' '}
          <Link href="/widely" prefetch>
            See all widely available
          </Link>
        </p>
        <FlatFeatureList
          features={graduating}
          emptyMessage={`No HTML, CSS, or JavaScript features are projected to become Baseline widely available in ${nextMonthLabel}.`}
          error={widelyResult.error}
        />
      </section>
    </div>
  );
}
