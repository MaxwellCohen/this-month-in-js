import { Link } from 'waku';

import { FeatureList, FlatFeatureList } from '../components/feature-list';
import { MonthNav } from '../components/month-nav';
import {
  getNewlyAvailableForMonth,
  getWidelyAvailable,
} from '../lib/baseline';
import { currentMonthSlug, monthLabel } from '../lib/months';

export default async function HomePage() {
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
    <div className="landing-page">
      <title>On This Month in JavaScript</title>
      <meta
        name="description"
        content="Browse JavaScript features by when they became Baseline newly available or widely available."
      />

      <section className="landing-hero">
        <h1 className="landing-hero__brand">On This Month in JavaScript</h1>
        <p className="landing-hero__lede">
          See when JS features crossed Baseline — newly available by month, or
          widely available across the platform.
        </p>
        <div className="landing-hero__actions">
          <Link to={`/${thisMonth}`} className="landing-cta landing-cta--primary">
            This month
            <span className="landing-cta__meta">{thisMonthLabel}</span>
          </Link>
          <Link to="/widely" className="landing-cta">
            Widely available
          </Link>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="browse-months">
        <h2 id="browse-months" className="landing-section__title">
          <span className="landing-section__heading">Browse by month</span>
        </h2>
        <p className="landing-section__lede">
          Jump to any calendar month to see which JS features became Baseline
          newly available in that month, across every year.
        </p>
        <MonthNav current={thisMonth} />
      </section>

      <section className="landing-section" aria-labelledby="this-month">
        <h2 id="this-month" className="landing-section__title">
          <span className="landing-section__heading">
            Newly available in {thisMonthLabel}
          </span>
          {!monthResult.error ? (
            <span className="landing-section__count">
              {monthTotal === 0
                ? 'None yet'
                : `${monthTotal} ${monthTotal === 1 ? 'feature' : 'features'}`}
            </span>
          ) : null}
        </h2>
        <p className="landing-section__lede">
          Features that hit Baseline newly available in {thisMonthLabel}, any
          year.{' '}
          <Link to={`/${thisMonth}`}>Open the full {thisMonthLabel} page</Link>
        </p>
        <FeatureList
          groups={monthResult.groups}
          monthLabel={thisMonthLabel}
          error={monthResult.error}
        />
      </section>

      <section className="landing-section" aria-labelledby="graduating">
        <h2 id="graduating" className="landing-section__title">
          <span className="landing-section__heading">
            Graduating in {nextMonthLabel}
          </span>
          {!widelyResult.error ? (
            <span className="landing-section__count">
              {graduating.length}{' '}
              {graduating.length === 1 ? 'feature' : 'features'}
            </span>
          ) : null}
        </h2>
        <p className="landing-section__lede">
          Newly available features projected to become widely available next
          month.{' '}
          <Link to="/widely">See all widely available</Link>
        </p>
        <FlatFeatureList
          features={graduating}
          emptyMessage={`No JavaScript features are projected to become Baseline widely available in ${nextMonthLabel}.`}
          error={widelyResult.error}
        />
      </section>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
