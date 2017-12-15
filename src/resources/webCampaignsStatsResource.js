const Resource = require('./resource');

/**
 * Websites Campaign Stats resource.
 * This resource provides the main statistics from a campaign.
 */
class WebCampaignsStatsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/:id/stats`;
    super(baseUrl, signatureFactory, config);
  }
}

module.exports = WebCampaignsStatsResource;
