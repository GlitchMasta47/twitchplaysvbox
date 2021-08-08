const { readFile } = require('fs/promises');
const { parse: parseToml } = require('toml');
const logger = require('./logger')();

async function parseConfig(file = './config/config.toml') {
    logger.debug({ file }, 'Starting config parsing');
    let raw_config = await readFile(file);
    logger.debug({ raw_config: raw_config.toString('utf8') }, 'Loaded text from config file');
    let parsed_config = parseToml(raw_config);
    logger.debug({ parsed_config }, 'Parsed config file, returning')
    return parsed_config;
}

module.exports = {
    parseConfig
}