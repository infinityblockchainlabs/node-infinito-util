const LOG_ALL = 1;
const LOG_DEBUG = 2;
const LOG_INFO = 3;
const LOG_WARN = 4;
const LOG_ERROR = 5;
const LOG_NONE = 6;

/**
 * Logger Class
 *
 * @class Logger
 */
class Logger {
  constructor() {
    this.logLevel = LOG_ERROR;
    this.innerLogger = null;
  }

  setLogger(value) {
    if (value) this.innerLogger = value;
  }

  /**
   * Set log level
   *
   * @param {String} level  (required) Set log level (DEBUG, INFO, WARN, ERROR)
   */
  setLogLevel(level) {
    if (level && typeof level === 'string') {
      level = level.toUpperCase();
      switch (level) {
        case 'ALL':
          this.logLevel = LOG_ALL;
          break;
        case 'DEBUG':
          this.logLevel = LOG_DEBUG;
          break;
        case 'INFO':
          this.logLevel = LOG_INFO;
          break;
        case 'WARN':
          this.logLevel = LOG_WARN;
          break;
        case 'ERROR':
          this.logLevel = LOG_ERROR;
          break;
        case 'NONE':
          this.logLevel = LOG_NONE;
          break;
      }
    }
  }

  /**
   * Log error message
   *
   * @memberof Logger
   */
  error() {
    if (this.logLevel && this.logLevel <= LOG_ERROR)
      this.__defaultLogFunc('ERROR', ...arguments);
  }

  /**
   * Log warn message
   *
   * @memberof Logger
   */
  warn() {
    if (this.logLevel && this.logLevel <= LOG_WARN)
      this.__defaultLogFunc('WARN', ...arguments);
  }

  /**
   * Log info message
   *
   * @memberof Logger
   */
  info() {
    if (this.logLevel && this.logLevel <= LOG_INFO)
      this.__defaultLogFunc('INFO', ...arguments);
  }

  /**
   * Log debug message
   *
   * @memberof Logger
   */
  debug() {
    if (this.logLevel && this.logLevel <= LOG_DEBUG)
      this.__defaultLogFunc('DEBUG', ...arguments);
  }

  /**
   * Default write log function
   *
   * @memberof Logger
   */
  __defaultLogFunc(fname, ...params) {
    if (this.innerLogger) {
      this.innerLogger[fname.toLowerCase()](...params);
    } else {
      var text = `[INFINITO-SDK] ${new Date().toISOString()} `;
      console.log(text, fname, ...params);
    }
  }
}

module.exports = new Logger();
