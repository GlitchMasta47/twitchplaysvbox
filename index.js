const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'twitchplaysvbox' });

// trick to use mainly async code
require('./src')(logger)
  .then(() => {
    logger.info('Main function finished, now quitting');
  })
  .catch(err => {
    logger.fatal(err, 'Uncaught error was thrown, please report this issue');
  });