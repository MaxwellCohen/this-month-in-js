import { cacheLife, cacheTag } from 'next/cache';

import {
  monthNumber,
  nextUtcMonth,
  type MonthSlug,
} from './months';

export const WEB_FEATURES_URL =
  'https://cdn.jsdelivr.net/npm/web-features@latest/data.json';
export const MDN_DOCS_URL =
  'https://raw.githubusercontent.com/web-platform-dx/web-features-mappings/main/mappings/mdn-docs.json';

/** Baseline newly available → widely available after 30 months */
const WIDELY_AVAILABLE_AFTER_MONTHS = 30;

/** Weekly ISR-style lifetime (matches prior CDN s-maxage) */
export const BASELINE_CACHE_LIFE = {
  stale: 604800,
  revalidate: 604800,
  expire: 1_209_600,
} as const;

export type MdnDoc = {
  title: string;
  url: string;
};

export type BaselineFeature = {
  id: string;
  name: string;
  description?: string | undefined;
  /** ISO date used for sort (low or high, depending on context) */
  date: string;
  /** Baseline newly available (`baseline_low_date`) */
  newlyAvailableDate: string;
  /** Baseline widely available (`baseline_high_date`), or projected */
  widelyAvailableDate?: string | undefined;
  year: number;
  mdn: MdnDoc[];
};

export type YearGroup = {
  year: number;
  features: BaselineFeature[];
};

export type MonthBaselineResult = {
  groups: YearGroup[];
  error?: string;
};

export type WidelyAvailableResult = {
  graduatingNextMonth: BaselineFeature[];
  widelyAvailable: BaselineFeature[];
  nextMonthLabel: string;
  error?: string;
};

type FeatureStatus = {
  baseline?: false | 'low' | 'high';
  baseline_low_date?: string;
  baseline_high_date?: string;
};

type WebFeature = {
  kind?: string;
  name?: string;
  description?: string;
  group?: string | string[];
  status?: FeatureStatus;
};

type WebFeaturesData = {
  features: Record<string, WebFeature>;
  groups: Record<string, { name?: string; parent?: string }>;
};

type MdnDocsMap = Record<
  string,
  Array<{ title?: string; url?: string; slug?: string }>
>;

async function fetchJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    // web-features data.json is >2MB; Next fetch Data Cache rejects it.
    // Lifetime comes from the surrounding `use cache` / cacheLife instead.
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${label}: ${response.status}`);
  }
  return (await response.json()) as T;
}

async function loadSources(): Promise<{
  data: WebFeaturesData;
  mdnDocs: MdnDocsMap;
}> {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('web-features');

  const [data, mdnDocs] = await Promise.all([
    fetchJson<WebFeaturesData>(WEB_FEATURES_URL, 'web-features'),
    fetchJson<MdnDocsMap>(MDN_DOCS_URL, 'mdn-docs').catch(
      () => ({}) as MdnDocsMap,
    ),
  ]);
  return { data, mdnDocs };
}

function isJsGroup(
  groupId: string,
  groups: WebFeaturesData['groups'],
  seen = new Set<string>(),
): boolean {
  if (groupId === 'javascript') {
    return true;
  }
  if (seen.has(groupId)) {
    return false;
  }
  seen.add(groupId);
  const parent = groups[groupId]?.parent;
  return parent ? isJsGroup(parent, groups, seen) : false;
}

function featureGroups(feature: WebFeature): string[] {
  if (!feature.group) {
    return [];
  }
  return Array.isArray(feature.group) ? feature.group : [feature.group];
}

function isJsFeature(
  feature: WebFeature,
  groups: WebFeaturesData['groups'],
): boolean {
  return featureGroups(feature).some((g) => isJsGroup(g, groups));
}

function normalizeMdn(
  docs: MdnDocsMap[string] | undefined,
): MdnDoc[] {
  if (!docs?.length) {
    return [];
  }
  return docs
    .filter((doc): doc is { title: string; url: string } =>
      Boolean(doc.url && doc.title),
    )
    .map((doc) => ({
      title: doc.title,
      url: doc.url.startsWith('http')
        ? doc.url
        : `https://developer.mozilla.org/${doc.url.replace(/^\//, '')}`,
    }));
}

function monthKey(date: string): string {
  // YYYY-MM-DD or YYYY-MM
  return date.slice(5, 7);
}

function yearMonthKey(date: string): string {
  return date.slice(0, 7);
}

/** Add calendar months in UTC, clamping the day to the target month length. */
export function addUtcMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) {
    return isoDate;
  }
  const targetMonthIndex = m - 1 + months;
  const lastDay = new Date(
    Date.UTC(y, targetMonthIndex + 1, 0),
  ).getUTCDate();
  const day = Math.min(d, lastDay);
  const result = new Date(Date.UTC(y, targetMonthIndex, day));
  const yy = result.getUTCFullYear();
  const mm = String(result.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(result.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function toFeature(
  id: string,
  feature: WebFeature,
  mdnDocs: MdnDocsMap,
  dates: {
    date: string;
    newlyAvailableDate: string;
    widelyAvailableDate?: string;
  },
): BaselineFeature {
  return {
    id,
    name: feature.name ?? id,
    description: feature.description,
    date: dates.date,
    newlyAvailableDate: dates.newlyAvailableDate,
    widelyAvailableDate: dates.widelyAvailableDate,
    year: Number(dates.date.slice(0, 4)),
    mdn: normalizeMdn(mdnDocs[id]),
  };
}

function sortByDateDesc(features: BaselineFeature[]): BaselineFeature[] {
  return [...features].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || a.name.localeCompare(b.name),
  );
}

export async function getNewlyAvailableForMonth(
  slug: MonthSlug,
): Promise<MonthBaselineResult> {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('baseline', `month-${slug}`);

  const targetMonth = String(monthNumber(slug)).padStart(2, '0');

  try {
    const { data, mdnDocs } = await loadSources();
    const features: BaselineFeature[] = [];

    for (const [id, feature] of Object.entries(data.features)) {
      if (feature.kind && feature.kind !== 'feature') {
        continue;
      }
      const lowDate = feature.status?.baseline_low_date;
      const baseline = feature.status?.baseline;
      if (!lowDate || (baseline !== 'low' && baseline !== 'high')) {
        continue;
      }
      if (monthKey(lowDate) !== targetMonth) {
        continue;
      }
      if (!isJsFeature(feature, data.groups)) {
        continue;
      }

      const highDate = feature.status?.baseline_high_date;
      features.push(
        toFeature(id, feature, mdnDocs, {
          date: lowDate,
          newlyAvailableDate: lowDate,
          ...(highDate ? { widelyAvailableDate: highDate } : {}),
        }),
      );
    }

    features.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return a.date.localeCompare(b.date) || a.name.localeCompare(b.name);
    });

    const byYear = new Map<number, BaselineFeature[]>();
    for (const feature of features) {
      const list = byYear.get(feature.year);
      if (list) {
        list.push(feature);
      } else {
        byYear.set(feature.year, [feature]);
      }
    }

    const groups: YearGroup[] = [...byYear.entries()]
      .sort(([a], [b]) => b - a)
      .map(([year, yearFeatures]) => ({ year, features: yearFeatures }));

    return { groups };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown data error';
    return { groups: [], error: message };
  }
}

export async function getWidelyAvailable(): Promise<WidelyAvailableResult> {
  'use cache';
  cacheLife(BASELINE_CACHE_LIFE);
  cacheTag('baseline', 'widely');

  const now = new Date();
  const next = nextUtcMonth(now);
  const nextMonthLabel =
    next.slug.charAt(0).toUpperCase() + next.slug.slice(1);
  const nextYearMonth = `${next.year}-${String(next.month).padStart(2, '0')}`;

  try {
    const { data, mdnDocs } = await loadSources();
    const graduatingNextMonth: BaselineFeature[] = [];
    const widelyAvailable: BaselineFeature[] = [];

    for (const [id, feature] of Object.entries(data.features)) {
      if (feature.kind && feature.kind !== 'feature') {
        continue;
      }
      if (!isJsFeature(feature, data.groups)) {
        continue;
      }

      const baseline = feature.status?.baseline;
      const lowDate = feature.status?.baseline_low_date;
      const highDate = feature.status?.baseline_high_date;

      if (baseline === 'high' && highDate) {
        widelyAvailable.push(
          toFeature(id, feature, mdnDocs, {
            date: highDate,
            newlyAvailableDate: lowDate ?? highDate,
            widelyAvailableDate: highDate,
          }),
        );
      }

      if (baseline === 'low' && lowDate) {
        const projectedHigh = addUtcMonths(
          lowDate,
          WIDELY_AVAILABLE_AFTER_MONTHS,
        );
        if (yearMonthKey(projectedHigh) === nextYearMonth) {
          graduatingNextMonth.push(
            toFeature(id, feature, mdnDocs, {
              date: projectedHigh,
              newlyAvailableDate: lowDate,
              widelyAvailableDate: projectedHigh,
            }),
          );
        }
      }
    }

    return {
      graduatingNextMonth: sortByDateDesc(graduatingNextMonth),
      widelyAvailable: sortByDateDesc(widelyAvailable),
      nextMonthLabel,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown data error';
    return {
      graduatingNextMonth: [],
      widelyAvailable: [],
      nextMonthLabel,
      error: message,
    };
  }
}
