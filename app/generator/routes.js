'use strict';

var methods = require('./methods');
var httpHelper = require('./helper/httpHelper');
var validateHelper = require('./helper/validateHelper');

exports.handleRest = function(server, schema, model) {
    model.name = model.name.toLowerCase();
    const urlId = `/${model.name}/:id`;
    const urlOutId = `/${model.name}`;

    var middlewares = httpHelper.setMiddlewares(model);

    function getSchema(req, res, next) {
        req.schema = schema;
        req.model = model;
        next();
    }

    const configMiddleware = {
        list: {
            config: function(req, res, next) {
                return httpHelper.configureMiddleware(req, res, next, middlewares.list);
            },
            method: 'get', 
            url: urlOutId,
            validate: function(req, res, next) {
                return validateHelper.validate(req, res, next, model.list.validate || null);
            }
        },
        detail: { 
            config: function(req, res, next) {
                return httpHelper.configureMiddleware(req, res, next, middlewares.detail);
            },
            method: 'get',
            url: urlId,
            validate: function(req, res, next) {
                return validateHelper.validate(req, res, next, model.detail.validate || null);
            }
        },
        create: {
            config: function(req, res, next) {
                return httpHelper.configureMiddleware(req, res, next, middlewares.create);
            },
            method: 'post', 
            url: urlOutId,
            validate: function(req, res, next) {
                return validateHelper.validate(req, res, next, model.create.validate || null);
            }
        },
        update: {
            config: function(req, res, next) {
                return httpHelper.configureMiddleware(req, res, next, middlewares.update);
            },
            method: 'put', 
            url: urlId,
            validate: function(req, res, next) {
                return validateHelper.validate(req, res, next, model.update.validate || null);
            }
        }, 
        delete: {
            config: function(req, res, next) {
                return httpHelper.configureMiddleware(req, res, next, middlewares.delete);
            },
            method: 'del', 
            url: urlId, 
            validate: function(req, res, next) {
                return validateHelper.validate(req, res, next, model.detail.validate || null);
            }
        }
    };

    const keys = Object.keys(configMiddleware);
    for (var i = 0; i < keys.length; i++) {
        const method = keys[i];
        if (httpHelper.checkMethod(method, model[method] || {})) {            
            server[configMiddleware[method].method](
                configMiddleware[method].url, 
                getSchema, 
                configMiddleware[method].config,
                httpHelper.applyFilter,
                configMiddleware[method].validate, 
                methods[method]
            );
        }
    }
};
