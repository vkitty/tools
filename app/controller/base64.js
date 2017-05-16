'use strict';
var Base = require('./base.js');
var pageSize = 20;


module.exports = class Index extends Base {
    constructor() {
        super();
    }

    /**
     * 列表页
     */
    * indexAction() {
        this.display();
    }

    * encodeAction(){
        var post = yield this.post(),
            type=post.type,
            content = post.content;

        if(type==='1'){
            var buf = new Buffer(content,'utf-8');
            this.responseSuccessMsg(buf.toString('base64'));
        }else{
            buf = new Buffer(content,'base64');
            this.responseSuccessMsg(buf.toString());
        }

    }

};