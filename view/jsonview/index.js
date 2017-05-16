;(function(){

    var isJSONP = function(str){
        if(str){
            return /^([^\(\{}]{1,15})\(\{/.test(str);
        }else{
            return false;
        }
    };

    var timeout = '';
    var change = function(){
        clearTimeout(timeout);

        timeout = setTimeout(function(){
            var text = $('#jsoninput').val().trim();
            var jsonpHandler = '';

            if(!text){
                $('#viewer').text('{"example":"hello word"}');
                return false;
            }


            //判断是不是jsonp
            if(isJSONP(text)){
                var m = text.match(/^([^\(\{}]{1,15})\(\{/);
                jsonpHandler = m[1];

                text = text.replace(/^([^\(\{}]{1,15}\()(\{)/,'$2').replace(/\)$/,'');
            }

            try {
                $('#viewer').JSONView(text,undefined,jsonpHandler);
            }catch (e){
                $('#viewer').html("<div class='errTip'>json格式错误,必须使用严格模式<br/><br/>常见错误模式 {name:1} 字段名称要使用双引号<br/>{'name':1} 字段名称要使用双引号<br/>{\"name\":'fudongguang'} 值为字符串时要使用双引号</div>");
            }
        },1000)
    };

    $('#jsoninput').on('keydown',change).on('mouseup',change).on('paste',change);
}());

