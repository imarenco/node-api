'use strict';

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8081,
    ip: process.env.IP || '0.0.0.0',
    mongo: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dev',
        options: {
            server: {
                auto_reconnect: true,
                socketOptions: {
                    keepAlive: 1
                }
            },
            db: {
                safe: true
            }
        }
    },
    getUrl: function() {
        return 'http://' + this.ip + ':' + this.port;
    }
};
