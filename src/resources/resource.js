const https = require('https');
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
      this._query = Object.assign(this._query, {params: {since: this.answer.lastTimestamp}});
      this.get(this._query, this._results).then((results) => {
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

    this.signatureFactory.setUrl(this.url);
    this.signatureFactory.setHeaders(Resource.getDefaultHeaders(packageJson.version));
    this.signatureFactory.handleQuery(this._query);
    const signature = this.signatureFactory.sign();

    let requestOptions = {
      protocol: 'https:',
      host: this.config.host,
      path: signature.url,
      headers: signature.headers
    };

    return new Promise((resolve, reject) => {
      https.get(requestOptions, (res) => {
        this.str = '';
        this.answer = {};

        res.on('data', this.handleOnData.bind(this));

        res.on('end', this.handleOnEnd.bind(this, resolve, reject));
      }).on('error', this.handleOnError.bind(this, reject));
    });
  }

  static getDefaultHeaders(version) {
    return {
      'x-ub-api-client': `Usabilla API Node Client/${version}`
    };
  }
}

module.exports = Resource;
