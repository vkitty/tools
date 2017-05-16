'use strict';
var path = require('path');
var fs = require('fs');
var co = require('co');
var Controller = require('./controller.js');

var toString = Object.prototype.toString;

/**
 * 调用数据库操作模块
 * @param name
 * @returns {module.exports|exports}
 * @constructor
 */
global.M = function(name){
    var DbQuery = require('./lib/dbQuery.js');
    var dbQuery = new DbQuery();
    dbQuery.sql.table=name;
    dbQuery.conn=conn;
    return dbQuery;
};

//var b = new a();
//在类的实例上面调用方法，其实就是调用构造函数原型上的方法。
//只有函数有原型 b.prototype=undefind;
//类的继承其实是通过__proto__来完成的,继承了原型链构造函数的prototype;

/**
 * 调用controller控制器
 * @param name
 * @constructor
 */
global.C = function (name,actionName) {
    name = name.toLowerCase();
    actionName = actionName?actionName+'Action':'indexAction';

    var actionFile = _g.APP_PATH + '/controller/' + name + '.js';
    if (!fs.existsSync(actionFile)) {
        console.log('not found ' + actionFile)
    } else {
        var Action = require(actionFile);

        Controller.prototype.__proto__ = this;
        var controller = new Controller(name,actionName.replace('Action',''));
        if(Action.prototype.__proto__.__proto__){
            Action.prototype.__proto__.__proto__ = controller;
        }else{
            Action.prototype.__proto__ = controller;
        }

        var action = new Action();

        if(action[actionName]){
            return new Promise(function (resolve) {

                co(action[actionName].apply(action)).then(function(res){

                    resolve(res);
                }, function(err){
                    console.log(err);
                });


            });
        }else{
            console.log(actionFile +' ' +actionName +' method not found');
        }
    }
};



global._g={};
