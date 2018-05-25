const get = require('lodash/get');

class ClientError extends Error {
  constructor(raw = {}) {
    super(raw);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClientError);
    }

    this.message = get(raw, 'response.data.error.message', '');
    this.raw = raw;
    this.timestamp = Date.now();
  }
}

module.exports = ClientError;
