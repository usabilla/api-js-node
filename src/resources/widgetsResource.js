const Resource = require('./resource');
const WidgetFeedbackResource = require('./widgetFeedbackResource');

/**
 * Email Widget resource.
 */
class WidgetsResource extends Resource {

  constructor(base, signatureFactory, config) {
    const baseUrl = `${base}/button`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new WidgetFeedbackResource(baseUrl, signatureFactory, config);
  }
}

module.exports = WidgetsResource;
