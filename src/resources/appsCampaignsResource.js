const CampaignsResultsResource = require('./campaignsResultsResource');
const Resource = require('./resource');

/**
 * Apps Campaigns resource.
 */
class AppsCampaignsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory, config);

    this.results = new CampaignsResultsResource(
      baseUrl,
      signatureFactory,
      config
    );
  }
}

module.exports = AppsCampaignsResource;
