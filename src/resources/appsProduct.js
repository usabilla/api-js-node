const FormsResource = require('./formsResource');
const AppsCampaignsResource = require('./appsCampaignsResource');

/**
 * Apps product endpoints.
 */
class AppsProduct {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/apps`;

    this.forms = new FormsResource(baseUrl, signatureFactory, config);
    this.campaigns = new AppsCampaignsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = AppsProduct;
