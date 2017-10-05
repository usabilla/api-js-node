const Resource = require('./resource');

/**
 * Apps Forms feedback resource.
 */
class FormsFeedbackResource extends Resource {
  constructor(base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

module.exports = FormsFeedbackResource;
