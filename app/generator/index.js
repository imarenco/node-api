'use strict';

const fs = require('fs');
const routes = require('./routes');
const modelHelper = require('./helper/modelHelper');

module.exports = function(server) {
    const directory = `${__dirname}/models`;
    fs.readdirSync(directory).forEach(function(file) {    	
        file = `${directory}/${file}`;
        if (fs.lstatSync(file).isFile()) {
            const model = require(file);
            return routes.handleRest(server, modelHelper.parseSchema(model), model);
        }
    });
};
