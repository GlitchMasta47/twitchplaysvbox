const bunyan = require('bunyan');

let logger;

// this ensures that all files can share a single logger
module.exports = level => {
    if (!logger) logger = bunyan.createLogger({ name: 'twitchplaysvbox', level: level || "info" });
    return logger;
};