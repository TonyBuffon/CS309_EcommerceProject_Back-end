// By https://www.github.com/TonyBuffon :)
class AppError extends Error {
  /**
   * @class AppError
   * @extends Error
   *
   * @description
   * A custom error class that adds a statusCode and a status to the error object.
   * The status is either "failed" for 4xx status codes or "error" for 5xx status codes.
   *
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   *
   * @property {number} statusCode - The HTTP status code.
   * @property {string} status - Either "failed" or "error".
   * @property {boolean} isOperational - A flag to indicate that the error is an operational error (i.e., not a programming error).
   */
  constructor(message, statusCode) {
    /**
     * @description
     * The error message.
     */
    super(message);

    /**
     * @description
     * The HTTP status code.
     */
    this.statusCode = statusCode;

    /**
     * @description
     * The status of the error. Either "failed" or "error".
     */
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";

    /**
     * @description
     * A flag to indicate that the error is an operational error (i.e., not a programming error).
     */
    this.isOperational = true;

    // Capture the stack trace to be able to log it if needed.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
