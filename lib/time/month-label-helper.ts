/* eslint-disable indent */
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
export class MonthLabelHelper {
  /** @description Get the label corresponding to January */
  public get January() {
    return this.byInteger(1);
  }

  /** @description Get the label corresponding to February */
  public get February() {
    return this.byInteger(2);
  }

  /** @description Get the label corresponding to March */
  public get March() {
    return this.byInteger(3);
  }

  /** @description Get the label corresponding to April */
  public get April() {
    return this.byInteger(4);
  }

  /** @description Get the label corresponding to May */
  public get May() {
    return this.byInteger(5);
  }

  /** @description Get the label corresponding to June */
  public get June() {
    return this.byInteger(6);
  }

  /** @description Get the label corresponding to July */
  public get July() {
    return this.byInteger(7);
  }

  /** @description Get the label corresponding to August */
  public get August() {
    return this.byInteger(8);
  }

  /** @description Get the label corresponding to September */
  public get September() {
    return this.byInteger(9);
  }

  /** @description Get the label corresponding to October */
  public get October() {
    return this.byInteger(10);
  }

  /** @description Get the label corresponding to November */
  public get November() {
    return this.byInteger(11);
  }

  /** @description Get the label corresponding to December */
  public get December() {
    return this.byInteger(12);
  }

  /**
   * @description Returns the number of the month corresponding to it's label.
   * Throws an error if the label wasn't one of the expected ENUM values.
   * @param {MonthLabel} month one of the Month label ENUM values
   * @returns {number} An integer between 1 and 12
   */
  public byLabel(month: MonthLabel) {
    switch (month) {
      case MonthLabel.JANUARY:
        return 1;
      case MonthLabel.FEBRUARY:
        return 2;
      case MonthLabel.MARCH:
        return 3;
      case MonthLabel.APRIL:
        return 4;
      case MonthLabel.MAY:
        return 5;
      case MonthLabel.JUNE:
        return 6;
      case MonthLabel.JULY:
        return 7;
      case MonthLabel.AUGUST:
        return 8;
      case MonthLabel.SEPTEMBER:
        return 9;
      case MonthLabel.OCTOBER:
        return 10;
      case MonthLabel.NOVEMBER:
        return 11;
      case MonthLabel.DECEMBER:
        return 12;
      default:
        throw new Error(
          `MonthLabelHelper.byLabel expected a value from the MonthLabel enum,
            got ${month}`,
        );
    }
  }

  /**
   * @description Returns the label corresponding to the month number.
   * Throws an error if a value outside 1 to 12 was requested.
   * @param {number} month The number of the month
   * @returns {string} One of the MonthLabel ENUM values
   */
  public byInteger(month: number) {
    switch (month) {
      case 1:
        return MonthLabel.JANUARY;
      case 2:
        return MonthLabel.FEBRUARY;
      case 3:
        return MonthLabel.MARCH;
      case 4:
        return MonthLabel.APRIL;
      case 5:
        return MonthLabel.MAY;
      case 6:
        return MonthLabel.JUNE;
      case 7:
        return MonthLabel.JULY;
      case 8:
        return MonthLabel.AUGUST;
      case 9:
        return MonthLabel.SEPTEMBER;
      case 10:
        return MonthLabel.OCTOBER;
      case 11:
        return MonthLabel.NOVEMBER;
      case 12:
        return MonthLabel.DECEMBER;
      default:
        throw new Error(
          `MonthLabelHelper.byInteger expected a value between 1 and 12,
            got ${month}`,
        );
    }
  }

  /**
   * @description Creates and returns an array of label.MONTHNAME's for
   * each month.
   * @returns {array<string>} An array of labels corresponding to the values
   * specified in the MonthLabel ENUM
   */
  public all() {
    return [
      MonthLabel.JANUARY,
      MonthLabel.FEBRUARY,
      MonthLabel.MARCH,
      MonthLabel.APRIL,
      MonthLabel.MAY,
      MonthLabel.JUNE,
      MonthLabel.JULY,
      MonthLabel.AUGUST,
      MonthLabel.SEPTEMBER,
      MonthLabel.OCTOBER,
      MonthLabel.NOVEMBER,
      MonthLabel.DECEMBER,
    ];
  }
}
