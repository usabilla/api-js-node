const CampaignsResource = require('./campaignsResource');
const WebCampaignsStatsResource = require('./webCampaignsStatsResource');

/**
 * Websites Campaigns resource.
 */
class WebCampaignsResource extends CampaignsResource {
  constructor(base, signatureFactory, config) {
    super(base, signatureFactory, config);

    this.stats = new WebCampaignsStatsResource(this.baseUrl, signatureFactory, config);
  }
}

module.exports = WebCampaignsResource;
