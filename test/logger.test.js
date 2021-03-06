const Logger = require('../lib/logger');
const Assert = require('assert');
const Log4js = require('./log4js');
const Winston = require('./winston');

describe('logger', async () => {
  describe('log4js', async () => {
    beforeEach(async () => {
      Logger.setLogger(Log4js);
      Logger.setLogLevel('ALL');
    });

    it('log info', async () => {
      Logger.info('log info');
      Assert.ok('ok');
    });

    it('log error', async () => {
      Logger.error('log error');
      Assert.ok('ok');
    });

    it('log warm', async () => {
      Logger.warn('log warm');
      Assert.ok('ok');
    });

    it('log debug', async () => {
      Logger.debug('log debug');
      Assert.ok('ok');
    });
  });

  describe('winston', async () => {
    beforeEach(async () => {
      Logger.setLogger(Winston);
      Logger.setLogLevel('ALL');
    });
    it('log info', async () => {
      Logger.info('log info');
      Assert.ok('ok');
    });

    it('log error', async () => {
      Logger.error('log error');
      Assert.ok('ok');
    });

    it('log warm', async () => {
      Logger.warn('log warm');
      Assert.ok('ok');
    });

    it('log debug', async () => {
      Logger.debug('log debug');
      Assert.ok('ok');
    });
  });
});
