/* eslint-disable indent */
/**
 * @description Bridge Class for providing add, subtract and comparison of date
 * values in a fluent pattern.
 * Uses DateComparisonHelper and DateDifferenceHelper internally to narrow
 * intent when calling downstream functions on dates.
 *
 * @requires
 *     Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/
 *
 * @private functions are
 */

import { DateTime } from "luxon";
import {
  TimePeriod,
  DateTimeFormats,
  DateTimeObject,
  DateTimeValue,
} from "../constants";
import * as DateTimeParser from "./date-parser";
import * as DateTimeFormatter from "./date-formatter";
import { DateComparisionHelper } from "./date-comparision-helper";
import { DateDifferenceHelper } from "./date-difference";

/**
 * @description
 */
export class DateHelper {
  private _dt: DateTime;
  private _timeZone: string;
  private _serverTimeZone: string;

  /**
   * @description Constructor. Requires a date-like or a falsy value to
   * initialise either the date supplied or the current date & time. If the
   * supplied value cannot be parsed, will always default to the current date.
   * The serverTimeZone is stored for decorating the final output formats to
   * maintain compatability with current use-cases.
   * @todo Move to UTC back-end date handling.
   * @param {DateTimeValue} dateOrNow A valid date or falsy value
   * @example let dt = TimeUtils.date(now_);
   * let dt = TimeUtils.date('');
   * let dt = TimeUtils.date(new Date());
   * let dt = TimeUtils.date('2020-10-20T01:02:03.456Z+09');
   */
  public constructor(dateOrNow: DateTimeValue) {
    // primary date for maths or comparisons. Could be falsy or a milliseconds
    const ms = DateTimeParser.parseValueOrNow(dateOrNow);
    this._dt = DateTime.fromMillis(ms).toUTC();
    this._timeZone = "";
    this._serverTimeZone = DateTime.now().zoneName;
  }

  /**
   * @description JS property access for the internal DateTime object in
   * milliseconds which allows us to compare dates using simple JS greater than
   * and less than operators. Alias of getter 'toMillis'
   * @returns {number} The internal date in milliseconds
   * @example
   *  const dt1 = TimeUtils.date(startDate);
   *  const dt2 = TimeUtils.date(endDate);
   *  const isLater = dt1 > dt2;
   */
  public valueOf() {
    const result = this._dt.valueOf();
    return result;
  }

  /**
   * @description Generic 'setter' for time period units contained in a date.
   * Applies the value specified directly to the time period in the date,
   * leaving all of the other parameters unchanged. Returns a new class
   * instance containing the updated date.
   * @param {TimePeriod} timePeriod One of the TimePeriod enum values
   * @param {number} toValue The value to set the specified time period to
   * @returns {DateHelper} A new instance of the DateHelper class.
   * @example
   * TimeUtils.date('2020-10-20T10:10:10+09:00').set(TimePeriod.days, 15);
   * will set the date to '2020-10-15T10:10:10+09:00'
   */
  public set(timePeriod: TimePeriod, toValue: number) {
    const unit =
      DateTimeParser.timePeriodToDateTimeObjectIdentifier(timePeriod);
    const option: Record<string, number> = {};
    option[unit] = toValue;
    const dt = this._dt.set(option);
    const result = newDateHelperWith(dt, this._timeZone);
    return result;
  }

  /**
   * @description Adds the specified time zone to the date returning a new
   * class instance with the date and new time zone. Throws an error if the
   * time zone supplied was not valid.
   * @param {string} value A valid IANA or UTC timezone specifier
   * @returns {DateHelper} A new instance of the DateHelper class.
   */
  public tz(value: string) {
    const testZone = DateTime.now().setZone(value);
    if (!testZone.isValid) {
      throw new Error(`${testZone.invalidExplanation}`);
    }
    const result = newDateHelperWith(this._dt, value);
    return result;
  }

  /**
   * @description Adds the number of TimePeriods to the date and returns a new
   * instance of the class containing the new date.
   * @param {number} quantity The number of TimePeriods to add
   * @param {TimePeriod} timePeriod One of the TimePeriod enum values
   * @returns {DateHelper} A new instance of the DateHelper class.
   */
  public plus(quantity: number, timePeriod: TimePeriod) {
    const shiftedDt = addPeriodToDate(quantity, timePeriod, this._dt);
    const result = newDateHelperWith(shiftedDt, this._timeZone);
    return result;
  }

  /**
   * @description Subtracts the number of TimePeriods from the date and returns
   *  a new instance of the class containing the new date.
   * @param {number} quantity The number of TimePeriods to subtract
   * @param {TimePeriod} timePeriod One of the TimePeriod enum values
   * @returns {DateHelper} A new instance of the DateHelper class.
   */
  public minus(quantity: number, timePeriod: TimePeriod) {
    const shiftedDt = subtractPeriodFromDate(quantity, timePeriod, this._dt);
    const result = newDateHelperWith(shiftedDt, this._timeZone);
    return result;
  }

  /**
   * @description Method call that will allow the caller to compute the number
   * of TimePeriod units between two dates. The one used to initialise the
   * original class and this date, returning the final result from a following
   * property call. E.g. InDays.
   * @param {DateTimeValue} toDate One of the valid types of date parameter
   * @returns {DateHelper} A new instance of a DateDifferenceHelper class
   * @example TimeUtils.date('date1').difference('date2').InDays;
   */
  public difference(toDate: DateTimeValue) {
    const ms = DateTimeParser.parseValueOrNow(toDate);
    return new DateDifferenceHelper(this._dt.toMillis(), ms);
  }

  /**
   * @description Method call that will allow the caller to compute if the
   * value of the TimePeriod units specified here are the same between two
   * dates; the one used to initialise the class and the date specified in the
   * follow-on method call.
   * @param {TimePeriod} timePeriod One of the TimePeriod enum values
   * @returns {DateHelper} A new instance of the DateComparision Helper class
   * @example TimeUtils.date('date1').hasSame(TimePeriod.days).as('date2');
   */
  public hasSame(timePeriod: TimePeriod) {
    const comparator = new DateComparisionHelper(
      this._dt.toMillis(),
      timePeriod,
    );
    return comparator;
  }

  /**
   * @description Compare two dates and return true if the first is earlier
   * than (before) the second.
   * @param {DateTimeValue} thisDate One of the valid types of date parameter
   * @returns {boolean} A true if the date is before the one specified,
   *   false otherwise
   * @example TimeUtils.date('date1').isBefore('date2');
   */
  public isBefore(thisDate: DateTimeValue) {
    const ms = DateTimeParser.parseValueOrNow(thisDate);
    const dt2 = DateTime.fromMillis(ms);
    const result = compareDates(this._dt, dt2);
    return result < 0;
  }

  /**
   * @description Compare two dates and return true if the first is later than
   * (after) the second.
   * @param {DateTimeValue} thisDate One of the valid types of date parameter
   * @returns {boolean} A true if the date is after the one specified,
   *   false otherwise
   * @example TimeUtils.date('date1').isAfter('date2');
   */
  public isAfter(thisDate: DateTimeValue) {
    const ms = DateTimeParser.parseValueOrNow(thisDate);
    const dt2 = DateTime.fromMillis(ms);
    const result = compareDates(this._dt, dt2);
    return result > 0;
  }

  /**
   * @summary The following 'time period' getter properties return the value of
   * the time period specified by the function name.
   */

  /** @description The value of the internal DateTime object's millisecond */
  public get millisecond() {
    return valueOfTimePeriod(TimePeriod.milliseconds, this._dt);
  }
  /** @description The value of the internal DateTime object's second */
  public get second() {
    return valueOfTimePeriod(TimePeriod.seconds, this._dt);
  }
  /** @description The value of the internal DateTime object's minute */
  public get minute() {
    return valueOfTimePeriod(TimePeriod.minutes, this._dt);
  }
  /** @description The value of the internal DateTime object's hour */
  public get hour() {
    return valueOfTimePeriod(TimePeriod.hours, this._dt);
  }
  /** @description The value of the internal DateTime object's day */
  public get day() {
    return valueOfTimePeriod(TimePeriod.days, this._dt);
  }
  /** @description The day of week based on 1=Monday */
  public get dayOfWeek() {
    return this._dt.weekday;
  }
  /** @description The value of the internal DateTime object's week */
  public get week() {
    return this._dt.weekNumber;
  }
  /** @description The value of the internal DateTime object's month */
  public get month() {
    return valueOfTimePeriod(TimePeriod.months, this._dt);
  }
  /** @description The value of the internal DateTime object's year */
  public get year() {
    return valueOfTimePeriod(TimePeriod.years, this._dt);
  }
  /** @description Public accessor */
  public get timeZone() {
    return this._timeZone;
  }
  /**
   * Set the time zone for the date.
   * @param {string} timeZone The time zone to set
   * @returns {string}
   */
  public setTimeZone(timeZone: string) {
    this._timeZone = timeZone;
  }

  /**
   * @description Returns the internal DateTime value in milliseconds
   * as a simple property getter. Alias of this.valueOf()
   * @returns {number} A datetime value in milliseconds
   * @example TimeUtils.date(<date>).toMillis;
   */
  public get toMillis() {
    return this._dt.toMillis();
  }

  /**
   * @description Returns the internal DateTime value in object format
   * @returns {object} A DateTime value in object format
   * @example TimeUtils.date(<date>).toObject;
   */
  public get toObject() {
    const result = this._dt.toObject();
    return result as DateTimeObject;
  }

  /**
   * @description Formats the internal date. If a time zone was specified using
   * the .tz(zone) method that zone will be used to decorate the formatted
   * date, otherwise the internal server's time zone will be used - essentially
   * to maintain compatability with the moment().format() output formats.
   * @param {string} format One of the DateTimeFormats specified in TypeDefs
   * @returns {string} The value of Date in the format specifed.
   */
  public toFormat(format: string) {
    const tz = this._timeZone ? this._timeZone : this._serverTimeZone;
    const dt = this._dt.setZone(tz);
    const result = DateTimeFormatter.formatDate(dt, format);
    return result;
  }

  /** -<>- Shortcut accessor methods -<>- */
  /** @description Shortcut getter for ISO format of this date */
  public get toISO() {
    return this.toFormat(DateTimeFormats.ISO);
  }

  /** @description Shortcut getter for SQL format of this date */
  public get toSQL() {
    return this.toFormat(DateTimeFormats.SQL);
  }

  /** @description Shortcut getter for ISO formatted UTC value of this date */
  public get toUTC() {
    const result = DateTimeFormatter.formatDate(this._dt, DateTimeFormats.ISO);
    return result;
  }
}

/**
 * -<>----------------------------------------------------------------------<>-
 * @summary Private member functions for this class
 * -<>----------------------------------------------------------------------<>-
 */

/**
 * @description Creates a 'clone' of the DateHelper class with the specified
 * date and time zone properties. Returns a new class instance.
 * @param {DateTime} date The DateTime object to initialise the class with
 * @param {string} timeZone The time zone to initialise the class with
 * @returns {DateHelper} A new instance of a DateHelper class
 */
function newDateHelperWith(date: DateTime, timeZone: string) {
  const result = new DateHelper(date);
  result.setTimeZone(timeZone);
  return result;
}

/**
 * @description Direct property access for a unit of time in the internal
 * DateTime object. Returns the value of the requested time period.
 * @param {TimePeriod} timePeriod One of the TimePeriod enum values
 * @param {DateTime} inDate A reference to the internal DateTime object
 * @returns {number} The value of the specified unit
 */
function valueOfTimePeriod(timePeriod: TimePeriod, inDate: DateTime) {
  const unit = DateTimeParser.timePeriodToDateTimeObjectIdentifier(timePeriod);
  const result = inDate.get(unit as keyof DateTime);
  return result;
}

/**
 * @description Wrapper for the Luxon Diff function.
 * @param {DateTime} dateTime1 A Luxon DateTime object
 * @param {DateTime} dateTime2 A Luxon DateTime object
 * @returns {DateHelper} The difference between the two dates in milliseconds
 */
function compareDates(dateTime1: DateTime, dateTime2: DateTime) {
  const result = dateTime1.diff(dateTime2).milliseconds;
  return result;
}

/**
 * @description Subtracts the specified number of duration units from a date
 * @example subtract 3 days from [today], subtract 10 minutes from [a date]
 * @param {number} quantity The number of units to subtract
 * @param {TimePeriod} period One of the TimePeriod Enum values
 * @param {DateTime} dt  A valid Luxon DateTime object
 * @returns {DateTime} A DateTime object shifted by the quantity of TimePeriods
 */
function subtractPeriodFromDate(
  quantity: number,
  period: TimePeriod,
  dt: DateTime,
) {
  let result: DateTime;

  switch (period) {
    case TimePeriod.milliseconds:
      result = dt.minus({ milliseconds: quantity });
      break;
    case TimePeriod.seconds:
      result = dt.minus({ seconds: quantity });
      break;
    case TimePeriod.minutes:
      result = dt.minus({ minutes: quantity });
      break;
    case TimePeriod.hours:
      result = dt.minus({ hours: quantity });
      break;
    case TimePeriod.days:
      result = dt.minus({ days: quantity });
      break;
    case TimePeriod.weeks:
      result = dt.minus({ weeks: quantity });
      break;
    case TimePeriod.months:
      result = dt.minus({ months: quantity });
      break;
    case TimePeriod.years:
      result = dt.minus({ years: quantity });
      break;
    default:
      /** no change if no time period */
      result = dt.minus({ milliseconds: 0 });
      break;
  }

  return result;
}

/**
 * @description Adds the specified number of duration units to a date
 * @example add 3 days to [today], add 10 minutes to [a date]
 * @param {Integer} quantity The number of units to add
 * @param {TimePeriod} period One of the TimePeriod Enum values
 * @param {DateTime} fromDate A valid Luxon DateTime object
 * @returns {DateTime} A DateTime object shifted by the quantity of TimePeriods
 */
function addPeriodToDate(
  quantity: number,
  period: TimePeriod,
  fromDate: DateTime,
) {
  const qty = -1 * quantity;
  return subtractPeriodFromDate(qty, period, fromDate);
}
