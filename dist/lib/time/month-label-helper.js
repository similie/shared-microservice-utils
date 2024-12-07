"use strict";
/* eslint-disable indent */
/**
 * @description Class for accessing system wide labels.MONTHNAME constants
 * previously surfaced in api/Services/Const.js
 * Used internally by the TimeUtils.months to provide a consistent interface
 * with previous use-case in /api/models/Report.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthLabelHelper = void 0;
const constants_1 = require("../constants");
/**
 * @description Class for surfacing labels.MONTHNAME constants with
 * function and property getters for returning a month number for a label and a
 * label for a month number. Individual property getters return their
 * respective label counterparts and are provided for convenience. You could
 * import MonthLabel from TypeDefs (or TimeUtils.timeConstants.ENUM.monthLabels to
 * achieve the same effect.
 */
class MonthLabelHelper {
    /** @description Get the label corresponding to January */
    get January() {
        return this.byInteger(1);
    }
    /** @description Get the label corresponding to February */
    get February() {
        return this.byInteger(2);
    }
    /** @description Get the label corresponding to March */
    get March() {
        return this.byInteger(3);
    }
    /** @description Get the label corresponding to April */
    get April() {
        return this.byInteger(4);
    }
    /** @description Get the label corresponding to May */
    get May() {
        return this.byInteger(5);
    }
    /** @description Get the label corresponding to June */
    get June() {
        return this.byInteger(6);
    }
    /** @description Get the label corresponding to July */
    get July() {
        return this.byInteger(7);
    }
    /** @description Get the label corresponding to August */
    get August() {
        return this.byInteger(8);
    }
    /** @description Get the label corresponding to September */
    get September() {
        return this.byInteger(9);
    }
    /** @description Get the label corresponding to October */
    get October() {
        return this.byInteger(10);
    }
    /** @description Get the label corresponding to November */
    get November() {
        return this.byInteger(11);
    }
    /** @description Get the label corresponding to December */
    get December() {
        return this.byInteger(12);
    }
    /**
     * @description Returns the number of the month corresponding to it's label.
     * Throws an error if the label wasn't one of the expected ENUM values.
     * @param {MonthLabel} month one of the Month label ENUM values
     * @returns {number} An integer between 1 and 12
     */
    byLabel(month) {
        switch (month) {
            case constants_1.MonthLabel.JANUARY:
                return 1;
            case constants_1.MonthLabel.FEBRUARY:
                return 2;
            case constants_1.MonthLabel.MARCH:
                return 3;
            case constants_1.MonthLabel.APRIL:
                return 4;
            case constants_1.MonthLabel.MAY:
                return 5;
            case constants_1.MonthLabel.JUNE:
                return 6;
            case constants_1.MonthLabel.JULY:
                return 7;
            case constants_1.MonthLabel.AUGUST:
                return 8;
            case constants_1.MonthLabel.SEPTEMBER:
                return 9;
            case constants_1.MonthLabel.OCTOBER:
                return 10;
            case constants_1.MonthLabel.NOVEMBER:
                return 11;
            case constants_1.MonthLabel.DECEMBER:
                return 12;
            default:
                throw new Error(`MonthLabelHelper.byLabel expected a value from the MonthLabel enum,
            got ${month}`);
        }
    }
    /**
     * @description Returns the label corresponding to the month number.
     * Throws an error if a value outside 1 to 12 was requested.
     * @param {number} month The number of the month
     * @returns {string} One of the MonthLabel ENUM values
     */
    byInteger(month) {
        switch (month) {
            case 1:
                return constants_1.MonthLabel.JANUARY;
            case 2:
                return constants_1.MonthLabel.FEBRUARY;
            case 3:
                return constants_1.MonthLabel.MARCH;
            case 4:
                return constants_1.MonthLabel.APRIL;
            case 5:
                return constants_1.MonthLabel.MAY;
            case 6:
                return constants_1.MonthLabel.JUNE;
            case 7:
                return constants_1.MonthLabel.JULY;
            case 8:
                return constants_1.MonthLabel.AUGUST;
            case 9:
                return constants_1.MonthLabel.SEPTEMBER;
            case 10:
                return constants_1.MonthLabel.OCTOBER;
            case 11:
                return constants_1.MonthLabel.NOVEMBER;
            case 12:
                return constants_1.MonthLabel.DECEMBER;
            default:
                throw new Error(`MonthLabelHelper.byInteger expected a value between 1 and 12,
            got ${month}`);
        }
    }
    /**
     * @description Creates and returns an array of label.MONTHNAME's for
     * each month.
     * @returns {array<string>} An array of labels corresponding to the values
     * specified in the MonthLabel ENUM
     */
    all() {
        return [
            constants_1.MonthLabel.JANUARY,
            constants_1.MonthLabel.FEBRUARY,
            constants_1.MonthLabel.MARCH,
            constants_1.MonthLabel.APRIL,
            constants_1.MonthLabel.MAY,
            constants_1.MonthLabel.JUNE,
            constants_1.MonthLabel.JULY,
            constants_1.MonthLabel.AUGUST,
            constants_1.MonthLabel.SEPTEMBER,
            constants_1.MonthLabel.OCTOBER,
            constants_1.MonthLabel.NOVEMBER,
            constants_1.MonthLabel.DECEMBER,
        ];
    }
}
exports.MonthLabelHelper = MonthLabelHelper;
