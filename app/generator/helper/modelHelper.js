'use strict';

const mongoose = require('mongoose');
const	Schema = mongoose.Schema;
	
exports.parseSchema = function(model) {
    return mongoose.model(model.name, new Schema(model.structure));
};
