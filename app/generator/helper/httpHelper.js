'use strict';
var async = require('async');
var log = require('../../../service/log');
const that = this;

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
                log.error('There was a problem running the middleware' + err);
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

exports.applySearch = function(req) {
    const search = JSON.parse(req.query.search);
    const keys = Object.keys(search);
    for (var x = 0; x < keys.length; x++) {
        const type = req.model.structure[keys[x]].type.toLowerCase();
        if (type === 'string' && typeof search[keys[x]] === 'string') {
            req.filter[keys[x]] = new RegExp(search[keys[x]], 'i');
        }
    }
};

exports.applyQueryFilter = function(req, keys) {
    for (var i = 0; i < keys.length; i++) {
        if ( 
            keys[i] !== 'page' && 
            keys[i] !== 'limit' && 
            keys[i] !== 'search' && 
            typeof req.model.structure[keys[i]] !== 'undefined' 
        ) {
            req.filter[keys[i]] = req.query[keys[i]];
        }
    }
};

exports.addSelected = function(query, select) {
    const keys = Object.keys(select);
    var selected = {};
    for (var i = 0; i < keys.length; i++) {
        selected[keys[i]] = (select[keys[i]] == false) ? 0 : 1;
    }

    return selected;
};

exports.applyFilter = function(req, res, next) {
    req.filter = {};
    const keys = Object.keys(req.query);
    
    if (keys.length > 0) {
        that.applyQueryFilter(req, keys);
    }
    
    if (req.query.search && req.model.list.search) {
        that.applySearch(req);
    }
    
    next();
};
