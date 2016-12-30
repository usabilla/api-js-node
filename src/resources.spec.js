const resources = require('./../src/resources.js');

describe('Resources', () => {
  describe('WebsitesProduct', () => {
    let WebsitesProduct;

    beforeEach(() => {
      WebsitesProduct = new resources.WebsitesProduct();
    });

    it ('new', () => {
      expect(true).toEqual(true);
    });

  });

  describe('EmailProduct', () => {
    let emailProduct;

    beforeEach(() => {
      emailProduct = new resources.EmailProduct();
    });

    it ('new', () => {
      expect(true).toEqual(true);
    });

  });

  describe('AppsProduct', () => {
    let appsProduct;

    beforeEach(() => {
      appsProduct = new resources.AppsProduct();
    });

    it ('new', () => {
      expect(true).toEqual(true);
    });

  });
});
