#!/usr/bin/env node
var fs = require('fs');
var winston = require('winston');
var nconf = require('nconf');
var App = require('../src/app');

winston.level = 'debug';

nconf
  .argv()
  .env();

if (nconf.get('help')) {
    console.log('Usage: node bin/dashboard.js [OPTIONS]');
    console.log('Options:');
    console.log('  --help           this help');
    console.log('  --config         path to json config file - default is [project_dir]/config/app.json');
    console.log('  --log-level      log level - default debug');
    process.exit(0);
}

var configFile = nconf.get('config') || __dirname + '/../config/app.json';

try {
    var stats = fs.lstatSync(configFile);

    if (stats.isFile()) {
        winston.info('Loading config', { path: configFile });
        nconf.file({ file: configFile });
        new App(winston, nconf).run();
    } else {
        winston.error('Invalid file', { path: configFile });
    }
} catch(e) {
    winston.error(e.message);
}
