const { readFile } = require('fs/promises');
const { parse: parseToml } = require('toml');

async function parseConfig(file = './config/config.toml') {
    let raw_config = await readFile(file);
    let parsed_config = parseToml(raw_config);
    return parsed_config;
}

module.exports = {
    parseConfig
}