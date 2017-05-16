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
        var crypto = require('crypto');
        var result = crypto.createHash('md5').update(this.query.content).digest('hex');

        this.responseSuccessMsg(result);
    }

};