import { FlatFeatureList } from '../components/feature-list';
import { getWidelyAvailable } from '../lib/baseline';

export default async function WidelyPage() {
  const {
    graduatingNextMonth,
    widelyAvailable,
    nextMonthLabel,
    error,
  } = await getWidelyAvailable();

  return (
    <div className="widely-page">
      <title>Widely available — On This Month in JavaScript</title>
      <meta
        name="description"
        content="JavaScript features that are Baseline widely available, and which ones graduate next month."
      />

      <section className="hero">
        <p className="hero__brand">On This Month in JavaScript</p>
        <h1 className="hero__month">widely available</h1>
        <p className="hero__lede">
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
          <p className="hero__meta">
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
          <section className="widely-section">
            <h2 className="widely-section__title">
              <span className="widely-section__heading">
                Coming in {nextMonthLabel}
              </span>
              <span className="widely-section__count">
                {graduatingNextMonth.length}{' '}
                {graduatingNextMonth.length === 1 ? 'feature' : 'features'}
              </span>
            </h2>
            <p className="widely-section__lede">
              Newly available features projected to become widely available next
              month (30 months after their Baseline low date).
            </p>
            <FlatFeatureList
              features={graduatingNextMonth}
              emptyMessage={`No JavaScript features are projected to become Baseline widely available in ${nextMonthLabel}.`}
            />
          </section>

          <section className="widely-section">
            <h2 className="widely-section__title">
              <span className="widely-section__heading">All widely available</span>
              <span className="widely-section__count">
                {widelyAvailable.length}{' '}
                {widelyAvailable.length === 1 ? 'feature' : 'features'}
              </span>
            </h2>
            <p className="widely-section__lede">
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

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
