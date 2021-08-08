const logger = require('./src/logger')('info'); // change this line if you want a different logging level (I swear I'll make it better soon:tm:)

// trick to use mainly async code
require('./src')()
  .then(() => {
    logger.info('Main function finished, now quitting');
  })
  .catch(err => {
    logger.fatal(err, 'Uncaught error was thrown, please report this issue');
  });