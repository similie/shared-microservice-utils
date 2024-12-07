/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
/**
 * @summary Test rig for PerformanceTimer.js
 */
/** @summary Test rig components */
/** @summary Header files */
import * as TimeUtils from './utils';
import { PerformanceTimer } from './perf-timer';

describe('PerformanceTimer.js', function () {
  /**
   * @summary Test functions for the PerformanceTimer helper module
   */

  it('new TimeUtils.performanceTimer() creates a new instance of a PerformanceTimer class', function () {
    const instance = new TimeUtils.PerformanceTimer(3);
    const className = 'PerformanceTimer';

    expect(instance.constructor.name).toEqual(className);
  });

  it('Performance Timer returns a value in milliseconds for time periods less than 0.75s', function (done) {
    let duration = 0;
    let formattedResult = '';
    const decimalPlaces = 5;
    const delay = 400;

    const timer = new PerformanceTimer(decimalPlaces);

    setTimeout(function () {
      duration = timer.stop().milliseconds;
      formattedResult = timer.format();

      // set our expectations to between half and double, we're testing the
      // format of the output, not the accuracy of setTimeout.
      expect(duration).toBeGreaterThan(delay / 2);
      expect(duration).toBeLessThan(delay * 2);
      expect(formattedResult).toContain('ms');

      formattedResult = formattedResult.replace('ms', '');
      const a = formattedResult.split('.');
      expect(a[1]!.length).toEqual(decimalPlaces);

      done();
    }, delay);
  });

  it('Performance Timer returns a value in seconds for time periods greater than 0.75s', function (done) {
    let duration = 0;
    let formattedResult = '';
    const decimalPlaces = 3;
    const delay = 800;
    const timer = new PerformanceTimer(decimalPlaces);

    setTimeout(function () {
      duration = timer.stop().seconds;
      formattedResult = timer.format();

      // set our expectations to between half and double, we're testing the
      // format of the output, not the accuracy of setTimeout.
      const delayInSeconds = delay / 1e3;
      expect(duration).toBeGreaterThan(delayInSeconds / 2);
      expect(duration).toBeLessThan(delayInSeconds * 2);
      expect(formattedResult).toContain('s');

      formattedResult = formattedResult.replace('s', '');
      const a = formattedResult.split('.');
      expect(a[1]!.length).toEqual(decimalPlaces);

      done();
    }, delay);
  });
});
