const Resource = require('./resource');
const ButtonFeedbackResource = require('./buttonFeedbackResource');

/**
 * Websites Buttons resource.
 */
class ButtonsResource extends Resource {

  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/button`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new ButtonFeedbackResource(baseUrl, signatureFactory, config);
  }
}

module.exports = ButtonsResource;
