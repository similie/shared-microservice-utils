/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
/** @summary Test rig components */
import { DateTime } from "luxon";

/** @summary Header files */
import * as TimeUtils from "./utils";
import { IsThis } from "../general/is-this";
import { TimeObject } from "../constants";

describe("Time-Utils.js", function () {
  /**
   * @summary This section of tests verifies the current set of functions in Time.js
   * Subsequent sections will test newer or refactored versions of these functions
   * and their equivalent implementations in Luxon.js
   */

  it("timeCategoryInDays returns the number of days in the category specified", function () {
    const candidates: string[] = ["day", "week", "month", "year"];
    const expectedResults: number[] = [1, 7, 30, 365];

    let result = 0;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as string;
      const expectedResult = expectedResults[i] as number;

      result = TimeUtils.timeCategoryInDays(candidate);

      expect(result).toEqual(expectedResult);
    }
  });

  it("keyNameForDayOfWeek returns the correct keyname for the specified day of the week", function () {
    // From StationTelemetry
    const dayKeys = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dt = TimeUtils.date("");
    const dayIndex = dt.dayOfWeek;
    const expectedResult = dayKeys[dayIndex];
    const result = TimeUtils.keyNameForDayOfWeek(dayIndex);

    expect(result).toEqual(expectedResult);
  });

  it("keyNameForDayOfWeek throws an error for an out of bounds day of the week", function () {
    expect(() => TimeUtils.keyNameForDayOfWeek(10)).toThrow();
  });

  it("isoFormattedDate accepts a date formatted string and returns a date string in ISO format minus milliseconds", function () {
    const candidates: string[] = [
      "2017-04-20T11:32:00.123-04:00", // ISO format
      "2017-04-20 11:32:00.123 +05:00", // SQL format
      "July 4 2017 6:15:22 GMT+3", // JS readable format
    ];

    const expectedResults: string[] = [
      "2017-04-21T00:32:00+09:00",
      "2017-04-20T15:32:00+09:00",
      "2017-07-04T12:15:22+09:00",
    ];

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as string;
      const expectedResult = expectedResults[i] as string;

      result = TimeUtils.isoFormattedDate(candidate);
      expect(result).toEqual(expectedResult);
    }
  });

  it("isoFormattedDate accepts the empty string and returns the current date string in ISO format *minus milliseconds", function () {
    // the current UTC time in seconds.
    const expectedResult = Math.floor(new Date().valueOf() / 1000);

    const dt = TimeUtils.isoFormattedDate("");
    // note: .fromISO will fail if the input parameter is not in ISO format
    const result = Math.floor(DateTime.fromISO(dt).toMillis() / 1000);

    expect(result).toEqual(expectedResult);
  });

  it("isoFormattedDate returns the current date string in ISO format* when the input param is not a valid date string", function () {
    // the current UTC time in seconds.
    const expectedResult = Math.floor(new Date().valueOf() / 1000);

    const dt = TimeUtils.isoFormattedDate("this is not a date");
    // note: .fromISO will fail if the input parameter is not in ISO format
    const result = Math.floor(DateTime.fromISO(dt).toMillis() / 1000);

    expect(result).toEqual(expectedResult);
  });

  it("sqlFormattedDate accepts a date formatted string and returns a date string in SQL format", function () {
    const candidates: string[] = [
      "2017-04-20T11:32:00.123-04:00", // ISO format
      "2017-04-20 11:32:00.123 +05:00", // SQL format
      "July 4 2017 6:15:22 GMT+3", // JS readable format
    ];

    const expectedResults: string[] = [
      "2017-04-21 00:32:00.123 +09:00",
      "2017-04-20 15:32:00.123 +09:00",
      "2017-07-04 12:15:22.000 +09:00",
    ];

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as string;
      const expectedResult = expectedResults[i] as string;

      result = TimeUtils.sqlFormattedDate(candidate);
      expect(result).toEqual(expectedResult);
    }
  });

  it("sqlFormattedDate accepts the empty string and returns the current date string in SQL format", function () {
    // the current UTC time in seconds.
    const expectedResult = Math.floor(new Date().valueOf() / 1000);

    const dt = TimeUtils.sqlFormattedDate("");
    // note: .fromSQL will fail if the input parameter is not in SQL format
    const result = Math.floor(DateTime.fromSQL(dt).toMillis() / 1000);

    expect(result).toEqual(expectedResult);
  });

  it("sqlFormattedDate returns the current date string in SQL format when the input param is not a valid date string", function () {
    // the current UTC time in seconds.
    const expectedResult = Math.floor(new Date().valueOf() / 1000);

    const dt = TimeUtils.sqlFormattedDate("this is not a date");
    // note: .fromSQL will fail if the input parameter is not in SQL format
    const result = Math.floor(DateTime.fromSQL(dt).toMillis() / 1000);

    expect(result).toEqual(expectedResult);
  });

  it("reportFormattedDate produces a medium format date string with an input date string and time parameter of false ", function () {
    const dateString = "2020-10-20T16:20:30+09:00"; // in Dili timezone
    // Expected result: Oct 20, 2020

    const result = TimeUtils.reportFormattedDate(dateString, false);

    const dateParts = result.split(" ");
    expect(dateParts.length).toEqual(3);
    expect(dateParts[0]).toEqual("Oct");
    expect(dateParts[1]).toEqual("20,");
    expect(dateParts[2]).toEqual("2020");
  });

  it("reportFormattedDate produces a medium format date string with an input JS date and time parameter of false ", function () {
    const dateString = "2020-10-20T16:20:30+09:00"; // in Dili timezone
    const dt = new Date(dateString);
    // Expected result: Oct 20, 2020

    const result = TimeUtils.reportFormattedDate(dt, false);

    const dateParts = result.split(" ");
    expect(dateParts.length).toEqual(3);
    expect(dateParts[0]).toEqual("Oct");
    expect(dateParts[1]).toEqual("20,");
    expect(dateParts[2]).toEqual("2020");
  });

  it("reportFormattedDate produces a medium format date-time string with an input date string and time parameter of true ", function () {
    const dateString = "2020-10-20T16:20:30+09:00"; // in Dili timezone
    // Expected result: Oct 20, 2020 16:20

    const result = TimeUtils.reportFormattedDate(dateString, true);

    const dateParts = result.split(" ");
    expect(dateParts.length).toEqual(4);
    expect(dateParts[0]).toEqual("Oct");
    expect(dateParts[1]).toEqual("20,");
    expect(dateParts[2]).toEqual("2020");
    expect(dateParts[3]).toEqual("16:20");
  });

  it("reportFormattedDate produces a medium format date-time string with an input JS date and time parameter of true ", function () {
    const dateString = "2020-10-20T10:20:30+03:00"; // in UTC+3 timezone
    const dt = new Date(dateString);
    // Expected result: Oct 20, 2020 16:20          // in Dili timezone

    const result = TimeUtils.reportFormattedDate(dt, true);

    const dateParts = result.split(" ");
    expect(dateParts.length).toEqual(4);
    expect(dateParts[0]).toEqual("Oct");
    expect(dateParts[1]).toEqual("20,");
    expect(dateParts[2]).toEqual("2020");
    expect(dateParts[3]).toEqual("16:20");
  });

  it("reportFormattedDateArray returns an array of dates formatted as per the `reportFormattedDate` spec", function () {
    const candidateDates = [
      "2020-10-20T16:20:30+09:00",
      "2020-10-21T10:20:30",
      "2020-11-22",
    ];
    const formattedDates = ["Oct 20, 2020", "Oct 21, 2020", "Nov 22, 2020"];

    const result = TimeUtils.reportFormattedDateArray(candidateDates, false);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(candidateDates.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(formattedDates[i]);
    }
  });

  it("reportFormattedDateArray returns an array of date-times formatted as per the `reportFormattedDate` spec", function () {
    const candidateDates = [
      "2020-10-20T16:20:30+09:00",
      "2020-10-21T10:20:30+02:00",
      "2020-11-22 00:00:01.125 +02:00",
    ];
    const formattedDates = [
      "Oct 20, 2020 16:20",
      "Oct 21, 2020 17:20",
      "Nov 22, 2020 07:00",
    ];

    const result = TimeUtils.reportFormattedDateArray(candidateDates, true);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(candidateDates.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(formattedDates[i]);
    }
  });

  it("reportFormattedDateArray function returns 2 date-times and one orignal with 2 good and 1 invalid dates", function () {
    const candidateDates = [
      "2020-10-20T16:20:30+09:00",
      "2020-10-21T10:20:30+02:00",
      "rubbish",
    ];
    const formattedDates = [
      "Oct 20, 2020 16:20",
      "Oct 21, 2020 17:20",
      "rubbish",
    ];

    const result = TimeUtils.reportFormattedDateArray(candidateDates, true);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(candidateDates.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(formattedDates[i]);
    }
  });

  it("dateFormatter - returns a string that matches the corresponding shortcut format function", function () {
    const dateString = "2019-09-10T10:02:30.123+02:00";
    const fmt = TimeUtils.timeConstants.formats;

    let result = "";
    let expectedResult = "";

    // 1. Report Formatted Date, no time
    result = TimeUtils.formattedDate(dateString, fmt.Date.medium);
    expectedResult = TimeUtils.reportFormattedDate(dateString, false);
    expect(result).toEqual(expectedResult);

    // 2. Report Formatted Date, + time
    result = TimeUtils.formattedDate(dateString, fmt.DateTime.medium24Hr);
    expectedResult = TimeUtils.reportFormattedDate(dateString, true);
    expect(result).toEqual(expectedResult);

    // 3. ISO Formatted Date
    result = TimeUtils.formattedDate(dateString, fmt.ISO);
    expectedResult = TimeUtils.isoFormattedDate(dateString);
    expect(result).toEqual(expectedResult);

    // 4. SQL Formatted Date
    result = TimeUtils.formattedDate(dateString, fmt.SQL);
    expectedResult = TimeUtils.sqlFormattedDate(dateString);
    expect(result).toEqual(expectedResult);
  });

  it("timeFormatFromSeconds function returns a zero padded time formatted string in the form hh:mm:ss", function () {
    const candidates = [7254, 3963, 206, 4];
    const results = ["02:00:54", "01:06:03", "00:03:26", "00:00:04"];

    for (let index = 0; index < candidates.length; index++) {
      const candidate = candidates[index];
      const expectedResult = results[index];

      const result = TimeUtils.timeFormatFromSeconds(candidate!);

      expect(result).toEqual(expectedResult);
      expect(result).toEqual(expectedResult);
      expect(result).toEqual(expectedResult);

      expect(IsThis(result).aString).toBe(true);
    }
  });

  it("timeObjectFromSeconds function converts a time in seconds into a Type containing hours, mins & secs properties", function () {
    const candidates = [7254, 3963, 206, 4];
    const expectedResults: TimeObject[] = [
      { hours: 2, minutes: 0, seconds: 54 },
      { hours: 1, minutes: 6, seconds: 3 },
      { hours: 0, minutes: 3, seconds: 26 },
      { hours: 0, minutes: 0, seconds: 4 },
    ];

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const expectedResult = expectedResults[i] as TimeObject;

      const result = TimeUtils.timeObjectFromSeconds(candidate!);

      expect(typeof result).toEqual(typeof expectedResult);
      expect(result.hours).toEqual(expectedResult.hours);
      expect(result.minutes).toEqual(expectedResult.minutes);
      expect(result.seconds).toEqual(expectedResult.seconds);
    }
  });

  it("minutesFromSeconds function returns decimal 'm.ss' from the seconds specified with the asDecimal format argument", function () {
    // WARNING. 630 seconds is 10 and a half minutes (10.5 in base 10), this function returns 10.3
    const candidates = [30, 61, 128, 180, 600, 630, 651];
    const expectedResults = [
      "0.30",
      "1.01",
      "2.08",
      "3.00",
      "10.00",
      "10.30",
      "10.51",
    ];
    const format = TimeUtils.timeConstants.formats.Time.MinsSecs;

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      result = TimeUtils.minutesFromSeconds(candidate!, format.asDecimal);
      expect(result).toEqual(expectedResults[i]);
    }
  });

  it("minutesFromSeconds function returns time 'mm:ss' from the seconds specified with the asTime format argument", function () {
    const candidates = [30, 61, 128, 180, 600, 630, 651];
    const expectedResults = [
      "00:30",
      "01:01",
      "02:08",
      "03:00",
      "10:00",
      "10:30",
      "10:51",
    ];
    const format = TimeUtils.timeConstants.formats.Time.MinsSecs;

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as number;
      result = TimeUtils.minutesFromSeconds(candidate, format.asTime);
      expect(result).toEqual(expectedResults[i]);
    }
  });

  it("minutesFromSeconds function returns time 'mm:ss' from the seconds specified with an invalid format specifier", function () {
    const candidate = 651;
    const expectedResult = "10:51";

    const result = TimeUtils.minutesFromSeconds(candidate, "invalid format");
    expect(result).toEqual(expectedResult);
  });

  it("minutesFromSeconds function throws an error when the number of seconds specified isn't a number", function () {
    expect(() =>
      TimeUtils.minutesFromSeconds(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        "wtf",
        "TimeFormat.asDecimal",
      ),
    ).toThrow();
  });

  it("minutesFromMilliseconds function returns 'm.ss' from milliseconds when called with the asDecimal argument", function () {
    const candidates = [30000, 61000, 128000, 180000, 600000, 630000, 651000];
    const expectedResults = [
      "0.30",
      "1.01",
      "2.08",
      "3.00",
      "10.00",
      "10.30",
      "10.51",
    ];
    const format = TimeUtils.timeConstants.formats.Time.MinsSecs;

    let result: string | number;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as number;
      result = TimeUtils.minutesFromMilliseconds(candidate, format.asDecimal);

      expect(result).toEqual(expectedResults[i]);
    }
  });

  it("minutesFromMilliseconds function returns 'mm:ss' from milliseconds when called with the asTime argument", function () {
    const candidates = [30000, 61000, 128000, 180000, 600000, 630000, 651000];
    const expectedResults = [
      "00:30",
      "01:01",
      "02:08",
      "03:00",
      "10:00",
      "10:30",
      "10:51",
    ];
    const format = TimeUtils.timeConstants.formats.Time.MinsSecs;

    let result;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as number;
      result = TimeUtils.minutesFromMilliseconds(candidate, format.asTime);

      expect(result).toEqual(expectedResults[i]);
      expect(typeof result).toEqual("string");
    }
  });

  it("minutesFromMilliseconds function returns 'mm:ss' from the milliseconds specified with an invalid format specifier", function () {
    const candidate = 651000;
    const expectedResult = "10:51";

    const result = TimeUtils.minutesFromMilliseconds(
      candidate,
      "invalid format specifier",
    );
    expect(result).toEqual(expectedResult);
  });

  it("minutesFromMilliseconds function throws an error when the number of milliseconds specified isn't a number", function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => TimeUtils.minutesFromMilliseconds("bad", "format")).toThrow();
  });

  it("minutesToMilliseconds function converts a number of minutes into millseconds", function () {
    // Note. No evidence that this function is called from anywhere on the server-side
    const candidates = [1, 1.5, 5, 14, 20];
    const expectedResults = [60000, 90000, 300000, 840000, 1200000];

    let result = 0.0;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      result = TimeUtils.minutesToMilliseconds(candidate!);

      expect(result).toEqual(expectedResults[i]);
      expect(IsThis(result).aUseableNumber).toBe(true);
    }
  });

  it("monthOfDate function returns a 1-based index of the month for a given date.", function () {
    const candidates = [
      "2020-06-20T16:20:30+09:00",
      "2020-10-21T10:20:30+02:00",
      "2020-11-22 00:00:01.125 +02:00",
    ];
    const expectedResults = [6, 10, 11];

    let month = 0;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      month = TimeUtils.monthOfDate(candidate!);
      expect(month).toEqual(expectedResults[i]);
    }
  });

  it("monthOfDate function throws an error when passed an invalid date.", function () {
    expect(() => TimeUtils.monthOfDate("not a date")).toThrow();
  });

  it("TimeUtils.date(<date>) creates a new instance of a DateHelper class", function () {
    const instance = TimeUtils.date("2019-09-10T10:02:30.123+02:00");
    const className = "DateHelper";

    expect(instance.constructor.name).toEqual(className);
  });

  it("new TimeUtils.performanceTimer() creates a new instance of a PerformanceTimer class", function () {
    const instance = new TimeUtils.PerformanceTimer(3);
    const className = "PerformanceTimer";

    expect(instance.constructor.name).toEqual(className);
  });

  it("TimeUtils.months creates a new instance of the MonthLabelHelper class", () => {
    const instance = TimeUtils.months;
    const className = "MonthLabelHelper";

    expect(instance.constructor.name).toEqual(className);
  });

  it("TimeUtils.getDateDiffInHighestOrdinals finds the 2 highest non-zero date parts with EN labels", () => {
    let duration = TimeUtils.getTwoHighestNonZeroOrdinals(
      "2020-10-10 10:10:10",
      "2020-06-07 10:11:12",
    );
    expect(duration).toEqual("4 months 4 days");

    // [sg] Function is to spec, but not sure that this is the intended result?
    // I imagine that '4 months' would make more sense in this context.
    duration = TimeUtils.getTwoHighestNonZeroOrdinals(
      "2020-10-10 10:10:10",
      "2020-06-12 10:09:10",
    );
    expect(duration).toEqual("4 months 1 minute");
  });

  it("TimeUtils.date->difference->toObject can be used to manually find the required date parts", () => {
    const d = TimeUtils.date("2020-10-10 10:10:10").difference(
      "2020-06-07 10:11:12",
    ).toObject;

    const nouns = (count: number, value: string) =>
      count > 1 ? `${value}s` : value;

    const duration = [
      `${d.year ? `${d.year} ${nouns(d.year, "year")}` : ""}`,
      `${d.month ? `${d.month} ${nouns(d.month, "month")}` : ""}`,
      `${d.day ? `${d.day} ${nouns(d.day, "day")}` : ""}`,
      `${d.hour ? `${d.hour} ${nouns(d.hour, "hour")}` : ""}`,
      `${d.minute ? `${d.minute} ${nouns(d.minute, "minute")}` : ""}`,
    ]
      .filter((f) => f !== "")
      .slice(0, 2)
      .join(" ");

    expect(duration).toEqual("4 months 4 days");
  });

  it("TimeUtils.getDateDiffInHighestOrdinals finds the 2 highest non-zero date parts with custom labels", () => {
    const labels =
      TimeUtils.timeConstants.dateTimeObjectFormatLabels.translationKeys;

    // Part 1. Custom label structure
    let duration = TimeUtils.getTwoHighestNonZeroOrdinals(
      "2020-10-10 10:10:10",
      "2020-06-07 10:11:12",
      labels,
    );

    expect(duration).toEqual("4 labels.MONTHS 4 labels.DAYS");

    // Part 2. Pre-translate your label stack e.g. French
    labels.month.plural = "mois";
    labels.day.plural = "journées";
    duration = TimeUtils.getTwoHighestNonZeroOrdinals(
      "2020-10-10 10:10:10",
      "2020-06-07 10:11:12",
      labels,
    );

    expect(duration).toEqual("4 mois 4 journées");
  });

  it("TimeUtils.autoFormatDuration can be used to find the first two consecutive non-zero date-parts", () => {
    let duration = TimeUtils.autoFormatDuration(
      "2020-10-10 10:10:10",
      "2020-06-07 10:11:12",
    );
    expect(duration).toEqual("4 months 4 days");

    duration = TimeUtils.autoFormatDuration(
      "2020-10-10 10:10:10",
      "2020-06-12 10:09:10",
    );
    expect(duration).toEqual("4 months");

    duration = TimeUtils.autoFormatDuration(
      "2020-10-10 10:10:10",
      "2020-10-10 09:08:07",
    );
    expect(duration).toEqual("1 hour 2 minutes");

    duration = TimeUtils.autoFormatDuration(
      "2020-10-10 10:10:10",
      "2020-10-10 10:08:10",
    );
    expect(duration).toEqual("2 minutes");
  });
});
