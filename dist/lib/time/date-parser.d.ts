/**
 * @description Date parser functions for converting a date like values
 * into a number of epoch milliseconds.
 *
 * @requires
 *    Luxon, modern version of moment (and twix), see https://moment.github.io/luxon/docs/manual/install.html
 *    IsThis - validator class using lodash functions for validation
 */
import { TimePeriod, DateTimeValue } from "../constants";
/**
 * @description Converts a TimePeriod Enum value into an object identifier that
 * can be used to query specifc time properties of a Luxon Duration.
 * Eg 'hours', 'minutes', 'days'
 * @param {TimePeriod} timePeriod One of the TimePeriod enum values
 * @returns {string} The corresponding Luxon Duration object identifier
 */
declare function _timePeriodToDurationIdentifier(timePeriod: TimePeriod): string;
/**
 * @description Converts a TimePeriod Enum value into an object identifier that
 * can be used to query specifc time properties of a Luxon DateTime.
 * Eg 'hour', 'minute', 'day'
 * @param {TimePeriod} timePeriod One of the TimePeriod enum values
 * @returns {string} The corresponding Luxon Date-part object identifier
 */
declare function _timePeriodToDateTimeObjectIdentifier(timePeriod: TimePeriod): string;
/** @summary Exports declaration */
export declare const parseValueOrNow: (value: DateTimeValue) => number;
export declare const guardInputDate: (value: DateTimeValue) => number;
export declare const timePeriodToDurationIdentifier: typeof _timePeriodToDurationIdentifier;
export declare const timePeriodToDateTimeObjectIdentifier: typeof _timePeriodToDateTimeObjectIdentifier;
export {};
