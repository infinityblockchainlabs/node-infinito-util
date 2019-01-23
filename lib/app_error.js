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
  constructor(message, code, httpCode) {
    super();
    this.message = message;
    this.code = code;
    this.httpCode = httpCode;
  }
}

module.exports = AppError;