const CampaignsResultsResource = require('./campaignsResultsResource');
const WebCampaignsStatsResource = require('./webCampaignsStatsResource');
const Resource = require('./resource');

/**
 * Websites Campaigns resource.
 */
class WebCampaignsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory, config);

    this.results = new CampaignsResultsResource(
      baseUrl,
      signatureFactory,
      config
    );
    this.stats = new WebCampaignsStatsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = WebCampaignsResource;
