const logger = require('./logger');

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    logger.log()
  }
}

module.exports = MyCustomReporter;
