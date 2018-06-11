class ClientError extends Error {
  constructor(raw = {}) {
    super();

    if (!raw.response || !raw.response.data || !raw.response.data.error) {
      return;
    }

    const error = raw.response.data.error;
    this.type = error.type;
    this.code = error.code;
    this.message = error.message;
    this.status = error.status;
  }
}

module.exports = ClientError;
