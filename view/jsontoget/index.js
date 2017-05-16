;(function () {
    var jsonToTet = function (json) {
        var str = '',
            contcatStr = '?';
        for (var key in json) {
            if(str){
                contcatStr ='&';
            }

            try{
                if(Object.prototype.toString.call(json[key])==='[object Object]'){
                    str += contcatStr + key + '=' + JSON.stringify(json[key]);
                }else{
                    str += contcatStr + key + '=' + json[key];
                }
            }catch (e){
                str += contcatStr + key + '=' + json[key];

            }
        }
        return str;
    };

    var getToJson = function(){

    };

    $('.J_jsontogetinput').click(function () {
        var type = $(this).data('type'),
            content = $('#jsontogetinput').val().trim();

        if(!content){
            $('#viewer').text('{"example":"hello word"}');
            return false;
        }

        if (type === 1) {
            try {
                content = JSON.parse(content);
                $('#viewer').text(jsonToTet(content))
            } catch (e) {
                $('#viewer').text('json格式错误');
            }
        } else {
            content = content.replace(/^[^\?]*\?/, '');
            Data.jsontoget.gettojson(content,function(res){
                $('#viewer').text(res);
            })
        }



    })
}());

