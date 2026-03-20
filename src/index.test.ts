import { relativeDate } from "./index";

// Fixed reference point: March 20, 2026 12:00:00 UTC
const NOW = new Date("2026-03-20T12:00:00.000Z");
const sec = (n: number) => new Date(NOW.getTime() + n * 1000);
const min = (n: number) => sec(n * 60);
const hr = (n: number) => min(n * 60);
const day = (n: number) => hr(n * 24);
const mo = (n: number) => day(n * 30.44);
const yr = (n: number) => day(n * 365.25);

describe("relativeDate — just now", () => {
  test("same instant", () => {
    expect(relativeDate(NOW, { now: NOW })).toBe("just now");
  });
  test("10 seconds ago", () => {
    expect(relativeDate(sec(-10), { now: NOW })).toBe("just now");
  });
  test("10 seconds away", () => {
    expect(relativeDate(sec(10), { now: NOW })).toBe("just now");
  });
});

describe("relativeDate — minutes (past)", () => {
  test("a minute ago (60s)", () => {
    expect(relativeDate(sec(-60), { now: NOW })).toBe("a minute ago");
  });
  test("3 minutes ago", () => {
    expect(relativeDate(min(-3), { now: NOW })).toBe("3 minutes ago");
  });
  test("44 minutes ago", () => {
    expect(relativeDate(min(-44), { now: NOW })).toBe("44 minutes ago");
  });
});

describe("relativeDate — minutes (future)", () => {
  test("in a minute (60s)", () => {
    expect(relativeDate(sec(60), { now: NOW })).toBe("in a minute");
  });
  test("in 5 minutes", () => {
    expect(relativeDate(min(5), { now: NOW })).toBe("in 5 minutes");
  });
  test("a minute away (custom future template)", () => {
    expect(
      relativeDate(sec(60), { now: NOW, format: { future: "{} away" } }),
    ).toBe("a minute away");
  });
  test("5 minutes away (custom future template)", () => {
    expect(
      relativeDate(min(5), { now: NOW, format: { future: "{} away" } }),
    ).toBe("5 minutes away");
  });
});

describe("relativeDate — hours", () => {
  test("an hour ago", () => {
    expect(relativeDate(hr(-1), { now: NOW })).toBe("an hour ago");
  });
  test("2 hours ago", () => {
    expect(relativeDate(hr(-2), { now: NOW })).toBe("2 hours ago");
  });
  test("in 2 hours", () => {
    expect(relativeDate(hr(2), { now: NOW })).toBe("in 2 hours");
  });
  test("2 hours away (custom future template)", () => {
    expect(
      relativeDate(hr(2), { now: NOW, format: { future: "{} away" } }),
    ).toBe("2 hours away");
  });
  test("21 hours ago", () => {
    expect(relativeDate(hr(-21), { now: NOW })).toBe("21 hours ago");
  });
});

describe("relativeDate — yesterday / tomorrow", () => {
  test("yesterday (25h ago)", () => {
    expect(relativeDate(hr(-25), { now: NOW })).toBe("yesterday");
  });
  test("tomorrow (25h away)", () => {
    expect(relativeDate(hr(25), { now: NOW })).toBe("tomorrow");
  });
  test("tomorrow is unaffected by format option", () => {
    expect(
      relativeDate(hr(25), { now: NOW, format: { future: "{} away" } }),
    ).toBe("tomorrow");
  });
});

describe("relativeDate — days", () => {
  test("4 days ago", () => {
    expect(relativeDate(day(-4), { now: NOW })).toBe("4 days ago");
  });
  test("in 4 days", () => {
    expect(relativeDate(day(4), { now: NOW })).toBe("in 4 days");
  });
  test("4 days away (custom future template)", () => {
    expect(
      relativeDate(day(4), { now: NOW, format: { future: "{} away" } }),
    ).toBe("4 days away");
  });
  test("25 days ago", () => {
    expect(relativeDate(day(-25), { now: NOW })).toBe("25 days ago");
  });
});

describe("relativeDate — months", () => {
  test("a month ago", () => {
    expect(relativeDate(day(-40), { now: NOW })).toBe("a month ago");
  });
  test("in a month", () => {
    expect(relativeDate(day(40), { now: NOW })).toBe("in a month");
  });
  test("3 months ago", () => {
    expect(relativeDate(mo(-3), { now: NOW })).toBe("3 months ago");
  });
  test("in 6 months", () => {
    expect(relativeDate(mo(6), { now: NOW })).toBe("in 6 months");
  });
});

describe("relativeDate — years", () => {
  test("a year ago", () => {
    expect(relativeDate(yr(-1), { now: NOW })).toBe("a year ago");
  });
  test("in a year", () => {
    expect(relativeDate(yr(1), { now: NOW })).toBe("in a year");
  });
  test("3 years ago", () => {
    expect(relativeDate(yr(-3), { now: NOW })).toBe("3 years ago");
  });
  test("3 years away (custom future template)", () => {
    expect(
      relativeDate(yr(3), { now: NOW, format: { future: "{} away" } }),
    ).toBe("3 years away");
  });
});

describe("relativeDate — units: short", () => {
  test("1 min ago", () => {
    expect(relativeDate(sec(-60), { now: NOW, units: "short" })).toBe(
      "1 min ago",
    );
  });
  test("5 mins ago", () => {
    expect(relativeDate(min(-5), { now: NOW, units: "short" })).toBe(
      "5 mins ago",
    );
  });
  test("1 hr ago", () => {
    expect(relativeDate(hr(-1), { now: NOW, units: "short" })).toBe("1 hr ago");
  });
  test("in 2 hrs", () => {
    expect(relativeDate(hr(2), { now: NOW, units: "short" })).toBe("in 2 hrs");
  });
  test("4 days ago (short = same as long)", () => {
    expect(relativeDate(day(-4), { now: NOW, units: "short" })).toBe(
      "4 days ago",
    );
  });
  test("1 mo ago", () => {
    expect(relativeDate(day(-40), { now: NOW, units: "short" })).toBe(
      "1 mo ago",
    );
  });
  test("3 mos ago", () => {
    expect(relativeDate(mo(-3), { now: NOW, units: "short" })).toBe(
      "3 mos ago",
    );
  });
  test("1 yr ago", () => {
    expect(relativeDate(yr(-1), { now: NOW, units: "short" })).toBe("1 yr ago");
  });
  test("in 3 yrs", () => {
    expect(relativeDate(yr(3), { now: NOW, units: "short" })).toBe("in 3 yrs");
  });
});

describe("relativeDate — units: narrow", () => {
  test("1m ago", () => {
    expect(relativeDate(sec(-60), { now: NOW, units: "narrow" })).toBe(
      "1m ago",
    );
  });
  test("5m ago", () => {
    expect(relativeDate(min(-5), { now: NOW, units: "narrow" })).toBe("5m ago");
  });
  test("1h ago", () => {
    expect(relativeDate(hr(-1), { now: NOW, units: "narrow" })).toBe("1h ago");
  });
  test("in 2h", () => {
    expect(relativeDate(hr(2), { now: NOW, units: "narrow" })).toBe("in 2h");
  });
  test("4d ago", () => {
    expect(relativeDate(day(-4), { now: NOW, units: "narrow" })).toBe("4d ago");
  });
  test("1mo ago", () => {
    expect(relativeDate(day(-40), { now: NOW, units: "narrow" })).toBe(
      "1mo ago",
    );
  });
  test("3mo ago", () => {
    expect(relativeDate(mo(-3), { now: NOW, units: "narrow" })).toBe("3mo ago");
  });
  test("1y ago", () => {
    expect(relativeDate(yr(-1), { now: NOW, units: "narrow" })).toBe("1y ago");
  });
  test("in 3y", () => {
    expect(relativeDate(yr(3), { now: NOW, units: "narrow" })).toBe("in 3y");
  });
  test("narrow + suffix template", () => {
    expect(
      relativeDate(hr(2), {
        now: NOW,
        units: "narrow",
        format: { future: "{} away" },
      }),
    ).toBe("2h away");
  });
});

describe("relativeDate — format.past customization", () => {
  test("custom past template", () => {
    expect(
      relativeDate(hr(-2), { now: NOW, format: { past: "{} in the past" } }),
    ).toBe("2 hours in the past");
  });
  test("both templates custom", () => {
    expect(
      relativeDate(hr(2), {
        now: NOW,
        format: { past: "{} back", future: "{} from now" },
      }),
    ).toBe("2 hours from now");
  });
});

describe("relativeDate — input types", () => {
  test("accepts a Unix timestamp (ms)", () => {
    expect(relativeDate(hr(-2).getTime(), { now: NOW })).toBe("2 hours ago");
  });
  test("accepts an ISO string", () => {
    expect(relativeDate(hr(-2).toISOString(), { now: NOW })).toBe(
      "2 hours ago",
    );
  });
  test("accepts a Date object", () => {
    expect(relativeDate(hr(-2), { now: NOW })).toBe("2 hours ago");
  });
  test("throws on an invalid date", () => {
    expect(() => relativeDate("not-a-date", { now: NOW })).toThrow(RangeError);
  });
});
