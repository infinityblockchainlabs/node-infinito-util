const Util = require('util');

/**
 * Application Error Class
 *
 * @class AppError
 * @extends {Error}
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {*} message
   * @param {*} code
   * @param {*} httpCode
   * @memberof AppError
   */
  constructor(message, code, httpCode, innerError) {
    super();
    this.message = message;
    this.code = code;
    this.httpCode = httpCode;
    this.inner = innerError;
  }

  /**
   * Create error
   *
   * @static
   * @param {*} msg
   * @param {*} params
   * @returns
   * @memberof AppError
   */
  static create(msg, ...params) {
    return new AppError(Util.format(msg.message, ...params), msg.code);
  }

}

module.exports = AppError;
