'use strict';

require('./global.js');
//var Controller = require('./controller.js');
//var module = require('./model.js');

module.exports = class Framework {
    constructor(config) {
        Object.assign(_g, config);
        //this.connection();
    }

    connection(){
        var mysql = require('mysql');
        var config = require(_g.APP_PATH+'/config/db.json');
        var connection = mysql.createConnection({
            host     : config.host,
            user     : config.user,
            password : config.password,
            database : config.database,
            port : config.port,
            debug:config.degbug,
            charset:config.charset,
            connectTimeout:config.connectTimeout
        });


        connection.connect(function(err){
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            global.conn=connection;

            console.log('connected as id ' + connection.threadId);
        });
    }

    createServer() {

        var app = require('koa')();
        var router = require('koa-router')();
        app.experimental = true;

        _g.router = router;

        router.get(['/', '/index','/index/:action'], function*(ctx, next) {
            yield C.apply(this,['index',this.params.action]);
        });

        router.get(['/', '/jsonview','/jsonview/:action'], function*(ctx, next) {
            yield C.apply(this,['jsonview',this.params.action]);
        });

        router.get(['/', '/base64','/base64/:action'], function*(ctx, next) {
            yield C.apply(this,['base64',this.params.action]);
        });

        router.post(['/', '/base64','/base64/:action'], function*(ctx, next) {
            yield C.apply(this,['base64',this.params.action]);
        });

        router.get(['/', '/urlencode','/urlencode/:action'], function*(ctx, next) {
            yield C.apply(this,['urlencode',this.params.action]);
        });

        router.get(['/', '/jsontoget','/jsontoget/:action'], function*(ctx, next) {
            yield C.apply(this,['jsontoget',this.params.action]);
        });

        router.get(['/', '/md5','/md5/:action'], function*(ctx, next) {
            yield C.apply(this,['md5',this.params.action]);
        });

        router.post(['/', '/md5','/md5/:action'], function*(ctx, next) {
            yield C.apply(this,['md5',this.params.action]);
        });

        router.get(['/', '/minify','/minify/:action'], function*(ctx, next) {
            yield C.apply(this,['minify',this.params.action]);
        });


        router.post(['/', '/minify','/minify/:action'], function*(ctx, next) {
            yield C.apply(this,['minify',this.params.action]);
        });


        router.get(['/', '/erweima','/erweima/:action'], function*(ctx, next) {
            yield C.apply(this,['erweima',this.params.action]);
        });

        router.post(['/', '/erweima','/erweima/:action'], function*(ctx, next) {
            yield C.apply(this,['erweima',this.params.action]);
        });

        router.get(['/', '/ico','/ico/:action'], function*(ctx, next) {
            yield C.apply(this,['ico',this.params.action]);
        });

        router.post(['/', '/ico','/ico/:action'], function*(ctx, next) {
            yield C.apply(this,['ico',this.params.action]);
        });



        app.use(router.routes())
            .use(router.allowedMethods());



        var config = require(_g.APP_PATH+'/config/config.json');
        app.listen(config.port);
    }

    run() {
        this.createServer();
    }

};