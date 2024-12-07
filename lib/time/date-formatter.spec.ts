/* eslint-disable max-len */
/** @summary Test rig components */
import { DateTime } from "luxon";

/** @summary Header files */
import { DefaultTimeZoneName, DateTimeFormats } from "../constants";
import * as DateFormatter from "./date-formatter";

const tz = DefaultTimeZoneName;

describe("DateTimeFormatter.js", function () {
  /**
   * @summary Tests functions in DateTimeFormatter helper module
   */

  it("validDateTimeFormatOrISO returns the queried format when it matches one of the predefined formats", function () {
    const fmts = DateTimeFormats;
    const formats = [
      fmts.Date.monthFirst,
      fmts.Date.medium, // reportFormattedDate without Time
      fmts.Date.full,
      fmts.DateTime.medium24Hr, // reportFormattedDate with Time
      fmts.DateTime.fullAmPm,
      fmts.DateTime.monthFirstZ, // used by SqlUtils
      fmts.DateTime.verboseAmPm,
      fmts.Time.HoursMinsSecs,
      fmts.Time.UnixMillis,
      fmts.Time.MinsSecs.asDecimal,
      fmts.Time.MinsSecs.asTime,
      fmts.ISO, // isoFormattedDate
      fmts.SQL, // sqlFormattedDate
      fmts.Device, // DeviceController.js format
    ];

    let result = "";
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i] as string;
      result = DateFormatter.validDateTimeFormatOrISO(format);
      expect(result).toEqual(format);
    }
  });

  it("validDateTimeFormatOrISO returns ISO format when it does not match one of the predefined formats", function () {
    const result = DateFormatter.validDateTimeFormatOrISO(
      "not a recognised format",
    );
    expect(result).toEqual(DateTimeFormats.ISO);
  });

  it("formatDate - returns the correct date string from one of the specified formats in constants.formats", function () {
    const dateString = "2019-09-10T10:02:30.123+02:00";
    const fmts = DateTimeFormats;
    const formats = [
      fmts.Date.monthFirst,
      fmts.Date.medium, // reportFormattedDate without Time
      fmts.Date.full,
      fmts.DateTime.medium24Hr, // reportFormattedDate with Time
      fmts.DateTime.fullAmPm,
      fmts.DateTime.monthFirstZ, // used by SqlUtils
      fmts.DateTime.verboseAmPm,
      fmts.Time.HoursMinsSecs,
      fmts.Time.UnixMillis,
      fmts.Time.MinsSecs.asDecimal,
      fmts.Time.MinsSecs.asTime,
      fmts.ISO, // isoFormattedDate
      fmts.SQL, // sqlFormattedDate
      fmts.Device, // DeviceController.js format
      "invalid format", // will default to ISO
    ];
    const expectedResults = [
      "09/10/2019",
      "Sep 10, 2019",
      "September 10, 2019",
      "Sep 10, 2019 17:02",
      "September 10, 2019 5:02 PM",
      "09-10-2019 17:02:30+0900",
      "Tuesday, September 10, 2019 5:02 PM",
      "17:02:30",
      "1568102550123",
      "2.30",
      "02:30",
      "2019-09-10T17:02:30+09:00",
      "2019-09-10 17:02:30.123 +09:00",
      "17&2&30&10&9&2019",
      "2019-09-10T17:02:30+09:00",
    ];

    const dt = DateTime.fromISO(dateString).setZone(tz);
    let result = "";
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i] as string;
      const expectedResult = expectedResults[i] as string;
      result = DateFormatter.formatDate(dt, format);

      expect(result).toEqual(expectedResult);
    }
  });

  it("formatDateForDevice - returns a date that can be transformed into a compatable string for DeviceController.config::date", function () {
    const dateString = "2019-09-10T10:02:30+02:00";
    const expectedResult = "17&2&30&10&9&2019"; // note TZ difference +2 -> +9
    const dt = DateTime.fromISO(dateString).setZone(tz);

    const result = DateFormatter.formatDateForDevice(dt);
    expect(result).toEqual(expectedResult);
  });
});
