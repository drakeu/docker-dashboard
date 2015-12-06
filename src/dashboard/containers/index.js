/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();

var configTemplate = require('../template');

class Containers {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
    }

    getLayout() {
        var dashboardConfig = configTemplate();

        dashboardConfig.datasources.push(
            this.getDataSource('data_source')
        );

        dashboardConfig.panes.push(
            this.getPanes('docker', 'data_source')
        );

        return JSON.stringify(dashboardConfig);
    }

    getDataSource(name) {
        return {
            name: name,
            type: 'node_js',
            settings: {
                url: '',
                events: [{
                    eventName: 'refresh'
                }],
                rooms: [],
                name: name
            }
        }
    };

    getPanes(name, datasourceName) {
        return {
            title: name,
            width: 1,
            row: { 2: 1, 3: 1, 4: 1, 5: 1 },
            col: { 2: 1, 3: 1, 4: 1, 5: 1 },
            col_width: 1,
            widgets: [{
                type: 'gauge',
                settings: {
                    title: 'Items QTY',
                    value: 'datasources["' + datasourceName + '"].value',
                    units: 'items',
                    min_value: 0,
                    max_value: 100
                }
            }, {
                type: 'sparkline',
                settings: {
                    title: 'Some sparkline',
                    value: [
                        'datasources["' + datasourceName + '"].value'
                    ]
                }
            }, {
                type: 'text_widget',
                settings: {
                    title: 'Some unit',
                    size: 'regular',
                    value: 'datasources["' + datasourceName + '"].value',
                    sparkline: true,
                    animate: true,
                    units: 'kg'
                }
            }]
        };
    };
}

module.exports = Containers;
