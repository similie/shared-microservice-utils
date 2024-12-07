"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateForDevice = exports.formatDate = exports.validDateTimeFormatOrISO = void 0;
const is_this_1 = require("../general/is-this");
const constants_1 = require("../constants");
/**
 * @description Checks the specified format against the options available
 * in the DateTimeFormats structure. If found, returns the format supplied,
 * otherwise returns DateTimeFormat.ISO as a default
 * @param {string} format One of the DateTimeFormat options
 * @returns {string} A format string
 */
const _validDateTimeFormatOrISO = function (format) {
    let result = constants_1.DateTimeFormats.ISO;
    if ((0, is_this_1.IsThis)(format).aValidDateTimeFormat) {
        result = format;
    }
    return result;
};
/**
 * @description Format the valid DateTime object in the specified format
 * (or ISO if the format wasn't one of the recognised formats). Throws an error
 * if the DateTime is not valid.
 * @param {DateTime} dateItem A valid DateTime object.
 * @param {string} format  One of the constants.DateTimeFormat options
 * @returns {string} A date time string in the specified format or ISO format
 * if no format specifier was supplied or was not recognised.
 */
function _formatDate(dateItem, format) {
    if (!dateItem.isValid) {
        throw new Error(`Private function DateTimeFormatter.formatDate was asked to
    format an invalid date. ${dateItem.invalidExplanation}`);
    }
    const fmt = _validDateTimeFormatOrISO(format);
    let result = "";
    switch (fmt) {
        case constants_1.DateTimeFormats.ISO:
            result =
                dateItem
                    .set({ millisecond: 0 })
                    .toISO({ suppressMilliseconds: true }) || "";
            break;
        case constants_1.DateTimeFormats.SQL:
            result = dateItem.toSQL() || "";
            break;
        case constants_1.DateTimeFormats.Device:
            result = _formatDateForDevice(dateItem);
            break;
        default:
            result = dateItem.setLocale("en").toFormat(format);
            break;
    }
    return result;
}
/**
 * @description Specialist format for DeviceController.js
 * @param {DateTime} dateItem Luxon DateTime object
 * @returns {string} A string formatted for the DeviceController use-case
 */
function _formatDateForDevice(dateItem) {
    const date = dateItem.toObject();
    const result = `${date.hour}&` +
        `${date.minute}&` +
        `${date.second}&` +
        `${date.day}&` +
        `${date.month}&` +
        `${date.year}`;
    return result;
}
/** @summary Exports declaration */
exports.validDateTimeFormatOrISO = _validDateTimeFormatOrISO;
exports.formatDate = _formatDate;
exports.formatDateForDevice = _formatDateForDevice;
