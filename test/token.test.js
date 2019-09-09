const Assert = require('assert');
const TokenProvider = require('../lib/token');
const ConfigTest = require('./config.test');
const Messages = require('../lib/messages');

var tokenProvider = null;

describe('token', function() {
  beforeEach(async () => {
    tokenProvider = new TokenProvider({
      apiKey: ConfigTest.API_KEY,
      secret: ConfigTest.SECRET,
      url: ConfigTest.AUTH_URL,
    });
  });

  describe('constructor', async () => {

    it('Lacking option', async() => {
      try {
        tokenProvider = new TokenProvider();
        Assert.fail('should be error');
      } catch(err) {
        console.log('err.message :', err.message);
        Assert.equal('Missing required parameter options', err.message);
      }
    });

    it('Lacking apiKey', async() => {
      try {
        tokenProvider = new TokenProvider({
          secret: ConfigTest.SECRET,
          url: ConfigTest.AUTH_URL,
        });
        Assert.fail('should be error');
      } catch(err) {
        Assert.equal('Missing required parameter options.apiKey', err.message);
      }
    });

    it('Lacking secret', async() => {
      try {
        tokenProvider = new TokenProvider({
          apiKey: ConfigTest.API_KEY,
          url: ConfigTest.AUTH_URL,
        });
        Assert.fail('should be error');
      } catch(err) {
        Assert.equal('Missing required parameter options.secret', err.message);
      }
    });

    it('Lacking url', async() => {
      try {
        tokenProvider = new TokenProvider({
          apiKey: ConfigTest.API_KEY,
          secret: ConfigTest.SECRET,
        });
        Assert.fail('should be error');
      } catch(err) {
        Assert.equal('Missing required parameter options.url', err.message);
      }
    })

  })

  describe('#getLatestToken()', async () => {
    it('Should get new token', async () => {
      let token = await tokenProvider.getLatestToken();
      Assert.ok(token.length > 0, 'must have token');
    });

    it('Should get cache token', async () => {
      let oldToken = 'This is old token';
      tokenProvider.setToken(oldToken);
      let token = await tokenProvider.getLatestToken();
      Assert.equal(oldToken, token, 'Token must be same');
    });

    it('Should get previous', async () => {
      let token1 = await tokenProvider.getLatestToken();
      let token2 = await tokenProvider.getLatestToken();
      Assert.equal(token1, token2, 'Token must be same');
    });

    it('Clear token', async () => {
      let oldToken = 'This is old token';
      tokenProvider.setToken(oldToken);
      let token = await tokenProvider.getLatestToken();
      Assert.equal(oldToken, token, 'Token must be same');
      tokenProvider.clearToken();
      token = await tokenProvider.getLatestToken();
      Assert.notEqual(oldToken, token, 'Token must be same');
    });

  });

  describe('#getNewToken()', async () => {
    it('Get new token', async () => {
      let token = await tokenProvider.getNewToken();

      Assert.ok(token.length > 0, 'must have token');
    });

    it('invalid key', async () => {
      tokenProvider = new TokenProvider({
        apiKey: ConfigTest.API_KEY,
        secret: ConfigTest.SECRET + '_invalid',
        url: ConfigTest.AUTH_URL,
      });
      try {
        await tokenProvider.getNewToken();
        Assert.fail('should be error');
      } catch (err) {
        Assert.ok(err.message, Messages.internal_error.message);
        Assert.ok(err.code, Messages.internal_error.code);
        Assert.ok(err.httpCode, 400);
        Assert.ok(err.inner.message, 'Request failed with status code 400');
        Assert.ok(err.inner.response.data.cd, 400);
        Assert.ok(err.inner.response.data.message, 'Bad Request');
      }
    });
  });

  describe('#getNewTokenOnce()', async () => {
    it('Get new token 1 time', async () => {
      let token = await tokenProvider.getNewTokenOnce();
      Assert.ok(typeof(token), 'string');
      Assert.ok(token.length > 0);
    });

    it('Get new token', async () => {
      let firstToken = null;
      var getTokenAsync = async i => {
        let token = await tokenProvider.getNewTokenOnce();
        Assert.ok(typeof(token), 'string');
        Assert.ok(token.length > 0);
        if (firstToken == null) {
          firstToken = token;
        } else {
          Assert.ok(firstToken, token, `Token must be the same (${i})`);
        }
        // console.log('token :', i, token);
      };

      let list = [...Array(100).keys()];
      return await Promise.all(list.map(item => getTokenAsync(item)));
    });
  });

  describe('#getChecksum)', async () => {
    it('Get checksum', async () => {
      let opt = {
        secretKey:
          'HKT6kRghpsgTMFnvfxDKeDTCzvb5AeHtcHZkEwaAcG7CqwPPfAEzRrKCyut2B4Bm',
        httpVerb: 'post',
        url: '/v1/airdrop/register',
        jsonEncodeBody: JSON.stringify({
          addr: '123',
        }),
        xTime: 1547524471,
      };
      let checksum = await tokenProvider.getChecksum(opt);
      Assert.equal(
        checksum,
        '8b575ddba41f8fb65536b27b71cefd477b69fb3d02ba290902c5761f3d2e6e65'
      );
    });
  });
});
