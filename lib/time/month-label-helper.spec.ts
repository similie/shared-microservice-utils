/* eslint-disable max-len */
/** Test rig components */
/** @summary Header files */
import * as TimeUtils from "./utils";

const months = TimeUtils.timeConstants.ENUMS.monthLabels;

describe("MonthLabelHelper", function () {
  /**
   * @summary This section of tests verifies functionality in the
   * MonthLabel Helper class as surfaced in TimeUtils.months
   */

  it("TimeUtils.months creates a new instance of the MonthLabelHelper class", () => {
    const instance = TimeUtils.months;
    const className = "MonthLabelHelper";

    expect(instance.constructor.name).toEqual(className);
  });

  it("MonthLabelHelper returns a numeric value corresponding to the month specified by it's label", () => {
    const candidates = [
      months.JANUARY,
      months.FEBRUARY,
      months.MARCH,
      months.APRIL,
      months.MAY,
      months.JUNE,
      months.JULY,
      months.AUGUST,
      months.SEPTEMBER,
      months.OCTOBER,
      months.NOVEMBER,
      months.DECEMBER,
    ];
    const expectedResults = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let result = 0;
    let expectedResult = 0;

    candidates.forEach((candidate, index) => {
      result = TimeUtils.months.byLabel(candidate);
      expectedResult = expectedResults[index] as number;

      expect(result).toEqual(expectedResult);
    });

    // add the historic FEBRURARY
    result = TimeUtils.months.byLabel(months.FEBRUARY);
    expect(result).toEqual(2);
  });

  it("MonthLabelHelper returns the correct numeric value when the month is specified by the mis-spelled months.FEBRURARY value", () => {
    let result = TimeUtils.months.byLabel(months.FEBRUARY);
    expect(result).toEqual(2);

    result = TimeUtils.months.byLabel(months.FEBRUARY);
    expect(result).toEqual(2);
  });

  it("MonthLabelHelper throws an error when the month label doesn't correspond to a known value", () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      TimeUtils.months.byLabel("rubbish");
    }).toThrow();
  });

  it("MonthLabelHelper returns a month label corresponding to the month specified by number", () => {
    // byInteger
    const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const expectedResults = [
      months.JANUARY,
      months.FEBRUARY,
      months.MARCH,
      months.APRIL,
      months.MAY,
      months.JUNE,
      months.JULY,
      months.AUGUST,
      months.SEPTEMBER,
      months.OCTOBER,
      months.NOVEMBER,
      months.DECEMBER,
    ];
    let result = "";
    let expectedResult = "";

    candidates.forEach((candidate, index) => {
      result = TimeUtils.months.byInteger(candidate);
      expectedResult = expectedResults[index] as string;

      expect(result).toEqual(expectedResult);
    });
  });

  it("MonthLabelHelper throws an error when the month month number isn't between 1 and 12", () => {
    expect(() => {
      TimeUtils.months.byInteger(15);
    }).toThrow();
  });

  it("MonthLabelHelper returns a 12 element array containing the collection of labels when .all is called", () => {
    const allMonths = TimeUtils.months.all();

    expect(Array.isArray(allMonths)).toBe(true);
    expect(allMonths.length).toEqual(12);
    expect(allMonths[6]).toEqual(months.JULY);
  });

  it("MonthLabelHelper property getters return their respective ENUM values", () => {
    const MonthClass = TimeUtils.months;

    expect(MonthClass.January).toEqual(months.JANUARY);
    expect(MonthClass.February).toEqual(months.FEBRUARY);
    expect(MonthClass.March).toEqual(months.MARCH);
    expect(MonthClass.April).toEqual(months.APRIL);
    expect(MonthClass.May).toEqual(months.MAY);
    expect(MonthClass.June).toEqual(months.JUNE);
    expect(MonthClass.July).toEqual(months.JULY);
    expect(MonthClass.August).toEqual(months.AUGUST);
    expect(MonthClass.September).toEqual(months.SEPTEMBER);
    expect(MonthClass.October).toEqual(months.OCTOBER);
    expect(MonthClass.November).toEqual(months.NOVEMBER);
    expect(MonthClass.December).toEqual(months.DECEMBER);
  });
});
