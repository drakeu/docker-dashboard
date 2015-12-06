/*jslint node: true */
'use strict';
var express = require('express');
var socketIo = require('socket.io');
var http = require('http');

var routing = require('./express/routing');

class App {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
        this.socketConnectionsCounter = 0;
    }

    run() {
        this.runHttpServer();
        this.registerSocketServer();
        this.registerRefreshMetricsLoop();
    }

    runHttpServer() {
        var httpPort = this.config.get('http-server:port') || 7070;

        this.expressApp = express();
        http.Server(this.expressApp)
            .listen(httpPort, () => this.logger.info('Http server started', { port: httpPort } ));

        routing(this.expressApp, this.logger, this.config);
    }

    registerSocketServer() {
        this.io = socketIo(this.httpServer);
        this.io.on('connection', this.socketConnected.bind(this));
    }

    socketConnected(socket) {
        this.logger.debug('New client connected');

        this.socketConnectionsCounter++;

        socket.on('subscribe', room => socket.join(room));
        socket.on('disconnect', socket => this.socketConnectionsCounter--);
    }
}

module.exports = App;
