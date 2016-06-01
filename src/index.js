const moment = require('moment');
const crypto = require('crypto');
const assign = require('lodash.assign');
const request = require('request');

/**
 * Base resource class which takes care of creating the query
 * and signing the request.
 */
class Resource {

  constructor (url, signatureFactory) {
    this.config = {
      protocol: 'https',
      host: 'data.usabilla.com'
    };

    this.url = url;
    this.signatureFactory = signatureFactory;
  }

  getBaseUrl () {
    return `${this.config.protocol}://${this.config.host}`;
  }

  /**
   * Make a GET call to the API, using the query parameters.
   * To use a specific id you should `id` in the query object.
   * The request query parameters are the ones that the API supports.
   * @param query
   * @returns {Promise}
   */
  get (query) {
    if (!query) {
      query = {};
    }

    this.signatureFactory.setUrl(this.url);
    this.signatureFactory.handleQuery(query);
    const signature = this.signatureFactory.sign();

    const options = {
      url: this.getBaseUrl() + signature.url,
      headers: signature.headers
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(error);
        }
      });
    });
  }
}

/**
 * Campaigns results resource.
 */
class CampaignsResultsResource extends Resource {

  constructor (base, signatureFactory) {
    const baseUrl = `${base}/:id/results`;
    super(baseUrl, signatureFactory);
  }
}

/**
 * Campaigns stats resource.
 */
class CampaignsStatsResource extends Resource {

  constructor (base, signatureFactory) {
    const baseUrl = `${base}/:id/stats`;
    super(baseUrl, signatureFactory);
  }
}

/**
 * Campaigns resource.
 */
class CampaignsResource extends Resource {

  constructor (base, signatureFactory) {
    const baseUrl = `${base}/campaign`;
    super(baseUrl, signatureFactory);

    this.resutls = new CampaignsResultsResource(baseUrl, signatureFactory);
    this.stats = new CampaignsStatsResource(baseUrl, signatureFactory);
  }
}

/**
 * Buttons feedback resource.
 */
class ButtonFeedbackResource extends Resource {

  constructor (base, signatureFactory) {
    super(`${base}/:id/feedback`, signatureFactory);
  }
}

/**
 * Buttons resource.
 */
class ButtonsResource extends Resource {

  constructor (base, signatureFactory) {
    const baseUrl = `${base}/button`;
    super(baseUrl, signatureFactory);

    this.feedback = new ButtonFeedbackResource(baseUrl, signatureFactory);
  }
}

/**
 * Websites product endpoints.
 */
class WebsitesProduct {

  constructor (base, signatureFactory) {
    this.baseUrl = `${base}/websites`;
    this.signatureFactory = signatureFactory;

    this.buttons = new ButtonsResource(this.baseUrl, signatureFactory);
    this.campaigns = new CampaignsResource(this.baseUrl, signatureFactory);
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

  getCanonicalHeaders () {
    return {
      date: `date:${this.dates.usbldate}`,
      host: `host:${this.host}\n`
    };
  }

  hash (string, encoding) {
    return crypto.createHash('sha256').update(string, 'utf8').digest(encoding);
  }

  canonicalString () {
    const queryStr = this.queryParameters;
    const bodyHash = this.hash('', 'hex');
    const canonicalHeaders = this.getCanonicalHeaders();

    return [
      this.method || 'GET',
      this.url,
      queryStr,
      canonicalHeaders.date,
      canonicalHeaders.host,
      'date;host',
      bodyHash
    ].join('\n');
  };

  hmac (key, string, encoding) {
    return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding);
  }

  stringToSign () {
    return [
      'USBL1-HMAC-SHA256',
      this.dates.longdate,
      this.dates.shortdate + '/' + 'usbl1_request',
      this.hash(this.canonicalString(), 'hex')
    ].join('\n');
  };

  getSignature () {
    const kDate = this.hmac('USBL1' + this.secretKey, this.dates.shortdate);
    const kSigning = this.hmac(kDate, 'usbl1_request');
    // const kCredentials = this.hmac(kDate, 'usbl1_request');

    return this.hmac(kSigning, this.stringToSign(), 'hex');
  }

  authHeader () {
    return [
      'USBL1-HMAC-SHA256 Credential=' + this.accessKey + '/' + this.dates.shortdate + '/' + 'usbl1_request',
      'SignedHeaders=' + 'date;host',
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

    if (query.urlParameters && query.urlParameters !== '') {
      var params = [];

      for (var k in query.urlParameters) {
        if (query.urlParameters.hasOwnProperty(k)) {
          params.push(k);
        }
      }
      params.sort();

      for (var i = 0; i < params.length; i++) {
        this.queryParameters += params[i] + '=' + query.urlParameters[params[i]] + '&';
      }

      this.queryParameters = this.queryParameters.slice(0, -1);
    }
  }

  sign () {
    this.dates = this.getDateTime();
    this.headers = {};
    this.headers.date = this.dates.usbldate;
    this.headers.Authorization = this.authHeader();

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
export class Usabilla {

  constructor (accessKey, secretKey) {
    this.config = {
      method: 'GET',
      host: 'data.usabilla.com',
      protocol: 'https'
    };

    this.signatureFactory = new SignatureFactory(accessKey, secretKey, this.config.host);
    this.websites = new WebsitesProduct('/live', this.signatureFactory);
  }

  configure (options) {
    assign(this.config, options);
  }
}
