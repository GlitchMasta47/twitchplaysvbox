// haha nodejs it's async time
const logger = require('./logger')();
const KEYBOARD = require('./keyboard');

/**
 * Starts the main twitchplaysvbox logic
 */
module.exports = async () => {
  const { parseConfig } = require('./config');

  let config;
  try {
    config = await parseConfig();
  } catch (err) {
    logger.fatal(err, 'The config file could not be loaded');
    return;
  }
  logger.info({ config }, 'Config loaded');

  const { VirtualBoxAPI } = require('./vbox');

  let vbox = new VirtualBoxAPI(config.virtualbox.url);
  await vbox.login(config.virtualbox.username, config.virtualbox.password);
  logger.info(`Connected to VirtualBox, version ${vbox.version}`)

  await vbox.sendKeyboardEvent(config.virtualbox.vmname, [
    KEYBOARD.LEFT_SHIFT,
    KEYBOARD.H,
    KEYBOARD.RELEASE | KEYBOARD.H,
    KEYBOARD.RELEASE | KEYBOARD.LEFT_SHIFT,
    KEYBOARD.E,
    KEYBOARD.RELEASE | KEYBOARD.E,
    KEYBOARD.L,
    KEYBOARD.RELEASE | KEYBOARD.L,
    KEYBOARD.L,
    KEYBOARD.RELEASE | KEYBOARD.L,
    KEYBOARD.O,
    KEYBOARD.RELEASE | KEYBOARD.O,
    KEYBOARD.COMMA,
    KEYBOARD.RELEASE | KEYBOARD.COMMA,
    KEYBOARD.SPACE,
    KEYBOARD.RELEASE | KEYBOARD.SPACE,
    KEYBOARD.W,
    KEYBOARD.RELEASE | KEYBOARD.W,
    KEYBOARD.O,
    KEYBOARD.RELEASE | KEYBOARD.O,
    KEYBOARD.R,
    KEYBOARD.RELEASE | KEYBOARD.R,
    KEYBOARD.L,
    KEYBOARD.RELEASE | KEYBOARD.L,
    KEYBOARD.D,
    KEYBOARD.RELEASE | KEYBOARD.D,
    KEYBOARD.LEFT_SHIFT,
    KEYBOARD.ONE,
    KEYBOARD.RELEASE | KEYBOARD.ONE,
    KEYBOARD.RELEASE | KEYBOARD.LEFT_SHIFT
  ])
}