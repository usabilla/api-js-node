const SignatureFactory = require('./../src/signing.js');
const resources = require('./../src/resources.js');

/**
 * The main Usabilla API object, which exposes product specific resources.
 * Needs to be instantiated with access and secret keys.
 */
class Usabilla {

  constructor(accessKey, secretKey) {
    this.config = {
      method: 'GET',
      host: 'data.usabilla.com',
      iterator: true
    };

    const signatureFactory = new SignatureFactory(accessKey, secretKey, this.config.host);

    this.websites = new resources.WebsitesProduct('/live', signatureFactory, this.config);
    this.email = new resources.EmailProduct('/live', signatureFactory, this.config);
    this.apps = new resources.AppsProduct('/live', signatureFactory, this.config);
  }

  configure(options) {
    Object.assign(this.config, options);
  }
}

module.exports = Usabilla;
