'use strict';
var methods = require('./methods');
var httpHelper = require('./helper/httpHelper');

exports.handleRest = function(server, schema, model) {
    model.name = model.name.toLowerCase();
    const urlId = `/${model.name}/:id`;
    const urlOutId = `/${model.name}`;

    const rest = { 
        'list': { method: 'get', url: urlOutId }, 
        'create': { method: 'post', url: urlOutId },
        'delete': { method: 'del', url: urlId },
        'detail': { method: 'get', url: urlId }, 
        'update': { method: 'put', url: urlId} 
    };

    var middlewares = httpHelper.setMiddlewares(model);

    function getSchema(req, res, next) {
        req.schema = schema;
        req.model = model;
        next();
    }

    var configMiddleware = {
        list: function(req, res, next) {
            return httpHelper.configureMiddleware(req, res, next, middlewares.list);
        },
        detail: function(req, res, next) {
            return httpHelper.configureMiddleware(req, res, next, middlewares.detail);
        },
        create: function(req, res, next) {
            return httpHelper.configureMiddleware(req, res, next, middlewares.create);
        },
        update: function(req, res, next) {
            return httpHelper.configureMiddleware(req, res, next, middlewares.update);
        },
        delete: function(req, res, next) {
            return httpHelper.configureMiddleware(req, res, next, middlewares.delete);
        }
    };

    const keys = Object.keys(rest);
    for (var i = 0; i < keys.length; i++) {
        const method = keys[i];
        if (httpHelper.checkMethod(method, model[method] || {})) {
            server[rest[method].method](
                rest[method].url, getSchema, 
                configMiddleware[method], 
                methods[method]
            );
        }
    }
};
