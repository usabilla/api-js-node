const SignatureFactory = require('./signing.js');
const WebsitesProduct = require('./resources/websitesProduct');
const EmailProduct = require('./resources/emailProduct');
const AppsProduct = require('./resources/appsProduct');

/**
 * The main Usabilla API object, which exposes product specific resources.
 * Needs to be instantiated with access and secret keys.
 */
class Usabilla {
  constructor(accessKey, secretKey, options = {}) {
    this.config = Object.assign(
      {},
      {
        protocol: 'https',
        host: 'data.usabilla.com',
        port: null,
        iterator: true
      },
      options
    );

    const signatureFactory = new SignatureFactory(accessKey, secretKey);

    this.websites = new WebsitesProduct('/live', signatureFactory, this.config);
    this.email = new EmailProduct('/live', signatureFactory, this.config);
    this.apps = new AppsProduct('/live', signatureFactory, this.config);
  }
}

module.exports = Usabilla;
