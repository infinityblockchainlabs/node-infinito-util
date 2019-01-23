const ShaJs = require('sha.js');
const Util = require('util');
const Messages = require('./messages');
const Http = require('./http');
const Logger = require('./logger');
const AppError = require('./app_error');
const AsyncLock = require('./asynclock');

/**
 * Token provider
 *
 * @class TokenProvider
 */
class TokenProvider {
  /**
   * Creates an instance of TokenProvider.
   * @param {Object} options
   * @param {String} options.apiKey              (required) API Key
   * @param {String} options.secret              (required) Secret Key
   * @param {String} options.expired             (optional) Expired time in minute
   * @param {String} options.url                 (required) Base url of api
   * @memberof TokenProvider
   */
  constructor(options) {
    this._enforce(options, ['apiKey', 'secret', 'url']);

    this.apiKey = options.apiKey;
    this.secret = options.secret;
    this.expired = (options.expired || 60) * 60;
    this.url = options.url;
    this.lock = new AsyncLock();

    this.latestToken = null;
  }

  /**
   * Set latest token
   *
   * @param {*} newToken
   * @memberof TokenProvider
   */
  setToken(newToken) {
    this.latestToken = newToken;
  }

  /**
   * Clear token
   *
   * @memberof TokenProvider
   */
  clearToken() {
    this.setToken(null);
  }

  /**
   * Get latest token. Get new token if it is not exists.
   *
   * @returns
   * @memberof TokenProvider
   */
  async getLatestToken() {
    if (this.latestToken) {
      return this.latestToken;
    }

    let token = this.getNewTokenOnce();
    this.setToken(token);
    return token;
  }

  /**
   * Refresh latest token
   *
   * @returns
   * @memberof TokenProvider
   */
  async getNewTokenOnce() {
    let result = await this.lock.acquire();
    if (result === true) {
      let token = this.getNewToken();
      this.lock.release(token);
      return token;
    }

    return result;
  }

  /**
   * Get new token
   *
   * @returns
   * @memberof TokenProvider
   */
  async getNewToken() {
    let expired = Math.floor(new Date().getTime() / 1000) + this.expired;
    let body = {
      api_key: this.apiKey,
      expired: expired,
      grant_type: 'client_credentials',
    };
    let signString = `${this.secret}
POST
/iam/token
${JSON.stringify(body)}`;

    let signature = new ShaJs.sha256().update(signString).digest('hex');

    try {
      let result = await Http.send(
        this.url,
        'POST',
        {
          'Content-Type': 'application/json',
          'x-signature': signature,
        },
        body
      );
      return result.data.data.access_token;
    } catch (err) {
      Logger.error('getNewToken: ', err);
      if (err.response.status === 401)
        throw new AppError(
          Messages.invalid_api_key.message,
          Messages.invalid_api_key.code,
          err.response.status
        );
      throw new AppError(
        Messages.internal_error.message,
        Messages.internal_error.code,
        err.response.status
      );
    }
  }

  /**
   * Get checksum
   *
   * @param {object} opts
   * @param {String} opts.secretKey             (required) Secret key
   * @param {String} opts.httpVerb              (required) Uppercase HTTP-Verb GET, POST, DELETE, PUT
   * @param {String} opts.url                   (required) URL
   * @param {String} opts.jsonEncodeBody        (required) JSON-Encode(BODY): JSON.stringify(request body)
   * @param {Number} opts.xTime                 (required) X-Time: Unix Time
   * @returns
   * @memberof Method
   */
  getChecksum(opts) {
    let { secretKey, httpVerb, url, jsonEncodeBody, xTime } = opts;
    let stringToSign = `${secretKey}
${httpVerb.toUpperCase()}
${url}
${jsonEncodeBody}
${xTime}`;
    let checksum = new ShaJs.sha256().update(stringToSign).digest('hex');
    return checksum;
  }

  /**
   * Enforce require key in object
   *
   * @param {Object} options
   * @param {Array[String]} requiredKeys
   * @memberof Api
   */
  _enforce(options, requiredKeys) {
    if (!options || typeof options !== 'object') {
      throw new AppError(
        Util.format(Messages.missing_parameter.message, 'options'),
        Messages.missing_parameter.code
      );
    }

    requiredKeys.forEach(function(requiredKey) {
      if (!options[requiredKey])
        throw new AppError(
          Util.format(
            Messages.missing_parameter.message,
            `options.${requiredKey}`
          ),
          Messages.missing_parameter.code
        );
    });
  }
}

module.exports = TokenProvider;
