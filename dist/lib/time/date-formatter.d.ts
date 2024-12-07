import { DateTime } from "luxon";
/**
 * @description Format the valid DateTime object in the specified format
 * (or ISO if the format wasn't one of the recognised formats). Throws an error
 * if the DateTime is not valid.
 * @param {DateTime} dateItem A valid DateTime object.
 * @param {string} format  One of the constants.DateTimeFormat options
 * @returns {string} A date time string in the specified format or ISO format
 * if no format specifier was supplied or was not recognised.
 */
declare function _formatDate(dateItem: DateTime, format: string): string;
/**
 * @description Specialist format for DeviceController.js
 * @param {DateTime} dateItem Luxon DateTime object
 * @returns {string} A string formatted for the DeviceController use-case
 */
declare function _formatDateForDevice(dateItem: DateTime): string;
/** @summary Exports declaration */
export declare const validDateTimeFormatOrISO: (format: string) => string;
export declare const formatDate: typeof _formatDate;
export declare const formatDateForDevice: typeof _formatDateForDevice;
export {};
