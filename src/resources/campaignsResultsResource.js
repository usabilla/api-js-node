const Resource = require('./resource');

/**
 * Websites Campaign Results resource.
 * This resource provides the responses for a single or all campaigns.
 */
class CampaignsResultsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/:id/results`;
    super(baseUrl, signatureFactory, config);
  }
}

module.exports = CampaignsResultsResource;
