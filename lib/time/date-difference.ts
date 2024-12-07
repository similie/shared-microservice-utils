/* eslint-disable max-len */
/**
 * @description Class for comparing a time period across two dates.
 * Used internally by the DateHelper class.
 *
 * @requires
 *     Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/
 */

import { DateTime, DateTimeUnit, Duration } from "luxon";

import { TimePeriod, DateTimeObject, DateTimeValue } from "../constants";

import * as DateTimeParser from "./date-parser";

/**
 * @description Class for computing the difference between two dates in the
 * specified time period units. Used internally by the DateHelper class for
 * answering questions like 'how many days are there between date1 & date2.
 * This class provides a numeric answer to the difference question in the
 * time period units specified by the getter property.
 *
 * @example
 *    Using DateHelper and DateDifferenceHelper
 *    let startDate = new DateHelper(<from database or variable>);
 *    let endDate = startDate.difference(<from database or variable>).inHours;
 *    In this example, the method call returns the number of hours between the
 *    two dates.
 */
export class DateDifferenceHelper {
  private _dt1: DateTime;
  private _dt2: DateTime;
  private _timePeriod: TimePeriod | number;

  /**
   * @description Constructor. Requires two date-like values to compare.
   * If the date-like values are falsy, the current date will be initialised.
   * Note. If you construct a comparator with two dates the same, the diff
   * will always return zero!
   * @param {DateTimeValue} date1
   * @param {DateTimeValue} date2
   */
  public constructor(date1: DateTimeValue, date2: DateTimeValue) {
    const ms1 = DateTimeParser.parseValueOrNow(date1);
    const ms2 = DateTimeParser.parseValueOrNow(date2);
    this._dt1 = DateTime.fromMillis(ms1);
    this._dt2 = DateTime.fromMillis(ms2);
    this._timePeriod = 0;
  }

  /**
   * @private
   * @description Computes the difference between Date1 & Date2 in the units
   * specified. Throws an error if there is no valid TimePeriod specified.
   * @returns {number} The difference in the time period unit
   */
  private __differenceInTimePeriod() {
    if (this._timePeriod < 1) {
      throw new Error(
        "DateDifferenceHelper.__differenceInTimePeriod cannot compute a time difference without a time period",
      );
    }
    const unit = DateTimeParser.timePeriodToDurationIdentifier(
      this._timePeriod,
    );
    this._timePeriod = 0; // reset
    return this._dt1
      .diff(this._dt2, unit as DateTimeUnit)
      .as(unit as DateTimeUnit);
  }

  /**
   * @description Get the difference between the dates in milliseconds
   * @example date1.difference(date2).inMilliseconds
   */
  public get inMilliseconds() {
    this._timePeriod = TimePeriod.milliseconds;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in seconds
   */
  public get inSeconds() {
    this._timePeriod = TimePeriod.seconds;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in minutes
   */
  public get inMinutes() {
    this._timePeriod = TimePeriod.minutes;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in hours
   */
  public get inHours() {
    this._timePeriod = TimePeriod.hours;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in days
   */
  public get inDays() {
    this._timePeriod = TimePeriod.days;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in weeks
   */
  public get inWeeks() {
    this._timePeriod = TimePeriod.weeks;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in months
   */
  public get inMonths() {
    this._timePeriod = TimePeriod.months;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between the dates in years
   */
  public get inYears() {
    this._timePeriod = TimePeriod.years;
    return this.__differenceInTimePeriod();
  }

  /**
   * @description Get the difference between two dates in object format.
   * @example
   * const t1 = TimeUtils.date('2021-10-14 10:14:13');
   * const t2 = TimeUtils.date('2021-10-10 10:11:12');
   * const diff = t1.difference(t2).toObject;
   * diff: {
   * year: 0, month: 0, day: 4,
   * hour: 0, minute: 3, second: 1,
   * millisecond: 0
   * }
   */
  public get toObject() {
    const result: DateTimeObject = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: this.inMilliseconds,
    };

    // Luxon Duration units are plurals of our internal DateTimeObject
    const d = Duration.fromObject(result).normalize().toObject();

    // remap to our DateTimeObject format.
    result.year = d.years ? d.years : 0;
    result.month = d.months ? d.months : 0;
    result.day = d.days ? d.days : 0;
    result.hour = d.hours ? d.hours : 0;
    result.minute = d.minutes ? d.minutes : 0;
    result.second = d.seconds ? d.seconds : 0;
    result.millisecond = d.milliseconds ? d.milliseconds : 0;

    return result;
  }
}
