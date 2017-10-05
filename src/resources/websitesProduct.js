const ButtonsResource = require('./buttonsResource');
const CampaignsResource = require('./campaignsResource');
const InPageResource = require('./inPageResource');

/**
 * Websites product endpoints.
 */
class WebsitesProduct {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/websites`;

    this.buttons = new ButtonsResource(baseUrl, signatureFactory, config);
    this.campaigns = new CampaignsResource(baseUrl, signatureFactory, config);
    this.inpage = new InPageResource(baseUrl, signatureFactory, config);
  }
}

module.exports = WebsitesProduct;
