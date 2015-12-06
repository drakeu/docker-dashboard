var BasicHttpAuth = require('./auth');
var express = require('express');
var Containers = require('../dashboard/containers');

module.exports = function(expressApp, logger, config) {
    var basicHttpAuth = new BasicHttpAuth(logger, config);

    expressApp.use('/',
        basicHttpAuth.authorize.bind(basicHttpAuth),
        express.static(__dirname + '/../web')
    );

    var containers = new Containers(logger, config);

    expressApp.use('/containers',
        basicHttpAuth.authorize.bind(basicHttpAuth),
        (req, res) => res.send(containers.getLayout())
    );

    expressApp.use((err, req, res, next) => { logger.error(err); res.sendStatus(500); });
}
