"use strict";
/* eslint-disable max-len */
/**
 * @description Class for comparing a time period across two dates.
 * Used internally by the DateHelper class.
 *
 * @requires
 *     Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/
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
exports.DateDifferenceHelper = void 0;
const luxon_1 = require("luxon");
const constants_1 = require("../constants");
const DateTimeParser = __importStar(require("./date-parser"));
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
class DateDifferenceHelper {
    /**
     * @description Constructor. Requires two date-like values to compare.
     * If the date-like values are falsy, the current date will be initialised.
     * Note. If you construct a comparator with two dates the same, the diff
     * will always return zero!
     * @param {DateTimeValue} date1
     * @param {DateTimeValue} date2
     */
    constructor(date1, date2) {
        const ms1 = DateTimeParser.parseValueOrNow(date1);
        const ms2 = DateTimeParser.parseValueOrNow(date2);
        this._dt1 = luxon_1.DateTime.fromMillis(ms1);
        this._dt2 = luxon_1.DateTime.fromMillis(ms2);
        this._timePeriod = 0;
    }
    /**
     * @private
     * @description Computes the difference between Date1 & Date2 in the units
     * specified. Throws an error if there is no valid TimePeriod specified.
     * @returns {number} The difference in the time period unit
     */
    __differenceInTimePeriod() {
        if (this._timePeriod < 1) {
            throw new Error("DateDifferenceHelper.__differenceInTimePeriod cannot compute a time difference without a time period");
        }
        const unit = DateTimeParser.timePeriodToDurationIdentifier(this._timePeriod);
        this._timePeriod = 0; // reset
        return this._dt1
            .diff(this._dt2, unit)
            .as(unit);
    }
    /**
     * @description Get the difference between the dates in milliseconds
     * @example date1.difference(date2).inMilliseconds
     */
    get inMilliseconds() {
        this._timePeriod = constants_1.TimePeriod.milliseconds;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in seconds
     */
    get inSeconds() {
        this._timePeriod = constants_1.TimePeriod.seconds;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in minutes
     */
    get inMinutes() {
        this._timePeriod = constants_1.TimePeriod.minutes;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in hours
     */
    get inHours() {
        this._timePeriod = constants_1.TimePeriod.hours;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in days
     */
    get inDays() {
        this._timePeriod = constants_1.TimePeriod.days;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in weeks
     */
    get inWeeks() {
        this._timePeriod = constants_1.TimePeriod.weeks;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in months
     */
    get inMonths() {
        this._timePeriod = constants_1.TimePeriod.months;
        return this.__differenceInTimePeriod();
    }
    /**
     * @description Get the difference between the dates in years
     */
    get inYears() {
        this._timePeriod = constants_1.TimePeriod.years;
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
    get toObject() {
        const result = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: this.inMilliseconds,
        };
        // Luxon Duration units are plurals of our internal DateTimeObject
        const d = luxon_1.Duration.fromObject(result).normalize().toObject();
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
exports.DateDifferenceHelper = DateDifferenceHelper;
