import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

import { FlatFeatureList } from '@/components/feature-list';
import { SectionLede, SectionTitle } from '@/components/section';
import {
  BASELINE_CACHE_LIFE,
  getWidelyAvailable,
} from '@/lib/baseline';

export const metadata: Metadata = {
  title: 'Widely available',
  description:
    'HTML, CSS, and JavaScript features that are Baseline widely available, and which ones graduate next month.',
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
      <section className="mb-10 pt-4">
        <p className="mb-4 animate-rise font-mono text-[0.72rem] tracking-[0.18em] text-accent uppercase motion-reduce:animate-none">
          Across the platform
        </p>
        <h1 className="font-display mb-4 animate-rise text-[clamp(3rem,10vw,5.5rem)] leading-[0.95] font-normal tracking-[-0.015em] text-ink italic [animation-delay:60ms] motion-reduce:animate-none">
          Widely available
        </h1>
        <p className="m-0 max-w-xl animate-rise text-[1.05rem] text-muted [animation-delay:120ms] motion-reduce:animate-none">
          HTML, CSS, and JS features that are{' '}
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
          <p className="mt-5 animate-rise font-mono text-[0.72rem] tracking-widest text-muted uppercase [animation-delay:180ms] motion-reduce:animate-none">
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
            <SectionTitle
              count={`${graduatingNextMonth.length} ${graduatingNextMonth.length === 1 ? 'feature' : 'features'}`}
            >
              Coming in {nextMonthLabel}
            </SectionTitle>
            <SectionLede>
              Newly available features projected to become widely available next
              month (30 months after their Baseline low date).
            </SectionLede>
            <FlatFeatureList
              features={graduatingNextMonth}
              emptyMessage={`No HTML, CSS, or JavaScript features are projected to become Baseline widely available in ${nextMonthLabel}.`}
            />
          </section>

          <section className="mt-11">
            <SectionTitle
              count={`${widelyAvailable.length} ${widelyAvailable.length === 1 ? 'feature' : 'features'}`}
            >
              All widely available
            </SectionTitle>
            <SectionLede>
              Newest Baseline widely available dates first.
            </SectionLede>
            <FlatFeatureList
              features={widelyAvailable}
              emptyMessage="No HTML, CSS, or JavaScript features are Baseline widely available yet."
            />
          </section>
        </>
      )}
    </div>
  );
}
