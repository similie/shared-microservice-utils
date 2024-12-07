/**
 * @description Class for comparing a time period across two dates.
 * Used internally by the DateHelper class.
 *
 * @requires
 *     Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/
 */
import { DateTimeObject, DateTimeValue } from "../constants";
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
export declare class DateDifferenceHelper {
    private _dt1;
    private _dt2;
    private _timePeriod;
    /**
     * @description Constructor. Requires two date-like values to compare.
     * If the date-like values are falsy, the current date will be initialised.
     * Note. If you construct a comparator with two dates the same, the diff
     * will always return zero!
     * @param {DateTimeValue} date1
     * @param {DateTimeValue} date2
     */
    constructor(date1: DateTimeValue, date2: DateTimeValue);
    /**
     * @private
     * @description Computes the difference between Date1 & Date2 in the units
     * specified. Throws an error if there is no valid TimePeriod specified.
     * @returns {number} The difference in the time period unit
     */
    private __differenceInTimePeriod;
    /**
     * @description Get the difference between the dates in milliseconds
     * @example date1.difference(date2).inMilliseconds
     */
    get inMilliseconds(): number;
    /**
     * @description Get the difference between the dates in seconds
     */
    get inSeconds(): number;
    /**
     * @description Get the difference between the dates in minutes
     */
    get inMinutes(): number;
    /**
     * @description Get the difference between the dates in hours
     */
    get inHours(): number;
    /**
     * @description Get the difference between the dates in days
     */
    get inDays(): number;
    /**
     * @description Get the difference between the dates in weeks
     */
    get inWeeks(): number;
    /**
     * @description Get the difference between the dates in months
     */
    get inMonths(): number;
    /**
     * @description Get the difference between the dates in years
     */
    get inYears(): number;
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
    get toObject(): DateTimeObject;
}
