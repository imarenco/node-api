'use strict';

const config = require('./config');
const restify = require('restify');
const log = require('./service/log');

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection
    .on('error', function(err) {
        log.error('MongoDB connection error: ' + err);
        process.exit(1);
    })
    .on('open', function() {
        log.info('MongoDB connection successful');
    });

var server = restify.createServer({
    name: 'node-api',
    log: log
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

require('./app')(server);

server.listen(config.port, function() {
    log.info('Restify server listening on %d, in %s mode', config.port, config.env);
});
