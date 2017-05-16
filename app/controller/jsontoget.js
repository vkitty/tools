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

    * gettojsonAction(){
        var recurse = function(content){
            for(let key in content){
                try{
                    content[key]=JSON.parse(content[key]);
                    response(content[key]);
                }catch (e){}
            }
        };


        recurse(this.query);

        var content = JSON.stringify(this.query);

        this.responseSuccessMsg(content)
    }
};