/**
 * @description Class for comparing a time period across two dates.
 * @requires
 *     Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/
 */
import { TimePeriod, DateTimeValue } from "../constants";
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
export declare class DateComparisionHelper {
    private _dt;
    private _timePeriod;
    /**
     * @description Constructor. Requires a date-like value and one of the
     * TimePeriod enum values. Accepted objects in JS Date, DateHelper and
     * this class.
     * If the date-like value is falsy, the current date
     * will be initialised.
     * @param {DateTimeValue} value
     * @param {TimePeriod} timePeriod One of the TimePeriod Enum values
     */
    constructor(value: DateTimeValue, timePeriod: TimePeriod);
    /**
     * @description Compares the date and time period [used to construct this
     * instance of the class] with the date passed into this function.
     * @param { string | number | Date | object } thisDate the date to compare
     * @returns {boolean} Yes if the two dates have the same time period, false
     * otherwise.
     */
    as(thisDate: DateTimeValue): boolean;
    /**
     * @description Getter for the internal epoch milliseconds of the date used
     * to create this instance of the class.
     * @returns {number} Number of milliseconds
     */
    get toMillis(): number;
}
