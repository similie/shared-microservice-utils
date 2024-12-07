import { indexOf } from "lodash";

/** @summary Header files */
import * as imaging from "../general/imaging";
// import {ISysFileModelEntity} from '@similie/types';
import { Base64Image, SysFileConfig, SysFileList } from "./imaging-test-models";

describe("Imaging", () => {
  it("randomColor creates a random HTML hex color", () => {
    const regex = new RegExp(/^#([a-f0-9]{6})$/);
    const results: string[] = [];
    let result = "";
    let isValid = false;

    // 1. Test the regex for correct results
    expect(regex.test("#12345a")).toBe(true);
    expect(regex.test("12345a")).toBe(false);
    expect(regex.test("#12345g")).toBe(false);
    expect(regex.test("123#45g")).toBe(false);

    // 2. Run through 10 of them to make sure we get a bunch of valid results
    for (let i = 0; i < 10; i++) {
      result = imaging.randomColor();
      isValid = regex.test(result);
      expect(isValid).toBe(true);
      expect(indexOf(results, result)).toEqual(-1); // should be random...
      results.push(result); // add this one AFTER or it will be at index 0
    }
  });

  // eslint-disable-next-line max-len
  it("Returns the candidate string when it is properly wrapped in a Base64 encoded image header", () => {
    const candidate = Base64Image.withHeader;
    const result = imaging.ensureBase64EncodedImageHeader(candidate, "*.jpeg");

    // should be unchanged
    expect(result).toEqual(candidate);
  });

  // eslint-disable-next-line max-len
  it("Wraps the candidate string when it is missing a Base64 encoded image header", () => {
    const candidate = Base64Image.noHeader;
    const expectedResult = Base64Image.withHeader;
    const result = imaging.ensureBase64EncodedImageHeader(candidate, "*.jpeg");

    // should be changed
    expect(result).toEqual(expectedResult);
  });

  it("Adds a default JPEG image type when none is supplied", () => {
    const candidate = Base64Image.noHeader;
    const expectedResult = Base64Image.withHeader;
    const result = imaging.ensureBase64EncodedImageHeader(candidate, "");

    // should be changed and include the jpeg image descriptor
    expect(result).toEqual(expectedResult);
  });

  // eslint-disable-next-line max-len
  it("Removes the base64 image header when one is present in the supplied image string", () => {
    const candidate = Base64Image.withHeader;
    const expectedResult = Base64Image.noHeader;
    const result = imaging.stripBase64EncodedImageHeader(candidate);

    // should be changed and not include the jpeg image descriptor
    expect(result).toEqual(expectedResult);
  });

  // eslint-disable-next-line max-len
  it("Returns a copy the base64 image string when no header is present in the supplied image string", () => {
    const candidate = Base64Image.noHeader;
    const expectedResult = Base64Image.noHeader;
    const result = imaging.stripBase64EncodedImageHeader(candidate);

    // should be changed and not include the jpeg image descriptor
    expect(result).toEqual(expectedResult);
  });

  it("encodes the image at the URL specified into an HTML compatible <img> tag", async () => {
    // This test uses the publicly available FFDTL image, downloaded and
    // Base64 encoded separately and compares it to our URL image encoder.
    const candidate =
      "https://cdn.jsdelivr.net/npm/heroicons@1.0.6/solid/archive.svg";
    const expectedResult = Base64Image.archive;
    const result = await imaging.encodeImage(candidate);

    expect(result).toEqual(expectedResult);
  });

  // eslint-disable-next-line max-len
  it("getFirstImage returns the path to the first image file in the specified list of SysFile objects", () => {
    const files = SysFileList;
    const config = SysFileConfig;
    const expectedResult = "api/v1/sysfile/29";

    // @ t s -expect-error: partial
    const result = imaging.getFirstImage(files, config);
    expect(result).toEqual(expectedResult);
  });

  // eslint-disable-next-line max-len
  it("getFirstImage returns the ID of the first image file when the config is not supplied", () => {
    const files = SysFileList;
    const expectedResult = "29";

    // @ t s -expect-error: partial
    const result = imaging.getFirstImage(files);
    expect(result).toEqual(expectedResult);
  });

  it("getFirstImage returns null when the fileList is empty", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const files: Array<any /* ISysFileModelEntity*/> = [];
    const config = SysFileConfig;
    const expectedResult = null;

    const result = imaging.getFirstImage(files, config);
    expect(result).toEqual(expectedResult);
  });
});
