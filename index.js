var usabilla = exports;
var moment = require('moment');
var crypto = require('crypto');

var API_URL = 'https://data.usabilla.com';

var resources = {
  'scopes': {
    'live': {
      'products': {
        'website': {
          'resources': {
            'button': '/button',
            'feedback': '/button/:id/feedback',
            'campaign': '/campaign',
            'campaign_result': '/campaign/:id/results',
            'stats': '/campaign/:id/stats'
          }
        },
        'email': {
          'resources': {
            'button': '/button',
            'feedback': '/button/:id/feedback'
          }
        },
        'apps': {
          'resources': {
            'app': '',
            'feedback': '/:id/feedback'
          }
        }
      }
    }
  }
};

function hmac (key, string, encoding) {
  return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding);
}

function hash (string, encoding) {
  return crypto.createHash('sha256').update(string, 'utf8').digest(encoding);
}

function retrieveResourceUrl (resource) {
  if (!(resource.scope in resources.scopes)) {
    throw 'Invalid scope. Valid scopes are: ' + Object.keys(resources.scopes);
  }
  if (!(resource.product in resources.scopes[resource.scope].products)) {
    throw 'Invalid product. Valid products are: ' + Object.keys(resources.scopes[resource.scope].products);
  }
  if (!(resource.resource_type in resources.scopes[resource.scope].products[resource.product].resources)) {
    throw 'Invalid resouce type. Valid resource types are: ' + Object.keys(resources.scopes[resource.scope].products[resource.product].resources);
  }
  return '/' + resource.scope + '/' + resource.product + resources.scopes[resource.scope].products[resource.product].resources[resource.resource_type];
}

function Signature (resource, credentials, query) {
  this.settings = this.getSettings();
  this.queryParameters = '';
  this.credentials = credentials;
  this.url = retrieveResourceUrl(resource);
  this.handleQuery(query);
}

Signature.prototype.handleQuery = function (query) {
  if (query.resource_id && query.resource_id != '') {
    if (query.resource_id == '*') {
      query.resource_id = '%2A';
    }
    this.url = this.url.replace(':id', query.resource_id);
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
};

Signature.prototype.sign = function () {
  this.dates = this.getDateTime();
  this.headers = {};
  this.headers.date = this.dates.usbldate;
  this.headers.Authorization = this.authHeader();

  return {
    headers: this.headers,
    url: this.url + '?'.concat(this.queryParameters)
  };
};

Signature.prototype.getCanonicalHeaders = function () {
  return 'date:' + this.dates.usbldate + '\n' + 'host:' + this.settings.host + '\n';
};

Signature.prototype.signedHeaders = function () {
  return Object.keys(this.request.headers)
    .map(function (key) {
      return key.toLowerCase();
    })
    .sort()
    .join(';');
};

Signature.prototype.stringToSign = function () {
  return [
    'USBL1-HMAC-SHA256',
    this.dates.longdate,
    this.dates.shortdate + '/' + 'usbl1_request',
    hash(this.canonicalString(), 'hex')
  ].join('\n');
};

Signature.prototype.canonicalString = function () {
  var queryStr = this.getQueryParameters();
  var bodyHash = hash('', 'hex');

  return [
    this.settings.method || 'GET',
    this.url,
    queryStr,
    this.getCanonicalHeaders(),
    'date;host',
    bodyHash,
  ].join('\n');
};

Signature.prototype.getSignature = function () {
  var kDate = hmac('USBL1' + this.credentials.secret_key, this.dates.shortdate);
  var kSigning = kCredentials = hmac(kDate, 'usbl1_request');

  return hmac(kSigning, this.stringToSign(), 'hex');
};

Signature.prototype.authHeader = function () {
  return [
    'USBL1-HMAC-SHA256 Credential=' + this.credentials.access_key + '/' + this.dates.shortdate + '/' + 'usbl1_request',
    'SignedHeaders=' + 'date;host',
    'Signature=' + this.getSignature()
  ].join(', ');
};

Signature.prototype.getSettings = function () {
  settings = {};
  settings.method = 'GET';
  settings.host = 'data.usabilla.com';
  settings.protocol = 'https://';

  return settings;
};

Signature.prototype.getDateTime = function () {
  dates = {};
  dates.usbldate = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT';
  dates.shortdate = moment().format('YYYYMMDD');
  dates.longdate = moment().format('YYYYMMDDTHHmmss') + 'Z';

  return dates;
};

Signature.prototype.getQueryParameters = function () {
  return this.queryParameters;
};

usabilla.Signature = Signature;

usabilla.getOptions = function (resource, credentials, query) {
  signed_request = new Signature(resource, credentials, query).sign();
  var options = {
    url: API_URL + signed_request.url,
    headers: signed_request.headers,
  };

  return options;
};

usabilla.getConstants = function () {
  var constants = {
    // Scope constants
    SCOPE_LIVE: 'live',

    // Product contants
    PRODUCT_WEBSITES: 'website',
    PRODUCT_EMAIL: 'email',
    PRODUCT_APPS: 'apps',

    // Resource contants
    RESOURCE_FEEDBACK: 'feedback',
    RESOURCE_APP: 'app',
    RESOURCE_BUTTON: 'button',
    RESOURCE_CAMPAIGN: 'campaign',
    RESOURCE_CAMPAIGN_RESULT: 'campaign_result',
    RESOURCE_CAMPAIGN_STATS: 'stats'
  };

  return constants;
};

exports.usabilla = usabilla;
