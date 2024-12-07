"use strict";
/**
 * @description Utility wrapper for checking if things are:
 *  - of a particular type,
 *  - usuable for a certain function
 *  - in an expected format.
 * Simple checks are exported via their lodash counterparts, this is to prevent
 * the case where the lodash import statement gets too unweildy when importing
 * the same dozen validator functions into every module/class file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsThis = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
/**
 * @description Wrapper for checking if a value is a number and not NaN or
 * over the bounding limits
 * @param {number|string} o The value to test
 * @returns {boolean} True if the input value passes all checks, false otherwise
 */
const _aUseableNumber = (o) => {
    return (0, lodash_1.isNumber)(o) && (0, lodash_1.isFinite)(o) && !(0, lodash_1.isNil)(o);
};
/**
 * @description Wrapper for checking if a supplied value is a finite,
 * not undefined, non-null floating point number or parseable string.
 * @param {string|number} o The value to test
 * @returns {boolean} True if the input value passes all checks, false otherwise
 */
const _aUseableFloatingPointNumber = (o) => {
    let result = false;
    const f = parseFloat(`${o}`);
    if (_aUseableNumber(f) === true) {
        result = f === +f && Math.round(f) !== f;
    }
    return result;
};
/**
 * @description Wrapper for checking if a supplied value is a finite,
 * not undefined, non-null integer number or parseable string.
 * @param {number|string} o The value to test
 * @returns {boolean} True if the input value passes all checks, false otherwise
 */
const _aUseableIntegerNumber = (o) => {
    let result = false;
    // Using parseFloat because parseInt will strip floating point values from
    // a string input and result in a valid int, when we have a string->float
    const i = parseFloat(`${o}`);
    if (_aUseableNumber(i) === true) {
        result = i === +i && Math.round(i) == i;
    }
    return result;
};
/**
 * @description Checks the specified format against the options available
 * in the DateTimeFormats structure. If found, returns true, false otherwise.
 * @param {Record<string, unknown>} validFormats
 *  An object literal containing a tree of formats
 * @param {string} format One of the DateTimeFormat options
 * @returns {boolean} True if found, false otherwise
 */
const _aValidDateTimeFormat = function (validFormats, format) {
    let found = false;
    /**
     * @param {Record<string, unknown>} obj
     * @param {any} value
     * @returns {void}
     */
    const keyIterator = function (obj, value) {
        Object.keys(obj).forEach((key) => {
            const item = obj[key];
            if ((0, lodash_1.isObject)(item)) {
                keyIterator(item, value);
            }
            else if (item === value) {
                found = true;
            }
        });
    };
    // Check for falsy value of format to exclude nil, null etc.
    if (format)
        keyIterator(validFormats, format);
    return found;
};
/**
 * @description Validator class for commonly used lodash validators including
 * checks for specifc formats used internally by the Similie project.
 * Answers question like 'is this a valid number'
 */
class IsThisValidator {
    /**
     * @param {any} value
     */
    constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value) {
        /**
         * @description Checks to see if the value used to initialise the call is
         * between the lower and upper bounds specified. Returns false if the initial
         * value is not numeric or outside the lower or upper bounds.
         * @param {number} lower The lower boundary of the check
         * @param {number} upper The upper boundary of the check
         * @returns {boolean} True if the initial value is numeric and between the
         * bounds specified, false otherwise
         */
        this.between = (lower, upper) => {
            let result = false;
            if (_aUseableNumber(this._value)) {
                result = this._value >= lower && this._value <= upper;
            }
            return result;
        };
        /**
         * @description Checks to see if the initialiser param is one of values in
         * find. Case insensitive, checks for both uppercase and lowercase values.
         * @param {string[]} One or more parameters to search for
         * @example const isTrue = IsThis(httpMethod).oneOf('get', 'post', 'put');
         * @returns {boolean}
         */
        this.oneOf = (...find) => {
            // bounds check. We're searching for a string value
            if ((0, lodash_1.isNil)(this._value) || !(0, lodash_1.isString)(this._value))
                return false;
            const param = this._value.toUpperCase();
            // create a search array of unique UPPERCASE values
            const searchArray = [];
            find.forEach((element) => {
                const e = element.toUpperCase();
                if (!(0, lodash_1.includes)(searchArray, e)) {
                    searchArray.push(e);
                }
            });
            return (0, lodash_1.includes)(searchArray, param);
        };
        this._value = value;
    }
    /** @summary Wrapper function for lodash.isNumber() */
    get aNumber() {
        return (0, lodash_1.isNumber)(this._value);
    }
    /** @summary Wrapper function for lodash.isString() */
    get aString() {
        return (0, lodash_1.isString)(this._value);
    }
    /** @summary Wrapper function for lodash.isArray() */
    get anArray() {
        return (0, lodash_1.isArray)(this._value);
    }
    /** @summary Wrapper function for lodash.isObject() */
    get anObject() {
        return (0, lodash_1.isObject)(this._value);
    }
    /** @summary Wrapper function for lodash.isFinite() */
    get finite() {
        return (0, lodash_1.isFinite)(this._value);
    }
    /** @summary Wrapper function for lodash.isUndefined */
    get undefined() {
        return (0, lodash_1.isUndefined)(this._value);
    }
    /** @summary Wrapper function for lodash.isNil() aka isNull || isUndefined */
    get nullOrUndefined() {
        return (0, lodash_1.isNil)(this._value);
    }
    /**
     * @description Check function to ensure array members are ok to pass into the
     * function '_reportFormattedDate'. Typically these values interface to
     * regular JS code and should be treated as having any value, before we use
     * them in the TS (or transpiled version of) code.
     * @returns {boolean} True if the input value passes all checks false otherwise
     */
    get aValidDateTimeCandidate() {
        return (0, lodash_1.isNil)(this._value) === false && (0, lodash_1.size)(this._value.toString()) > 4;
    }
    /**
     * @description Checks the specified format against the options available
     * in the DateTimeFormats structure. If found, returns true, false otherwise.
     * @returns {boolean} True if found, false otherwise
     */
    get aValidDateTimeFormat() {
        return _aValidDateTimeFormat(constants_1.DateTimeFormats, this._value);
    }
    /**
     * @description Check if a value is a number and not NaN
     * or over the bounding limits
     */
    get aUseableNumber() {
        return _aUseableNumber(this._value);
    }
    /**
     * @description Checks if a value is a number or parseable string. Note this
     * differs from .aUseableNumber in that this function considers number-like
     * strings as numbers if they are parseable.
     */
    get numericIsh() {
        let result = false;
        if ((0, lodash_1.isString)(this._value)) {
            const candidate = parseFloat(this._value);
            if (candidate.toString().length === this._value.length) {
                // avoids parse errors where the initial segment of a string input is
                // numeric but the remainder isn't. E.g. A date where the
                // parse[Int|Float] function passes but returns a valid int of 2020 for
                // the ISO formatted date: '2020-02-06T12:13:14.1234
                result = _aUseableNumber(candidate);
            }
        }
        else {
            result = _aUseableNumber(this._value);
        }
        return result;
    }
    /**
     * @description Check if a supplied value is a finite,
     * not undefined, non-null integer number or parseable string->int.
     */
    get aUseableInt() {
        return _aUseableIntegerNumber(this._value);
    }
    /**
     * @description Check if a supplied value is a finite,
     * not undefined, non-null floating point number or parseable string->float.
     */
    get aUseableFloat() {
        return _aUseableFloatingPointNumber(this._value);
    }
}
/**
 * @summary Export declaration for IsThis Class via a wrapper function
 * @param {any} value
 * @returns {boolean}
 */
function IsThis(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value) {
    return new IsThisValidator(value);
}
exports.IsThis = IsThis;
