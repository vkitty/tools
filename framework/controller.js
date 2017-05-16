'use strict';
var fs = require('fs');


var assignData = {};

module.exports = class Controller {
    constructor(name, action) {
        this.tplfile = name + '/' + action;
        assignData = {};
        assignData.action= action;
    }

    assign(name, value) {
        assignData[name] = value;
    }

    display(file) {
        var viewConfig = require(_g.APP_PATH + '/config/view.json');

        var tplfile = file || this.tplfile;
        var htmlfile = _g.VIEW_PATH+'/'+tplfile+'.html';
        var jsfile = _g.VIEW_PATH+'/build/'+tplfile+'.js';

        if(_g.env==='development'){
            if (fs.existsSync(htmlfile)) {
                var template = require('art-template');
                template.config('extname', viewConfig.extname);
                template.config('encoding', viewConfig.encoding);
                template.config('escape', viewConfig.escape);

                var html = template(htmlfile, assignData);
                this.body = html;
            } else {
                console.log(tplfile + ' not found')
            }
        }else{
            if(fs.existsSync(jsfile)) {
                var render = require(jsfile);
                var html = render(assignData);
                this.body = html;
            }else{
                console.log(tplfile + ' not found')
            }
        }
    }
};
