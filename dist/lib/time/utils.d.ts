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
import { PerformanceTimer } from "./perf-timer";
import { DateHelper } from "./date-helper";
import { MonthLabelHelper } from "./month-label-helper";
import { TimePeriod, MonthLabel, TimerInterval, DateTimeValue, TimeObject, DateTimeObjectLabels } from "../constants";
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
declare function _formattedDate(dateItem: DateTimeValue, format: string): string;
/** -<>---------------------------------------------------------------------<>-
 *
 * @description Export declaration for TimeUtils
 *
 */
export declare const timeConstants: {
    /** @description The default IANA Timezone */
    timeZone: string;
    /** @description Range of available date and time formats */
    formats: {
        Date: {
            monthFirst: string;
            medium: string;
            full: string;
        };
        DateTime: {
            medium24Hr: string;
            fullAmPm: string;
            monthFirstZ: string;
            verboseAmPm: string;
        };
        Time: {
            MinsSecs: {
                asDecimal: string;
                asTime: string;
            };
            HoursMinsSecs: string;
            UnixMillis: string;
        };
        Device: string;
        ISO: string;
        SQL: string;
    };
    /** @description Labels for formatting a DateTimeObject structure */
    dateTimeObjectFormatLabels: {
        default: DateTimeObjectLabels;
        translationKeys: DateTimeObjectLabels;
    };
    ENUMS: {
        /** @description Range of duration specifiers for Date/time math */
        timePeriods: typeof TimePeriod;
        /** @description Range of labels corresponding to month names */
        monthLabels: typeof MonthLabel;
        /** @description Scheduled event time period specifiers */
        timers: typeof TimerInterval;
    };
    /**
     * @description
     * definition for the empty parameter to create a date using the
     * current date and time */
    now_: string;
};
export declare const timeCategoryInDays: (category: string) => number;
export declare const keyNameForDayOfWeek: (dayOfWeek: number) => string;
export declare const isoFormattedDate: (dateItem: Date | string | number) => string;
export declare const sqlFormattedDate: (dateItem: Date | string | number) => string;
export declare const reportFormattedDate: (dateOrString: Date | string, shouldAppendTime: boolean) => string;
export declare const reportFormattedDateArray: (dateArray: Array<Date | string>, shouldAppendTime: boolean) => string[];
export declare const formattedDate: typeof _formattedDate;
export declare const timeObjectFromSeconds: (seconds: number) => TimeObject;
export declare const timeFormatFromSeconds: (seconds: number) => string;
export declare const minutesFromSeconds: (seconds: number, toFormat: string) => string;
export declare const minutesFromMilliseconds: (milliseconds: number, toFormat: string) => string;
export declare const minutesToMilliseconds: (mins: number) => number;
export declare const monthOfDate: (dateOrString: Date | string) => number;
export { PerformanceTimer };
export declare const date: (dateItem: DateTimeValue) => DateHelper;
export declare const months: MonthLabelHelper;
export declare const getTwoHighestNonZeroOrdinals: (dateItem1: DateTimeValue, dateItem2: DateTimeValue, ordinals?: DateTimeObjectLabels) => string;
export declare const autoFormatDuration: (dateItem1: DateTimeValue, dateItem2: DateTimeValue, ordinals?: DateTimeObjectLabels) => string;
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
