/*jslint node: true */
'use strict';
var basicAuth = require('basic-auth');

class BasicHttpAuth {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
    }

    authorize(req, res, next) {
        var authEnabled = this.config.get('auth:enabled') || false;

        if (!authEnabled) {
            return next();
        }

        var user = basicAuth(req);

        if (!user || !user.name || !user.pass) {
            return this.unauthorized(res);
        }

        if (user.name === this.config.get('auth:user') && user.pass === this.config.get('auth:password')) {
            return next();
        } else {
            return this.unauthorized(res, user.name);
        }
    }

    unauthorized(res, login) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        this.logger.error('Someone try to login into user ' + login);

        return res.sendStatus(401);
    }
}

module.exports = BasicHttpAuth;
