const ButtonsResource = require('./buttonsResource');
const WebCampaignsResource = require('./webCampaignsResource');
const InPageResource = require('./inPageResource');

/**
 * Websites product endpoints.
 */
class WebsitesProduct {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/websites`;

    this.buttons = new ButtonsResource(baseUrl, signatureFactory, config);
    this.campaigns = new WebCampaignsResource(baseUrl, signatureFactory, config);
    this.inpage = new InPageResource(baseUrl, signatureFactory, config);
  }
}

module.exports = WebsitesProduct;
