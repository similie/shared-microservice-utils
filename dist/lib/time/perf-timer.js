"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTimer = void 0;
/**
 * @description Time period calculation Class for performance testing and
 * debugging code blocks. Can output in millis, seconds or formatted string.
 *
 * @example
 *    const timer = new TimeUtils.PerformanceTimer(<dp>);
 *    {... long running code... }
 *    const timeTaken = timer.stop().milliseconds;
 *    or
 *    console.log(timer.stop().format());
 *
 * @version 1.0.0.0
 * @todo Better format function for higher order results. 1min 30.3444s
 *
 * Developer note. process.hrtime.bigint() was added in Node v10.7.0
 * When using this version, the time period calculation can be
 * upgraded to use the more recent BigInt version:
 * https://nodejs.org/api/process.html#process_process_hrtime_bigint
 * which provides for simpler duration calulations.
 */
class PerformanceTimer {
    /**
     * @description Class constructor, starts the timer on initialisation
     * @param {number} precision Required. Number of decimal places in the
     * formatted output
     */
    constructor(precision) {
        this._startTime = [0, 0];
        this._nanosPerSec = 1e9;
        this._precision = 4;
        this._durationInMills = 0;
        if (precision && typeof precision === 'number') {
            this._precision = precision;
        }
        this.start();
    }
    /**
     * @description Returns the number of milliseconds counted. Zero until
     * 'stop()' has been called
     * @returns {number} The number of milliseconds between start|init and stop
     */
    get milliseconds() {
        return this._durationInMills;
    }
    /**
     * @description Returns the number of seconds counted. Zero until
     * 'stop()' has been called
     * @returns {number} The number of seconds between start|init and stop
     */
    get seconds() {
        return this._durationInMills / 1e3;
    }
    /**
     * @description Get the number of decimal places configured for
     * the formatted output.
     * @returns {number} Returns the number of decimal places
     */
    get precision() {
        return this._precision;
    }
    /**
     * @description Setter for number of decimal places
     * @param {number} value Set the number of decimal places to display in the
     * formatted value.
     * @returns {this} the current instance of the PerformanceTimer class
     */
    setPrecision(value) {
        this._precision = value;
        return this;
    }
    /**
     * @description Restart the timer. Useful for reuse in multi-measurement
     * scenarios.
     * @example let timer = new PerformanceTimer(4);
     * {... some time later ...}
     * let t = timer.stop().seconds;
     * timer = timer.start().setPrecision(6);
     * {... some more time later ...}
     * t = timer.stop().format();
     * @returns {this} the current instance of the PerformanceTimer class
     */
    start() {
        this._startTime = process.hrtime();
        this._durationInMills = 0;
        return this;
    }
    /**
     * @description Stops timing and calculates the elapsed time period
     * @returns {this} the current instance of the PerformanceTimer class
     */
    stop() {
        const diff = process.hrtime(this._startTime);
        this._durationInMills = (diff[0] * this._nanosPerSec + diff[1]) / 1e6;
        return this;
    }
    /**
     * @description Formats the time period as milliseconds for events over 500ms
     * or seconds otherwise, adding the specified number of decimal places and
     * appending 's' or 'ms' as required to indicate the order of the value.
     * @returns {string} Formatted string to the specified number of
     * decimal places
     */
    format() {
        let postfix = 'ms';
        let result = this._durationInMills;
        if (this._durationInMills > 500) {
            // output time in seconds
            result = result / 1e3;
            postfix = 's';
        }
        /** @summary Either 0.6543ms or 1.2345s */
        return result.toFixed(this._precision) + postfix;
    }
}
exports.PerformanceTimer = PerformanceTimer;
