const FormsResource = require('./formsResource');

/**
 * Apps product endpoints.
 */
class AppsProduct {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/apps`;

    this.forms = new FormsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = AppsProduct;
