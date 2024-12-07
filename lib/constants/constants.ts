/* eslint-disable max-len */
/**
 * @description Bucket list of custom types, interfaces and enums.
 * May be split into different files if it gets too large.
 * @todo Move to @types/similie-one module in own repo.
 * c.f. other @types/<library>
 */

import { DateTimeObjectLabels } from "./interfaces";

/** @summary Constants and other static references */

export const ONE = {
  DEFAULT_CURRENCY: "USD",
  NULL: null,
  STRING_ONLY: true,
  WITHOUT_GEO: true,
  DONT_ROUND: false,
  ROUND: true,
  ADMIN_TOKEN_GENERATION: 7,
  USER_TOKEN_GENERATION: 2,
  sockets: {
    /** @todo Move to enum */
    FORCE_LOGOUT: "force_logout",
    NEW_MESSAGE: "new_message",
    NEW_TASK_UPDATE: "new_task_update",
    SESSION_EXPIRED: "expired_user_session",
    EXCEL_REPORT_COMPILED: "excel_report_compiled",
  },
  rules: {
    REJECT: -1,
    IRRELEVANT: 0,
    ACCPTED: 1,
  },
  /* timers: moved to TypeDefs.TimerIntervals */
  currencies: {
    USD: {
      symbol: "$",
      key: "USD",
    },
  },
  code: {
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    UNKNOWN_ERROR: 500 /** @summary. alias of Server Error */,
  },
  err: {
    ORGNIZATION_HAS_NO_ASSIGNED_CAREER_PROGRESSION:
      "This organization has not been assinged a career progression",
    USER_MUST_BE_ASSIGNED_ORGANIZATION:
      "This user entity must be assigned and organization",
    ID_PARAM_NOT_PROVIDED: "This Route Requires an ID parameter",
    REQUIRED_PARAMETERS_NOT_SUPPLIED: "errors.REQUIRED_PARAMETERS_NOT_SUPPLIED",
    NON_MEMBERS_NOT_ALLOWED: "errors.NON_MEMBERS_NOT_ALLOWED",
    PROBLEM_INDENTIFY_SITE_ROLE: "errors.PROBLEM_INDENTIFY_SITE_ROLE",
    ENTITY_DOES_NOT_EXIST: "errors.ENTITY_DOES_NOT_EXIST",
    STATE_CHAIN_HACKING_ATTEMPT:
      "This state chain has been corrupted. Possible attempts at hacking this system have been made",
    STATE_CHAIN_PREVIOUS_REQUIRED:
      "To add a new non-genesis state a previous state is required",
    STATE_CHAIN_SIGNED_TRANSACTION:
      "State chains require signed state transactions",
    VALID_ENTITY_REQUIRED: "A valid object entity is required",
    STATE_VALID_SIGNATURE:
      "This valid signature is required before signing this state",
    STATE_OWN_SIGNATURE: "You cannot sign states for other entities",
    TOKEN_ISSUE_FAILURE: "Failed to issue request token",
    APPROVAL_TOKEN_REQUIRED: "Approval token has Expired",
    APPROVAL_TOKEN_NOT_VERIFIED: "This token cannot be verified",
    IMMUTABLE_DATA:
      "This data can no longer be changed because it has already has a valid signature",
    NO_COST_CODE_AMMOUNT: "The ammount value cannot be null",
    NOT_A_COST_CODE_TRANSACTION:
      "A costcode transaction must contain both from and to parameters",
    NOT_PERMITTED_TO_PERFORM_THIS_ACTION:
      "You are not permmitted to perform this action",
    BAD_REQUEST: "warning.INVALID_REQUEST",
    FORBIDDEN: "warning.ACCESS_DENIED",
    SERVER_ERROR: "errors.SERVER_ERROR",
    UNKNOWN_ERROR: "errors.UNKOWN_ERROR",
  },
  ALLOWED: true,
  REJECTED: true,
  SITE_NAME: "mekong",
  /**
   * @description Returns the path to the storage folder for uploads.
   * Refactored from Const.js [upload] which referenced the sails global
   * variable directly, but which is decoupled in this library.
   * @param {string} appPath The Sails application path
   * @returns {string} The upload folder relative to the specified path
   */
  upload: (appPath: string) => {
    // Previously: sails.config.appPath + "/storage"
    return `${appPath}/storage`.replace("//", "/");
  },
  TRACK_GET: false,
  ACTIVITY_RESTRICT_PATH: ["/count"],
  /* months: moved to TimeUtils.months */
  NodeABIValues: {
    v8: 57,
    v9: 59,
    v10: 64,
    v11: 67,
    v12: 72,
    v13: 79,
    v14: 83,
    v15: 88,
    v16: 93,
    v17: 102,
    v18: 108,
    v20: 115,
  },
};

/**
 * @description Helper to return the IANA timezone name from environment
 * variables or 'Asia/Dili' if the environment variable was not set.
 *
 * @returns {String} coerced string containing the IANA timezone name
 */
export const DefaultTimeZoneName = `${process.env["TIME_ZONE"] || "Asia/Dili"}`;

/**
 * @description The base language to use for translation functionality where
 * there are no other valid variables available to the caller
 */
export const DefaultLanguage = "en";

/**
  * @description Common formats for dates and times.
  * Each format is followed by an example.
  * Important formats:
  *  - api/models/Report.js :: FormatDatesArray
  *    without Time: was 'll' now Date.medium
  *    with Time: was 'MMM DD, YYYY HH:mm' now DateTime.medium24Hr
  *
  * formats used extensively inline with moment:
  *  - moment(<date>)[optional timezone].format( <FMT> ):
  *    L     maps to Date.monthFirst
  *    LL    maps to Date.full
  *    LLL   maps to DateTime.fullAmPm
  *    LLLL  maps to DateTime.verboseAmPm
  *
  * There is one specialist format: MM-DD-YYYY HH:mm:ssz that uses a deprecated
  * moment time-zone formatter. The closest match is Date.DateTime.monthFirstZ
  * which emmits a 4 character timezone rather than 2 (+0900 vs. +09)

 * Other options will be added as they are found in the codebase. For example
  * the following formats are available but not yet implemented:
  * @summary.
  * DateTime.mediumAmPm: "DD t", // maps to: Oct 10, 2020 4:20 PM
  * DateTime.full24Hr: "DDD T",  // maps to: October 10, 2020 16:20
  */
export const DateTimeFormats = {
  Date: {
    monthFirst: "LL/dd/yyyy", // 04/11/2021 WARNING! 11th April or 4th November?
    medium: "DD", // Oct 10, 2021
    full: "DDD", // October 10, 2021
  },
  DateTime: {
    medium24Hr: "DD T", // Oct 10, 2020 16:20
    fullAmPm: "DDD t", // October 10, 2020 4:20 PM
    monthFirstZ: "LL-dd-yyyy TTZZZ", // 04-12-2021 02:28:15+0900
    verboseAmPm: "DDDD t", // Saturday, October 10, 2020 4:05 PM
  },
  Time: {
    MinsSecs: {
      asDecimal: "m.ss", // 3.45, 12.30, 10.04
      asTime: "mm:ss", // 03:45
    },
    HoursMinsSecs: "HH:mm:ss", // 06:03:45
    UnixMillis: "x", // Unix epoch milliseconds as a string
  },
  /** @summary The following are interpreted formats which map to
   * standard (ISO/SQL) or specialist formats.
   */
  Device: "deviceFormat", // For DeviceController, dateparts delimited with &
  ISO: "asISO",
  SQL: "asSQL",
};

/** @description Default labels (en) for UI representation of parts of
 * a date-time object
 */
export const DefaultDateTimeObjectLabels: DateTimeObjectLabels = {
  year: { singular: "year", plural: "years" },
  month: { singular: "month", plural: "months" },
  day: { singular: "day", plural: "days" },
  hour: { singular: "hour", plural: "hours" },
  minute: { singular: "minute", plural: "minutes" },
  second: { singular: "second", plural: "seconds" },
  millisecond: { singular: "millisecond", plural: "milliseconds" },
};

/**
 * @description Structure of database translation keys for formatting the date
 * time object. Pass these to the translate sub-system and use them as an input
 * into the getHighestOrdinal function in TimeUtils.
 */
export const DateTimeObjectLabelTranslationKeys: DateTimeObjectLabels = {
  year: {
    singular: "labels.YEAR",
    plural: "labels.YEARS",
  },
  month: {
    singular: "labels.MONTH",
    plural: "labels.MONTHS",
  },
  day: {
    singular: "labels.DAYS",
    plural: "labels.DAYS",
  },
  hour: {
    singular: "labels.HOUR",
    plural: "labels.HOURS",
  },
  minute: {
    singular: "labels.MINUTE",
    plural: "labels.MINUTES",
  },
  second: {
    singular: "labels.SECOND",
    plural: "labels.SECONDS",
  },
  millisecond: {
    singular: "labels.MILLISECOND",
    plural: "labels.MILLISECONDS",
  },
};

export const DefaultTranslationDisclaimerMessage: Record<string, string> = {
  // eslint-disable-next-line max-len
  en: "Similie is change. We specialize in delivering sustainable solutions for developing economies.<br/>We are similie,<br/>change by design",
  pt: "",
  tl: "",
};

/** @summary Enums and similar lookup objects */

/**
 * @description ENUM to specify time period mathematics on time durations.
 * @example Subtract(qty, DurationType.hour, fromDate)
 * @example Add(qty, DurationType.)
 */
export enum TimePeriod {
  milliseconds = 1,
  seconds = 2,
  minutes = 3,
  hours = 4,
  days = 5,
  weeks = 6,
  months = 7,
  years = 8,
}

/**
 * @description ENUM to surface label values for month names
 */
export enum MonthLabel {
  JANUARY = "labels.JANUARY",
  FEBRUARY = "labels.FEBRUARY",
  MARCH = "labels.MARCH",
  APRIL = "labels.APRIL",
  MAY = "labels.MAY",
  JUNE = "labels.JUNE",
  JULY = "labels.JULY",
  AUGUST = "labels.AUGUST",
  SEPTEMBER = "labels.SEPTEMBER",
  OCTOBER = "labels.OCTOBER",
  NOVEMBER = "labels.NOVEMBER",
  DECEMBER = "labels.DECEMBER",
}

/**
 * @description ENUM to surface interval specifications for schedulers
 * that depend on a specific time period
 */
export enum TimerInterval {
  MINUTE = "minute",
  FIVE_MINUTE = "5 minute",
  THIRTY_MINUTE = "30 minute",
  HOUR = "hour",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

/**
 * @description ENUM to choose a database adapter when creating an instance of
 * the SQL escape wrapper class. Defaults to Postgres.
 */
export enum DatabaseAdapter {
  DEFAULT = "default",
  Postgres = "pg",
}

/**
 * ENUM to surface the intervals used to specify time periods in a
 * virtual function
 */
export enum VFunctionInterval {
  year = 0,
  month = 1,
  day = 2,
  hour = 3,
  minute = 4,
  limit = 5,
  forever = 6,
}

/**
 * ENUM to specify the minimum user role required to perform a specific
 * action against the REST api.
 */
export const UserRoleRESTPermissions = {
  delete: "RECORDER",
  alter: "RECORDER",
  post: "MANAGER",
  update: "MANAGER",
  count: "VISITOR",
  get: "VISITOR",
};

export enum RequiredParamsErrorCode {
  UnknownError = 0,
  BadRequest,
  Forbidden,
  ServerError,
  EntityDoesNotExist,
  RequiredParametersNotSupplied,
  NonMembersNotAllowed,
}
