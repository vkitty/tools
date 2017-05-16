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
            var UglifyJS = require("uglify-js");
            try{
                var result = UglifyJS.minify(content, {fromString: true,mangle:true});
                result = result.code
            }catch (e){
                result = content;
            }
        }else{
            var uglifycss = require('uglifycss');
            try {
                result = uglifycss.processString(content,{ maxLineLen: 500, expandVars: true });
            }catch (e){
                result = content;
            }
        }

        this.responseSuccessMsg(result);
    }

};