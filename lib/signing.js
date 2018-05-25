const crypto = require('crypto');

/**
 * This class is the factory for creating the signature describing
 * and securing the request based on;
 * - headers
 * - HTTP method
 * - URL + Query parameters
 */
class SignatureFactory {
  constructor(accessKey, secretKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.host = 'data.usabilla.com';

    this.method = 'GET';
    this.headers = {};
  }

  setUrl(url) {
    // mandatory
    this.url = url;
  }

  setMethod(method) {
    // optional
    this.method = method;
  }

  setHeaders(headers) {
    // optional
    Object.assign(this.headers, headers);
  }

  handleQuery(query) {
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
      let params = [];

      for (let k in query.params) {
        if (query.params.hasOwnProperty(k)) {
          params.push(k);
        }
      }
      params.sort();

      // map params to URL queryParameters
      this.queryParameters = Object.keys(params)
        .map(function(k) {
          return [params[k], query.params[params[k]]].join('=');
        })
        .join('&');
    }
  }

  getHeadersToSign() {
    // add host to headers
    this.headers.host = this.host;
    let headers = this.headers;

    // delete possible cached Authorization header
    delete headers.Authorization;

    // sort headers alphabetically
    return Object.keys(headers)
      .sort()
      .reduce((r, k) => ((r[k] = headers[k]), r), {});
  }

  /**
   * Example;
   * 'host:data.usabilla.com\nx-usbl-date:${this.dates.longdate}\n'
   */
  getCanonicalHeaders() {
    let headers = this.getHeadersToSign();
    return Object.keys(headers)
      .map(function(k) {
        return [k, headers[k] + '\n'].join(':');
      })
      .join('');
  }

  /**
   * Example;
   * 'host;x-usbl-date'
   */
  getSignedHeaders() {
    let headers = this.getHeadersToSign();
    return Object.keys(headers).join(';');
  }

  canonicalString() {
    /**
     * HTTPRequestMethod
     * CanonicalURI
     * CanonicalQueryString
     * CanonicalHeaders
     * SignedHeaders
     * HexEncode(Hash(RequestPayload))
     */
    return [
      this.method,
      this.url,
      this.queryParameters,
      this.getCanonicalHeaders(),
      this.getSignedHeaders(),
      SignatureFactory.hash('', 'hex')
    ].join('\n');
  }

  stringToSign() {
    /**
     * Algorithm
     * RequestDate
     * CredentialScope
     * HashedCanonicalRequest
     */
    return [
      'USBL1-HMAC-SHA256',
      this.dates.longdate,
      this.dates.shortdate + '/' + 'usbl1_request',
      SignatureFactory.hash(this.canonicalString(), 'hex')
    ].join('\n');
  }

  getSignature() {
    const kDate = SignatureFactory.hmac(
      'USBL1' + this.secretKey,
      this.dates.shortdate
    );
    const kSigning = SignatureFactory.hmac(kDate, 'usbl1_request');

    return SignatureFactory.hmac(kSigning, this.stringToSign(), 'hex');
  }

  authHeader() {
    this.dates = SignatureFactory.getDateTime();
    this.headers['x-usbl-date'] = this.dates.longdate;

    return [
      `USBL1-HMAC-SHA256 Credential=${this.accessKey}/${
        this.dates.shortdate
      }/usbl1_request`,
      `SignedHeaders=${this.getSignedHeaders()}`,
      `Signature=${this.getSignature()}`
    ].join(', ');
  }

  sign() {
    this.headers['Authorization'] = this.authHeader();

    return {
      headers: this.headers,
      url: this.queryParameters
        ? `${this.url}?${this.queryParameters}`
        : this.url
    };
  }

  static getDateTime() {
    const date = new Date().toJSON().replace(/[\-:.]/g, '');

    return {
      shortdate: date.substr(0, 8),
      longdate: `${date.substr(0, 15)}Z`
    };
  }

  static hmac(key, string, encoding) {
    return crypto
      .createHmac(SignatureFactory.HMAC, key)
      .update(string, SignatureFactory.ENCODING)
      .digest(encoding);
  }

  static hash(string, encoding) {
    return crypto
      .createHash(SignatureFactory.HMAC)
      .update(string, SignatureFactory.ENCODING)
      .digest(encoding);
  }
}

SignatureFactory.HMAC = 'sha256';
SignatureFactory.ENCODING = 'utf8';

function sign(accessKey, privateKey, path, headers, options) {
  const signatureFactory = new SignatureFactory(accessKey, privateKey);
  signatureFactory.setUrl(path);
  signatureFactory.setHeaders(headers);
  signatureFactory.handleQuery(options);
  return signatureFactory.sign();
}

module.exports = {
  sign,
  SignatureFactory
};
