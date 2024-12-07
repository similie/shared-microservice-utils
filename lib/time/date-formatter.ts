/* eslint-disable max-len */
/* eslint-disable indent */
import { DateTime } from "luxon";

import { IsThis } from "../general/is-this";
import { DateTimeFormats, DateTimeObject } from "../constants";

/**
 * @description Checks the specified format against the options available
 * in the DateTimeFormats structure. If found, returns the format supplied,
 * otherwise returns DateTimeFormat.ISO as a default
 * @param {string} format One of the DateTimeFormat options
 * @returns {string} A format string
 */
const _validDateTimeFormatOrISO = function (format: string): string {
  let result = DateTimeFormats.ISO;
  if (IsThis(format).aValidDateTimeFormat) {
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
function _formatDate(dateItem: DateTime, format: string) {
  if (!dateItem.isValid) {
    throw new Error(`Private function DateTimeFormatter.formatDate was asked to
    format an invalid date. ${dateItem.invalidExplanation}`);
  }

  const fmt = _validDateTimeFormatOrISO(format);
  let result = "";

  switch (fmt) {
    case DateTimeFormats.ISO:
      result =
        dateItem
          .set({ millisecond: 0 })
          .toISO({ suppressMilliseconds: true }) || "";
      break;
    case DateTimeFormats.SQL:
      result = dateItem.toSQL() || "";
      break;
    case DateTimeFormats.Device:
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
function _formatDateForDevice(dateItem: DateTime) {
  const date = dateItem.toObject() as DateTimeObject;

  const result =
    `${date.hour}&` +
    `${date.minute}&` +
    `${date.second}&` +
    `${date.day}&` +
    `${date.month}&` +
    `${date.year}`;

  return result;
}

/** @summary Exports declaration */
export const validDateTimeFormatOrISO = _validDateTimeFormatOrISO;
export const formatDate = _formatDate;
export const formatDateForDevice = _formatDateForDevice;
