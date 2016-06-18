'use strict';
var valid = require('validate.js');

exports.validate = function(req, res, next, validate) {
    if (validate) {
        var constraints = {};
        var attributes = {};

        for (var i = 0; i < validate.length; i++) {
            attributes[validate[i].name] = req[validate[i].source][validate[i].name] || null;
            constraints[validate[i].name] = validate[i].rules;
        }

        valid.async(attributes, constraints)
        .then(function(result) {
            next();
        }, function(err) {
            res.send(400, {error: err });
        });
    } else {
        next();
    }
};
