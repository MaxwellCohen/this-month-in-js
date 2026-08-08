import type { ReactNode } from 'react';

import type { BaselineFeature, YearGroup } from '@/lib/baseline';

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
    <div className="flex flex-col gap-[0.15rem]">
      <span className="font-mono text-[0.65rem] tracking-[0.06em] text-[color-mix(in_oklab,var(--color-muted)_82%,var(--color-ink))] uppercase">
        {label}
      </span>
      <time
        className="font-mono text-xs tracking-[0.03em] text-muted whitespace-nowrap"
        dateTime={iso}
      >
        {formatDate(iso)}
      </time>
    </div>
  );
}

function FeatureRow({ feature }: { feature: BaselineFeature }) {
  const primary = feature.mdn[0];

  return (
    <li className="grid grid-cols-1 items-start gap-[0.35rem] sm:grid-cols-[1fr_auto] sm:gap-x-6 sm:gap-y-4">
      <div>
        <h3 className="m-0 font-display text-[1.2rem] leading-tight font-bold tracking-[-0.02em]">
          {primary ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-size-[0_2px] bg-bottom bg-no-repeat text-ink no-underline transition-[background-size,color] duration-200 hover:bg-size-[100%_2px] hover:text-accent motion-reduce:transition-none"
            >
              {feature.name}
            </a>
          ) : (
            feature.name
          )}
        </h3>
        {feature.description ? (
          <p className="mt-[0.4rem] mb-0 text-[0.95rem] text-muted">
            {feature.description}
          </p>
        ) : null}
        {feature.mdn.length > 1 ? (
          <ul className="mt-[0.35rem] mb-0 flex list-none flex-col gap-2 p-0 text-[0.85rem]">
            {feature.mdn.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center py-[0.65rem] text-muted hover:text-accent"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        ) : primary ? (
          <p className="mt-[0.35rem] mb-0 list-none p-0 text-[0.85rem]">
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center py-[0.65rem] text-muted hover:text-accent"
            >
              MDN docs
            </a>
          </p>
        ) : (
          <p className="mt-[0.35rem] mb-0 list-none p-0 text-[0.85rem] text-muted italic">
            No MDN page mapped yet
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-[0.55rem] pt-0 text-left sm:items-end sm:pt-[0.2rem] sm:text-right">
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

function StatePanel({
  children,
  error,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={
        error
          ? 'border border-dashed border-danger/40 bg-bg-elevated p-6 text-ink'
          : 'border border-dashed border-line bg-bg-elevated p-6 text-muted'
      }
      role={error ? 'alert' : undefined}
    >
      {children}
    </div>
  );
}

export function FlatFeatureList({
  features,
  emptyMessage,
  error,
}: FlatFeatureListProps) {
  if (error) {
    return (
      <StatePanel error>
        <p>Couldn’t load Baseline data right now.</p>
        <p className="mt-2 mb-0 font-mono text-[0.8rem] text-danger">{error}</p>
      </StatePanel>
    );
  }

  if (features.length === 0) {
    return (
      <StatePanel>
        <p>{emptyMessage}</p>
      </StatePanel>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-[1.35rem] p-0">
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
      <StatePanel error>
        <p>Couldn’t load Baseline data right now.</p>
        <p className="mt-2 mb-0 font-mono text-[0.8rem] text-danger">{error}</p>
      </StatePanel>
    );
  }

  if (groups.length === 0) {
    return (
      <StatePanel>
        <p>
          No HTML, CSS, or JavaScript features became Baseline newly available
          in {monthLabel} (any year) — yet.
        </p>
      </StatePanel>
    );
  }

  return (
    <div className="flex flex-col gap-11">
      {groups.map((group) => (
        <section key={group.year}>
          <h2 className="mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-2">
            <span className="font-display text-2xl font-bold tracking-[-0.03em]">
              {group.year}
            </span>
            <span className="font-mono text-xs tracking-[0.04em] text-muted uppercase">
              {group.features.length}{' '}
              {group.features.length === 1 ? 'feature' : 'features'}
            </span>
          </h2>
          <ul className="m-0 flex list-none flex-col gap-[1.35rem] p-0">
            {group.features.map((feature) => (
              <FeatureRow key={feature.id} feature={feature} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
