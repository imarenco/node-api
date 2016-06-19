'use strict';

const httpHelper = require('./helper/httpHelper');

exports.list = function(req, res) {
    
    httpHelper.applyFilter(req, 'list');

    const limit = req.query.limit || 10;

    const page = typeof req.query.page !== 'undefined' ? 
    httpHelper.getPage(req.query.page, limit) : 
    httpHelper.getPage(1, limit);

    let query =	req.schema.find(req.filter).limit(limit).skip(page).lean();
		
    if (typeof req.model.list.populate !== 'undefined' && req.model.list.populate.length > 0) {
        query = httpHelper.addPopulate(query, req.model.list.populate);
    }

    query.select(req.model.list.select || {});
    
    const queryCount = req.model.list.paginate ? req.schema.count(req.filter) : null;

    return Promise.all([query, queryCount])
    .then(function(data) {
        const count = data[1] || null;
        var response = {
            limit: limit,
            docs: data[0]
        };

        if (count) {
            response.pages = Math.ceil(count / limit);
            response.total = count;
        }

        res.send(response);
    })
    .catch(err => res.status(500).send(err));
};

exports.detail = function(req, res) {
    let query =	req.schema.findById(req.params.id).lean();

    if (
        typeof req.model.detail.populate !== 'undefined' && req.model.detail.populate.length > 0) {
        query = httpHelper.addPopulate(query, req.model.list.populate);
    }
	
    query.select(req.model.detail.select || {});
    
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
    return	req.schema.findOneAndUpdate({_id: req.params.id }, req.body, {new: true})
    .lean()
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};

exports.delete = function(req, res) {
    return req.schema.remove({ _id: req.params.id }).lean()
    .then(doc => res.send(doc))
    .catch(err => res.status(500).send(err));
};
