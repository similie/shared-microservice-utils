/* eslint-disable max-len */
/* eslint-disable indent */
/**
 * @description Date parser functions for converting a date like values
 * into a number of epoch milliseconds.
 *
 * @requires
 *    Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/manual/install.html
 *    IsThis - validator class using lodash functions for validation
 */

import { DateTime } from "luxon";
import { IsThis } from "../general/is-this";

import { DateHelper } from "./date-helper";
import { DateComparisionHelper } from "./date-comparision-helper";
import { TimePeriod, DateTimeValue } from "../constants";

/** @summary Private members ----------------------------------------------- */

/**
 * @private
 * @description Attempts to parse a date time from an ISO formatted string.
 * @param {string} o An ISO formatted date string
 * @returns {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
const tryParseISO = function (o: string) {
  const dt = DateTime.fromISO(o);
  return dt.isValid ? dt.valueOf() : 0;
};

/**
 * @private
 * @description Attempts to parse a date time from a SQL formatted string.
 * @param {string} o A SQL formatted date string
 * @returns {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
const tryParseSQL = function (o: string) {
  const dt = DateTime.fromSQL(o);
  return dt.isValid ? dt.valueOf() : 0;
};

/**
 * @private
 * @description Attempts to parse a date time from a number of milliseconds
 * @param {number} o The number of milliseconds to parse
 * @returns {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
const tryParseMillis = function (o: number) {
  const dt = DateTime.fromMillis(o);
  return dt.isValid ? dt.valueOf() : 0;
};

/**
 * @private
 * @description Attempts to parse a date time from a JS Date object
 * @param {Date} o A JS Date object
 * @returns {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
const tryParseJSDate = function (o: Date) {
  const dt = DateTime.fromJSDate(o);
  return dt.isValid ? dt.valueOf() : 0;
};

/**
 *
 * @param {object} o An object representing a date[time] value
 * @returns {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
const tryParseDateTypeObject = function (o: object) {
  if (!IsThis(o).anObject) return 0;

  const objectName = o.constructor.name;
  let result = 0;

  switch (objectName) {
    case "DateTime":
      result = o.valueOf() as number;
      break;

    case "DateHelper":
      result = (o as DateHelper).toMillis;
      break;

    case "DateComparisionHelper":
      result = (o as DateComparisionHelper).toMillis;
      break;

    case "Date":
      result = tryParseJSDate(o as Date);
      break;

    default:
      result = 0;
      break;
  }

  return result;
};

/**
 * @private
 * @description Attempts to parse a date time using the built-in JS Date
 * functionality.
 * @param {any} o The item to try and parse.
 * @return {number} The number of epoch milliseconds or zero if the date
 * couldn't be parsed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fallbackParser = function (o: any) {
  const dt = typeof o === "string" ? Date.parse(o) : new Date(o).valueOf();
  return Number.isNaN(dt) ? 0 : dt;
};

/**
 * @private
 * @description Parser function that attempts to take an unknown date/time
 * input form and create a date from it. Utilises the Try[Format] functions
 * to do the heavy lifting.
 * @param {DateTimeValue} value A JS Date object, a date formatted string,
 * an Epoch number of milliseconds or an object that represents a date.
 * @returns {number} Epoch milliseconds or zero if the function failed to parse the input
 */
const ingestDate = function (value: DateTimeValue) {
  let result = 0;
  const thisIs = IsThis(value);

  if (thisIs.aString) result = tryParseISO(value as string);
  if (result === 0 && thisIs.aString) result = tryParseSQL(value as string);
  if (result === 0 && thisIs.aNumber) result = tryParseMillis(value as number);
  if (result === 0 && thisIs.anObject) {
    result = tryParseDateTypeObject(value as object);
  }
  if (result === 0) result = fallbackParser(value);

  return result;
};

/** @summary Public, exported members -------------------------------------- */

/**
 * @description Guard function that will throw an error if the specified date
 * parameter could not be converted into a valid DateTime structure.
 * @param {DateTimeValue} value A date-like value containing a parseable date
 * or an object representing a date.
 * @returns {number} Epoch milliseconds corresponding to the specified date
 */
const _guardInputDate = function (value: DateTimeValue) {
  const result = ingestDate(value);
  if (result === 0) {
    throw new Error(
      `The DateTimeParser was expecting a date value that could be converted into a date, got ${typeof value}`,
    );
  }
  return result;
};

/**
 * @description Creates a date from the specified parameter (or the current
 * date if the input parameter is falsy). NB this function always returns a
 * value in milliseconds that can be converted into a DateTime object. If the
 * caller has to ensure that the input parameter is a valid date-like variable
 * it should call [guardInputDate] which will throw an error if the parameter
 * could not be parsed into a DateTime object.
 * @param {DateTimeValue} value A date-like value containing a parseable date,
 * an object representing a date or a falsy value, e.g. Null, empty string etc.
 * If falsy, the function will return the current date.
 * @returns {number} Epoch milliseconds corresponding to the specified date
 */
const _parseValueOrNow = function (value: DateTimeValue) {
  let result = 0;
  if (value) result = ingestDate(value);
  if (result === 0) result = DateTime.now().toMillis();
  return result;
};

/**
 * @description Converts a TimePeriod Enum value into an object identifier that
 * can be used to query specifc time properties of a Luxon Duration.
 * Eg 'hours', 'minutes', 'days'
 * @param {TimePeriod} timePeriod One of the TimePeriod enum values
 * @returns {string} The corresponding Luxon Duration object identifier
 */
function _timePeriodToDurationIdentifier(timePeriod: TimePeriod) {
  let result = "";
  switch (timePeriod) {
    case TimePeriod.milliseconds:
      result = "milliseconds";
      break;
    case TimePeriod.seconds:
      result = "seconds";
      break;
    case TimePeriod.minutes:
      result = "minutes";
      break;
    case TimePeriod.hours:
      result = "hours";
      break;
    case TimePeriod.days:
      result = "days";
      break;
    case TimePeriod.weeks:
      result = "weeks";
      break;
    case TimePeriod.months:
      result = "months";
      break;
    case TimePeriod.years:
      result = "years";
      break;
    default:
      result = "milliseconds";
      break;
  }
  return result;
}

/**
 * @description Converts a TimePeriod Enum value into an object identifier that
 * can be used to query specifc time properties of a Luxon DateTime.
 * Eg 'hour', 'minute', 'day'
 * @param {TimePeriod} timePeriod One of the TimePeriod enum values
 * @returns {string} The corresponding Luxon Date-part object identifier
 */
function _timePeriodToDateTimeObjectIdentifier(timePeriod: TimePeriod) {
  const result = _timePeriodToDurationIdentifier(timePeriod);
  return result.substring(0, result.length - 1); // strip trailing 's'
}

/** @summary Exports declaration */
export const parseValueOrNow = _parseValueOrNow;
export const guardInputDate = _guardInputDate;
export const timePeriodToDurationIdentifier = _timePeriodToDurationIdentifier;
export const timePeriodToDateTimeObjectIdentifier =
  _timePeriodToDateTimeObjectIdentifier;
