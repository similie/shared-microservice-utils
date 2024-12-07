"use strict";
/**
 * @description Class for comparing a time period across two dates.
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
exports.DateComparisionHelper = void 0;
const luxon_1 = require("luxon");
const DateTimeParser = __importStar(require("./date-parser"));
/**
 * @description Class for comparing if two dates have the same period of time.
 * Used internally by the DateHelper class for answering questions like:
 *  if(date(<d>).hasSame(week).as(<d>)) {...}
 * This class provides the final boolean answer to the comparison question.
 *
 * @example
 *    Using DateHelper and DateComparisionHelper
 *    let yesNo = new DateHelper(<d>).plus(1).week.hasSame(month).as(<d2>);
 *    In this example, the method call 'hasSame' returns an instance of this
 *    class in order to perform the final date comparision.
 */
class DateComparisionHelper {
    /**
     * @description Constructor. Requires a date-like value and one of the
     * TimePeriod enum values. Accepted objects in JS Date, DateHelper and
     * this class.
     * If the date-like value is falsy, the current date
     * will be initialised.
     * @param {DateTimeValue} value
     * @param {TimePeriod} timePeriod One of the TimePeriod Enum values
     */
    constructor(value, timePeriod) {
        const ms = DateTimeParser.parseValueOrNow(value);
        this._dt = luxon_1.DateTime.fromMillis(ms);
        this._timePeriod = timePeriod;
    }
    /**
     * @description Compares the date and time period [used to construct this
     * instance of the class] with the date passed into this function.
     * @param { string | number | Date | object } thisDate the date to compare
     * @returns {boolean} Yes if the two dates have the same time period, false
     * otherwise.
     */
    as(thisDate) {
        const ms = DateTimeParser.parseValueOrNow(thisDate);
        const dt2 = luxon_1.DateTime.fromMillis(ms);
        const unit = DateTimeParser.timePeriodToDateTimeObjectIdentifier(this._timePeriod);
        const result = this._dt.hasSame(dt2, unit);
        return result;
    }
    /**
     * @description Getter for the internal epoch milliseconds of the date used
     * to create this instance of the class.
     * @returns {number} Number of milliseconds
     */
    get toMillis() {
        return this._dt.toMillis();
    }
}
exports.DateComparisionHelper = DateComparisionHelper;
