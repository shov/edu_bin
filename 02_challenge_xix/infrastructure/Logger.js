'use strict'

/**
 * @implements ILogger
 */
class Logger {

  log(message, ...values) {
    this.info(message, ...values)
  }

  info(message, ...values) {
    this._deliver(message, 'info', ...values)
  }

  warn(message, ...values) {
    this._deliver(message, 'warn', ...values)
  }

  error(message, ...values) {
    this._deliver(message, 'error', ...values)
  }

  _deliver(message, level, ...values) {
    // Console
    const toLog = [message]
    if (values.length > 0) {
      toLog.push(values)
    }
    console[level](...toLog)
  }
}

module.exports = Logger
