'use strict';

const bunyan = require('bunyan');

const log = bunyan.createLogger({
    name: 'node-api',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'error',
            path:   process.env.LOG_PATH || '/var/tmp/myapp-error.log'
        }
    ]
});

module.exports = log;
