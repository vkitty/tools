'use strict';
var exit = require('exit');
module.exports = class Base {
    constructor() {
    }

    /**
     * assign初始化 search&用户信息
     */
    * init() {
        var search_keyword = this.query.search_keyword;
        var search_app_id = this.query.search_app_id;

        this.assign('search_keyword',search_keyword);
        this.assign('search_app_id',search_app_id);

        var searchCategory = yield M('app').select();
        this.assign('search_category',searchCategory);

        this.assign('username',this.getUserName());
    }

    /**
     * 发送get请求
     * @param url
     * @param data
     * @param callback
     */
    httpGet(url, data, callback) {
        var request = require('request');
        var querystring = require('querystring');
        data = querystring.stringify(data);

        if (url.indexOf('?') > -1) {
            url = url + '&' + data
        } else {
            url = url + '?' + data
        }

        console.log(url);
        request(url, function (error, response, body) {
            if (error) {
                throw error;
            } else {
                callback(body);
            }
        })
    }

    /**
     * 跳转
     * @param url
     * @param msg
     */
    redirectByMsg(url, headers) {
        this.redirect(url);
    }


    /**
     * 获取post信息数据{id:1}
     * @returns {Promise}
     */
    post(){
        var data = '',self = this;
        var querystring = require('querystring');
        this.req.on('data',function(chunk){
            data += chunk.toString()
        });

        return new Promise(function(resolve){
            self.req.on('end',function(){
                resolve(querystring.parse(data));
            })
        })
    }

    /**
     * 计算页面数量
     * @param total
     * @param pageSize
     * @returns {*}
     */
    getTotalPage(total,pageSize){
        if(total%pageSize){
            return parseInt(total/pageSize)+1;
        }else{
            return parseInt(total/pageSize);
        }
    }

    /**
     * 获取用户名称
     * @returns {*}
     */
    getUserName(){
        if(this.cookies.get('Sign')){
            var a = new Buffer(this.cookies.get('Sign'),'base64').toString();
            return JSON.parse(a).name;
        }else{
            return '';
        }
    }

    /**
     * json返回成功信息
     * @param result
     */
    responseSuccessMsg(result){
        var data ={
            status:{
                status_code:0,
                status_reason:'success'
            }
        };

        if(result){
            data.result = result;
        }

        this.body=data;
    }

    /**
     * 失败信息 (没有指定file 标示json输出)
     * @param status_code
     * @param status_reason
     * @param file ('/public/msg/error')
     */
    responseFailMsg(status_code,status_reason,file){
        var data ={
            status:{
                status_code:status_code || 1,
                status_reason:status_reason || ''
            }
        };

        if(!file){
            this.body=data;
        }else{
            this.assign('data',data);
            this.display(file);
        }
    }


    /**
     * 判断app表权限
     * @param appId
     * @param username
     * @returns {boolean}
     */
    * checkPower(appId,username){
        username = username || this.getUserName();
        var appRow = yield M('app').where({id:appId}).find();
        var creater = appRow.creater;

        if (creater !== username && appRow.power.indexOf(username) === -1) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * schema json check
     * @param src
     * @param validator
     * @param isStrict  是否严格模式
     * @returns {boolean}
     */
    validJson(src,validator,isStrict){
        if(!src || !validator){
            return false;
        }

        var isError = false;



        //相互判断键名是否一致
        (function(){
            var checkKey = function(childSrc,childValidator){
                //对象长度是否一致
                if(Object.prototype.toString.call(childSrc)==='[object Object]' && Object.getOwnPropertyNames(childSrc).length!==Object.getOwnPropertyNames(childValidator).length){
                    isError = "key";
                    return;
                }

                for(let key in childSrc){
                    //属性名称(即字段名)是否一致
                    if(Object.prototype.toString.call(childSrc)==='[object Object]' && (!childValidator.hasOwnProperty || !childValidator.hasOwnProperty(key))){
                        isError = true;
                        return;
                    }

                    //递归处理
                    if(childSrc[key] && (Object.prototype.toString.call(childSrc[key])==='[object Object]' || Object.prototype.toString.call(childSrc[key])==='[object Array]')){
                        //如果是数组,只要和验证数组第一个值进行check
                        if(Object.prototype.toString.call(childSrc)==='[object Array]'){
                            checkKey(childSrc[key],childValidator[0]);
                        }else{
                            checkKey(childSrc[key],childValidator[key]);
                        }
                    }

                }
            };

            !isError && checkKey(src,validator);
            !isError && isStrict && checkKey(validator,src);
        }());



        //判断值类型是否正确
        (function(){
            var valid = function(srcProp,validatorPro){
                return Object.prototype.toString.call(srcProp)===Object.prototype.toString.call(validatorPro)
            };

            var roundObj = function(childSrc,childValidator){
                if(!valid(childSrc,childValidator)){
                    isError = true;
                    return;
                }

                for(let key in childSrc){
                    if(childSrc[key] && (Object.prototype.toString.call(childSrc[key])==='[object Object]' || Object.prototype.toString.call(childSrc[key])==='[object Array]')){
                        //如果是数组,只要和验证数组第一个值进行check
                        if(Object.prototype.toString.call(childSrc)==='[object Array]'){
                            roundObj(childSrc[key],childValidator[0]);
                        }else{
                            roundObj(childSrc[key],childValidator[key]);
                        }
                    }else{
                        //如果不是对象或者数组

                        //如果schema是数字,将值转化为数字
                        if(!isStrict){
                            if(Object.prototype.toString.call(childValidator[key])==='[object Number]'){
                                childSrc[key] = Number(childSrc[key]);
                            }

                            if(Object.prototype.toString.call(childValidator[key])==='[object Boolean]'){
                                childSrc[key] = Boolean(childSrc[key]);
                            }


                            if(Object.prototype.toString.call(childValidator[key])==='[object Null]'){
                                childValidator[key] = '';
                            }
                        }


                        if(!valid(childSrc[key],childValidator[key])){
                            isError = true;
                            break;
                        }
                    }
                }
            };

            !isError && roundObj(src,validator);
        }());


        return !isError;

    }

};