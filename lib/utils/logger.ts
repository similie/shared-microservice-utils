import { format, transports, createLogger } from 'winston';

const isProduction = process.env['NODE_ENV'] === 'production';
const isTest = process.env['NODE_ENV'] === 'test';

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const fmt = format.combine(
  format.timestamp({ format: 'isoDateTime' }),
  format.label({ label: 'Application' }),
  // format.json()
  myFormat
);

const Logger = createLogger({
  level: isProduction ? 'verbose' : 'silly',
  format: fmt,
  // transports: [new transports.Console()],
});

// If we're not in production then log to the `console`
if (!isProduction && !isTest) {
  Logger.add(
    new transports.Console({
      format: format.combine(fmt, format.colorize({ all: true })),
    })
  );
} else {
  Logger.add(new transports.Console());
}

class LogProfile {
  private readonly Logger;
  public constructor(private label: string) {
    this.Logger = createLogger({
      level: isProduction ? 'verbose' : 'silly',
      format: this.format,
      // transports: [new transports.Console()],
    });
    this.applyFormatting();
  }

  private get format() {
    return format.combine(
      format.timestamp({ format: 'isoDateTime' }),
      format.label({ label: this.label }),
      // format.json()
      myFormat
    );
  }

  private applyFormatting() {
    this.Logger.add(
      new transports.Console({
        format: format.combine(this.format, format.colorize({ all: true })),
      })
    );
  }

  public get log() {
    return this.Logger;
  }
}

export { Logger, LogProfile };
