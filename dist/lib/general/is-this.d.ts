/**
 * @description Utility wrapper for checking if things are:
 *  - of a particular type,
 *  - usuable for a certain function
 *  - in an expected format.
 * Simple checks are exported via their lodash counterparts, this is to prevent
 * the case where the lodash import statement gets too unweildy when importing
 * the same dozen validator functions into every module/class file.
 */
/**
 * @description Validator class for commonly used lodash validators including
 * checks for specifc formats used internally by the Similie project.
 * Answers question like 'is this a valid number'
 */
declare class IsThisValidator {
    private _value;
    /**
     * @param {any} value
     */
    constructor(value: any);
    /** @summary Wrapper function for lodash.isNumber() */
    get aNumber(): boolean;
    /** @summary Wrapper function for lodash.isString() */
    get aString(): boolean;
    /** @summary Wrapper function for lodash.isArray() */
    get anArray(): boolean;
    /** @summary Wrapper function for lodash.isObject() */
    get anObject(): boolean;
    /** @summary Wrapper function for lodash.isFinite() */
    get finite(): boolean;
    /** @summary Wrapper function for lodash.isUndefined */
    get undefined(): boolean;
    /** @summary Wrapper function for lodash.isNil() aka isNull || isUndefined */
    get nullOrUndefined(): boolean;
    /**
     * @description Check function to ensure array members are ok to pass into the
     * function '_reportFormattedDate'. Typically these values interface to
     * regular JS code and should be treated as having any value, before we use
     * them in the TS (or transpiled version of) code.
     * @returns {boolean} True if the input value passes all checks false otherwise
     */
    get aValidDateTimeCandidate(): boolean;
    /**
     * @description Checks the specified format against the options available
     * in the DateTimeFormats structure. If found, returns true, false otherwise.
     * @returns {boolean} True if found, false otherwise
     */
    get aValidDateTimeFormat(): boolean;
    /**
     * @description Check if a value is a number and not NaN
     * or over the bounding limits
     */
    get aUseableNumber(): boolean;
    /**
     * @description Checks if a value is a number or parseable string. Note this
     * differs from .aUseableNumber in that this function considers number-like
     * strings as numbers if they are parseable.
     */
    get numericIsh(): boolean;
    /**
     * @description Check if a supplied value is a finite,
     * not undefined, non-null integer number or parseable string->int.
     */
    get aUseableInt(): boolean;
    /**
     * @description Check if a supplied value is a finite,
     * not undefined, non-null floating point number or parseable string->float.
     */
    get aUseableFloat(): boolean;
    /**
     * @description Checks to see if the value used to initialise the call is
     * between the lower and upper bounds specified. Returns false if the initial
     * value is not numeric or outside the lower or upper bounds.
     * @param {number} lower The lower boundary of the check
     * @param {number} upper The upper boundary of the check
     * @returns {boolean} True if the initial value is numeric and between the
     * bounds specified, false otherwise
     */
    between: (lower: number, upper: number) => boolean;
    /**
     * @description Checks to see if the initialiser param is one of values in
     * find. Case insensitive, checks for both uppercase and lowercase values.
     * @param {string[]} One or more parameters to search for
     * @example const isTrue = IsThis(httpMethod).oneOf('get', 'post', 'put');
     * @returns {boolean}
     */
    oneOf: (...find: Array<string>) => boolean;
}
/**
 * @summary Export declaration for IsThis Class via a wrapper function
 * @param {any} value
 * @returns {boolean}
 */
export declare function IsThis(value: any): IsThisValidator;
export {};
