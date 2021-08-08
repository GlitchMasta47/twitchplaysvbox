// haha nodejs it's async time

/**
 * Starts the main twitchplaysvbox logic
 * @param {import('bunyan')} logger - The bunyan instance to use for logging messages
 */
module.exports = async logger => {
  const { parseConfig } = require('./config');

  let config;
  try {
    config = await parseConfig();
  } catch (err) {
    logger.fatal(err, 'The config file could not be loaded');
    return;
  }

  logger.info({ config }, 'Config loaded');
}