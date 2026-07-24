import {
  monthNumber,
  type MonthSlug,
} from './months';

export const WEB_FEATURES_URL =
  'https://cdn.jsdelivr.net/npm/web-features@latest/data.json';
export const MDN_DOCS_URL =
  'https://raw.githubusercontent.com/web-platform-dx/web-features-mappings/main/mappings/mdn-docs.json';

const CACHE_TTL_MS = 60 * 60 * 1000;

export type MdnDoc = {
  title: string;
  url: string;
};

export type BaselineFeature = {
  id: string;
  name: string;
  description?: string | undefined;
  lowDate: string;
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

type FeatureStatus = {
  baseline?: false | 'low' | 'high';
  baseline_low_date?: string;
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

type CacheEntry<T> = { expires: number; value: T };

const cache = new Map<string, CacheEntry<unknown>>();

async function cachedFetchJson<T>(
  key: string,
  url: string,
): Promise<T> {
  const hit = cache.get(key) as CacheEntry<T> | undefined;
  if (hit && hit.expires > Date.now()) {
    return hit.value;
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${key}: ${response.status}`);
  }
  const value = (await response.json()) as T;
  cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
  return value;
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

export async function getNewlyAvailableForMonth(
  slug: MonthSlug,
): Promise<MonthBaselineResult> {
  const targetMonth = String(monthNumber(slug)).padStart(2, '0');

  try {
    const [data, mdnDocs] = await Promise.all([
      cachedFetchJson<WebFeaturesData>('web-features', WEB_FEATURES_URL),
      cachedFetchJson<MdnDocsMap>('mdn-docs', MDN_DOCS_URL).catch(
        () => ({}) as MdnDocsMap,
      ),
    ]);

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
      if (!featureGroups(feature).some((g) => isJsGroup(g, data.groups))) {
        continue;
      }

      features.push({
        id,
        name: feature.name ?? id,
        description: feature.description,
        lowDate,
        year: Number(lowDate.slice(0, 4)),
        mdn: normalizeMdn(mdnDocs[id]),
      });
    }

    features.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return a.lowDate.localeCompare(b.lowDate) || a.name.localeCompare(b.name);
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
