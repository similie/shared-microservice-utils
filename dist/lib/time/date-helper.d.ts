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
import { TimePeriod, DateTimeObject, DateTimeValue } from "../constants";
import { DateComparisionHelper } from "./date-comparision-helper";
import { DateDifferenceHelper } from "./date-difference";
/**
 * @description
 */
export declare class DateHelper {
    private _dt;
    private _timeZone;
    private _serverTimeZone;
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
    constructor(dateOrNow: DateTimeValue);
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
    valueOf(): number;
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
    set(timePeriod: TimePeriod, toValue: number): DateHelper;
    /**
     * @description Adds the specified time zone to the date returning a new
     * class instance with the date and new time zone. Throws an error if the
     * time zone supplied was not valid.
     * @param {string} value A valid IANA or UTC timezone specifier
     * @returns {DateHelper} A new instance of the DateHelper class.
     */
    tz(value: string): DateHelper;
    /**
     * @description Adds the number of TimePeriods to the date and returns a new
     * instance of the class containing the new date.
     * @param {number} quantity The number of TimePeriods to add
     * @param {TimePeriod} timePeriod One of the TimePeriod enum values
     * @returns {DateHelper} A new instance of the DateHelper class.
     */
    plus(quantity: number, timePeriod: TimePeriod): DateHelper;
    /**
     * @description Subtracts the number of TimePeriods from the date and returns
     *  a new instance of the class containing the new date.
     * @param {number} quantity The number of TimePeriods to subtract
     * @param {TimePeriod} timePeriod One of the TimePeriod enum values
     * @returns {DateHelper} A new instance of the DateHelper class.
     */
    minus(quantity: number, timePeriod: TimePeriod): DateHelper;
    /**
     * @description Method call that will allow the caller to compute the number
     * of TimePeriod units between two dates. The one used to initialise the
     * original class and this date, returning the final result from a following
     * property call. E.g. InDays.
     * @param {DateTimeValue} toDate One of the valid types of date parameter
     * @returns {DateHelper} A new instance of a DateDifferenceHelper class
     * @example TimeUtils.date('date1').difference('date2').InDays;
     */
    difference(toDate: DateTimeValue): DateDifferenceHelper;
    /**
     * @description Method call that will allow the caller to compute if the
     * value of the TimePeriod units specified here are the same between two
     * dates; the one used to initialise the class and the date specified in the
     * follow-on method call.
     * @param {TimePeriod} timePeriod One of the TimePeriod enum values
     * @returns {DateHelper} A new instance of the DateComparision Helper class
     * @example TimeUtils.date('date1').hasSame(TimePeriod.days).as('date2');
     */
    hasSame(timePeriod: TimePeriod): DateComparisionHelper;
    /**
     * @description Compare two dates and return true if the first is earlier
     * than (before) the second.
     * @param {DateTimeValue} thisDate One of the valid types of date parameter
     * @returns {boolean} A true if the date is before the one specified,
     *   false otherwise
     * @example TimeUtils.date('date1').isBefore('date2');
     */
    isBefore(thisDate: DateTimeValue): boolean;
    /**
     * @description Compare two dates and return true if the first is later than
     * (after) the second.
     * @param {DateTimeValue} thisDate One of the valid types of date parameter
     * @returns {boolean} A true if the date is after the one specified,
     *   false otherwise
     * @example TimeUtils.date('date1').isAfter('date2');
     */
    isAfter(thisDate: DateTimeValue): boolean;
    /**
     * @summary The following 'time period' getter properties return the value of
     * the time period specified by the function name.
     */
    /** @description The value of the internal DateTime object's millisecond */
    get millisecond(): number;
    /** @description The value of the internal DateTime object's second */
    get second(): number;
    /** @description The value of the internal DateTime object's minute */
    get minute(): number;
    /** @description The value of the internal DateTime object's hour */
    get hour(): number;
    /** @description The value of the internal DateTime object's day */
    get day(): number;
    /** @description The day of week based on 1=Monday */
    get dayOfWeek(): number;
    /** @description The value of the internal DateTime object's week */
    get week(): number;
    /** @description The value of the internal DateTime object's month */
    get month(): number;
    /** @description The value of the internal DateTime object's year */
    get year(): number;
    /** @description Public accessor */
    get timeZone(): string;
    /**
     * Set the time zone for the date.
     * @param {string} timeZone The time zone to set
     * @returns {string}
     */
    setTimeZone(timeZone: string): void;
    /**
     * @description Returns the internal DateTime value in milliseconds
     * as a simple property getter. Alias of this.valueOf()
     * @returns {number} A datetime value in milliseconds
     * @example TimeUtils.date(<date>).toMillis;
     */
    get toMillis(): number;
    /**
     * @description Returns the internal DateTime value in object format
     * @returns {object} A DateTime value in object format
     * @example TimeUtils.date(<date>).toObject;
     */
    get toObject(): DateTimeObject;
    /**
     * @description Formats the internal date. If a time zone was specified using
     * the .tz(zone) method that zone will be used to decorate the formatted
     * date, otherwise the internal server's time zone will be used - essentially
     * to maintain compatability with the moment().format() output formats.
     * @param {string} format One of the DateTimeFormats specified in TypeDefs
     * @returns {string} The value of Date in the format specifed.
     */
    toFormat(format: string): string;
    /** -<>- Shortcut accessor methods -<>- */
    /** @description Shortcut getter for ISO format of this date */
    get toISO(): string;
    /** @description Shortcut getter for SQL format of this date */
    get toSQL(): string;
    /** @description Shortcut getter for ISO formatted UTC value of this date */
    get toUTC(): string;
}
