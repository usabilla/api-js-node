const CampaignsResource = require('./campaignsResource');

/**
 * Apps Campaigns resource.
 */
class AppsCampaignsResource extends CampaignsResource {
  constructor(base, signatureFactory, config) {
    super(base, signatureFactory, config);
  }
}

module.exports = AppsCampaignsResource;
