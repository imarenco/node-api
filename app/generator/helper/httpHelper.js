'use strict';
var async = require('async');

exports.addPopulate = function(query, populates) {
    for (var i = 0; i < populates.length; i++) {
        query = query.populate(populates[i].toLowerCase());
    }
    return query;
};

exports.checkMethod = function(status, meta_data) {
    let flag = false;
    if (
        (typeof meta_data.unable !== 'undefined' && meta_data.unable) ||
        typeof meta_data.unable === 'undefined'
    ) {
        flag = true;
    }

    return flag;
};

exports.getPage = function(page, limit) {
    return limit * page - limit;
};

exports.configureMiddleware = function(req, res, next, middlewares) {
    var operations = [];
    if (middlewares.length > 0) {
        for (var i = 0; i < middlewares.length; i++) {
            operations.push(middlewares[i].bind(null, req, res));
        }

        async.series(operations, function(err) {
            if (err) {
                console.log('There was a problem running the middleware!');
                return next(err);
            }
            next();
        });

    } else {
        next();
    }
};

exports.setMiddlewares = function(model) {
    var middlewares = { 
        'list': [], 
        'create': [], 
        'delete': [], 
        'detail': [], 
        'update': [] 
    };
    
    var keys = Object.keys(middlewares);
    for (var x = 0; x < keys.length; x++) {
        if (typeof model[keys[x]].service !== 'undefined') {
            for (var i = 0; i < model[keys[x]].service.length; i++) {
                const service = model[keys[x]].service[i].name;
                const method = model[keys[x]].service[i].method;
                middlewares[keys[x]].push(require('../../../service/' + service)[method]);
            }
        }
    }
    return middlewares;
};
