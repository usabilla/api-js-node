const WidgetsResource = require('./widgetsResource');

/**
 * Email product endpoints.
 */
class EmailProduct {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/email`;

    this.widgets = new WidgetsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = EmailProduct;
