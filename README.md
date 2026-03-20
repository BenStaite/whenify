# whenify

Convert a `Date` into a human-readable relative string with no dependencies.

```
"just now"    "3 minutes ago"    "in 2 hours"    "yesterday"    "tomorrow"
"4 days ago"  "in 2 weeks"       "a month ago"   "3 years ago"
```

## Installation

```sh
npm install whenify
```

## Usage

```ts
import { relativeDate } from "whenify";

relativeDate(new Date(Date.now() - 5 * 60 * 1000)); // "5 minutes ago"
relativeDate(new Date(Date.now() + 2 * 60 * 60 * 1000)); // "in 2 hours"
relativeDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); // "tomorrow"
relativeDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)); // "4 days ago"
```

## API

### `relativeDate(date, options?)`

| Parameter        | Type                                 | Description                                                                                               |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `date`           | `Date \| number \| string`           | The date to describe. Accepts a `Date` object, a Unix timestamp (ms), or an ISO string.                   |
| `options.now`    | `Date \| number`                     | Reference date to compare against. Defaults to `new Date()`. Useful for testing.                          |
| `options.units`  | `"long" \| "short" \| "narrow"`      | Verbosity of unit labels. `"long"` (default): `"2 hours"`. `"short"`: `"2 hrs"`. `"narrow"`: `"2h"`.      |
| `options.format` | `{ past?: string; future?: string }` | Templates for wrapping the value. Use `{}` as placeholder. Defaults: `past: "{} ago"`, `future: "in {}"`. |

### Thresholds

| Range        | Output example                     |
| ------------ | ---------------------------------- |
| < 30 seconds | `"just now"`                       |
| < 90 seconds | `"a minute ago"` / `"in a minute"` |
| < 45 minutes | `"5 minutes ago"`                  |
| < 90 minutes | `"an hour ago"`                    |
| < 22 hours   | `"3 hours ago"`                    |
| < 36 hours   | `"yesterday"` / `"tomorrow"`       |
| < 26 days    | `"4 days ago"`                     |
| < 46 days    | `"a month ago"`                    |
| < 11 months  | `"3 months ago"`                   |
| < 17 months  | `"a year ago"`                     |
| 17+ months   | `"2 years ago"`                    |

### `format` and `units` examples

```ts
// suffix-style future (equivalent to the old future: "suffix")
relativeDate(new Date(Date.now() + 2 * 60 * 60 * 1000), {
  format: { future: "{} away" },
});
// "2 hours away"

relativeDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), {
  format: { future: "{} away" },
});
// "4 days away"

// custom past and future templates
relativeDate(new Date(Date.now() - 2 * 60 * 60 * 1000), {
  format: { past: "{} in the past", future: "{} from now" },
});
// "2 hours in the past"

// short unit labels
relativeDate(new Date(Date.now() - 2 * 60 * 60 * 1000), { units: "short" });
// "2 hrs ago"

// narrow unit labels
relativeDate(new Date(Date.now() - 2 * 60 * 60 * 1000), { units: "narrow" });
// "2h ago"

// combining units and format
relativeDate(new Date(Date.now() + 2 * 60 * 60 * 1000), {
  units: "narrow",
  format: { future: "{} away" },
});
// "2h away"
```

## License

MIT
