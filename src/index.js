const moment = require('moment');
const crypto = require('crypto');
const https = require('https');

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
    let _query = query || {};
    let _results = results || [];

    this.signatureFactory.setUrl(this.url);
    this.signatureFactory.handleQuery(_query);
    const signature = this.signatureFactory.sign();

    let requestOptions = {
      protocol: 'https:',
      host: this.config.host,
      path: signature.url,
      headers: signature.headers
    };

    return new Promise((resolve, reject) => {
      https.get(requestOptions, (res) => {
        let str = '';
        let answer = {};

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

class SignatureFactory {

  constructor (accessKey, secretKey, host) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.host = host;
  }

  setUrl (url) {
    this.url = url;
  }

  setMethod (method) {
    this.method = method;
  }

  hash (string, encoding) {
    return crypto.createHash('sha256').update(string, 'utf8').digest(encoding);
  }

  canonicalString () {
    // CanonicalHeaders
    let canonicalHeaders = `host:${this.host}\n` + `x-usbl-date:${this.dates.longdate}\n`;

    return [
      this.method || 'GET',     // HTTPRequestMethod
      this.url,                 // CanonicalURI
      this.queryParameters,     // CanonicalQueryString
      canonicalHeaders,         // CanonicalHeaders
      'host;x-usbl-date',       // SignedHeaders
      this.hash('', 'hex')      // HexEncode(Hash(RequestPayload))
    ].join('\n');
  };

  hmac (key, string, encoding) {
    return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding);
  }

  stringToSign () {
    return [
      'USBL1-HMAC-SHA256',                          // Algorithm
      this.dates.longdate,                          // RequestDate
      this.dates.shortdate + '/' + 'usbl1_request', // CredentialScope
      this.hash(this.canonicalString(), 'hex')      // HashedCanonicalRequest
    ].join('\n');
  };

  getSignature () {
    const kDate = this.hmac('USBL1' + this.secretKey, this.dates.shortdate);
    const kSigning = this.hmac(kDate, 'usbl1_request');

    return this.hmac(kSigning, this.stringToSign(), 'hex');
  }

  authHeader () {
    return [
      'USBL1-HMAC-SHA256 Credential=' + this.accessKey + '/' + this.dates.shortdate + '/' + 'usbl1_request',
      'SignedHeaders=' + 'host;x-usbl-date',
      'Signature=' + this.getSignature()
    ].join(', ');
  };

  getDateTime () {
    const dates = {};
    dates.usbldate = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT';
    dates.shortdate = moment().format('YYYYMMDD');
    dates.longdate = moment().format('YYYYMMDDTHHmmss') + 'Z';

    return dates;
  }

  handleQuery (query) {
    if (query.id && query.id != '') {
      if (query.id == '*') {
        query.id = '%2A';
      }
      this.url = this.url.replace(':id', query.id);
    }

    if (!!query.params) {
      let params = [];

      for (let k in query.params) {
        if (query.params.hasOwnProperty(k)) {
          params.push(k);
        }
      }
      params.sort();

      this.queryParameters = '';
      for (let i = 0; i < params.length; i++) {
        this.queryParameters += params[i] + '=' + query.params[params[i]] + '&';
      }

      this.queryParameters = this.queryParameters.slice(0, -1);
    }
  }

  sign () {
    this.dates = this.getDateTime();
    this.headers = {};
    this.headers['Authorization'] = this.authHeader();
    this.headers['x-usbl-date'] = this.dates.longdate;

    const response = {
      headers: this.headers,
      url: this.url
    };

    if (this.queryParameters) {
      response.url = `${response.url}?${this.queryParameters}`;
    }

    return response;
  }
}

/**
 * The main Usabilla API object, which exposes product specific resources.
 * Needs to be instantiated with access and secret keys.
 */
class Usabilla {

  constructor (accessKey, secretKey) {
    this.config = {
      method: 'GET',
      host: 'data.usabilla.com',
      iterator: true
    };

    const signatureFactory = new SignatureFactory(accessKey, secretKey, this.config.host);

    this.websites = new WebsitesProduct('/live', signatureFactory, this.config);
    this.email = new EmailProduct('/live', signatureFactory, this.config);
    this.apps = new AppsProduct('/live', signatureFactory, this.config);
  }

  configure (options) {
    Object.assign(this.config, options);
  }
}

module.exports = Usabilla;
