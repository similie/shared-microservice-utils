"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogProfile = exports.Logger = void 0;
const winston_1 = require("winston");
const isProduction = process.env['NODE_ENV'] === 'production';
const isTest = process.env['NODE_ENV'] === 'test';
const myFormat = winston_1.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const fmt = winston_1.format.combine(winston_1.format.timestamp({ format: 'isoDateTime' }), winston_1.format.label({ label: 'Application' }), 
// format.json()
myFormat);
const Logger = (0, winston_1.createLogger)({
    level: isProduction ? 'verbose' : 'silly',
    format: fmt,
    // transports: [new transports.Console()],
});
exports.Logger = Logger;
// If we're not in production then log to the `console`
if (!isProduction && !isTest) {
    Logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(fmt, winston_1.format.colorize({ all: true })),
    }));
}
else {
    Logger.add(new winston_1.transports.Console());
}
class LogProfile {
    constructor(label) {
        this.label = label;
        this.Logger = (0, winston_1.createLogger)({
            level: isProduction ? 'verbose' : 'silly',
            format: this.format,
            // transports: [new transports.Console()],
        });
        this.applyFormatting();
    }
    get format() {
        return winston_1.format.combine(winston_1.format.timestamp({ format: 'isoDateTime' }), winston_1.format.label({ label: this.label }), 
        // format.json()
        myFormat);
    }
    applyFormatting() {
        this.Logger.add(new winston_1.transports.Console({
            format: winston_1.format.combine(this.format, winston_1.format.colorize({ all: true })),
        }));
    }
    get log() {
        return this.Logger;
    }
}
exports.LogProfile = LogProfile;
