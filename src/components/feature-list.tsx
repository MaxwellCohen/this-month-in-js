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

function DateChip({
  label,
  iso,
  highlight = false,
}: {
  label: string;
  iso: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={
        highlight
          ? 'inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.03em] whitespace-nowrap text-accent'
          : 'inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.03em] whitespace-nowrap text-muted'
      }
    >
      <span className="uppercase opacity-70">{label}</span>
      <time dateTime={iso}>{formatDate(iso)}</time>
    </span>
  );
}

function FeatureCard({ feature }: { feature: BaselineFeature }) {
  const primary = feature.mdn[0];

  return (
    <li className="card-surface card-surface-hover p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="m-0 text-[1.1rem] leading-snug font-semibold tracking-[-0.01em]">
          {primary ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noreferrer"
              className="text-ink no-underline transition-colors duration-150 hover:text-accent"
            >
              {feature.name}
            </a>
          ) : (
            feature.name
          )}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <DateChip label="New" iso={feature.newlyAvailableDate} highlight />
          {feature.widelyAvailableDate ? (
            <DateChip label="Wide" iso={feature.widelyAvailableDate} />
          ) : null}
        </div>
      </div>
      {feature.description ? (
        <p className="mt-2 mb-0 max-w-152 text-[0.92rem] leading-relaxed text-muted">
          {feature.description}
        </p>
      ) : null}
      <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem]">
        {feature.mdn.length > 0 ? (
          feature.mdn.map((doc) => (
            <a
              key={doc.url}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[0.72rem] text-muted no-underline transition-colors duration-150 hover:text-accent"
            >
              {feature.mdn.length > 1 ? doc.title : 'MDN docs'}
              <span aria-hidden="true" className="text-[0.85em]">
                ↗
              </span>
            </a>
          ))
        ) : (
          <span className="font-mono text-[0.72rem] text-muted/70 italic">
            No MDN page mapped yet
          </span>
        )}
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
          ? 'rounded-xl border border-dashed border-danger/40 bg-bg-elevated/60 p-6 text-ink'
          : 'rounded-xl border border-dashed border-line-bright bg-bg-elevated/60 p-6 text-muted'
      }
      role={error ? 'alert' : undefined}
    >
      {children}
    </div>
  );
}

function CardGrid({ features }: { features: BaselineFeature[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </ul>
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

  return <CardGrid features={features} />;
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
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.year}>
          <h2 className="mb-4 flex items-baseline gap-3">
            <span className="font-display text-[2rem] leading-none tracking-[-0.01em] text-ink italic">
              {group.year}
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            <span className="font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase">
              {group.features.length}{' '}
              {group.features.length === 1 ? 'feature' : 'features'}
            </span>
          </h2>
          <CardGrid features={group.features} />
        </section>
      ))}
    </div>
  );
}
