const Resource = require('./resource');
const CampaignsResultsResource = require('./campaignsResultsResource');
const CampaignsStatsResource = require('./campaignsStatsResource');

/**
 * Websites Campaigns resource.
 */
class CampaignsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory, config);

    this.results = new CampaignsResultsResource(
      baseUrl,
      signatureFactory,
      config
    );
    this.stats = new CampaignsStatsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = CampaignsResource;
