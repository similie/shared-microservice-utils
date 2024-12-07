"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/**
 * @description Bridge module for common date and time functions implemented
 *  in Luxon (previously in moment).
 *
 * @requires
 *    Luxon, modern version of moment (and twix),
 *      - see https://moment.github.io/luxon/docs/manual/install.html
 *
 * @example Example usage of Luxon DateTime vs. Moment
 *    moment(date).format() or moment(date).tz('time/zone').format()
 *      is equivalent to:
 *    DateTime.fromISO(<ISO DateString>.setZone("Time/Zone").toISO(no millis option)
 *    wrapped in this helper as 'isoFormattedDate()
 *
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
exports.autoFormatDuration = exports.getTwoHighestNonZeroOrdinals = exports.months = exports.date = exports.PerformanceTimer = exports.monthOfDate = exports.minutesToMilliseconds = exports.minutesFromMilliseconds = exports.minutesFromSeconds = exports.timeFormatFromSeconds = exports.timeObjectFromSeconds = exports.formattedDate = exports.reportFormattedDateArray = exports.reportFormattedDate = exports.sqlFormattedDate = exports.isoFormattedDate = exports.keyNameForDayOfWeek = exports.timeCategoryInDays = exports.timeConstants = void 0;
const luxon_1 = require("luxon"); // also: Interval, Settings, Zone
const perf_timer_1 = require("./perf-timer"); // exported as is
Object.defineProperty(exports, "PerformanceTimer", { enumerable: true, get: function () { return perf_timer_1.PerformanceTimer; } });
const date_helper_1 = require("./date-helper");
const month_label_helper_1 = require("./month-label-helper");
const DateTimeParser = __importStar(require("./date-parser"));
const DateTimeFormatter = __importStar(require("./date-formatter"));
const is_this_1 = require("../general/is-this");
const constants_1 = require("../constants");
/** @summary Private structures and helpers -------------------------------- */
/**
 * @private
 * @description Helper function to ensure that a format definitely exists for the
 * 'minutesFrom[milli]seconds function. If any value that doesn't correspond to a
 * valid choice of the TimeFormatMinsSecs Enum, the function will return 'asTime'
 * @param {string} candidate format candidate or null, undefined out of range etc
 * @return {string} DateTimeFormats.Time.MinsSecs value to use
 */
const coerceMinutesFormatArgument = function (candidate) {
    const validFormats = constants_1.DateTimeFormats.Time.MinsSecs;
    let result = validFormats.asTime;
    // only one pathway will reset the result, all others return 'asTime'
    if (candidate) {
        if (candidate === validFormats.asTime ||
            candidate === validFormats.asDecimal) {
            result = candidate;
        }
    }
    return result;
};
/** @summary Privately implemented functions surfaced through module.exports */
/**
 * @description Constants object to surface enums, types and default values
 * for this module.
 */
const _constants = {
    /** @description The default IANA Timezone */
    timeZone: constants_1.DefaultTimeZoneName,
    /** @description Range of available date and time formats */
    formats: constants_1.DateTimeFormats,
    /** @description Labels for formatting a DateTimeObject structure */
    dateTimeObjectFormatLabels: {
        default: constants_1.DefaultDateTimeObjectLabels,
        translationKeys: constants_1.DateTimeObjectLabelTranslationKeys,
    },
    ENUMS: {
        /** @description Range of duration specifiers for Date/time math */
        timePeriods: constants_1.TimePeriod,
        /** @description Range of labels corresponding to month names */
        monthLabels: constants_1.MonthLabel,
        /** @description Scheduled event time period specifiers */
        timers: constants_1.TimerInterval,
    },
    /**
     * @description
     * definition for the empty parameter to create a date using the
     * current date and time */
    now_: "",
};
/**
 * @description Returns the number of days in the specified category. Note. This is loosely defined
 * for categories larger than 'week', since these quantities change. E.g not every month has 30 days.
 * Developer note. Luxon has a 'strict' form for these that take into account leap years, daylight
 * savings times and the different lengths of months.
 * @param {string} The category name e.g. 'year', 'week'. c.f. this.constants.timeCategories.<enum>
 * @return {number} The number of days in the specified category
 */
const _timeCategoryInDays = function (category) {
    const days = {
        years: 365,
        year: 365,
        months: 30,
        month: 30,
        weeks: 7,
        week: 7,
        days: 1,
        day: 1,
    };
    return days[category] || 0;
};
/**
 * @description Converts a day-of-the-week datetime index into a keyname
 * containing the weekday. If the index parameter is outside the bounds of
 * expected values the function throws an error.
 * @param dayOfWeek {number}
 * @return {string} The key name associated with the day of the week
 */
const _keyNameForDayOfWeek = function (dayOfWeek) {
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
    if (dayOfWeek >= 0 && dayOfWeek < dayKeys.length) {
        return dayKeys[dayOfWeek];
    }
    throw new Error(`TimeUtils.keyNameForDayOfWeek expected a value between 1 and 7, got ${dayOfWeek}`);
};
/**
 * @description Shortcut function to create a date time string formatted
 * in ISO8601 format in the default time zone
 * @param dateItem {Date | string | number} A value that can be parsed into a
 * date or null if the function should return a result from the current date.
 * @return {string} A string in the format: "2017-04-20T11:32:00-04:00"
 */
const _isoFormattedDate = function (dateItem) {
    return _formattedDate(dateItem, constants_1.DateTimeFormats.ISO);
};
/**
 * @description Shortcut function to create a date time string formatted
 * in standard SQL format in the default time zone.
 * @param dateItem {Date | string | number} A value that can be parsed into a
 * date or null if the function should return a result from the current date.
 * @return {string} A string in the format: "2017-04-20 11:32:00.123 +05:00"
 */
const _sqlFormattedDate = function (dateItem) {
    return _formattedDate(dateItem, constants_1.DateTimeFormats.SQL);
};
/**
 * @description Formats a date-like string or JS Date object into a medium date format string.
 * If the time param is true, the returned value will also contain a HH:mm 24hr time segment.
 * @alias defDateFormat (deprecated)
 * @param {JSDate | String} dateOrString
 * @param {Boolean} shouldAppendTime
 * @returns {string} Medium format date with optional time. e.g. Aug, 10 2020 16:20 or
 * the empty string if the input date could not be parsed.
 */
const _reportFormattedDate = function (dateOrString, shouldAppendTime) {
    let result = "";
    let epochMillis = 0;
    try {
        epochMillis = DateTimeParser.guardInputDate(dateOrString);
    }
    catch (error) {
        // any error will pass though the date candidate
        epochMillis = 0;
    }
    if (epochMillis > 0) {
        const outputFormat = shouldAppendTime === true
            ? constants_1.DateTimeFormats.DateTime.medium24Hr
            : constants_1.DateTimeFormats.Date.medium;
        result = _formattedDate(epochMillis, outputFormat);
    }
    return result; // formatted dateString or the empty string.
};
/**
 * @description Takes an array of Date-ish items and transforms them into an array
 * of formatted items in the forn 'Oct, 10 2020 16:30'.
 * WARNING. If an item in the array isn't parseable as a date, it will be returned
 * in situ unchanged. E.g. Rubbish-In = Rubbish-Out
 * @param {Array} dateArray An array of identifiable date objects or strings
 * @param {Boolean} shouldAppendTime Flag indicating if the output format should include hh:mm
 * @return {Array} An array or strings formatted using the '_reportFormattedDate' function.
 */
const _reportFormattedDateArray = function (dateArray, shouldAppendTime) {
    if ((0, is_this_1.IsThis)(dateArray).anArray === false) {
        throw new Error("TimeUtils.reportFormattedDateArray() was expecting an Array of values to format. Got: " +
            typeof dateArray);
    }
    const result = [];
    let formattedDate = "";
    const arrayLength = dateArray.length;
    for (let i = 0; i < arrayLength; i++) {
        const dateItem = dateArray[i];
        if ((0, is_this_1.IsThis)(dateItem).aValidDateTimeCandidate) {
            formattedDate = _reportFormattedDate(dateItem, shouldAppendTime);
        }
        /** If the format attempt failed, reset to the input array item */
        if (formattedDate.length === 0)
            formattedDate = dateItem;
        result.push(formattedDate);
    }
    return result;
};
/**
 * @description Accepts a date-like value and format parameter and returns a
 * date formatted string in the specified format parameter in the default
 * time zone.
 * @param dateItem {Date | string | number} A value that can be parsed into a
 * date. If falsy, the function will return a result using the current date.
 * @param format {string} one of the format specifiers in [constants.formats]
 * @return {string} A string in the specified format, or ISO if the format
 * parameter was omitted (or falsy)
 * @example TimeUtils.formattedDate() the current date in ISO format
 * @example TimeUtils.formattedDate([date], formats.Date.medium) `Oct 10, 2021`
 */
function _formattedDate(dateItem, format) {
    const ms = DateTimeParser.parseValueOrNow(dateItem);
    const dt = luxon_1.DateTime.fromMillis(ms).setZone(constants_1.DefaultTimeZoneName);
    const result = DateTimeFormatter.formatDate(dt, format);
    return result;
}
/**
 * @description Takes a number of seconds and converts into an object format
 * containing the equivalent number of hours, minutes and seconds.
 * @param {number} seconds The number of seconds to convert
 * @return {Object} An object containing: hours, minutes and seconds
 */
const _timeObjectFromSeconds = function (seconds) {
    const result = luxon_1.Duration.fromObject({ hours: 0, minutes: 0, seconds: seconds })
        .normalize()
        .toObject();
    return result;
};
/**
 * @description Takes a number of seconds and converts into a zero-padded time
 * string in the format HH:mm:ss (24hr with each segment zero padded).
 * @param {number} seconds The number of seconds to convert
 * @return {string} A zero padded time format containing hours, mins & secs.
 */
const _timeFormatFromSeconds = function (seconds) {
    const result = luxon_1.Duration.fromMillis(seconds * 1000).toFormat("hh:mm:ss");
    return result;
};
/**
 * @description Converts the number of seconds specified into either a
 * decimal representation of the time or a time stamp, depending on the
 * format argument specifed. E.g. "1.30" [asDecimal] or "01:30" [asTime]
 * Throws an error if the input seconds are not a valid number.
 * @param {number} seconds The number of seconds to convert to mins & secs
 * @param {string} toFormat one of the TimeFormatMinsSecs specifiers
 * @return {string} the input value in mins & secs
 */
const _minutesFromSeconds = function (seconds, toFormat) {
    if (!(0, is_this_1.IsThis)(seconds).aUseableNumber) {
        throw new Error("TimeUtils.minutesFromSeconds was expecting a valid number of Seconds");
    }
    return _minutesFromMilliseconds(seconds * 1000, toFormat);
};
/**
 * @description Converts the number of milliseconds specified into either a
 * decimal representation of the time or a time stamp, depending on the format
 * argument specifed. E.g. "1.30" [asDecimal] or "01:30" [asTime].
 * Throws an error if the input milliseconds are not a valid number.
 * @param {number} milliseconds The number of ms to convert to mins & secs
 * @param {string} toFormat one of the TimeFormatMinsSecs specifiers
 * @return {string} the input value in mins & secs
 */
const _minutesFromMilliseconds = function (milliseconds, toFormat) {
    if (!(0, is_this_1.IsThis)(milliseconds).aUseableNumber) {
        throw new Error("TimeUtils.minutesFromMilliseconds was expecting a valid number of milliseconds");
    }
    const duration = luxon_1.Duration.fromMillis(milliseconds);
    const fmt = coerceMinutesFormatArgument(toFormat);
    return duration.toFormat(fmt);
};
/**
 * @description Converts minutes to miliseconds.
 * @param {number} minutes - minutes
 * @return {Long} miliSeconds if minutes is a valid numeric value zero otherwise
 */
const _minutesToMilliseconds = function (mins) {
    if ((0, is_this_1.IsThis)(mins).aUseableNumber === false)
        return 0;
    return Math.floor(Number(mins) * 60 * 1000);
};
/**
 * @description Returns a 1-based index of the month that corresponds to the specified
 * date parameter. Throws an error if the specified date parameter could not be parsed.
 * @param {Date | String} dateOrString A value that can be converted into a valid DateTime object
 * @return {number} The month of the specified date. 1=Jan, 12=Dec
 */
const _monthOfDate = function (dateOrString) {
    const ms = DateTimeParser.guardInputDate(dateOrString);
    const dt = luxon_1.DateTime.fromMillis(ms).setZone(constants_1.DefaultTimeZoneName);
    return dt.month;
};
/**
 * @description Instantiation signature for creating a new DateHelper class
 * for more interactive manipulation of dates. Note. By default this class
 * does NOT add a timezone. If timezone decoration is needed, one should be
 * specified using the .tz('IANA Zone Name') method prior to formatting.
 * @param dateItem {Date | string | number | Date-like object}
 * @return A new instance of the DateHelper class
 */
const _getNewDateHelper = function (dateItem) {
    const result = new date_helper_1.DateHelper(dateItem);
    return result;
};
/**
  * @description Accepts two date-like parameters and finds the difference
  * between them, formatting the result with the specified labels (or the
  * default [EN] labels if this parameter is omitted). Both date parameters
  * will be instantiated with the current date and time if they cannot be parsed
  * If both dates are the same, this function will return the empty string.
  * @param dateItem1 {Date | string | number | Date-like object} Date 1
  * @param dateItem2 {Date | string | number | Date-like object} Date 2
  * @param ordinals {object} Optional structure containing format labels
  * @return {string} containing the first two non-zero date-parts or the
  * empty string
  * @example const d = TimeUtils.getTwoHighestNonZeroOrdinals(
       '2020-10-10 10:10:10', '2020-06-07 10:11:12');
       returns '4 months 4 days'

       Using: '2020-10-10 10:10:10', '2020-06-12 10:09:10'
       returns '4 months 1 minute'
  */
const _getTwoHighestNonZeroOrdinals = function (dateItem1, dateItem2, ordinals) {
    const d = new date_helper_1.DateHelper(dateItem1).difference(dateItem2).toObject;
    // if values not supplied, use the basic [en] key names defined in TypeDefs
    if (!ordinals)
        ordinals = constants_1.DefaultDateTimeObjectLabels;
    const nouns = (count, ordinal) => {
        return count > 1 ? ordinal.plural : ordinal.singular;
    };
    const duration = [
        `${d.year ? `${d.year} ${nouns(d.year, ordinals.year)}` : ""}`,
        `${d.month ? `${d.month} ${nouns(d.month, ordinals.month)}` : ""}`,
        `${d.day ? `${d.day} ${nouns(d.day, ordinals.day)}` : ""}`,
        `${d.hour ? `${d.hour} ${nouns(d.hour, ordinals.hour)}` : ""}`,
        `${d.minute ? `${d.minute} ${nouns(d.minute, ordinals.minute)}` : ""}`,
    ]
        .filter((f) => f !== "")
        .slice(0, 2)
        .join(" ");
    return duration;
};
/**
  * @description Accepts two date-like parameters and finds the difference
  * between them, formatting the result with the specified labels (or the
  * default [EN] labels if this parameter is omitted). Both date parameters
  * will be instantiated with the current date and time if they cannot be parsed
  * If both dates are the same, this function will return the empty string.
  * NOTE: This function differs from 'getTwoHighestNonZeroOrdinals' in that it
  * will find the first non-zero ordinal and only append the 2nd if it is the
  * next non-zero date-part. See examples below.
  * @param dateItem1 {Date | string | number | Date-like object} Date 1
  * @param dateItem2 {Date | string | number | Date-like object} Date 2
  * @param ordinals {object} Optional structure containing format labels
  * @return {string} containing the first two consecutive non-zero date-parts
  * or the empty string
  * @example const d = TimeUtils.getTwoHighestNonZeroOrdinals(
       '2020-10-10 10:10:10', '2020-06-07 10:11:12');
       returns '4 months 4 days'

       Using: '2020-10-10 10:10:10', '2020-06-12 10:09:10'
       returns '4 months'
  */
const _autoFormatDuration = function (dateItem1, dateItem2, ordinals) {
    const result = [];
    const d = new date_helper_1.DateHelper(dateItem1).difference(dateItem2).toObject;
    // if values not supplied, use the basic [en] key names defined in TypeDefs
    if (!ordinals)
        ordinals = constants_1.DefaultDateTimeObjectLabels;
    // output format for date parts
    const nouns = (count, value) => {
        return `${count} ${count > 1 ? value.plural : value.singular}`;
    };
    // find the first two consecutive non-zero date parts
    if (d.year > 0) {
        result.push(nouns(d.year, ordinals.year));
        if (d.month > 0)
            result.push(nouns(d.month, ordinals.month));
    }
    else if (d.month > 0) {
        result.push(nouns(d.month, ordinals.month));
        if (d.day)
            result.push(nouns(d.day, ordinals.day));
    }
    else if (d.day > 0) {
        result.push(nouns(d.day, ordinals.day));
        if (d.hour)
            result.push(nouns(d.hour, ordinals.hour));
    }
    else if (d.hour > 0) {
        result.push(nouns(d.hour, ordinals.hour));
        if (d.minute)
            result.push(nouns(d.minute, ordinals.minute));
    }
    else if (d.minute > 0) {
        result.push(nouns(d.minute, ordinals.minute));
        if (d.second > 0)
            result.push(nouns(d.second, ordinals.second));
    }
    else if (d.second > 0)
        result.push(nouns(d.second, ordinals.second));
    return result.join(" ").trim();
};
/** -<>---------------------------------------------------------------------<>-
 *
 * @description Export declaration for TimeUtils
 *
 */
exports.timeConstants = _constants;
exports.timeCategoryInDays = _timeCategoryInDays;
exports.keyNameForDayOfWeek = _keyNameForDayOfWeek;
exports.isoFormattedDate = _isoFormattedDate;
exports.sqlFormattedDate = _sqlFormattedDate;
exports.reportFormattedDate = _reportFormattedDate;
exports.reportFormattedDateArray = _reportFormattedDateArray;
exports.formattedDate = _formattedDate;
exports.timeObjectFromSeconds = _timeObjectFromSeconds;
exports.timeFormatFromSeconds = _timeFormatFromSeconds;
exports.minutesFromSeconds = _minutesFromSeconds;
exports.minutesFromMilliseconds = _minutesFromMilliseconds;
exports.minutesToMilliseconds = _minutesToMilliseconds;
exports.monthOfDate = _monthOfDate;
exports.date = _getNewDateHelper;
exports.months = new month_label_helper_1.MonthLabelHelper();
exports.getTwoHighestNonZeroOrdinals = _getTwoHighestNonZeroOrdinals;
exports.autoFormatDuration = _autoFormatDuration;
/**
 * Current functionality mapping in Time.js <=> TimeUtils.js
 * [x] timeCategoryInDays: function(category)   => Retained as-is
 * [x] getMoment: function(date)                => RENAMED - use the Bridge Class .date(date) instead
 * [x] defDateFormat: function(date, time)      => RENAMED - use reportFormattedDate
 * [x] formatDates: function(dateArr, time)     => RENAMED - use reportFormattedDateArray
 * [ ] formatTime: function(time)               => DEPRECATED - use timeFormatFromSeconds for string format'hh:mm:ss'
 * [x] timeFromSeconds: function(seconds)       => RENAMED - use timeObjectFromSeconds for object format h,m,s
 * [x] secondsToMinutes: function(seconds)      => RENAMED - use minutesFromSeconds with format argument
 * [x] milisToMins: function(miliSeconds)       => RENAMED - use minutesFromMilliseconds with format argument
 * [x] miliToMinutes: function(miliSeconds)     => RENAMED - use minutesFromMilliseconds with format argument
 * [x] minsToMilis: function(mins)              => RENAMED - use minutesToMilliseconds
 *
 * Current Functionality in other helpers.
 * [x] Time.getMoment().format() & moment.tz(tz).format() - should be replaced by TimeUtils.isoFormattedDate()
 * [x] moment(<date>).format('<format string>') - should be replaced by TimeUtils.formattedDate(date, format)
 * [x] moment(<date>) + add/subtract/diff/value of time unit - should be replaced by .date(<d>).plus|minus|etc
 *
 * New Functionality from other known requirements
 * [x] keyNameForDayOfWeek - returns a lowercase string 'key' value based on the day of week index specified.
 * [x] monthOfDate - returns a 1-based index of the month for the given date.
 * [x] sqlFormattedDate - returns a date string in standard SQL format 2017-04-20 11:32:00-04:00
 * [x] timeFormatFromSeconds - replaces the composite function Time.formatTime(Time.timeFromSeconds(seconds))
 * [x] formattedDate - returns a date string from one of the specified formats in TimeUtils.timeConstants.formats.
 *     Coverage includes: moment.formats: x ll L LL LLL LLLL, also ISO, SQL & Time
 *     Other manual formats supplied are:
 *     (1) MMM DD, YYYY HH:mm' now DateTime.medium24Hr (same as _reportFormattedDate with time option)
 *     (2) MM-DD-YYYY HH:mm:ssz SqlUtils.convertToDate is now TimeUtils.formattedDate(<date>, Date.DateTime.monthFirstZ)
 *         WARNING:The new format has a 4 character tz not 2
 * [x] Performance timer - high precision timer for debugging code blocks.
 * [x] date - A fluent DateTime API for date manipulation, comparison and fetching unit values.
 *     Shortcut date functions are retained in TimeUtils for working with date formats that ALWAYS add
 *     the default time zone before formatting. The 'date' class will create dates in UTC by default
 *     and output formatted dates in that timezone unless otherwise instructed.
 *     Possible functions include:
 *      (1) add 3 days to this-date, compare with that-date, add a time zone and format.
 *      (2) how many seconds | hours | days etc are there between these 2 dates.
 *      (3) is this [date] before/after has the same 'month|day|week|etc' as that [date]
 * [x] months - A wrapper class for month labels in the form "labels.MONTHNAME". Allows the user to
 *     specify the label by month number (1-12), by enum value monthLabel.JANUARY or direct property getter.
 *     Proprty getters are a direct alias of the values contained in the base ENUM structure.
 * [x] getTwoHighestNonZeroOrdinals - Calculates the difference between two dates and filters the results
 *     to return the highest two non-zero date parts. e.g. 1 month 2 days, 6 hours 34 minutes, 3 months 1 second
 *     An optional parameter takes a structure of labels to format the result.
 *     E.g. translated labels for the users' language
 * [x] autoFormatDuration - similar to getTwoHighestNonZeroOrdinals but will only return two ordinals if they
 *     are consecutive. This avoids the scenario of 3 months 1 second, returning 3 months in this case.
 */
