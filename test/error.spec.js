const ClientError = require('../lib/error');

describe('ClientError', () => {
  it('returns error with empty error message when given raw is empty object', () => {
    const error = new ClientError();
    expect(error.type).toBeUndefined();
    expect(error.message).toBe('');
  });

  it('returns error with type, code, message, and status given raw error', () => {
    const error = new ClientError({
      response: {
        data: {
          error: {
            type: 'type',
            code: 'code',
            message: 'message',
            status: 'status'
          }
        }
      }
    });
    expect(error.type).toBe('type');
    expect(error.code).toBe('code');
    expect(error.message).toBe('message');
    expect(error.status).toBe('status');
  });
});
