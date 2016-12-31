'use strict';
const moment = require('moment');
const crypto = require('crypto');

/**
 * This class is the factory for creating the signature describing
 * and securing the request based on;
 * - headers
 * - HTTP method
 * - URL + Query parameters
 */
class SignatureFactory {

  constructor (accessKey, secretKey, host) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.host = host;

    this.method = 'GET';
    this.headers = {};
  }

  setUrl (url) {
    // mandatory
    this.url = url;
  }

  setMethod (method) {
    // optional
    this.method = method;
  }

  setHeaders (headers) {
    // optional
    for (let key in headers) {
      this.headers[key] = headers[key];
    }
  }

  handleQuery (query) {
    // mandatory
    // Transform URL based on query
    if (query.id && query.id != '') {
      if (query.id == '*') {
        query.id = '%2A';
      }
      this.url = this.url.replace(':id', query.id);
    }

    // Set queryParameters based on query
    if (!!query.params) {
      var params = [];

      for (var k in query.params) {
        if (query.params.hasOwnProperty(k)) {
          params.push(k);
        }
      }
      params.sort();

      // map params to URL queryParameters
      this.queryParameters = Object.keys(params).map(function(k) { return [params[k], query.params[params[k]]].join('=') }).join('&');

    }
  }

  hash (string, encoding) {
    return crypto.createHash('sha256').update(string, 'utf8').digest(encoding);
  }

  getHeadersToSign () {
    // add host to headers
    this.headers.host = this.host;
    let headers = this.headers;

    // delete possible cached Authorization header
    delete headers.Authorization;

    // sort headers alphabetically
    return Object.keys(headers).sort().reduce((r, k) => (r[k] = headers[k], r), {});
  }

  /**
   * Example;
   * 'host:https://data.usabilla.com\nx-usbl-date:${this.dates.longdate}\n'
   */
  getCanonicalHeaders () {
    let headers = this.getHeadersToSign();
    return Object.keys(headers).map(function(k) { return [k, headers[k] + '\n'].join(':') }).join('');
  }

  /**
   * Example;
   * 'host;x-usbl-date'
   */
  getSignedHeaders () {
    let headers = this.getHeadersToSign();
    return Object.keys(headers).join(';');
  }

  canonicalString () {
    return [
      this.method,                // HTTPRequestMethod
      this.url,                   // CanonicalURI
      this.queryParameters,       // CanonicalQueryString
      this.getCanonicalHeaders(), // CanonicalHeaders
      this.getSignedHeaders(),    // SignedHeaders
      this.hash('', 'hex')        // HexEncode(Hash(RequestPayload))
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
    this.dates = this.getDateTime();
    this.headers['x-usbl-date'] = this.dates.longdate;

    return [
      'USBL1-HMAC-SHA256 Credential=' + this.accessKey + '/' + this.dates.shortdate + '/' + 'usbl1_request',
      'SignedHeaders=' + this.getSignedHeaders(),
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

  sign () {
    this.headers['Authorization'] = this.authHeader();

    return {
      headers: this.headers,
      url: (this.queryParameters) ? `${this.url}?${this.queryParameters}` : this.url
    };
  }
}

module.exports = SignatureFactory;
