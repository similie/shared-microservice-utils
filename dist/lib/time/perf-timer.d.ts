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
export declare class PerformanceTimer {
    private _startTime;
    private _nanosPerSec;
    private _precision;
    private _durationInMills;
    /**
     * @description Class constructor, starts the timer on initialisation
     * @param {number} precision Required. Number of decimal places in the
     * formatted output
     */
    constructor(precision: number);
    /**
     * @description Returns the number of milliseconds counted. Zero until
     * 'stop()' has been called
     * @returns {number} The number of milliseconds between start|init and stop
     */
    get milliseconds(): number;
    /**
     * @description Returns the number of seconds counted. Zero until
     * 'stop()' has been called
     * @returns {number} The number of seconds between start|init and stop
     */
    get seconds(): number;
    /**
     * @description Get the number of decimal places configured for
     * the formatted output.
     * @returns {number} Returns the number of decimal places
     */
    get precision(): number;
    /**
     * @description Setter for number of decimal places
     * @param {number} value Set the number of decimal places to display in the
     * formatted value.
     * @returns {this} the current instance of the PerformanceTimer class
     */
    setPrecision(value: number): this;
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
    start(): this;
    /**
     * @description Stops timing and calculates the elapsed time period
     * @returns {this} the current instance of the PerformanceTimer class
     */
    stop(): this;
    /**
     * @description Formats the time period as milliseconds for events over 500ms
     * or seconds otherwise, adding the specified number of decimal places and
     * appending 's' or 'ms' as required to indicate the order of the value.
     * @returns {string} Formatted string to the specified number of
     * decimal places
     */
    format(): string;
}
