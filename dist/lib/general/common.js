"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/**
 * @description replacement for the giant /services/Utils.js.
 * Contains those functions but they have been relayered as
 * necessary to provide a clearer intent in the codebase.
 */
// import {IModelEntity as IModel} from '@similie/types';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.security = exports.imaging = exports.isThis = exports.responseMask = exports.pullHost = exports.asMoney = exports.fixDecimalPlaces = exports.containsValue = exports.hasKeysShallow = exports.deepValues = exports.deepKeys = exports.stripUndefinedIds = exports.populateNotNullRecords = exports.transformAttributes = exports.truncateText = exports.guardItsRequired = exports.getErrorForCode = exports.parseLocals = exports.getModelId = exports.coerceToArray = exports.nodeModuleVersion = exports.constants = void 0;
const is_this_1 = require("./is-this");
const Imaging = __importStar(require("./imaging"));
const Security = __importStar(require("./security"));
const constants_1 = require("../constants");
const lodash_1 = require("lodash");
/**
 * @description types and enums surfaced for JS implementations
 */
const _constants = {
    nodeModuleVersionNumbers: constants_1.ONE.NodeABIValues,
    ENUMS: {
        /** List of error codes that can be passed for GetErrorCode to build
         * a throwable error
         */
        ErrorCodes: constants_1.RequiredParamsErrorCode,
    },
};
/**
 * @description Fetches the ABI version number for the currently running
 * process. E.g. Node v12.x.x has ABI version 72. This allows for a simple
 * method of branching internal functions to take advantage of updated code
 * in the Node core. E.g. Performance Timer, Internationalisation of numbers
 * @returns {Integer} The ABI Module version of the running node process or
 * zero if the function failed to find a valid value.
 */
const _nodeModuleVersion = () => {
    const versions = process.versions;
    if (versions &&
        Reflect.has(versions, "modules") &&
        (0, is_this_1.IsThis)(versions.modules).aUseableInt) {
        return parseInt(versions.modules);
    }
    // The above code absolutely should not fail, but just in case, here's a
    // a set of lookup values from the Node.JS docs using process.version.
    let nodeVersion = process.version;
    if (nodeVersion.indexOf(".") > 0) {
        nodeVersion = nodeVersion.substring(0, nodeVersion.indexOf("."));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const abiValue = _constants.nodeModuleVersionNumbers[nodeVersion];
    if ((0, is_this_1.IsThis)(abiValue).aUseableInt)
        return parseInt(abiValue);
    return 0;
};
/**
 * @description Checks to see if the specified parameter is an Array type. If
 * so, it is returned as-is, otherwise it is wrapped in an array and returned.
 * @param {Array | any } candidate
 * @returns {Array} An array
 */
const _coerceToArray = (candidate) => {
    return (0, is_this_1.IsThis)(candidate).anArray ? candidate : [candidate];
};
/**
 * @description Copy of function taken from config/models.js. Attempts to
 * retrieve the Id of the specified model, returning one of: undefined, null,
 * the model Id or the original value, depending on what was passed in.
 * @param {any} candidate
 * @returns {any}
 */
const _getModelId = (candidate) => {
    const thisIs = (0, is_this_1.IsThis)(candidate);
    if (thisIs.nullOrUndefined)
        return constants_1.ONE.NULL;
    if (thisIs.anObject && Reflect.has(candidate, "id")) {
        return candidate.id;
    }
    return candidate;
};
/**
 * @description Accepts a formatted string with replacement locations specified
 * by %escaped% variables and replaces those parts with the corresponding
 * key-value pair supplied by the 'locals' input parameter. A truthy value for
 * the 'nullify' parameter (if supplied) will replace null values with 'NULL'
 * for use in SQL strings, or 'UNKNOWN' otherwise.
 * @param {string} stringValue A formatted string with replacement locations
 * to match against key-values in the 'locals' object
 * @param {object} locals An object containing one or more key-value pairs
 * @param {boolean} nullify Optional True|False to indicate whether to
 * replace any undefined values for a given key with 'NULL' or 'UNDEFINED'
 * defaults to false if not specified.
 * @returns {string} The input string with key-value replacements transformed
 * to contain the values in the corresponding field of the input object.
 */
const _parseLocals = (stringValue, locals, nullify) => {
    const matches = (stringValue || "").match(/%(.[^\s]*?)%/g);
    if (!matches || !matches.length) {
        return stringValue;
    }
    /**
     * in-line recursive function to return the value of the last segment
     * of a mutlipart key
     *
     * @param {string[]} split
     * @param {Record<string, string>} locals
     * @returns {string}
     */
    const walkValues = (split, locals) => {
        const key = split.shift();
        if (!(0, lodash_1.size)(split)) {
            return locals[key];
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return walkValues(split, locals[key]);
        }
    };
    (0, lodash_1.each)(matches, (match) => {
        const key = match.replace(/%/g, "");
        let value = "";
        // decide if we need to iterate though a dot-notation
        // style key to arrive at a single key & find it's value
        if ((0, lodash_1.includes)(key, ".")) {
            const split = key.split(".");
            value = walkValues(split, locals);
        }
        else {
            value = locals[key];
        }
        const regex = new RegExp(match, "g");
        if (key === "<br/>") {
            stringValue = stringValue.replace(regex, "\n");
        }
        else {
            if (!(0, is_this_1.IsThis)(value).undefined) {
                let local;
                if (value == null) {
                    local = nullify ? "NULL" : "UNKNOWN";
                }
                else {
                    local = value;
                }
                stringValue = stringValue.replace(regex, local);
            }
            else if (nullify) {
                stringValue = stringValue.replace(regex, "NULL");
            }
            // [sg] NOTE. if nullify is false, and the value for key is undefined,
            // the 'match' value will NOT be replaced.
        }
    });
    return stringValue;
};
/**
 * @description Checks that the input has a truthy value. If not, throws an
 * error constructed from the specified enum value.
 * @param {number} errorCode An enum value that specfies the error to throw
 * @param {any[]} required An object or list of properties to verify
 * @returns {boolean} True if all elements are truthy, throws otherwise
 */
const _guardItsRequired = (errorCode, ...required) => {
    if (!(0, lodash_1.every)(required)) {
        const result = _getErrorForCode(errorCode);
        throw result;
    }
    return true;
};
/**
 * @description Constructs an error message from the specified lookup value
 * @param {number} code Lookup code to generate an error from
 * @returns {object} An object containing code and message properties describing
 * the error corresponding to the input code
 */
const _getErrorForCode = (code) => {
    // Default case for non-matching or missing production [js] params
    const result = {
        code: constants_1.ONE.code.BAD_REQUEST,
        message: constants_1.ONE.err.REQUIRED_PARAMETERS_NOT_SUPPLIED,
    };
    switch (code) {
        case constants_1.RequiredParamsErrorCode.UnknownError:
            result["code"] = constants_1.ONE.code.UNKNOWN_ERROR;
            result["message"] = constants_1.ONE.err.UNKNOWN_ERROR;
            break;
        case constants_1.RequiredParamsErrorCode.BadRequest:
            result["message"] = constants_1.ONE.err.BAD_REQUEST;
            break;
        case constants_1.RequiredParamsErrorCode.Forbidden:
            result["code"] = constants_1.ONE.code.FORBIDDEN;
            result["message"] = constants_1.ONE.err.FORBIDDEN;
            break;
        case constants_1.RequiredParamsErrorCode.ServerError:
            result["code"] = constants_1.ONE.code.SERVER_ERROR;
            result["message"] = constants_1.ONE.err.SERVER_ERROR;
            break;
        case constants_1.RequiredParamsErrorCode.EntityDoesNotExist:
            result["message"] = constants_1.ONE.err.ENTITY_DOES_NOT_EXIST;
            break;
        case constants_1.RequiredParamsErrorCode.RequiredParametersNotSupplied:
            // default case.
            break;
        case constants_1.RequiredParamsErrorCode.NonMembersNotAllowed:
            result["code"] = constants_1.ONE.code.FORBIDDEN;
            result["message"] = constants_1.ONE.err.NON_MEMBERS_NOT_ALLOWED;
            break;
    }
    return result;
};
/**
 * @description Restricts the input text to the required length adding an
 *   elipsis character to the end if the text was truncated.
 * @param {string} value The string to check and truncate if necessary
 * @param {number} toLength The max required length of the string
 * @returns {string} The truncated string with trailing elipsis if the input
 *   string is longer than toLength, the orignal string otherwise.
 */
const _truncateText = (value, toLength) => {
    if (!(0, is_this_1.IsThis)(value).aString) {
        throw new Error("CommonUtils.truncateText expects a string value to truncate");
    }
    let result = value;
    if (result.length > toLength) {
        result = result.substring(0, toLength - 3);
        result += "...";
    }
    return result;
};
/**
 * @description Transforms the attributes object of a model into a new object
 * containing key-value pairs of the form: [fieldName]: [dataType] using the
 * sails models attribute.type parameter.
 *  attr.type, attr.model or attr.collection
 * @param {object} attrs Object to transform
 * @returns {object} The transformed object
 */
const _transformAttributes = (attrs) => {
    const result = {};
    let selector = "type";
    (0, lodash_1.each)(attrs, (attr, key) => {
        selector = "type";
        if (!attr[selector])
            selector = "model";
        if (!attr[selector])
            selector = "collection";
        if (attr[selector])
            result[key] = attr[selector];
    });
    return result;
};
/**
 * @description Accepts an array of objects (models) and returns a new array
 * containing only those objects that contain non-null values for every key
 * specified in the 'keys' spread.
 * @param {Record<string, any>[]} records Array of objects
 * @param {string[]} keys Array of keys to validate
 * @returns {any[]} An array of objects passing the checks. If the input
 * collection is zero-length, null or undefined returns an empty array.
 */
const _populateNotNullRecords = (records, ...keys) => {
    // bounday checks.
    const thisIs = (0, is_this_1.IsThis)(records);
    if (thisIs.nullOrUndefined || !thisIs.anArray || records.length == 0) {
        return [];
    }
    /**
     * @description Inline function to test if an object has a non-null value
     * for all of the keys specified.
     * @param {Record<string, any>} record key=value object to test
     * @param {string[]} keys array of keys for check values for
     * @returns {boolean} True if all of the keys produce a non-null value
     * false otherwise.
     */
    const _hasAllKeys = (record, ...keys) => {
        if (!(0, lodash_1.size)(record))
            return false;
        let result = true;
        (0, lodash_1.each)(keys, (key) => {
            if (record[key] == null) {
                result = false;
                return;
            }
        });
        return result;
    };
    const result = [];
    const len = (0, lodash_1.size)(records);
    let record = {};
    for (let i = 0; i < len; i++) {
        record = records[i] || {};
        if ((0, lodash_1.size)(record) && _hasAllKeys(record, ...keys)) {
            result.push(record);
        }
    }
    return result;
};
/**
 * @description Iterates the input array and returns all integer values that
 * are not null, undefined, NaN or otherwise unuseable in the context of a
 * model id. If members of the input array are strings  parseable to valid
 * integers, they are parsed and added to the return array.
 * @param {*} candidates The array of Ids to check
 * @returns {number[]} An array of unique 'definite' integers
 */
const _stripUndefinedIds = (candidates) => {
    // boundary checks, we need a non-zero length array to continue
    if (!(candidates && (0, is_this_1.IsThis)(candidates).anArray && candidates.length > 0))
        return [];
    const result = [];
    let _id = 0;
    candidates.forEach((candidate) => {
        if ((0, is_this_1.IsThis)(candidate).aUseableInt) {
            _id = parseInt(`${candidate}`); // cast[cast]
            // only add unique id values
            if (result.indexOf(_id) == -1)
                result.push(_id);
        }
    });
    return result;
    // original code
    // const has: GenericBuildableObject = {};
    // return _map(
    //   _filter(candidates || [], v => {
    //     if (IsThis(v).aNumber && !has[v]) {
    //       has[v] = true;
    //       return v;
    //     }
    //     return null;
    //   }),
    //   f => parseInt(`${f}`) // recast to suppress TS error
    // );
};
/**
 * @description Recusively looks at the object and returns values for the keys
 * @param {object} obj the nested object to search
 * @param {Function} cb callback for supporting hasKeys
 * @returns {any}
 */
const _deepKeys = (obj, cb) => {
    const thisIs = (0, is_this_1.IsThis)(obj);
    if (thisIs.anArray) {
        // inner obj is cast to any, because it could be anything...
        return obj.map((innerObj) => _deepKeys(innerObj, cb));
    }
    else if (thisIs.anObject) {
        return (0, lodash_1.mapValues)((0, lodash_1.mapKeys)(obj, cb), (val) => _deepKeys(val, cb));
    }
    else {
        return obj;
    }
};
/**
 * @description Gets an array of all the values with the specified keys
 * @param {*} obj The nested object or array of objects to search
 * @param {string[]} keys the Spread containing the keys
 * @returns {any[]} An array of values contained in the specified keys, or an
 * empty array if none of the keys were found in the input object.
 */
const _deepValues = (obj, ...keys) => {
    const values = [];
    _deepKeys(obj, (val, key) => {
        if ((0, lodash_1.includes)(keys, key)) {
            values.push(val);
        }
        return key;
    });
    return values;
};
/**
 * @description Searches the top-level keys of an object and checks that it
 *   contains all the specified keys.
 * @param {*} obj The object (model) to find the keys in
 * @param {string[]} keys The keys to search for
 * @returns {boolean} True if the object contains all of the keys,
 *   false otherwise
 */
const _hasKeysShallow = (obj, ...keys) => {
    const keychain = Object.keys(obj);
    const contains = []; // array of function predicates for _every
    (0, lodash_1.each)(keys, (key) => {
        contains.push((0, lodash_1.includes)(keychain, key));
    });
    return (0, lodash_1.every)(contains);
};
/**
 * @description Looks to see if there is a value in the key
 * @param {object} obj The nested object to search
 * @param {any} contains The value to search for
 * @param {string[]} keys The Spread containing the keys
 * @returns {boolean} true if there is at least one key that has the specfied
 * value, false otherwise
 */
const _containsValue = (obj, contains, ...key) => {
    const values = _deepValues(obj, ...key);
    return (0, lodash_1.includes)(values, contains);
};
/**
 * @todo Should the function return a string or the same type as candidate?
 * @description Ensure that we get a fixed number of decmial places for a float
 * if the input value is a float or float-like string. If it is an int, or the
 * 'round' option was specified [and true] the resulting return value will have
 * no decimal places.
 * @param {string|number} candidate The value we are converting
 * @param {boolean} round Do we round the value if it's a float
 * @param {number} length How many decimal places to include
 * @returns {string} A value rounded, or with the specified number of decimal
 * places, depending on the input options.
 */
const _fixDecimalPlaces = (candidate, round, length) => {
    // boundary check. We need a number or number like string
    const thisIs = (0, is_this_1.IsThis)(candidate);
    if (thisIs.aUseableFloat || thisIs.aUseableInt || thisIs.aString) {
        /* no-op */
    }
    else
        return candidate;
    let value; // int or float
    let result = "";
    // convert the input value if it was a string
    if (thisIs.aString) {
        if (thisIs.aUseableFloat) {
            value = parseFloat(`${candidate}`);
        }
        else {
            value = parseInt(`${candidate}`);
        }
    }
    else
        value = candidate;
    // check rounding priority and decimal places if necessary
    if (thisIs.aUseableFloat) {
        if (round) {
            value = Math.round(candidate);
            result = value.toString();
        }
        else {
            const dp = (0, is_this_1.IsThis)(length).aUseableInt ? length : 2;
            result = value.toFixed(dp);
        }
    }
    else
        result = value.toString();
    return result;
    // if (_.isString(value)) {
    //   var parse;
    //   if (_.contains(value, '.')) {
    //     parse = parseFloat(value);
    //   } else {
    //     parse = parseInt(value);
    //   }
    //   if (_.isFinite(parse)) {
    //     value = parse;
    //   } else {
    //     return value;
    //   }
    // }
    // if (Utils.isFloat(value)) {
    //   if (round) {
    //     return Math.round(value);
    //   }
    //   return value.toFixed(length);
    // } else {
    //   return value;
    // }
};
/**
 * @description Formats the amount specified in currency with the user's locale
 * If currency is omitted, USD is used as a default. If locale is omitted, 'en'
 * is used as a default. Uses the Intl.NumberFormat JS function for currencies.
 * @param {number} amount The amount of money to format
 * @param {string | object} currency 3-Digit currency code (default USD) or
 * currency model containing a key param that holds the 3-digit ISO code.
 * @param {string} localeCode 2-Digit locale (default en)
 * @returns {string} A currency value formatted in the user's locale or the
 * original value unchanged if it can't be parsed into a float.
 * @todo Needs wider locale support for more currencies/locales.
 */
const _asMoney = (amount, currency, localeCode) => {
    if (!(0, is_this_1.IsThis)(amount).aUseableFloat)
        return amount.toString();
    const value = parseFloat(`${amount}`);
    let locale = "en";
    let currencyCode = "USD"; // default currency code
    // figure out the 3-Digit currency code
    if (currency) {
        if ((0, is_this_1.IsThis)(currency).anObject &&
            Reflect.has(currency, "key")) {
            currencyCode = currency.key;
        }
        else if ((0, is_this_1.IsThis)(currency).aString) {
            currencyCode = currency;
        }
    }
    currencyCode = currencyCode.toUpperCase();
    // figure out the locale, or en if none supplied
    if (localeCode)
        locale = localeCode;
    const formatOptions = {
        style: "currency",
        currency: currencyCode,
    };
    const result = Intl.NumberFormat(locale, formatOptions).format(value);
    return result;
};
/**
 * @description Pulls the host based on the specified config and process object
 * @todo [sg] This is a direct copy of the old code. Have some concerns since
 * some pathways return the string 'undefined' which probably isn't intended??
 * @param {string} config The site config
 * @returns {string} A fully qualified path to the root of the application
 */
const _pullHost = (config) => {
    const env = process.env["NODE_ENV"];
    const deploy = process.env["DEPLOYMENT"];
    const flavor = env == "production" ? "" : "_DEV";
    const security = config.secure_protocol != null
        ? config.secure_protocol
            ? "https://"
            : "http://"
        : "";
    if (process.env["LOCAL_OVERRIDE_URL"]) {
        return (0, lodash_1.includes)(process.env["LOCAL_OVERRIDE_URL"], "http")
            ? process.env["LOCAL_OVERRIDE_URL"]
            : `${security}${process.env["LOCAL_OVERRIDE_URL"]}`;
    }
    return (security + (config || {}).site_url ||
        process.env["HOST_NAME_" + deploy + flavor] ||
        "localhost");
};
/**
 * @description Store a reference to a function stack for calling a callback
 * function, used mainly in WorkOrders and POS.
 * @param {function} cb
 * @returns {object} combinator function objects for futher processing
 */
const _responseMask = (cb) => {
    return {
        send: function (values) {
            cb("send", values);
        },
        ok: function (values) {
            cb("ok", values);
        },
        serverError: function (values) {
            cb("serverError", values);
        },
        badRequest: function (values) {
            cb("badRequest", values);
        },
    };
};
/** @summary Export declarations */
exports.constants = _constants;
exports.nodeModuleVersion = _nodeModuleVersion;
exports.coerceToArray = _coerceToArray;
exports.getModelId = _getModelId;
exports.parseLocals = _parseLocals;
exports.getErrorForCode = _getErrorForCode;
exports.guardItsRequired = _guardItsRequired;
exports.truncateText = _truncateText;
// @TODO: move to Node module when ready
exports.transformAttributes = _transformAttributes;
exports.populateNotNullRecords = _populateNotNullRecords;
exports.stripUndefinedIds = _stripUndefinedIds;
exports.deepKeys = _deepKeys;
exports.deepValues = _deepValues;
exports.hasKeysShallow = _hasKeysShallow;
exports.containsValue = _containsValue;
exports.fixDecimalPlaces = _fixDecimalPlaces;
exports.asMoney = _asMoney;
exports.pullHost = _pullHost;
exports.responseMask = _responseMask;
exports.isThis = is_this_1.IsThis;
exports.imaging = Imaging;
exports.security = Security;
