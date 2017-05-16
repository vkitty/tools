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
        var favicons = require('favicons'),
            source = '/Users/mebx/nodeweb/qianniuhua/logo.png',
            configuration = {
                background:'#fff',
                path:"/",
                url:"/",
                icons: {
                    android: false,              // Create Android homescreen icon. `boolean`
                    appleIcon: false,            // Create Apple touch icons. `boolean`
                    appleStartup: false,         // Create Apple startup images. `boolean`
                    coast: false,                // Create Opera Coast icon. `boolean`
                    favicons: true,             // Create regular favicons. `boolean`
                    firefox: false,              // Create Firefox OS icons. `boolean`
                    opengraph: false,            // Create Facebook OpenGraph image. `boolean`
                    twitter: false,              // Create Twitter Summary Card image. `boolean`
                    windows: false,              // Create Windows 8 tile icons. `boolean`
                    yandex: false                // Create Yandex browser icon. `boolean`
                }
            };




        var generatIco = function * (){
            return new Promise(function(resolve){
                favicons(source, configuration, function(error, response){
                    if (error) {
                        console.log(error.status);  // HTTP error code (e.g. `200`) or `null`
                        console.log(error.name);    // Error name e.g. "API Error"
                        console.log(error.message); // Error description e.g. "An unknown error has occurred"
                    }


                    console.log(response.images)

                    if(response.images && response.images[3] && response.images[3].contents){


                        var str = response.images[3].contents.toString('base64');
                        resolve(str);
                    }
                });
            })
        };


        var str = yield generatIco();

        this.body='<img src="data:image/ico;base64,'+str+'"/>';
    }

};