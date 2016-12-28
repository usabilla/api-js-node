"use strict";
const moment = require('moment');
const crypto = require('crypto');
const https = require('https');

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
      var params = [];

      for (var k in query.params) {
        if (query.params.hasOwnProperty(k)) {
          params.push(k);
        }
      }
      params.sort();

      this.queryParameters = '';
      for (var i = 0; i < params.length; i++) {
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

module.exports = SignatureFactory;
