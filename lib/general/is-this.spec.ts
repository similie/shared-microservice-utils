/** @summary Header files */
import { IsThis } from "./is-this";
import { DateTimeFormats } from "../constants";

describe("IsThis Validator Class", () => {
  /**
   * @summary This section of tests verifies functions exported via
   * the IsThisValidator class wrapper module: IsThis
   * Developer note.
   * The following Lodash passthough convenience functions are not tested
   *    aNumber             AKA isNumber
   *    aString             AKA isString
   *    anArray             AKA isArray
   *    anObject            AKA isObject
   *    finite              AKA isFinite
   *    undefined           AKA isUndefined
   *    nullOrUndefined     AKA isNil
   */

  it("A call to IsThis(value) creates a new instance of the IsThisValidator class", () => {
    const instance = IsThis(3);
    const className = "IsThisValidator";

    expect(instance.constructor.name).toEqual(className);
  });

  it("IsThis(value).aValidDateTimeCandidate passes negative and positive test cases", () => {
    let candidate; // undefined
    let result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(false);

    candidate = null;
    result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(false);

    candidate = "1234";
    result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(false);

    candidate = 123456789; // e.g. Date in milliseconds
    result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(true);

    candidate = "20/10/2010"; // e.g. Date as a formatted string
    result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(true);
  });

  it("IsThis(value).aValidDateTimeCandidate passes low value integer values as a date =:o", () => {
    // e.g. Database Entity Id 12,345 passed as a string, even though this
    // corresponds to a date [of birth] in Jan 1970, so actually is a valid
    // Date. It's just probably not what we intended this validator to pass.
    const candidate = "12345";
    const result = IsThis(candidate).aValidDateTimeCandidate;
    expect(result).toBe(true);
  });

  it("IsThis(value).aValidDateTimeFormat passes negative and positive test cases", () => {
    let candidate = DateTimeFormats.Date.full;
    let result = IsThis(candidate).aValidDateTimeFormat;
    expect(result).toBe(true);

    candidate = DateTimeFormats.ISO;
    result = IsThis(candidate).aValidDateTimeFormat;
    expect(result).toBe(true);

    candidate = "dd/mm/yy"; // worth noting!
    result = IsThis(candidate).aValidDateTimeFormat;
    expect(result).toBe(false);

    candidate = "obviously not valid";
    result = IsThis(candidate).aValidDateTimeFormat;
    expect(result).toBe(false);
  });

  it("IsThis(value).aUseableNumber passes negative and positive test cases", () => {
    let candidate;
    let result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(false);

    candidate = null;
    result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(false);

    candidate = "123";
    result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(false);

    candidate = Number.NEGATIVE_INFINITY;
    result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(false);

    candidate = 123;
    result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(true);

    candidate = 123.45;
    result = IsThis(candidate).aUseableNumber;
    expect(result).toBe(true);
  });

  it("IsThis(value).numericIsh passes negative and positive test cases", () => {
    // note. Uses .aUseableNumber after a call to parseInt. It will pass all tests
    // considered in that function

    let result = IsThis(123.456).numericIsh;
    expect(result).toBe(true);

    result = IsThis(8).numericIsh;
    expect(result).toBe(true);

    result = IsThis("8").numericIsh;
    expect(result).toBe(true);

    result = IsThis("123.456").numericIsh;
    expect(result).toBe(true);

    result = IsThis({ foo: "bar" }).numericIsh;
    expect(result).toBe(false);

    result = IsThis("12s3.456").numericIsh;
    expect(result).toBe(false);

    result = IsThis("s123").numericIsh;
    expect(result).toBe(false);

    result = IsThis("2020-10-12T10:11:12+09:00").numericIsh;
    expect(result).toBe(false);
  });

  it("IsThis(value).aUseableInt passes negative and positive test cases", () => {
    // Developer note. This method passes the input candidate through
    // the 'aUseableNumber' function prior to testing if it is an int.
    // Those tests (above) are not repeated here.
    let candidate = 123;
    let result = IsThis(candidate).aUseableInt;
    expect(result).toBe(true);

    result = IsThis("123").aUseableInt;
    expect(result).toBe(true);

    candidate = 123.45;
    result = IsThis(candidate).aUseableInt;
    expect(result).toBe(false);
  });

  it("IsThis(value).aUseableFloat passes negative and positive test cases", () => {
    // Developer note. This method passes the input candidate through
    // the 'aUseableNumber' function prior to testing if it is a float.
    // Those tests (above) are not repeated here.
    let candidate = 123;
    let result = IsThis(candidate).aUseableFloat;
    expect(result).toBe(false);

    candidate = 123.45;
    result = IsThis(candidate).aUseableFloat;
    expect(result).toBe(true);
  });

  it("IsThis(value).between(a,b) passes negative and positive test cases for numeric values", () => {
    // Developer note. This method passes the input candidate through
    // the 'aUseableNumber' function prior to testing if it is a float.
    // Those tests (above) are not repeated here.
    const candidate = 123;
    const thisIs = IsThis(candidate);

    expect(thisIs.between(100, 200)).toBe(true);
    expect(thisIs.between(10, 20)).toBe(false);
  });

  it("IsThis(value).between(a,b) returns false for non numeric initialiser values", () => {
    // Developer note. This method passes the input candidate through
    // the 'aUseableNumber' function prior to testing if it is a float.
    // Those tests (above) are not repeated here.
    const candidate = "123";
    const result = IsThis(candidate);

    expect(result.between(100, 200)).toBe(false);
    expect(result.between(10, 20)).toBe(false);
  });

  it("IsThis(value).oneOf(...) returns true when the initialser is in the input spread", () => {
    const candidate = "123";
    const result = IsThis(candidate).oneOf("123", "abc", "def");
    expect(result).toBe(true);
  });

  it("IsThis(value).oneOf(...) returns false when the initialser is NOT in the input spread", () => {
    const candidate = "GET";
    const result = IsThis(candidate).oneOf("put", "post", "delete");
    expect(result).toBe(false);
  });

  it("IsThis(value).oneOf(...) performs a case-insensitive search", () => {
    const candidate = "GET";
    const result = IsThis(candidate).oneOf("put", "post", "get");
    expect(result).toBe(true);
  });

  it("IsThis(value).oneOf(...) returns false when the initialser is not a string type", () => {
    let result = IsThis(undefined).oneOf("123", "abc", "def");
    expect(result).toBe(false);

    result = IsThis(123).oneOf("123", "abc", "def");
    expect(result).toBe(false);
  });
});
