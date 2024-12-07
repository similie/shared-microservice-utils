/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/** Test rig components */
import { includes as _contains } from "lodash";

/** @summary Header files */
import * as CommonUtils from "./common";
import { StationAttributes, KeyInspector } from "./common-test-models";
import { ONE, RequiredParamsErrorCode } from "../constants";

/**
 * Simplified copy of Utils.asMoney
 * @param {string} amount
 * @returns {string}
 */
const oldCurrencyFormatter = (amount: string | number) => {
  // const currency = 'USD';
  const c = { symbol: "$" };
  return `${c.symbol}${CommonUtils.fixDecimalPlaces(amount)}`;
};

describe("Common-Utils.js", () => {
  /**
   * @summary This section of tests verifies functions and structures exported
   * in the CommonUtils module
   */

  it("Node Module Version returns the correct number corresponding to the running process", () => {
    // Lookup from the version string and manually created lookup list
    const versionString = process.version.split(".")[0] || "";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lookupVersion = parseInt(ONE.NodeABIValues[versionString]);
    // Lookup from specific version object
    const moduleVersion = parseInt(process.versions.modules);
    // Lookup from wrapper function
    const result = CommonUtils.nodeModuleVersion();
    // 1. All 3 should be the same.
    expect(lookupVersion).toEqual(moduleVersion);
    expect(lookupVersion).toEqual(result);
  });

  it("Coerce to array returns an array when an array parameter is specified", () => {
    const candidate: string[] = ["A", "B"];
    const result = CommonUtils.coerceToArray(candidate);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(2);
  });

  it("Coerce to array returns an array when a non array parameter is specified", () => {
    const candidateA = "A";
    const candidateB: object = { param1: 1, param2: 2 };

    // wrap a string variable in an array
    let result = CommonUtils.coerceToArray(candidateA);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);

    // wrap an object variable in an array
    result = CommonUtils.coerceToArray(candidateB);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(1);
    expect(result[0].param1).toEqual(1);
  });

  it("GetModelId returns null when a null object parameter is specified", () => {
    const candidate = null;

    const result = CommonUtils.getModelId(candidate);
    expect(result).toBe(null);
  });

  it("GetModelId returns null when an undefined parameter is specified", () => {
    let candidate;

    const result = CommonUtils.getModelId(candidate);
    expect(result).toBe(null);
  });

  it("GetModelId returns the Id when an object parameter containing an Id field is specified", () => {
    const candidate = { id: 5, name: "candidate" };

    const result = CommonUtils.getModelId(candidate);
    expect(result).toEqual(5);
  });

  it("GetModelId returns the passed parameter when a non-object parameter is specified", () => {
    const candidate = 10;

    const result = CommonUtils.getModelId(candidate);
    expect(result).toEqual(10);
  });

  it("ParseLocals correctly parses the specified string with values from the replacement object", () => {
    const candidate = "The quick brown %potato% jumped over the lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
      turnip: "owls",
    };

    const expectedResult = "The quick brown fox jumped over the lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements);

    expect(result).toEqual(expectedResult);
  });

  it("ParseLocals ignores key-like strings not escaped with wrapping '%' characters", () => {
    const candidate =
      "The quick brown %potato% jumped over the potato turnip lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
      turnip: "owls",
    };

    const expectedResult =
      "The quick brown fox jumped over the potato turnip lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements);

    expect(result).toEqual(expectedResult);
  });

  it("ParseLocals correctly adds line breaks while parsing values from the replacement object", () => {
    const candidate =
      "The quick brown %<br/>% %potato% jumped over %<br/>% the potato turnip %<br/>% lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
      turnip: "owls",
    };

    const expectedResult = [
      "The quick brown ",
      " fox jumped over ",
      " the potato turnip ",
      " lazy dogs",
    ];
    const r = CommonUtils.parseLocals(candidate, replacements);
    const result = r.split("\n");

    expect(result.length).toEqual(expectedResult.length);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toEqual(expectedResult[i]);
    }
  });

  it("ParseLocals correctly adds NULL while parsing values from the replacement object", () => {
    const candidate =
      "The quick %brown% %potato% jumped over the lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
      brown: null,
    };

    const expectedResult = "The quick NULL fox jumped over the lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements, true);

    expect(result).toEqual(expectedResult);
  });

  it("ParseLocals correctly adds UNKNOWN while parsing values from the replacement object", () => {
    const candidate =
      "The quick %brown% %potato% jumped over the lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
      brown: null,
    };

    const expectedResult = "The quick UNKNOWN fox jumped over the lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements, false);

    expect(result).toEqual(expectedResult);
  });

  it("ParseLocals doesn't replace a % escaped key where no replacement exists in the replacement object", () => {
    const candidate =
      "The quick %brown% %potato% jumped over the lazy %onions%";
    const replacements = {
      potato: "fox",
      onions: "dogs",
    };

    const expectedResult = "The quick %brown% fox jumped over the lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements);

    expect(result).toEqual(expectedResult);
  });

  it("ParseLocals correctly iterates multi-part keys while parsing values from the replacement object", () => {
    const candidate =
      "The quick brown %root.veg.potato% jumped over the lazy %green.onions%";
    const replacements = {
      root: {
        veg: {
          potato: "fox",
          carrots: "orange",
        },
      },
      green: {
        onions: "dogs",
      },
    };

    const expectedResult = "The quick brown fox jumped over the lazy dogs";
    const result = CommonUtils.parseLocals(candidate, replacements, false);

    expect(result).toEqual(expectedResult);
  });

  it("getErrorCode returns the correct object values for the specified enum value", () => {
    // 1. Standard Bad-request error message
    let candidate = RequiredParamsErrorCode.BadRequest;
    const expectedResult = {
      code: 400,
      message: "warning.INVALID_REQUEST",
    };
    let result = CommonUtils.getErrorForCode(candidate);
    expect(result["code"]).toEqual(expectedResult["code"]);
    expect(result["message"]).toEqual(expectedResult["message"]);

    // 2. Params not supplied will throw the same code with a different message
    candidate = RequiredParamsErrorCode.RequiredParametersNotSupplied;
    expectedResult.message = "errors.REQUIRED_PARAMETERS_NOT_SUPPLIED";
    result = CommonUtils.getErrorForCode(candidate);
    expect(result["code"]).toEqual(expectedResult["code"]);
    expect(result["message"]).toEqual(expectedResult["message"]);

    // 3. Non-Members not allowed throws a different code and message
    candidate = RequiredParamsErrorCode.NonMembersNotAllowed;
    expectedResult["code"] = 403;
    expectedResult["message"] = "errors.NON_MEMBERS_NOT_ALLOWED";
    result = CommonUtils.getErrorForCode(candidate);
    expect(result["code"]).toEqual(expectedResult["code"]);
    expect(result["message"]).toEqual(expectedResult["message"]);
  });

  it("guardItsRequired (replacement for itsRequired) throws when the input is falsy", () => {
    const code = RequiredParamsErrorCode.EntityDoesNotExist;
    let candidate: any; // undefined object
    expect(() => CommonUtils.guardItsRequired(code, candidate)).toThrow(
      "errors.ENTITY_DOES_NOT_EXIST",
    );
  });

  it("guardItsRequired (replacement for itsRequired) returns true when the input is truthy", () => {
    const code = RequiredParamsErrorCode.EntityDoesNotExist;
    const candidate = {};
    expect(CommonUtils.guardItsRequired(code, candidate)).toBe(true);
  });

  it("guardItsRequired (replacement for itsRequired) returns true even when undefined parameters are supplied in an initialsed object", () => {
    const code = RequiredParamsErrorCode.EntityDoesNotExist;
    let a;
    let b;
    const c = "";
    const candidate = {
      A: a,
      B: b,
      C: c,
    };
    expect(CommonUtils.guardItsRequired(code, candidate)).toBe(true);
  });

  it("guardItsRequired (replacement for itsRequired) throws when any single parameter is falsy", () => {
    const code = RequiredParamsErrorCode.EntityDoesNotExist;
    let a: any;
    const b = 0;
    const c = "";
    const candidate = {
      A: a,
      B: b,
      C: c,
    };
    expect(() =>
      CommonUtils.guardItsRequired(code, candidate, c, b, a),
    ).toThrow("errors.ENTITY_DOES_NOT_EXIST");
  });

  it("TruncateText truncates the specified string value to the required length", () => {
    const candidate = "The quick brown fox jumped over the lazy dogs";
    const expectedResult = "The quick brown f...";
    const maxLength = 20;

    const result = CommonUtils.truncateText(candidate, maxLength);
    expect(result).toEqual(expectedResult);
    expect(result.length).toEqual(maxLength);
    expect(result.endsWith("...")).toEqual(true);
  });

  it("TruncateText returns a copy of the input string when the string is shorter than the specified length", () => {
    const candidate = "The quick brown fox";
    const expectedResult = "The quick brown fox";
    const maxLength = 20;

    const result = CommonUtils.truncateText(candidate, maxLength);
    expect(result).toEqual(expectedResult);
    expect(result.length).toEqual(candidate.length);
    expect(result.endsWith("...")).toEqual(false);
  });

  it("transformAttributes transforms the expected parameters", () => {
    const model = StationAttributes;
    const expectedResult = {
      station_id: "string",
      serial_number: "string",
      local_name: "string",
      registration_id: "string",
      code: "string",
      geo: "geometry",
      station_state: "variable",
      station_type: "stationschema",
      district: "district",
      tags: "tag",
      files: "sysfile",
      parents: "array",
      archived: "boolean",
      schema: "json",
      alerts: "json",
      domain: "domain",
      settings: "json",
      word_address: "json",
      address: "json",
      meta: "json",
      scannable_id: "string",
      organizational: "boolean",
      members_only: "boolean",
      has_facilities: "boolean",
      state_key: "statekeys",
    };

    const result = CommonUtils.transformAttributes(model);
    // 1. We should have an object type
    expect(typeof result).toEqual("object");

    // 2. Each key value in result should equal our expected result
    for (const key in result) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result[key]).toEqual(expectedResult[key]);
    }
  });

  it("populateNotNullRecords returns the correct objects for the specified keys", () => {
    const A = { id: 1, ref: "#1", foo: "F1", bar: "B1" };
    const B = { id: null, ref: "#2", foo: "F2", bar: "B2" };
    const C = { id: 3, ref: "#3", foo: "F3", bar: "B3" };
    const D = { ref: "#4", foo: "F4", bar: "B4" };
    const E = { foo: "F5", bar: "B5" };
    const candidates = [A, B, C, D, E];
    const expectedResult = [A, C];

    const result = CommonUtils.populateNotNullRecords(candidates, "id", "ref");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
    for (let i = 0; i < result.length; i++) {
      const r = result[i]!;
      const e = expectedResult[i]!;
      expect(r["id"]).toEqual(e["id"]);
    }
  });

  it("populateNotNullRecords returns an empty array when there are no matching input values", () => {
    const B = { id: null, ref: "#2", foo: "F2", bar: "B2" };
    const D = { ref: "#4", foo: "F4", bar: "B4" };
    const E = { foo: "F5", bar: "B5" };
    const candidates = [B, D, E];
    const expectedResult = [];

    const result = CommonUtils.populateNotNullRecords(candidates, "id", "ref");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
  });

  it("populateNotNullRecords returns an empty array when no input values are specified", () => {
    const expectedResult = [];
    const result = CommonUtils.populateNotNullRecords([], "id", "ref");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
  });

  it("stripUndefinedIds returns an empty array when the input value is not an array with at least one element", () => {
    let candidate: any = null;
    const expectedResult = [];

    let result = CommonUtils.stripUndefinedIds(candidate);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);

    candidate = [];
    result = CommonUtils.stripUndefinedIds(candidate);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);

    candidate = [1];
    result = CommonUtils.stripUndefinedIds(candidate);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(1);
  });

  it("stripUndefinedIds accepts an array of values and returns an array of integers", () => {
    const undef = undefined;
    const candidates = [1, 2, "3", null, undef, 4, "five"];
    const expectedResult = [1, 2, 3, 4];

    const result = CommonUtils.stripUndefinedIds(candidates);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
    for (let i = 0; i < result.length; i++) {
      const r = result[i];
      const e = expectedResult[i];
      expect(r).toEqual(e);
    }
  });

  it("hasKeysShallow returns true for an input object that contains the specified key", () => {
    const candidate = KeyInspector._object;
    const expectedResult = true;

    const result = CommonUtils.hasKeysShallow(candidate, "domain");
    expect(result).toEqual(expectedResult);
  });

  it("hasKeysShallow returns true for an input object that contains the specified keys", () => {
    const candidate = KeyInspector._object;
    const expectedResult = true;

    const result = CommonUtils.hasKeysShallow(candidate, "id", "domain");
    expect(result).toEqual(expectedResult);
  });

  it("hasKeysShallow returns false for an input object that doesn't contain the specified key", () => {
    const candidate = KeyInspector._object;
    const expectedResult = false;

    const result = CommonUtils.hasKeysShallow(candidate, "foo");
    expect(result).toEqual(expectedResult);
  });

  it("containsValue returns true if the input object has the specified value in one of its keys", () => {
    const candidate = KeyInspector.model_attributes.Variable._attributes;
    const expectedResult = true;

    const result = CommonUtils.containsValue(candidate, "domain", "model");
    expect(result).toEqual(expectedResult);
  });

  it("containsValue returns true if the input object has the specified value in one of its keys", () => {
    const candidate = KeyInspector.model_attributes.Variable._attributes;
    const expectedResult = true;

    const result = CommonUtils.containsValue(candidate, 0, "model", "min");
    expect(result).toEqual(expectedResult);
  });

  it("containsValue returns false if the input object doesn't have the specified value in one of its keys", () => {
    const candidate = KeyInspector.model_attributes.Variable._attributes;
    const expectedResult = false;

    // foo isn't a key, model contains 'domain'
    const result = CommonUtils.containsValue(candidate, "bar", "model", "foo");
    expect(result).toEqual(expectedResult);
  });

  it("deepValues should show all the values of id fields in the specified input array", () => {
    const candidate = KeyInspector._array;
    const expectedResult = ["a", "b", "c", "d", "e", "g"];

    const result = CommonUtils.deepValues(candidate, "id");
    expect(result).toEqual(expectedResult);
  });

  it("deepValues should show all the values of id fields in the specified input object", () => {
    const candidate = KeyInspector._object;
    const expectedResult = ["h"];

    const result = CommonUtils.deepValues(candidate, "id");
    expect(result).toEqual(expectedResult);

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(expectedResult[0]);
  });

  it("deepValues should return the value of the specified nested key in the input object", () => {
    const candidate = KeyInspector._object;
    const expectedResult = ["t"];

    const result = CommonUtils.deepValues(candidate, "turnips");
    expect(result).toEqual(expectedResult);
  });

  it("deepValues should return an empty array for non-existent keys on the input object", () => {
    const candidate = KeyInspector._object;
    const expectedResult: any[] = [];

    const result = CommonUtils.deepValues(candidate, "keyDoesntExist");
    expect(result).toEqual(expectedResult);
  });

  it("deepValues should return an array showing that the domains model has models tag, site & statekeys", () => {
    const candidate = KeyInspector.model_attributes.Domain._attributes;
    const expectedResult = ["site", "tag", "statekeys"];

    const result = CommonUtils.deepValues(candidate, "collection", "model");
    expect(result).toEqual(expectedResult);
  });

  it("deepValues should return an array showing that the variable model has models domain", () => {
    const candidate = KeyInspector.model_attributes.Variable._attributes;
    const expectedResult = ["domain"];

    const result = CommonUtils.deepValues(candidate, "model");
    expect(result).toEqual(expectedResult);
  });

  it("deepKeys returns an array of values from the nested input object that match the specfied keys", () => {
    const obj = KeyInspector._object; // the object to search from the parent function
    const keys = ["id", "turnips"]; // the spread key[] values from the parent function
    const expectedResult = ["h", "t"];
    const result: any[] = []; // the result array after iteration

    CommonUtils.deepKeys(obj, (val: any, key: any) => {
      if (_contains(keys, key)) {
        result.push(val);
      }
      return key;
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toEqual(expectedResult);
  });

  it("deepKeys returns an empty array when the nested input object has no matching keys", () => {
    const obj = KeyInspector; // the BIG object to search from the parent function
    const keys = ["foo", "bar"]; // the spread key[] values from the parent function
    const expectedResult: any[] = [];
    const result: any[] = []; // the result array after iteration

    CommonUtils.deepKeys(obj, (val: any, key: any) => {
      if (_contains(keys, key)) {
        result.push(val);
      }
      return key;
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(expectedResult.length);
    expect(result).toEqual(expectedResult);
  });

  it("fixDecimalPlaces adds the correct number of dp to a float input", () => {
    const candidate = 12.345678;
    let dp = 2;
    const round = false;
    let expectedResult = "12.35";

    let result = CommonUtils.fixDecimalPlaces(candidate, round, dp);
    expect(result).toEqual(expectedResult);

    dp = 3;
    expectedResult = "12.346";
    result = CommonUtils.fixDecimalPlaces(candidate, round, dp);
    expect(result).toEqual(expectedResult);
  });

  it("fixDecimalPlaces adds the correct number of dp to a string input", () => {
    const candidate = "12.345678";
    const dp = 2;
    const round = false;
    const expectedResult = "12.35";

    const result = CommonUtils.fixDecimalPlaces(candidate, round, dp);
    expect(result).toEqual(expectedResult);
  });

  it("fixDecimalPlaces ignores the number of dp for an integer input", () => {
    const A = "12";
    const B = 12;
    const dp = 2;
    const round = false;
    const expectedResult = "12";

    let result = CommonUtils.fixDecimalPlaces(A, round, dp);
    expect(result).toEqual(expectedResult);

    result = CommonUtils.fixDecimalPlaces(B, round, dp);
    expect(result).toEqual(expectedResult);
  });

  it("fixDecimalPlaces returns an int value when round is true", () => {
    const A = "12.121212";
    const B = 12.121212;
    const dp = 2;
    const round = true;
    const expectedResult = "12";

    let result = CommonUtils.fixDecimalPlaces(A, round, dp);
    expect(result).toEqual(expectedResult);

    result = CommonUtils.fixDecimalPlaces(B, round, dp);
    expect(result).toEqual(expectedResult);
  });

  it("fixDecimalPlaces defaults to 2dp non-rounded values when the round and length parameters are omitted", () => {
    const candidate = 12.345678;
    const expectedResult = "12.35";

    const result = CommonUtils.fixDecimalPlaces(candidate);
    expect(result).toEqual(expectedResult);
  });

  it("asMoney correctly formats a value into USD using the default options", () => {
    const candidateN = 12.343;
    let expectedResult = "$12.34";

    let A = oldCurrencyFormatter(candidateN);
    let B = CommonUtils.asMoney(candidateN);
    expect(A).toEqual(B);
    expect(A).toEqual(expectedResult);

    const candidateS = "100.4574356";
    expectedResult = "$100.46";
    A = oldCurrencyFormatter(candidateS);
    B = CommonUtils.asMoney(candidateS);
    expect(A).toEqual(B);
    expect(A).toEqual(expectedResult);
  });

  it("asMoney correctly formats a value into the correct currency and locale", () => {
    const candidate = "2100.4574356";
    let expectedResult = "€2,100.46";

    let result = CommonUtils.asMoney(candidate, "EUR", "en");
    expect(result).toEqual(expectedResult); // all good

    // Note 1. Full currency internationalisation was implemented in Node 13.x
    // whereas prior versions use the basic [en] style formatter with the
    // currect currency symbol. If we're running versions newer than v13, we
    // can test the newer formatter.
    // See Constants.NodeABIValues for info.

    // Note 2. There is a char difference in whitespace in the UTF-16 encoded
    // result and the values available at the keyboard (UTF-8). The 'equals'
    // test fails on whitespace, but a string character == reveals the expected
    // result. e.g. ' ' == ' ' in this case utf-16 8239 == utf-8 32.
    if (CommonUtils.nodeModuleVersion() > 79) expectedResult = "2 100,46 €";
    result = CommonUtils.asMoney(candidate, "EUR", "fr");
    expect(result.length).toEqual(expectedResult.length);
    // test each character in the string using equals lite '=='
    for (let i = 0; i < result.length; i++) {
      const r = result[i] || "";
      const e = expectedResult[i] || "";
      // console.log(r, e, result.charCodeAt(i), expectedResult.charCodeAt(i));
      expect(r[i] == e[i]).toBe(true);
    }
  });

  it("PullHost correctly returns the path for all options of config.secure_protocol", () => {
    const siteConfig: any = {
      // secure_protocol: true,         // or null (or not present key)
      site_url: "www.this-is-the-url", // any URL to append to protocol
    };

    // 1. No secure protocol in site config, should default to http
    let expectedResult = "www.this-is-the-url";
    let result = CommonUtils.pullHost(siteConfig);
    expect(result).toEqual(expectedResult);

    // 2. Add 'false' value to site config
    siteConfig["secure_protocol"] = false;
    expectedResult = "http://www.this-is-the-url";
    result = CommonUtils.pullHost(siteConfig);
    expect(result).toEqual(expectedResult);

    // 3. Add 'true' value to site config
    siteConfig["secure_protocol"] = true;
    expectedResult = "https://www.this-is-the-url";
    result = CommonUtils.pullHost(siteConfig);
    expect(result).toEqual(expectedResult);
  });

  it("PullHost correctly returns the override URL when present in process.env", () => {
    const siteConfig: any = {
      secure_protocol: true,
      site_url: "should-be-ignored",
    };

    process.env["LOCAL_OVERRIDE_URL"] = "should-be-this-one";
    const expectedResult = "https://should-be-this-one";
    const result = CommonUtils.pullHost(siteConfig);

    expect(result).toEqual(expectedResult);
  });

  it("Creates a new instance of the IsThisValidator", () => {
    const thisIs = CommonUtils.isThis("value");
    const className = "IsThisValidator";

    expect(thisIs.constructor.name).toEqual(className);

    expect(thisIs.aString).toBe(true);
  });
});
