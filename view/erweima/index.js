;(function(){

    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }



    function mix(target, source) {
        var tempSource = source,k;
        for (k in tempSource) {
            if (target.hasOwnProperty(k) && tempSource.hasOwnProperty(k) && tempSource[k]) {
                target[k] = tempSource[k];
            }
        }
        tempSource = null;
    }

    function createCanvas(config) {
        var tempConfig = {
            text: '',
            width:  260,
            height: 260
        };


        mix(tempConfig, config);

        //判断是否有汉字
        if(/[\u4E00-\u9FA5]/.test(tempConfig.text)){
            tempConfig.text=utf16to8(tempConfig.text);
        }

        var tempDiv = document.createElement('div');
        tempDiv.className="text-center";

        $(tempDiv).qrcode(tempConfig);
        $('#viewer').html(tempDiv);
    }



    var timeout = '';
    var change = function(){
        clearTimeout(timeout);

        timeout = setTimeout(function(){
            var text = $('#erweimainput').val().trim();
            if(!text){
                $('#viewer').text('http://qianniuhua.me');
                return false;
            }

            createCanvas({text:text,width:260,height:260});

        },1000)
    };

    $('#erweimainput').on('keydown',change).on('mouseup',change).on('paste',change);
}());

