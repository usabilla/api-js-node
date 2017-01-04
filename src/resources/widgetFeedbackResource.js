const Resource = require('./resource');

/**
 * Email Widget feedback resource.
 */
class WidgetFeedbackResource extends Resource {

  constructor(base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

module.exports = WidgetFeedbackResource;
