'use strict';
//var mongoose = require('mongoose');
    
exports.ifAuth = function(req, res, next) {
    //req.query.account = mongoose.Types.ObjectId();
    next();
};

exports.generateToken = function() {
};
