const Config = require('./config.test');
const log4js = require('log4js');

const logLayout = {
  type: 'colored',
  pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %p %z %c %m',
};

log4js.configure({
  appenders: {
    FILE: {
      type: 'dateFile',
      filename: Config.Logger.File.App,
      pattern: Config.Logger.File.Format,
      level: 'trace',
      layout: logLayout,
      compress: Config.Logger.File.Compress,
      daysToKeep: 90,
    },
    CONSOLE: {
      type: 'stdout',
      layout: logLayout,
      level: 'trace',
    },
    FILE_ERROR: {
      type: 'dateFile',
      filename: Config.Logger.File.Error,
      pattern: Config.Logger.File.Format,
      level: 'trace',
      layout: logLayout,
      compress: Config.Logger.File.Compress,
      daysToKeep: 90,
    },
    ERROR_ONLY: {
      type: 'logLevelFilter',
      appender: 'FILE_ERROR',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: Config.Logger.Appenders,
      level: Config.Logger.DefaultLevel,
    },
  },
});
const instance = log4js.getLogger('Logger');

module.exports = instance;
