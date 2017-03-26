const SignatureFactory = require('../../src/signing');
const Resource = require('../../src/resources/resource');
const https = require('https');

describe('Resource', function() {

  beforeEach(function() {
    this.signatureFactory = new SignatureFactory();
    spyOn(this.signatureFactory, 'sign').and.returnValue({
      url: 'foo',
      headers: 'bar'
    });
    this.spies = {
      reject: function() {
      },
      resolve: function() {
      }
    };
    spyOn(this.spies, 'reject');
    spyOn(this.spies, 'resolve');
    this.config = {
      host: 'host'
    };
    this.resource = new Resource('http://foo.bar', this.signatureFactory, this.config);
  });

  describe('handleOnData', function() {

    it('concatenates new json string to existing json string', function() {
      this.resource.str = 'foo';
      this.resource.handleOnData('bar');
      expect(this.resource.str).toBe('foobar');
    });
  });

  describe('handleOnError', function() {

    it('rejects with error', function() {
      this.resource.handleOnError(this.spies.reject, 'foo');
      expect(this.spies.reject).toHaveBeenCalledWith('foo');
    });
  });

  describe('handleOnEnd', function() {

    it('rejects with answer error', function() {
      this.resource.str = '{"error": "foo"}';
      this.resource.handleOnEnd(this.spies.resolve, this.spies.reject);
      expect(this.spies.reject).toHaveBeenCalledWith('foo');
    });

    it('resolves with first results if hasMore is false', function() {
      this.resource._results = [];
      this.resource.str = '{"items": [{"id": "foo"}]}';
      this.resource.handleOnEnd(this.spies.resolve, this.spies.reject);
      expect(this.spies.resolve).toHaveBeenCalledWith([{id: 'foo'}]);
    });

    it('resolves with first results if hasMore is true and iterator false', function() {
      this.resource._results = [];
      this.resource.config.iterator = false;
      this.resource.str = '{"items": [{"id": "foo"}], "hasMore": true}';
      this.resource.handleOnEnd(this.spies.resolve, this.spies.reject);
      expect(this.spies.resolve).toHaveBeenCalledWith([{id: 'foo'}]);
    });

    it('calls get with query and updated results if hasMore and iterator is true', function() {
      this.resource._results = [{id: 'foo'}];
      this.resource._query = {
        id: 'foo',
        params: {
          limit: 10,
        }
      };
      this.resource.queryParams = {limit: 10};
      this.resource.config.iterator = true;
      this.resource.str = '{"items": [{"id": "bar"}], "hasMore": true, "lastTimestamp": 1}';
      spyOn(this.resource, 'get').and.returnValue(Promise.resolve());
      this.resource.handleOnEnd(this.spies.resolve, this.spies.reject);
      expect(this.resource.get).toHaveBeenCalledWith({
        id: 'foo',
        params: {
          limit: 10,
          since: 1
        }
      }, [{id: 'foo'}, {id: 'bar'}]);
    });
  });

  describe('get', function() {

    it('calls https get with correct request options', function() {
      spyOn(https, 'get');
      this.resource.get({}, []);
      const requestArgs = https.get.calls.mostRecent().args[0];
      expect(requestArgs.protocol).toBe('https:');
      expect(requestArgs.host).toBe('host');
      expect(requestArgs.path).toBe('foo');
      expect(requestArgs.headers).toBe('bar');
    });
  });

  describe('getDefaultHeaders', function() {
    it('returns the proper default headers', function() {
      const headers = Resource.getDefaultHeaders('1.0.0');

      expect(headers).toEqual({
        'x-ub-api-client': 'Usabilla API Node Client/1.0.0'
      });
    });
  });
});
