# relative-dates

Convert a `Date` into a human-readable relative string with no dependencies.

```
"just now"    "3 minutes ago"    "in 2 hours"    "yesterday"    "tomorrow"
"4 days ago"  "in 2 weeks"       "a month ago"   "3 years ago"
```

## Installation

```sh
npm install relative-dates
```

## Usage

```ts
import { relativeDate } from "relative-dates";

relativeDate(new Date(Date.now() - 5 * 60 * 1000));  // "5 minutes ago"
relativeDate(new Date(Date.now() + 2 * 60 * 60 * 1000));  // "in 2 hours"
relativeDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // "tomorrow"
relativeDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)); // "4 days ago"
```

## API

### `relativeDate(date, options?)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | `Date \| number \| string` | The date to describe. Accepts a `Date` object, a Unix timestamp (ms), or an ISO string. |
| `options.now` | `Date \| number` | Reference date to compare against. Defaults to `new Date()`. Useful for testing. |
| `options.future` | `"prefix" \| "suffix"` | How to express future dates. `"prefix"` (default): `"in 2 hours"`. `"suffix"`: `"2 hours away"`. |

### Thresholds

| Range | Output example |
|-------|---------------|
| < 30 seconds | `"just now"` |
| < 90 seconds | `"a minute ago"` / `"in a minute"` |
| < 45 minutes | `"5 minutes ago"` |
| < 90 minutes | `"an hour ago"` |
| < 22 hours | `"3 hours ago"` |
| < 36 hours | `"yesterday"` / `"tomorrow"` |
| < 26 days | `"4 days ago"` |
| < 46 days | `"a month ago"` |
| < 11 months | `"3 months ago"` |
| < 17 months | `"a year ago"` |
| 17+ months | `"2 years ago"` |

### `future: "suffix"` example

```ts
relativeDate(new Date(Date.now() + 2 * 60 * 60 * 1000), { future: "suffix" });
// "2 hours away"

relativeDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), { future: "suffix" });
// "4 days away"
```

## License

MIT
