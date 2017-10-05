const Resource = require('./resource');

/**
 * Websites Buttons feedback resource.
 */
class ButtonFeedbackResource extends Resource {
  constructor(base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

module.exports = ButtonFeedbackResource;
