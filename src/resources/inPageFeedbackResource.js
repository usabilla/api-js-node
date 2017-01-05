const Resource = require('./resource');

/**
 * Websites InPage feedback resource.
 */
class InPageFeedbackResource extends Resource {

  constructor(base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

module.exports = InPageFeedbackResource;
