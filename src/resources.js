'use strict';
const https = require('https');
const packageJson = require('../package.json');

/**
 * Base resource class which takes care of creating the query
 * and signing the request.
 */
class Resource {

  constructor (url, signatureFactory, config) {
    this.url = url;
    this.signatureFactory = signatureFactory;
    this.config = config
  }

  /**
   * Make a GET call to the API, using the query parameters.
   * To use a specific id you should `id` in the query object.
   * The request query parameters are the ones that the API supports,
   * and should be given in a params object.
   *
   * @example
   * {
   *   id: '5869485767494'
   *   params: {
   *     limit: 5,
   *     since: 1467964293258
   *   }
   * }
   *
   * @param query
   * @param results
   * @returns {Promise}
   */

  get (query, results) {
    var _query = query || {};
    var _results = results || [];

    this.signatureFactory.setUrl(this.url);
    this.signatureFactory.setHeaders({'user-agent': `Usabilla API Node Client/${packageJson.version}`});
    this.signatureFactory.handleQuery(_query);
    const signature = this.signatureFactory.sign();

    var requestOptions = {
      protocol: 'https:',
      host: this.config.host,
      path: signature.url,
      headers: signature.headers
    };

    return new Promise((resolve, reject) => {
      https.get(requestOptions, (res) => {
        var str = '';
        var answer = {};

        res.on('data', (chunk) => {
          str += chunk;
        });

        res.on('end', () => {
          answer = JSON.parse(str);
          if (answer.error) {
            reject(answer.error);
          }
          _results = _results.concat(answer.items);

          if (answer.hasMore && this.config.iterator) {
            _query = Object.assign(_query, {params: {since: answer.lastTimestamp}});
            this.get(_query, _results).then((results) => {
              resolve(results);
            });
          } else {
            resolve(_results);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}

/**
 * Apps Forms feedback resource.
 */
class FormsFeedbackResource extends Resource {

  constructor (base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

/**
 * Apps Forms resource.
 */
class FormsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new FormsFeedbackResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Email Widget feedback resource.
 */
class WidgetFeedbackResource extends Resource {

  constructor (base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

/**
 * Email Widget resource.
 */
class WidgetsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/button`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new WidgetFeedbackResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites InPage feedback resource.
 */
class InPageFeedbackResource extends Resource {

  constructor (base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

/**
 * Websites InPage resource.
 */
class InPageResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/inpage`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new InPageFeedbackResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites Campaign Results resource.
 * This resource provides the responses for a single or all campaigns.
 */
class CampaignsResultsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/:id/results`;
    super(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites Campaign Stats resource.
 * This resource provides the main statistics from a campaign.
 */
class CampaignsStatsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/:id/stats`;
    super(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites Campaigns resource.
 */
class CampaignsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory, config);

    this.results = new CampaignsResultsResource(baseUrl, signatureFactory, config);
    this.stats = new CampaignsStatsResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites Buttons feedback resource.
 */
class ButtonFeedbackResource extends Resource {

  constructor (base, signatureFactory, config) {
    super(`${base}/:id/feedback`, signatureFactory, config);
  }
}

/**
 * Websites Buttons resource.
 */
class ButtonsResource extends Resource {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/button`;
    super(baseUrl, signatureFactory, config);

    this.feedback = new ButtonFeedbackResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Websites product endpoints.
 */
class WebsitesProduct {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/websites`;

    this.buttons = new ButtonsResource(baseUrl, signatureFactory, config);
    this.campaigns = new CampaignsResource(baseUrl, signatureFactory, config);
    this.inpage = new InPageResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Email product endpoints.
 */
class EmailProduct {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/email`;

    this.widgets = new WidgetsResource(baseUrl, signatureFactory, config);
  }
}

/**
 * Apps product endpoints.
 */
class AppsProduct {

  constructor (base, signatureFactory, config) {
    const baseUrl = `${base}/apps`;

    this.forms = new FormsResource(baseUrl, signatureFactory, config);
  }
}

module.exports = {
  'WebsitesProduct': WebsitesProduct,
  'EmailProduct': EmailProduct,
  'AppsProduct': AppsProduct
  };

