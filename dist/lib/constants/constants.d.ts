/**
 * @description Bucket list of custom types, interfaces and enums.
 * May be split into different files if it gets too large.
 * @todo Move to @types/similie-one module in own repo.
 * c.f. other @types/<library>
 */
import { DateTimeObjectLabels } from "./interfaces";
/** @summary Constants and other static references */
export declare const ONE: {
    DEFAULT_CURRENCY: string;
    NULL: null;
    STRING_ONLY: boolean;
    WITHOUT_GEO: boolean;
    DONT_ROUND: boolean;
    ROUND: boolean;
    ADMIN_TOKEN_GENERATION: number;
    USER_TOKEN_GENERATION: number;
    sockets: {
        /** @todo Move to enum */
        FORCE_LOGOUT: string;
        NEW_MESSAGE: string;
        NEW_TASK_UPDATE: string;
        SESSION_EXPIRED: string;
        EXCEL_REPORT_COMPILED: string;
    };
    rules: {
        REJECT: number;
        IRRELEVANT: number;
        ACCPTED: number;
    };
    currencies: {
        USD: {
            symbol: string;
            key: string;
        };
    };
    code: {
        BAD_REQUEST: number;
        FORBIDDEN: number;
        SERVER_ERROR: number;
        UNKNOWN_ERROR: number; /** @summary. alias of Server Error */
    };
    err: {
        ORGNIZATION_HAS_NO_ASSIGNED_CAREER_PROGRESSION: string;
        USER_MUST_BE_ASSIGNED_ORGANIZATION: string;
        ID_PARAM_NOT_PROVIDED: string;
        REQUIRED_PARAMETERS_NOT_SUPPLIED: string;
        NON_MEMBERS_NOT_ALLOWED: string;
        PROBLEM_INDENTIFY_SITE_ROLE: string;
        ENTITY_DOES_NOT_EXIST: string;
        STATE_CHAIN_HACKING_ATTEMPT: string;
        STATE_CHAIN_PREVIOUS_REQUIRED: string;
        STATE_CHAIN_SIGNED_TRANSACTION: string;
        VALID_ENTITY_REQUIRED: string;
        STATE_VALID_SIGNATURE: string;
        STATE_OWN_SIGNATURE: string;
        TOKEN_ISSUE_FAILURE: string;
        APPROVAL_TOKEN_REQUIRED: string;
        APPROVAL_TOKEN_NOT_VERIFIED: string;
        IMMUTABLE_DATA: string;
        NO_COST_CODE_AMMOUNT: string;
        NOT_A_COST_CODE_TRANSACTION: string;
        NOT_PERMITTED_TO_PERFORM_THIS_ACTION: string;
        BAD_REQUEST: string;
        FORBIDDEN: string;
        SERVER_ERROR: string;
        UNKNOWN_ERROR: string;
    };
    ALLOWED: boolean;
    REJECTED: boolean;
    SITE_NAME: string;
    /**
     * @description Returns the path to the storage folder for uploads.
     * Refactored from Const.js [upload] which referenced the sails global
     * variable directly, but which is decoupled in this library.
     * @param {string} appPath The Sails application path
     * @returns {string} The upload folder relative to the specified path
     */
    upload: (appPath: string) => string;
    TRACK_GET: boolean;
    ACTIVITY_RESTRICT_PATH: string[];
    NodeABIValues: {
        v8: number;
        v9: number;
        v10: number;
        v11: number;
        v12: number;
        v13: number;
        v14: number;
        v15: number;
        v16: number;
        v17: number;
        v18: number;
        v20: number;
    };
};
/**
 * @description Helper to return the IANA timezone name from environment
 * variables or 'Asia/Dili' if the environment variable was not set.
 *
 * @returns {String} coerced string containing the IANA timezone name
 */
export declare const DefaultTimeZoneName: string;
/**
 * @description The base language to use for translation functionality where
 * there are no other valid variables available to the caller
 */
export declare const DefaultLanguage = "en";
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
export declare const DateTimeFormats: {
    Date: {
        monthFirst: string;
        medium: string;
        full: string;
    };
    DateTime: {
        medium24Hr: string;
        fullAmPm: string;
        monthFirstZ: string;
        verboseAmPm: string;
    };
    Time: {
        MinsSecs: {
            asDecimal: string;
            asTime: string;
        };
        HoursMinsSecs: string;
        UnixMillis: string;
    };
    /** @summary The following are interpreted formats which map to
     * standard (ISO/SQL) or specialist formats.
     */
    Device: string;
    ISO: string;
    SQL: string;
};
/** @description Default labels (en) for UI representation of parts of
 * a date-time object
 */
export declare const DefaultDateTimeObjectLabels: DateTimeObjectLabels;
/**
 * @description Structure of database translation keys for formatting the date
 * time object. Pass these to the translate sub-system and use them as an input
 * into the getHighestOrdinal function in TimeUtils.
 */
export declare const DateTimeObjectLabelTranslationKeys: DateTimeObjectLabels;
export declare const DefaultTranslationDisclaimerMessage: Record<string, string>;
/** @summary Enums and similar lookup objects */
/**
 * @description ENUM to specify time period mathematics on time durations.
 * @example Subtract(qty, DurationType.hour, fromDate)
 * @example Add(qty, DurationType.)
 */
export declare enum TimePeriod {
    milliseconds = 1,
    seconds = 2,
    minutes = 3,
    hours = 4,
    days = 5,
    weeks = 6,
    months = 7,
    years = 8
}
/**
 * @description ENUM to surface label values for month names
 */
export declare enum MonthLabel {
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
    DECEMBER = "labels.DECEMBER"
}
/**
 * @description ENUM to surface interval specifications for schedulers
 * that depend on a specific time period
 */
export declare enum TimerInterval {
    MINUTE = "minute",
    FIVE_MINUTE = "5 minute",
    THIRTY_MINUTE = "30 minute",
    HOUR = "hour",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
/**
 * @description ENUM to choose a database adapter when creating an instance of
 * the SQL escape wrapper class. Defaults to Postgres.
 */
export declare enum DatabaseAdapter {
    DEFAULT = "default",
    Postgres = "pg"
}
/**
 * ENUM to surface the intervals used to specify time periods in a
 * virtual function
 */
export declare enum VFunctionInterval {
    year = 0,
    month = 1,
    day = 2,
    hour = 3,
    minute = 4,
    limit = 5,
    forever = 6
}
/**
 * ENUM to specify the minimum user role required to perform a specific
 * action against the REST api.
 */
export declare const UserRoleRESTPermissions: {
    delete: string;
    alter: string;
    post: string;
    update: string;
    count: string;
    get: string;
};
export declare enum RequiredParamsErrorCode {
    UnknownError = 0,
    BadRequest = 1,
    Forbidden = 2,
    ServerError = 3,
    EntityDoesNotExist = 4,
    RequiredParametersNotSupplied = 5,
    NonMembersNotAllowed = 6
}
