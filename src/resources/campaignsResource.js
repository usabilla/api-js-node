const Resource = require('./resource');
const CampaignsResultsResource = require('./campaignsResultsResource');

/**
 *  Generic Campaigns resource.
 */
class CampaignsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory, config);
    this.baseUrl = baseUrl;

    this.results = new CampaignsResultsResource(
      baseUrl,
      signatureFactory,
      config
    );
  }
}

module.exports = CampaignsResource;
