const Assert = require('assert');
const TokenProvider = require('../lib/token');
const ConfigTest = require('./config.test');

var tokenProvider = null;

describe('token', function() {
  beforeEach(async () => {
    tokenProvider = new TokenProvider({
      apiKey: ConfigTest.API_KEY,
      secret: ConfigTest.SECRET,
      url: ConfigTest.AUTH_URL,
    });
  });

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
  });

  describe('#getNewToken()', async () => {
    it('Get new token', async () => {
      let token = await tokenProvider.getNewToken();

      Assert.ok(token.length > 0, 'must have token');
    });
  });

  describe('#getNewTokenOnce)', async () => {
    it('Get new token', async () => {
      let firstToken = null;
      var getTokenAsync = async i => {
        let token = await tokenProvider.getNewTokenOnce();
        if (firstToken == null) {
          firstToken = token;
        } else {
          Assert.ok(firstToken, token, 'Token must be the same');
        }
        console.log('token :', i, token);
      };

      for (let i = 0; i < 50; i++) {
        getTokenAsync(i);
      }
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
      console.log('checksum :', checksum);
      Assert.equal(
        checksum,
        '8b575ddba41f8fb65536b27b71cefd477b69fb3d02ba290902c5761f3d2e6e65'
      );
    });
  });
});
