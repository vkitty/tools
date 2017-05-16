;(function () {
    var timeout = '';
    var change = function(){
        clearTimeout(timeout);

        timeout = setTimeout(function(){
            var text = $('#md5input').val().trim();

            if(!text){
                $('#viewer').text('hello word');
                return false;
            }

            Data.md5.encode(text,function(res){
                $('#viewer').text(res);
            })
        },1000)
    };

    $('#md5input').on('keydown',change).on('mouseup',change).on('paste',change);

}());

