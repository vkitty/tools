'use strict';

var path = require('path');
var rootPath = __dirname;

var Framework = require('./framework/index.js');

var config = {
    APP_PATH: rootPath + '/app',
    ROOT_PATH: rootPath,
    VIEW_PATH: rootPath+'/view',
    env: 'production',
    degbug:true
};

var framework = new Framework(config);
framework.run();

