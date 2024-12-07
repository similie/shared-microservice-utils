/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
/**
 * @summary Test rig for /time/classes/datehelper.js
 */
import { DateTime } from "luxon";
import * as TimeUtils from "./utils";
import { DefaultTimeZoneName, TimePeriod } from "../constants";

const tz = TimeUtils.timeConstants.timeZone;
const now_ = TimeUtils.timeConstants.now_;
const Formats = TimeUtils.timeConstants.formats;
// ISO: yyyy-mm-ddThh:mm:ss[+/-]hh:mm e.g 2038-09-30T18:19:20+09:00
// const isoRegex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
// SQL: yyyy-mm-dd hh:mm:ss [+/-]hh:mm e.g. 2021-10-20 09:20:30.123 +02:00
// const sqlRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3}) [+-](\d{2}):(\d{2})/;

describe("DateHelper Class", function () {
  /**
   * @summary This section of tests verifies functionality in the DateHelper.js
   * class and its associated classes:
   *    /time/classes/DateDifferenceHelper.js
   * and
   *    /time/classes/DateComparisonHelper.js
   */

  it("TimeUtils.date(<date>) creates a new instance of a DateHelper class", function () {
    const result = TimeUtils.date(now_);
    const className = "DateHelper";

    expect(result.constructor.name).toEqual(className);
  });

  it("TimeUtils.date(<date>).difference(<date>) returns a new instance of a DateDifferenceHelper class", function () {
    const result = TimeUtils.date("").difference("");
    const className = "DateDifferenceHelper";

    expect(result.constructor.name).toEqual(className);
  });

  it("TimeUtils.date(<date>).hasSame(<TimePeriod>) returns a new instance of a DateComparisionHelper class", function () {
    const result = TimeUtils.date("").hasSame(TimePeriod.years);
    const className = "DateComparisionHelper";

    expect(result.constructor.name).toEqual(className);
  });

  it("TimeUtils.date->minus function subtracts the correct number of days from the specified date", function () {
    const candidateDates = [
      "2020-01-05T16:20:30+01:00",
      "2020-06-02T10:20:30-01:30",
      "2019-03-05T10:20:30+07:00",
      "2020-03-05T10:20:30+07:00",
    ];
    const expectedResults = [
      "2019-12-27T00:20:30+09:00",
      "2020-05-23T20:50:30+09:00",
      "2019-02-23T12:20:30+09:00",
      "2020-02-24T12:20:30+09:00",
    ];

    let result = "";
    for (let i = 0; i < candidateDates.length; i++) {
      const candidate = candidateDates[i] as string;
      // result = TimeUtils.date(candidate).minus(10, TimePeriod.days).tz(tz).toISO;
      // OR
      result = TimeUtils.date(candidate)
        .minus(10, TimePeriod.days)
        .tz(tz)
        .toFormat(Formats.ISO);

      expect(result).toEqual(expectedResults[i]);
    }
  });

  it("TimeUtils.date->minus function subtracts the correct number of time periods from the specified date", function () {
    const startDate = "2020-03-05T16:20:30+09:00";
    const startMinus5days = "2020-02-29T16:20:30+09:00";
    const startMinus1Month = "2020-02-05T16:20:30+09:00";
    const startMinus30Days = "2020-02-04T16:20:30+09:00";
    const startMinus15Mins = "2020-03-05T16:05:30+09:00";

    let result = "";

    // 1. -5 days from [startDate]
    result = TimeUtils.date(startDate).minus(5, TimePeriod.days).tz(tz).toISO;
    expect(result).toEqual(startMinus5days);

    // 2. -1 months from [startDate]. Note Leap Year
    result = TimeUtils.date(startDate).minus(1, TimePeriod.months).tz(tz).toISO;
    expect(result).toEqual(startMinus1Month);

    // 3. -30 days from [startDate]. Note != 1 month for months not 30 days long
    result = TimeUtils.date(startDate).minus(30, TimePeriod.days).tz(tz).toISO;
    expect(result).toEqual(startMinus30Days);

    // 4. -15 mins from [startDate]
    result = TimeUtils.date(startDate)
      .minus(15, TimePeriod.minutes)
      .tz(tz).toISO;
    expect(result).toEqual(startMinus15Mins);
  });

  it("TimeUtils.date->plus function adds the correct number of time periods to the specified date", function () {
    const startDate = "2020-02-05T16:20:30+09:00";
    const startPlus5days = "2020-02-10T16:20:30+09:00";
    const startPlus1Month = "2020-03-05T16:20:30+09:00";
    const startPlus30Days = "2020-03-06T16:20:30+09:00";
    const startPlus15Mins = "2020-02-05T16:35:30+09:00";

    let result = "";

    // 1. +10 days from [startDate]
    result = TimeUtils.date(startDate).plus(5, TimePeriod.days).tz(tz).toISO;
    expect(result).toEqual(startPlus5days);

    // 2. +1 months from [startDate]. Note Leap Year
    result = TimeUtils.date(startDate)
      .plus(1, TimePeriod.months)
      .tz(tz)
      .toFormat(Formats.ISO);
    expect(result).toEqual(startPlus1Month);

    // 3. +30 days from [startDate]. Note != 1 month for months not 30 days long
    result = TimeUtils.date(startDate).plus(30, TimePeriod.days).tz(tz).toISO;
    expect(result).toEqual(startPlus30Days);

    // 4. +15 mins from [startDate]
    result = TimeUtils.date(startDate)
      .plus(15, TimePeriod.minutes)
      .tz(tz).toISO;
    expect(result).toEqual(startPlus15Mins);
  });

  it("TimeUtils.date->plus and minus functions do not mutate the date being operated on", function () {
    const date1 = "2020-04-15T16:20:30+02:00";

    const dt1 = TimeUtils.date(date1);
    const dt2 = dt1.plus(5, TimePeriod.seconds);
    const dt3 = dt2.minus(2, TimePeriod.seconds);

    expect(dt1.toMillis).toEqual(TimeUtils.date(date1).toMillis);
    expect(dt2.toMillis - 5000).toEqual(dt1.toMillis);
    expect(dt3.toMillis - 3000).toEqual(dt1.toMillis);

    // format in a +2 time zone to compare ISO values
    expect(dt1.tz("Europe/Paris").toISO).toEqual(date1);
  });

  it("TimeUtils.date(A)->difference(B) returns the same value as a JS Date milliseconds calculation", function () {
    const date1 = "2020-04-15T16:20:30+02:00";
    const date2 = "2020-04-15T18:20:30+02:00";

    const startMs = new Date(date1).valueOf();
    const endMs = new Date(date2).valueOf();

    const A = endMs - startMs;
    const B = TimeUtils.date(date2).difference(date1).inMilliseconds;

    expect(A).toEqual(B);
  });

  it("TimeUtils.date->diff function correctly determines the difference between 2 dates in the requested units", function () {
    const date1 = "2020-04-15T16:20:30+02:00";
    const date2 = "2020-04-15T18:20:30+04:00";

    const dt1 = TimeUtils.date(date1);

    // Same date-time in different time zones
    const diff1 = dt1.difference(date2).inSeconds;
    expect(diff1).toEqual(0);

    // add four hours, diff should be: 0.1667 days | 4 hours | 240mins
    const dt2 = dt1.plus(4, TimePeriod.hours);
    const diff2 = dt1.difference(dt2);

    expect(diff2.inDays.toFixed(4)).toEqual("-0.1667");
    expect(diff2.inHours).toEqual(-4);
    expect(diff2.inMinutes).toEqual(-240);
  });

  it("TimeUtils.date->diff returns a normalised object represpentation of the difference between two dates", () => {
    const diff = TimeUtils.date("2020-10-10 10:10:10").difference(
      "2020-06-07 10:11:12",
    ).toObject;

    expect(diff.month).toEqual(4);
    expect(diff.day).toEqual(4);
    expect(diff.hour).toEqual(23);
    expect(diff.minute).toEqual(58);
    expect(diff.second).toEqual(58);
    expect(diff.millisecond).toEqual(0);
  });

  it("TimeUtils.date->has-same returns the correct result for the unit specified for the 2 dates", function () {
    // Same date-time in different time zones
    const date1 = "2020-04-15T16:20:30+02:00";
    const date2 = "2020-04-15T18:20:30+04:00";

    const dt1 = TimeUtils.date(date1);

    let result = dt1.hasSame(TimePeriod.hours).as(date2);
    expect(result).toBe(true);

    result = dt1.tz(DefaultTimeZoneName).hasSame(TimePeriod.hours).as(date2);
    expect(result).toBe(true);

    result = dt1.plus(1, TimePeriod.hours).hasSame(TimePeriod.hours).as(date2);
    expect(result).toBe(false);
  });

  it("TimeUtils.date->is-before function correctly determines if Date1 is earlier than Date2", function () {
    const date1 = "2020-01-02T10:20:30+02:00";
    const date2 = "2021-02-03T20:30:40+02:00";

    // internal library
    let result = TimeUtils.date(date1).isBefore(date2);
    expect(result).toBe(true);

    // compare with Luxon
    const dtA = DateTime.fromISO(date1);
    const dtB = DateTime.fromISO(date2);
    result = dtA < dtB;
    expect(result).toBe(true);
  });

  it("TimeUtils.date->is-after function correctly determines if Date1 is later than Date2", function () {
    const date1 = "2020-01-02T10:20:30+02:00";
    const date2 = "2021-02-03T20:30:40+02:00";

    let result = TimeUtils.date(date1).plus(1, TimePeriod.weeks).isAfter(date1);

    expect(result).toBe(true);

    const dt2 = DateTime.fromISO(date2);
    result = TimeUtils.date(date1).isAfter(dt2);
    expect(result).toBe(false);
  });

  it("TimeUtils.date->toObject format returns a JSON object containing a date in component parts", function () {
    const candidate = "2020-01-02T10:20:30+00";
    const result = TimeUtils.date(candidate).toObject;
    const expectedKeys: string[] = [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "second",
      "millisecond",
    ];

    let trueResponses = 0;
    for (let i = 0; i < expectedKeys.length; i++) {
      const key = expectedKeys[i] as string;
      if (Reflect.has(result, key)) trueResponses += 1;
    }

    expect(trueResponses).toEqual(expectedKeys.length);
    expect(Reflect.has(result, "rubbish")).toBe(false);
    expect(result.year).toEqual(2020);
  });

  // it('TimeUtils.date->toFormat applies the correct format with and without the TimeZone specified', function() {
  //   // candidate @tz=UTC in ISO format = `2021-10-20T07:20:30+00:00`;
  //   const candidate = 1634714430123;

  //   let result = TimeUtils.date(candidate).toFormat(Formats.ISO);
  //   expect(isoRegex.test(result)).toBe(true);

  //   result = TimeUtils.date(candidate)
  //       .tz(DefaultTimeZoneName)
  //       .toFormat(Formats.ISO);

  //   expect(isoRegex.test(result)).toBe(true);
  // });

  // it('TimeUtils.date->toISO shortcut applies the correct format', function() {
  //   // candidate @tz=UTC in ISO format = "2021-10-20T07:20:30Z";
  //   const candidate = 1634714430123;
  //   const result = TimeUtils.date(candidate).toISO;
  //   expect(isoRegex.test(result)).toBe(true);
  // });

  // it('TimeUtils.date->toSQL shortcut applies the correct format', function() {
  //   // sql format @tz=9 "2021-10-20 16:20:30.123 +09:00";
  //   const candidate = 1634714430123;

  //   let result = TimeUtils.date(candidate).toSQL;
  //   expect(sqlRegex.test(result)).toBe(true);
  //   result = TimeUtils.date(candidate).tz(DefaultTimeZoneName).toSQL;
  //   expect(sqlRegex.test(result)).toBe(true);
  // });

  it("TimeUtils.date->valueOf() returns the number of epoch milliseconds in the internal date object", function () {
    // candidate in ms is this date: "2021-10-20T07:20:30.123+00"
    const candidate = 1634714430123;
    const dt1 = TimeUtils.date(candidate); // 1634714430123
    const dt2 = dt1.plus(1, TimePeriod.seconds); // 1634714431123

    let result = 0;
    result = dt1.valueOf();
    expect(result).toEqual(candidate);

    result = dt2.valueOf();
    expect(result).toEqual(candidate + 1000);
  });

  it("TimeUtils.date->valueOf() allows us to compare dates using simple JS <GT> and <LT> operators", function () {
    // candidate in ms is this date: "2021-10-20T07:20:30.123+00"
    const candidate = 1634714430123;
    const dt1 = TimeUtils.date(candidate); // 1634714430123
    const dt2 = dt1.plus(1, TimePeriod.seconds); // 1634714431123

    let result = false;

    result = dt1 < dt2;
    expect(result).toBe(true);

    result = dt1 > dt2;
    expect(result).toBe(false);
  });

  it("TimeUtils.date->value-of returns the correct value for the TimePeriod accessor property", function () {
    // candidate in ms is this date: "2021-10-20T07:20:30.123+00"
    const candidate = 1634714430123;
    const dt1 = TimeUtils.date(candidate);

    expect(dt1.toMillis).toEqual(candidate);
    expect(dt1.valueOf()).toEqual(candidate);

    expect(dt1.millisecond).toEqual(123);
    expect(dt1.second).toEqual(30);
    expect(dt1.minute).toEqual(20);
    expect(dt1.hour).toEqual(7);
    expect(dt1.day).toEqual(20);
    expect(dt1.week).toEqual(42);
    expect(dt1.dayOfWeek).toEqual(3);
    expect(dt1.month).toEqual(10);
    expect(dt1.year).toEqual(2021);
  });

  it("TimeUtils.date(value).toUTC returns a date in the UTC+0 timezone in ISO format", function () {
    const candidate = 1634714430123; // 2021-10-20T07:20:30.123Z UTC+0
    const expectedResult = "2021-10-20T07:20:30Z";

    const dt = TimeUtils.date(candidate);
    const result = dt.toUTC;
    expect(result).toEqual(expectedResult);
  });

  it("TimeUtils.date(value).toUTC correctly shifts the timezone if initialised with a date+timezone value", function () {
    const candidate = "2021-10-20T09:20:30+02:00";
    const expectedResult = "2021-10-20T07:20:30Z";

    const dt = TimeUtils.date(candidate);
    const result = dt.toUTC;
    expect(result).toEqual(expectedResult);
  });

  it("TimeUtils.date->set(time-period, qty) sets the specified time period leaving the remaining date parts unchanged ", function () {
    const candidateMs = 1634714430123; // 2021-10-20T07:20:30.123Z UTC+0
    const expectedResultUTC1 = "2021-10-20T07:20:30Z";
    const expectedResultUTC2 = "2021-10-20T19:20:30Z";
    const expectedResultUTC3 = "2021-10-01T07:20:30Z";

    const dt1 = TimeUtils.date(candidateMs);
    const dt2 = dt1.set(TimePeriod.hours, 19);
    const dt3 = dt1.set(TimePeriod.days, 1);

    // Properties not-set remain the same
    expect(dt1.day).toEqual(dt2.day);
    expect(dt1.hour).toEqual(dt3.hour);

    // Properties set are correctly updated
    expect(dt1.day).toEqual(20);
    expect(dt1.hour).toEqual(7);
    expect(dt2.hour).toEqual(19);
    expect(dt3.day).toEqual(1);

    // UTC formats show the correct shifts
    expect(dt1.toUTC).toEqual(expectedResultUTC1);
    expect(dt2.toUTC).toEqual(expectedResultUTC2);
    expect(dt3.toUTC).toEqual(expectedResultUTC3);
  });

  it("TimeUtils.date->set(time-period, qty) wraps the next highest order value when an out of bounds value is specified", function () {
    const candidateMs = 1634714430123; // 2021-10-20T07:20:30.123Z UTC+0
    const expectedResultUTC1 = "2021-11-05T07:20:30Z"; // days => 36
    const expectedResultUTC2 = "2021-10-21T03:20:30Z"; // hours => 27

    const dt = TimeUtils.date(candidateMs);
    const result1 = dt.set(TimePeriod.days, 36).toUTC;
    const result2 = dt.set(TimePeriod.hours, 27).toUTC;

    expect(result1).toEqual(expectedResultUTC1);
    expect(result2).toEqual(expectedResultUTC2);
  });
});
