"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../constants");
const DateTimeParser = __importStar(require("./date-parser"));
const DateTimeFormatter = __importStar(require("./date-formatter"));
const date_comparision_helper_1 = require("./date-comparision-helper");
const date_difference_1 = require("./date-difference");
/**
 * @description
 */
class DateHelper {
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
    constructor(dateOrNow) {
        // primary date for maths or comparisons. Could be falsy or a milliseconds
        const ms = DateTimeParser.parseValueOrNow(dateOrNow);
        this._dt = luxon_1.DateTime.fromMillis(ms).toUTC();
        this._timeZone = "";
        this._serverTimeZone = luxon_1.DateTime.now().zoneName;
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
    valueOf() {
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
    set(timePeriod, toValue) {
        const unit = DateTimeParser.timePeriodToDateTimeObjectIdentifier(timePeriod);
        const option = {};
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
    tz(value) {
        const testZone = luxon_1.DateTime.now().setZone(value);
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
    plus(quantity, timePeriod) {
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
    minus(quantity, timePeriod) {
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
    difference(toDate) {
        const ms = DateTimeParser.parseValueOrNow(toDate);
        return new date_difference_1.DateDifferenceHelper(this._dt.toMillis(), ms);
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
    hasSame(timePeriod) {
        const comparator = new date_comparision_helper_1.DateComparisionHelper(this._dt.toMillis(), timePeriod);
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
    isBefore(thisDate) {
        const ms = DateTimeParser.parseValueOrNow(thisDate);
        const dt2 = luxon_1.DateTime.fromMillis(ms);
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
    isAfter(thisDate) {
        const ms = DateTimeParser.parseValueOrNow(thisDate);
        const dt2 = luxon_1.DateTime.fromMillis(ms);
        const result = compareDates(this._dt, dt2);
        return result > 0;
    }
    /**
     * @summary The following 'time period' getter properties return the value of
     * the time period specified by the function name.
     */
    /** @description The value of the internal DateTime object's millisecond */
    get millisecond() {
        return valueOfTimePeriod(constants_1.TimePeriod.milliseconds, this._dt);
    }
    /** @description The value of the internal DateTime object's second */
    get second() {
        return valueOfTimePeriod(constants_1.TimePeriod.seconds, this._dt);
    }
    /** @description The value of the internal DateTime object's minute */
    get minute() {
        return valueOfTimePeriod(constants_1.TimePeriod.minutes, this._dt);
    }
    /** @description The value of the internal DateTime object's hour */
    get hour() {
        return valueOfTimePeriod(constants_1.TimePeriod.hours, this._dt);
    }
    /** @description The value of the internal DateTime object's day */
    get day() {
        return valueOfTimePeriod(constants_1.TimePeriod.days, this._dt);
    }
    /** @description The day of week based on 1=Monday */
    get dayOfWeek() {
        return this._dt.weekday;
    }
    /** @description The value of the internal DateTime object's week */
    get week() {
        return this._dt.weekNumber;
    }
    /** @description The value of the internal DateTime object's month */
    get month() {
        return valueOfTimePeriod(constants_1.TimePeriod.months, this._dt);
    }
    /** @description The value of the internal DateTime object's year */
    get year() {
        return valueOfTimePeriod(constants_1.TimePeriod.years, this._dt);
    }
    /** @description Public accessor */
    get timeZone() {
        return this._timeZone;
    }
    /**
     * Set the time zone for the date.
     * @param {string} timeZone The time zone to set
     * @returns {string}
     */
    setTimeZone(timeZone) {
        this._timeZone = timeZone;
    }
    /**
     * @description Returns the internal DateTime value in milliseconds
     * as a simple property getter. Alias of this.valueOf()
     * @returns {number} A datetime value in milliseconds
     * @example TimeUtils.date(<date>).toMillis;
     */
    get toMillis() {
        return this._dt.toMillis();
    }
    /**
     * @description Returns the internal DateTime value in object format
     * @returns {object} A DateTime value in object format
     * @example TimeUtils.date(<date>).toObject;
     */
    get toObject() {
        const result = this._dt.toObject();
        return result;
    }
    /**
     * @description Formats the internal date. If a time zone was specified using
     * the .tz(zone) method that zone will be used to decorate the formatted
     * date, otherwise the internal server's time zone will be used - essentially
     * to maintain compatability with the moment().format() output formats.
     * @param {string} format One of the DateTimeFormats specified in TypeDefs
     * @returns {string} The value of Date in the format specifed.
     */
    toFormat(format) {
        const tz = this._timeZone ? this._timeZone : this._serverTimeZone;
        const dt = this._dt.setZone(tz);
        const result = DateTimeFormatter.formatDate(dt, format);
        return result;
    }
    /** -<>- Shortcut accessor methods -<>- */
    /** @description Shortcut getter for ISO format of this date */
    get toISO() {
        return this.toFormat(constants_1.DateTimeFormats.ISO);
    }
    /** @description Shortcut getter for SQL format of this date */
    get toSQL() {
        return this.toFormat(constants_1.DateTimeFormats.SQL);
    }
    /** @description Shortcut getter for ISO formatted UTC value of this date */
    get toUTC() {
        const result = DateTimeFormatter.formatDate(this._dt, constants_1.DateTimeFormats.ISO);
        return result;
    }
}
exports.DateHelper = DateHelper;
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
function newDateHelperWith(date, timeZone) {
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
function valueOfTimePeriod(timePeriod, inDate) {
    const unit = DateTimeParser.timePeriodToDateTimeObjectIdentifier(timePeriod);
    const result = inDate.get(unit);
    return result;
}
/**
 * @description Wrapper for the Luxon Diff function.
 * @param {DateTime} dateTime1 A Luxon DateTime object
 * @param {DateTime} dateTime2 A Luxon DateTime object
 * @returns {DateHelper} The difference between the two dates in milliseconds
 */
function compareDates(dateTime1, dateTime2) {
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
function subtractPeriodFromDate(quantity, period, dt) {
    let result;
    switch (period) {
        case constants_1.TimePeriod.milliseconds:
            result = dt.minus({ milliseconds: quantity });
            break;
        case constants_1.TimePeriod.seconds:
            result = dt.minus({ seconds: quantity });
            break;
        case constants_1.TimePeriod.minutes:
            result = dt.minus({ minutes: quantity });
            break;
        case constants_1.TimePeriod.hours:
            result = dt.minus({ hours: quantity });
            break;
        case constants_1.TimePeriod.days:
            result = dt.minus({ days: quantity });
            break;
        case constants_1.TimePeriod.weeks:
            result = dt.minus({ weeks: quantity });
            break;
        case constants_1.TimePeriod.months:
            result = dt.minus({ months: quantity });
            break;
        case constants_1.TimePeriod.years:
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
function addPeriodToDate(quantity, period, fromDate) {
    const qty = -1 * quantity;
    return subtractPeriodFromDate(qty, period, fromDate);
}
