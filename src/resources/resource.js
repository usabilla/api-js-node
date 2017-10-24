const https = require('https');
const http = require('http');
const packageJson = require('../../package.json');

/**
 * Base resource class which takes care of creating the query
 * and signing the request.
 */
class Resource {
  constructor(url, signatureFactory, config) {
    this.url = url;
    this.signatureFactory = signatureFactory;
    this.config = config;
    this.str = '';
    this.queryParams = {};
    this.httpClient = this.getHttpClient(this.config.protocol);
  }

  getHttpClient(protocol) {
    return protocol === 'http' ? http : https;
  }

  handleOnData(newJsonString) {
    this.str += newJsonString;
  }

  handleOnEnd(resolve, reject) {
    this.answer = JSON.parse(this.str);
    if (this.answer.error) {
      reject(this.answer.error);
      return;
    }
    this._results = this._results.concat(this.answer.items);

    if (this.answer.hasMore && this.config.iterator) {
      // Delete since to be replaced by since of new answer
      delete this.queryParams.since;
      const params = Object.assign(
        {},
        { since: this.answer.lastTimestamp },
        this.queryParams
      );
      this._query = Object.assign(this._query, { params });
      this.get(this._query, this._results).then(results => {
        resolve(results);
      });
    } else {
      resolve(this._results);
    }
  }

  handleOnError(reject, error) {
    reject(error);
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
  get(query, results) {
    this._query = query || {};
    this._results = results || [];
    this.queryParams = this._query.params || {};

    this.signatureFactory.setUrl(this.url);
    this.signatureFactory.setHeaders(
      Resource.getDefaultHeaders(packageJson.version)
    );
    this.signatureFactory.handleQuery(this._query);
    const signature = this.signatureFactory.sign();

    const requestOptions = {
      protocol: `${this.config.protocol}:`,
      host: this.config.host,
      port: this.config.port,
      path: signature.url,
      headers: signature.headers
    };

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(requestOptions, this.handleGetResponse.bind(this, resolve, reject))
        .on('error', this.handleOnError.bind(this, reject));
    });
  }

  handleGetResponse(resolve, reject, response) {
    this.str = '';
    this.answer = {};

    response.on('data', this.handleOnData.bind(this));

    response.on('end', this.handleOnEnd.bind(this, resolve, reject));
  }

  static getDefaultHeaders(version) {
    return {
      'x-ub-api-client': `Usabilla API Node Client/${version}`
    };
  }
}

module.exports = Resource;
