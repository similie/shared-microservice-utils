/**
 * Converts a camel case string to snake case and turns it to lowercase.
 * @param {string} input - The camel case string to be converted.
 * @returns {string} The snake case version of the input string in lowercase.
 */
export declare const toSnakeCase: (input: string) => string;
export declare const toCamelCase: (input: string) => string;
export declare const deepCloneObject: <T>(obj: T) => T;
export declare const pullCookieValueInBrowser: (key: string) => string | null;
