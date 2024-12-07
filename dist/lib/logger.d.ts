declare const Logger: import("winston").Logger;
declare class LogProfile {
    private label;
    private readonly Logger;
    constructor(label: string);
    private get format();
    private applyFormatting;
    get log(): import("winston").Logger;
}
export { Logger, LogProfile };
