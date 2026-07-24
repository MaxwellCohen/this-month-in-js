import type { BaselineFeature, YearGroup } from '../lib/baseline';

type FeatureListProps = {
  groups: YearGroup[];
  monthLabel: string;
  error?: string | undefined;
};

type FlatFeatureListProps = {
  features: BaselineFeature[];
  emptyMessage: string;
  error?: string | undefined;
};

function formatDate(iso: string): string {
  if (!iso) {
    return '';
  }
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) {
    return iso;
  }
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function FeatureDate({
  label,
  iso,
}: {
  label: string;
  iso: string;
}) {
  return (
    <div className="feature-row__date-block">
      <span className="feature-row__date-label">{label}</span>
      <time className="feature-row__date" dateTime={iso}>
        {formatDate(iso)}
      </time>
    </div>
  );
}

function FeatureRow({ feature }: { feature: BaselineFeature }) {
  const primary = feature.mdn[0];

  return (
    <li className="feature-row">
      <div className="feature-row__main">
        <h3 className="feature-row__name">
          {primary ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="feature-row__link"
            >
              {feature.name}
            </a>
          ) : (
            feature.name
          )}
        </h3>
        {feature.description ? (
          <p className="feature-row__desc">{feature.description}</p>
        ) : null}
        {feature.mdn.length > 1 ? (
          <ul className="feature-row__mdn">
            {feature.mdn.map((doc) => (
              <li key={doc.url}>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        ) : primary ? (
          <p className="feature-row__mdn-single">
            <a href={primary.url} target="_blank" rel="noreferrer">
              MDN docs
            </a>
          </p>
        ) : (
          <p className="feature-row__mdn-missing">No MDN page mapped yet</p>
        )}
      </div>
      <div className="feature-row__dates">
        <FeatureDate label="Newly available" iso={feature.newlyAvailableDate} />
        {feature.widelyAvailableDate ? (
          <FeatureDate
            label="Widely available"
            iso={feature.widelyAvailableDate}
          />
        ) : null}
      </div>
    </li>
  );
}

export function FlatFeatureList({
  features,
  emptyMessage,
  error,
}: FlatFeatureListProps) {
  if (error) {
    return (
      <div className="state-panel state-panel--error" role="alert">
        <p>Couldn’t load Baseline data right now.</p>
        <p className="state-panel__detail">{error}</p>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="state-panel">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="feature-list">
      {features.map((feature) => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
    </ul>
  );
}

export function FeatureList({
  groups,
  monthLabel,
  error,
}: FeatureListProps) {
  if (error) {
    return (
      <div className="state-panel state-panel--error" role="alert">
        <p>Couldn’t load Baseline data right now.</p>
        <p className="state-panel__detail">{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="state-panel">
        <p>
          No JavaScript features became Baseline newly available in{' '}
          {monthLabel} (any year) — yet.
        </p>
      </div>
    );
  }

  return (
    <div className="year-stack">
      {groups.map((group) => (
        <section key={group.year} className="year-block">
          <h2 className="year-block__title">
            <span className="year-block__year">{group.year}</span>
            <span className="year-block__count">
              {group.features.length}{' '}
              {group.features.length === 1 ? 'feature' : 'features'}
            </span>
          </h2>
          <ul className="feature-list">
            {group.features.map((feature) => (
              <FeatureRow key={feature.id} feature={feature} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
