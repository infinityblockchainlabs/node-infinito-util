const http = require('../lib/http');
const Assert = require('assert');

describe('http', async () => {
  it('Get', async () => {
    let result = await http.send('https://api.infinitowallet.io/v1');
    Assert.ok(result.status === 200, 'statusCode must be 200');
  });

  it('Post', async () => {
    try {
      await http.send(
        'https://api.infinitowallet.io/v1/auth/token',
        'POST',
        {
          api_sign:
            '5282da0c632880562aa12eb067b47aa4dcac8e23f0f871a65b09438b1f20b1e8',
        },
        {
          api_key: 'API_KEY',
          nonce: 1534737142,
          grant_type: 'client_credentials',
        }
      );
    } catch (e) {
      Assert.ok(e.response.status === 401, 'must be invalid');
      Assert.equal(e.response.data.msg, 'E00002: Invalid API key');
    }
  });
});
