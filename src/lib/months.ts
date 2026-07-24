export const MONTH_SLUGS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export type MonthSlug = (typeof MONTH_SLUGS)[number];

const SLUG_SET = new Set<string>(MONTH_SLUGS);

export function isMonthSlug(value: string): value is MonthSlug {
  return SLUG_SET.has(value);
}

/** 1–12 for a valid month slug */
export function monthNumber(slug: MonthSlug): number {
  return MONTH_SLUGS.indexOf(slug) + 1;
}

export function monthLabel(slug: MonthSlug): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function currentMonthSlug(now = new Date()): MonthSlug {
  return MONTH_SLUGS[now.getUTCMonth()]!;
}

export function adjacentMonth(
  slug: MonthSlug,
  delta: -1 | 1,
): MonthSlug {
  const index = MONTH_SLUGS.indexOf(slug);
  return MONTH_SLUGS[(index + delta + 12) % 12]!;
}

/** Next calendar month in UTC (year + 1–12 month number + slug). */
export function nextUtcMonth(now = new Date()): {
  year: number;
  month: number;
  slug: MonthSlug;
} {
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    slug: MONTH_SLUGS[next.getUTCMonth()]!,
  };
}
