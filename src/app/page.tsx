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

const sectionTitle =
  'mb-2 flex items-baseline justify-between gap-4 border-b border-line pb-2';
const sectionHeading = 'font-display text-2xl font-bold tracking-[-0.03em]';
const sectionCount =
  'font-mono text-xs tracking-[0.04em] text-muted uppercase';
const sectionLede = 'mb-5 text-[0.95rem] text-muted';
const ctaBase =
  'inline-flex flex-col gap-[0.2rem] border px-[1.15rem] py-[0.85rem] font-display text-[1.05rem] font-bold tracking-[-0.02em] no-underline transition-[border-color,color,background] duration-150 motion-reduce:transition-none';

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
      <section className="pt-[clamp(1.75rem,8vh,3.5rem)] pb-9">
        <h1 className="font-display mb-4 animate-landing-rise text-[clamp(2.1rem,6vw,3.4rem)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink motion-reduce:animate-none">
          On This Month in JavaScript
        </h1>
        <p className="mb-8 max-w-xl animate-landing-rise text-[1.1rem] text-muted [animation-delay:80ms] motion-reduce:animate-none">
          See when HTML, CSS, and JS features crossed Baseline — newly available
          by month, or widely available across the platform.
        </p>
        <div className="flex animate-landing-rise flex-wrap gap-x-4 gap-y-3 [animation-delay:160ms] motion-reduce:animate-none">
          <Link
            href={`/${thisMonth}`}
            prefetch
            className={`${ctaBase} border-accent bg-accent text-bg hover:border-accent-bright hover:bg-accent-bright hover:text-bg`}
          >
            This month
            <span className="font-mono text-[0.7rem] font-normal tracking-[0.06em] uppercase opacity-75">
              {thisMonthLabel}
            </span>
          </Link>
          <Link
            href="/widely"
            prefetch
            className={`${ctaBase} border-line bg-[color-mix(in_oklab,var(--color-bg-elevated)_80%,transparent)] text-ink hover:border-[color-mix(in_oklab,var(--color-accent)_45%,var(--color-line))] hover:text-accent`}
          >
            Widely available
          </Link>
        </div>
      </section>

      <section className="mt-11" aria-labelledby="browse-months">
        <h2 id="browse-months" className={sectionTitle}>
          <span className={sectionHeading}>Browse by month</span>
        </h2>
        <p className={sectionLede}>
          Jump to any calendar month to see which HTML, CSS, and JS features
          became Baseline newly available in that month, across every year.
        </p>
        <MonthNav current={thisMonth} className="mb-0 border-t-0 pt-0" />
      </section>

      <section className="mt-11" aria-labelledby="this-month">
        <h2 id="this-month" className={sectionTitle}>
          <span className={sectionHeading}>
            Newly available in {thisMonthLabel}
          </span>
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

      <section className="mt-11" aria-labelledby="graduating">
        <h2 id="graduating" className={sectionTitle}>
          <span className={sectionHeading}>
            Graduating in {nextMonthLabel}
          </span>
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
