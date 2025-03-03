import config from "../env"

export interface LogFn {
  (message?: unknown, ...optionalParams: unknown[]): void
}

export interface Logger {
  log: LogFn
  warn: LogFn
  error: LogFn
  handleException: (error: Error, level?: LogLevel) => void
}

export type LogLevel = "log" | "warn" | "error"

const NO_OP: LogFn = () => {}

export class ConsoleLogger implements Logger {
  readonly log: LogFn
  readonly warn: LogFn
  readonly error: LogFn
  readonly handleException: (error: Error, level?: LogLevel) => void

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {}

    const formatTimestamp = () => new Date().toLocaleString()

    this.log = (...args: unknown[]) => console.log(formatTimestamp(), ...args)

    this.warn = (...args: unknown[]) => console.warn(formatTimestamp(), ...args)

    this.error = (...args: unknown[]) => console.error(formatTimestamp(), ...args)

    if (level === "error") {
      this.warn = NO_OP
      this.log = NO_OP
    } else if (level === "warn") {
      this.log = NO_OP
    }

    this.handleException = (error: Error, level: LogLevel = "error") => {
      switch (level) {
        case "log":
          this.log(`Exception: ${error.message}`, error)
          break
        case "warn":
          this.warn(`Warning: ${error.message}`, error)
          break
        case "error":
        default:
          this.error(`Error: ${error.message}`, error)
          break
      }
    }
  }
}

export const logger = new ConsoleLogger({ level: config.LOG_LEVEL })
