/**
 * @description Class for accessing system wide labels.MONTHNAME constants
 * previously surfaced in api/Services/Const.js
 * Used internally by the TimeUtils.months to provide a consistent interface
 * with previous use-case in /api/models/Report.js
 */
import { MonthLabel } from "../constants";
/**
 * @description Class for surfacing labels.MONTHNAME constants with
 * function and property getters for returning a month number for a label and a
 * label for a month number. Individual property getters return their
 * respective label counterparts and are provided for convenience. You could
 * import MonthLabel from TypeDefs (or TimeUtils.timeConstants.ENUM.monthLabels to
 * achieve the same effect.
 */
export declare class MonthLabelHelper {
    /** @description Get the label corresponding to January */
    get January(): MonthLabel;
    /** @description Get the label corresponding to February */
    get February(): MonthLabel;
    /** @description Get the label corresponding to March */
    get March(): MonthLabel;
    /** @description Get the label corresponding to April */
    get April(): MonthLabel;
    /** @description Get the label corresponding to May */
    get May(): MonthLabel;
    /** @description Get the label corresponding to June */
    get June(): MonthLabel;
    /** @description Get the label corresponding to July */
    get July(): MonthLabel;
    /** @description Get the label corresponding to August */
    get August(): MonthLabel;
    /** @description Get the label corresponding to September */
    get September(): MonthLabel;
    /** @description Get the label corresponding to October */
    get October(): MonthLabel;
    /** @description Get the label corresponding to November */
    get November(): MonthLabel;
    /** @description Get the label corresponding to December */
    get December(): MonthLabel;
    /**
     * @description Returns the number of the month corresponding to it's label.
     * Throws an error if the label wasn't one of the expected ENUM values.
     * @param {MonthLabel} month one of the Month label ENUM values
     * @returns {number} An integer between 1 and 12
     */
    byLabel(month: MonthLabel): 1 | 7 | 2 | 4 | 8 | 10 | 3 | 5 | 6 | 9 | 11 | 12;
    /**
     * @description Returns the label corresponding to the month number.
     * Throws an error if a value outside 1 to 12 was requested.
     * @param {number} month The number of the month
     * @returns {string} One of the MonthLabel ENUM values
     */
    byInteger(month: number): MonthLabel;
    /**
     * @description Creates and returns an array of label.MONTHNAME's for
     * each month.
     * @returns {array<string>} An array of labels corresponding to the values
     * specified in the MonthLabel ENUM
     */
    all(): MonthLabel[];
}
