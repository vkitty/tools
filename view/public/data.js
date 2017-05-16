;(function () {
    var host = '';

    function getRequest(config, callback, errorBack) {
        var defaultConfig = {
            type: 'post',
            success: function (result) {

                if (result && result.status && result.status.status_code !== 0) {
                    console.log('返回失败的信息:' + result.status.status_reason);
                    if (errorBack) {
                        errorBack(result);
                    }

                } else if (result.result) {
                    callback(result.result);
                } else if (result) {
                    callback(result);
                }
            },
            error: function () {
                console.log('请求失败')
            },
            complete: function () {
            }
        };

        config = $.extend(defaultConfig, config, true);


        !/http:\/\//i.test(config.url) && (config.url = host + config.url);

        $.ajax(config);
    }

    var Data = {};

    Data.base64 = {
        encode: function (type,content ,callback) {
            var config = {
                url:'/base64/encode',
                data:{
                    content:content,
                    type:type
                }
            };

            getRequest(config,callback)
        }
    };

    Data.jsontoget = {
        gettojson: function (search ,callback) {
            var config = {
                url:'/jsontoget/gettojson?'+search,
                type:'get'
            };

            getRequest(config,callback)
        }
    };

    Data.md5 = {
        encode:function(content,callback){
            var config = {
                url:'/md5/encode?content='+content
            };

            getRequest(config,callback)

        }
    };

    Data.minify = {
        encode:function(type,content,callback){
            var config = {
                data:{
                    content:content,
                    type:type
                },
                url:'/minify/encode'
            };

            getRequest(config,callback)

        }
    };

    Data.ico = {
        encode:function(content,callback){
            var config = {
                data:{
                    content:content
                },
                url:'/ico/encode'
            };

            getRequest(config,callback)
        }
    };



    window.Data = Data;
}());
