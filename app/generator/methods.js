'use strict';

const httpHelper = require('./helper/httpHelper');

exports.list = function(req, res) {
    const limit = req.query.limit || 10;
    
    const page = typeof req.query.page !== 'undefined' ? 
    httpHelper.getPage(req.query.page, limit) : 
    httpHelper.getPage(1, limit);

    let query =	req.schema.find({}).limit(limit).skip(page).lean();
		
    if (typeof req.model.list.populate !== 'undefined' && req.model.list.populate.length > 0) {
        query = httpHelper.addPopulate(query, req.model.list.populate);
    }
		
    query
    .then(docs => res.send(docs))
    .catch(err => res.status(500).send(err));
};

exports.detail = function(req, res) {
    let query =	req.schema.findById(req.params.id).lean();

    if (typeof req.model.detail.populate !== 'undefined' && req.model.detail.populate.length > 0) {
        query = httpHelper.addPopulate(query, req.model.list.populate);
    }
		
    return query
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};

exports.create = function(req, res) {
    return	req.schema.create(req.body)
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};

exports.update = function(req, res) {
    return	req.schema.update({_id: req.params.id }, req.body).lean()
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};

exports.delete = function(req, res) {
    return req.schema.remove({ _id: req.params.id }).lean()
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};
