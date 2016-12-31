const resources = require('./../src/resources.js');

describe('Resources', function() {
  describe('WebsitesProduct', function() {
    beforeEach(function() {
      this.websitesProduct = new resources.WebsitesProduct();
    });

    it('new', function() {
      expect(true).toEqual(true);
    });
  });

  describe('EmailProduct', function() {
    beforeEach(function() {
      this.emailProduct = new resources.EmailProduct();
    });

    it('new', function() {
      expect(true).toEqual(true);
    });
  });

  describe('AppsProduct', function() {
    beforeEach(function() {
      this.appsProduct = new resources.AppsProduct();
    });

    it('new', function() {
      expect(true).toEqual(true);
    });
  });
});
