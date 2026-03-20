export interface RelativeDateOptions {
  /**
   * The reference date to compare against. Defaults to `new Date()`.
   */
  now?: Date | number;

  /**
   * How to express future dates.
   * - `"prefix"` (default): "in 2 hours", "in 3 days"
   * - `"suffix"`: "2 hours away", "3 days away"
   */
  future?: "prefix" | "suffix";
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
  options: RelativeDateOptions = {}
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

  const past = (s: string) => `${s} ago`;
  const future = (s: string) =>
    options.future === "suffix" ? `${s} away` : `in ${s}`;
  const format = (s: string) => (isFuture ? future(s) : past(s));

  // < 30 seconds either way
  if (seconds < 30) return "just now";

  // < 90 seconds → "a minute"
  if (seconds < 90) return format("a minute");

  // < 45 minutes → "X minutes"
  if (minutes < 45) {
    const n = Math.round(minutes);
    return format(`${n} ${n === 1 ? "minute" : "minutes"}`);
  }

  // < 90 minutes → "an hour"
  if (minutes < 90) return format("an hour");

  // < 22 hours → "X hours"
  if (hours < 22) {
    const n = Math.round(hours);
    return format(`${n} ${n === 1 ? "hour" : "hours"}`);
  }

  // < 36 hours → "yesterday" / "tomorrow"
  if (hours < 36) return isFuture ? "tomorrow" : "yesterday";

  // < 26 days → "X days"
  if (days < 26) {
    const n = Math.round(days);
    return format(`${n} ${n === 1 ? "day" : "days"}`);
  }

  // < 46 days → "a month"
  if (days < 46) return format("a month");

  // < 11 months → "X months"
  if (days < 330) {
    const n = Math.round(months);
    return format(`${n} ${n === 1 ? "month" : "months"}`);
  }

  // < 17 months → "a year"
  if (days < 517) return format("a year");

  // 17+ months → "X years"
  const n = Math.round(years);
  return format(`${n} ${n === 1 ? "year" : "years"}`);
}
