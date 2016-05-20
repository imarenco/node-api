'use strict';

const generator = require('./generator');
//const custom = require('custom');

module.exports = function(server) {
    generator(server);
    //custom(server);
};
