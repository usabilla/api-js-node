const axios = require('axios');
const action = require('../lib/action');

jest.mock('axios');

describe('action', () => {
  let items;
  let apiOptions;
  let endpointOptions;
  let options;
  let expectedRequestOptions;
  let dateToUse;

  beforeEach(() => {
    dateToUse = new Date('2016');
    global.Date = jest.fn(() => dateToUse);
    global.Date.now = jest.fn().mockReturnValue(dateToUse.valueOf());

    items = [{ id: '1' }, { id: '2' }];
    apiOptions = { protocol: 'https', host: 'localhost', iterator: false };
    endpointOptions = { method: 'get', path: '/foo' };
    options = { value: 'bar' };
    expectedRequestOptions = {
      baseURL: 'https://localhost',
      headers: {
        Authorization:
          'USBL1-HMAC-SHA256 Credential=access-key/20160101/usbl1_request, SignedHeaders=host;x-usbl-date, Signature=bdbf025412de09a0331ee3810533f7c69146413745da0412a8d2a71a7d2ba0ce',
        host: 'data.usabilla.com',
        'x-usbl-date': '20160101T000000Z'
      },
      method: 'get',
      url: '/foo'
    };
  });

  it('calls request with options and returns items', done => {
    axios.mockImplementation(() =>
      Promise.resolve({
        data: {
          items
        }
      })
    );

    action(apiOptions, endpointOptions, 'access-key', 'private-key', options)
      .then(result => {
        expect(result).toEqual(items);
        expect(axios).toHaveBeenCalledWith(expectedRequestOptions);
        done();
      })
      .catch(done.fail);
  });

  it('calls request with options and returns items with iteration', done => {
    const moreItems = [{ id: '3' }, { id: '4' }];
    apiOptions = Object.assign({}, apiOptions, { iterator: true });
    axios
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            items,
            hasMore: true,
            lastTimestamp: new Date('2017')
          }
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            items: moreItems,
            hasMore: false
          }
        })
      );

    action(apiOptions, endpointOptions, 'access-key', 'private-key')
      .then(result => {
        expect(result).toEqual([...items, ...moreItems]);
        expect(axios).toHaveBeenCalledWith(expectedRequestOptions);
        done();
      })
      .catch(done.fail);
  });

  it('throws a client error when request fails', done => {
    axios.mockImplementationOnce(() =>
      Promise.reject({
        error: {
          message: 'foo'
        }
      })
    );
    action(apiOptions, endpointOptions, 'access-key', 'private-key', options)
      .then(done.fail)
      .catch(error => {
        expect(error.raw.error.message).toBe('foo');
        expect(error.timestamp).toBe(dateToUse.valueOf());
        done();
      });
  });
});
