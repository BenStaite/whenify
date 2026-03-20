export type UnitStyle = "long" | "short" | "narrow";

export interface RelativeDateFormat {
  /** Template for past dates. `{}` is replaced with the formatted value. Default: `"{} ago"` */
  past?: string;
  /** Template for future dates. `{}` is replaced with the formatted value. Default: `"in {}"` */
  future?: string;
}

export interface RelativeDateOptions {
  /** The reference date to compare against. Defaults to `new Date()`. */
  now?: Date | number;
  /**
   * Verbosity of unit labels.
   * - `"long"` (default): "minute", "hour", "day", "month", "year"
   * - `"short"`: "min", "hr", "day", "mo", "yr"
   * - `"narrow"`: "m", "h", "d", "mo", "y" (no space, numeric only)
   */
  units?: UnitStyle;
  /**
   * Templates controlling how past and future values are wrapped.
   * Use `{}` as the placeholder for the formatted value.
   *
   * @example
   * // defaults
   * { past: "{} ago", future: "in {}" }
   * // suffix style
   * { future: "{} away" }
   * // custom
   * { past: "{} in the past", future: "{} from now" }
   */
  format?: RelativeDateFormat;
}

type UnitKey = "minute" | "hour" | "day" | "month" | "year";

// [singular, plural] — narrow uses only singular (always numeric, no space)
const UNIT_LABELS: Record<UnitStyle, Record<UnitKey, [string, string]>> = {
  long: {
    minute: ["minute", "minutes"],
    hour: ["hour", "hours"],
    day: ["day", "days"],
    month: ["month", "months"],
    year: ["year", "years"],
  },
  short: {
    minute: ["min", "mins"],
    hour: ["hr", "hrs"],
    day: ["day", "days"],
    month: ["mo", "mos"],
    year: ["yr", "yrs"],
  },
  narrow: {
    minute: ["m", "m"],
    hour: ["h", "h"],
    day: ["d", "d"],
    month: ["mo", "mo"],
    year: ["y", "y"],
  },
};

function unitLabel(n: number, key: UnitKey, style: UnitStyle): string {
  const [sing, plur] = UNIT_LABELS[style][key];
  if (style === "narrow") return `${n}${sing}`;
  return `${n} ${n === 1 ? sing : plur}`;
}

function articleUnit(key: UnitKey, style: UnitStyle): string {
  if (style !== "long") return unitLabel(1, key, style);
  const article = key === "hour" ? "an" : "a";
  return `${article} ${UNIT_LABELS.long[key][0]}`;
}

/**
 * Converts a date into a human-readable relative string such as
 * "just now", "3 minutes ago", "tomorrow", "in 2 hours", or "4 days away".
 *
 * @param date - The date to describe. Accepts a Date, Unix timestamp (ms), or ISO string.
 * @param options - Optional configuration.
 * @returns A human-readable relative date string.
 */
export function relativeDate(
  date: Date | number | string,
  options: RelativeDateOptions = {},
): string {
  const now = options.now != null ? new Date(options.now) : new Date();
  const then = new Date(date as string | number | Date);

  if (isNaN(then.getTime())) {
    throw new RangeError(`Invalid date: ${date}`);
  }

  const diffMs = then.getTime() - now.getTime();
  const isFuture = diffMs > 0;
  const absMs = Math.abs(diffMs);

  const seconds = absMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30.44;
  const years = days / 365.25;

  const style = options.units ?? "long";
  const pastTpl = options.format?.past ?? "{} ago";
  const futureTpl = options.format?.future ?? "in {}";
  const fmt = (s: string) => (isFuture ? futureTpl : pastTpl).replace("{}", s);

  // < 30 seconds either way
  if (seconds < 30) return "just now";

  // < 90 seconds → "a minute" / "1 min" / "1m"
  if (seconds < 90) return fmt(articleUnit("minute", style));

  // < 45 minutes → "X minutes" / "X mins" / "Xm"
  if (minutes < 45) return fmt(unitLabel(Math.round(minutes), "minute", style));

  // < 90 minutes → "an hour" / "1 hr" / "1h"
  if (minutes < 90) return fmt(articleUnit("hour", style));

  // < 22 hours → "X hours" / "X hrs" / "Xh"
  if (hours < 22) return fmt(unitLabel(Math.round(hours), "hour", style));

  // < 36 hours → "yesterday" / "tomorrow"
  if (hours < 36) return isFuture ? "tomorrow" : "yesterday";

  // < 26 days → "X days" / "Xd"
  if (days < 26) return fmt(unitLabel(Math.round(days), "day", style));

  // < 46 days → "a month" / "1 mo" / "1mo"
  if (days < 46) return fmt(articleUnit("month", style));

  // < 11 months → "X months" / "X mos" / "Xmo"
  if (days < 330) return fmt(unitLabel(Math.round(months), "month", style));

  // < 17 months → "a year" / "1 yr" / "1y"
  if (days < 517) return fmt(articleUnit("year", style));

  // 17+ months → "X years" / "X yrs" / "Xy"
  return fmt(unitLabel(Math.round(years), "year", style));
}
