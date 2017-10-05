const Resource = require('./resource');
const InPageFeedbackResource = require('./inPageFeedbackResource');

/**
 * Websites InPage resource.
 */
class InPageResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/inpage`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new InPageFeedbackResource(
      baseUrl,
      signatureFactory,
      config
    );
  }
}

module.exports = InPageResource;
