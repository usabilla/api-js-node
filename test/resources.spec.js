const resources = require('./../src/resources.js');

describe('Resources', function() {
  describe('WebsitesProduct', function() {
    beforeEach(function() {
      this.websitesProduct = new resources.WebsitesProduct();
    });
  });

  describe('EmailProduct', function() {
    beforeEach(function() {
      this.emailProduct = new resources.EmailProduct();
    });
  });

  describe('AppsProduct', function() {
    beforeEach(function() {
      this.appsProduct = new resources.AppsProduct();
    });
  });
});
