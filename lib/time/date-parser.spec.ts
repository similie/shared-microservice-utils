/* eslint-disable @typescript-eslint/no-non-null-assertion */
/** @summary Test rig components */
import { DateTime } from "luxon";

/** @summary Header files */
import * as DateTimeParser from "./date-parser";
import { DateHelper } from "./date-helper";
import { DateComparisionHelper } from "./date-comparision-helper";
import { DateTimeValue, TimePeriod } from "../constants";

describe("DateTimeParser.js", function () {
  /**
   * @summary This section of tests verifies functions in the
   * DateTimeParser helper module
   */

  it("parseValueOrNow returns the date value when a correct date type parameter is supplied", function () {
    const candidate = "2021-10-20T16:20:30+09:00";
    const expectedResult = 1634714430000;

    const result = DateTimeParser.parseValueOrNow(candidate);
    expect(result).toEqual(expectedResult);
  });

  it("parseValueOrNow returns the current date when an incorrect correct date type parameter is supplied", function () {
    const candidate = "not a date";
    const expectedResult = new Date().valueOf();

    const result = DateTimeParser.parseValueOrNow(candidate);
    // result within -+10ms to account for processing time
    // github fails with a 5 ms interval
    expect(result).toBeGreaterThan(expectedResult - 10);
    expect(result).toBeLessThan(expectedResult + 10);
  });

  it("parseValueOrNow returns the current date when a falsy date type parameter is supplied", function () {
    const candidate = "";
    const expectedResult = new Date().valueOf();

    const result = DateTimeParser.parseValueOrNow(candidate);
    // result within -+5ms to account for processing time
    expect(result).toBeGreaterThan(expectedResult - 5);
    expect(result).toBeLessThan(expectedResult + 5);
  });

  it("guardInputDate returns the date value when a correct date type parameter is supplied", function () {
    const candidate = "2021-10-20T16:20:30+09:00";
    const expectedResult = 1634714430000;

    const result = DateTimeParser.guardInputDate(candidate);
    expect(result).toEqual(expectedResult);
  });

  it("guardInputDate throws an error when an invalid date type parameter is supplied", function () {
    const candidate = "not a date";
    expect(() => DateTimeParser.guardInputDate(candidate)).toThrow();
  });

  it("We can parse the required Date-Time string formats", function () {
    const candidates = [
      "2021-02-25 11:43:51+00",
      "2021-10-20T16:20:30+09:00",
      "05/18/2018",
      "Oct 20, 2020 16:20",
    ];

    /**
     * @description This will use current TZ info at the testing PC where no TZ
     * is specified. Ensures consistent results between the DateTime library
     * and the test values.
     * @param {number} i index of Candidate
     * @returns {number} Epoch ms of candidate
     */
    const expectedResults = (i: number) => {
      return new Date(candidates[i]!).valueOf();
    };

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as string;
      const expectedResult = expectedResults(i);
      const ms = DateTimeParser.guardInputDate(candidate);
      const dt = DateTime.fromMillis(ms);

      expect(dt.valueOf()).toEqual(expectedResult);
    }
  });

  it("We can parse the required Date-Time object formats", function () {
    const isoDateString = "2021-10-20T16:20:30.123+09:00";
    const expectedResult = 1634714430123;

    const candidates: DateTimeValue[] = [
      1634714430123,
      isoDateString,
      DateTime.fromISO(isoDateString),
      new Date(isoDateString),
      new DateHelper(isoDateString),
      new DateComparisionHelper(isoDateString, TimePeriod.milliseconds),
    ];

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as DateTimeValue;
      const ms = DateTimeParser.guardInputDate(candidate);
      const dt = DateTime.fromMillis(ms);

      expect(dt.valueOf()).toEqual(expectedResult);
    }
  });

  it("timePeriodToDurationIdentifier returns the correct duration object index identifier", function () {
    const candidates = [
      TimePeriod.milliseconds,
      TimePeriod.seconds,
      TimePeriod.minutes,
      TimePeriod.hours,
      TimePeriod.days,
      TimePeriod.weeks,
      TimePeriod.months,
      TimePeriod.years,
    ];
    const expectedResults = [
      "milliseconds",
      "seconds",
      "minutes",
      "hours",
      "days",
      "weeks",
      "months",
      "years",
    ];

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as number;
      const expectedResult = expectedResults[i] as string;

      result = DateTimeParser.timePeriodToDurationIdentifier(candidate);
      expect(result).toEqual(expectedResult);
    }
  });

  it("timePeriodToDurationIdentifier returns 'milliseconds' for an invalid TimePeriod", function () {
    const candidate = -1 as TimePeriod;
    const expectedResult = "milliseconds";

    const result = DateTimeParser.timePeriodToDurationIdentifier(candidate);
    expect(result).toEqual(expectedResult);
  });

  it("timePeriodToDateTimeObjectIdentifier returns the correct DateTime object index identifier", function () {
    const candidates = [
      TimePeriod.milliseconds,
      TimePeriod.seconds,
      TimePeriod.minutes,
      TimePeriod.hours,
      TimePeriod.days,
      TimePeriod.weeks,
      TimePeriod.months,
      TimePeriod.years,
    ];
    const expectedResults = [
      "millisecond",
      "second",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "year",
    ];

    let result = "";
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i] as number;
      const expectedResult = expectedResults[i] as string;

      result = DateTimeParser.timePeriodToDateTimeObjectIdentifier(candidate);
      expect(result).toEqual(expectedResult);
    }
  });

  it("timePeriodToDateTimeObjectIdentifier returns 'millisecond' for an invalid TimePeriod", function () {
    const candidate = -1 as TimePeriod;
    const expectedResult = "millisecond";

    const result =
      DateTimeParser.timePeriodToDateTimeObjectIdentifier(candidate);
    expect(result).toEqual(expectedResult);
  });
});
