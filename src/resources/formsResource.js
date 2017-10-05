const Resource = require('./resource');
const FormsFeedbackResource = require('./formsFeedbackResource');

/**
 * Apps Forms resource.
 */
class FormsResource extends Resource {
  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new FormsFeedbackResource(
      baseUrl,
      signatureFactory,
      config
    );
  }
}

module.exports = FormsResource;
