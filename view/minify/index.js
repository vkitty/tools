;(function () {
    $('.J_minify').click(function () {
        var type = $(this).data('type'),
            content = $('#minifyinput').val().trim();

        if(!content){
            $('#viewer').html('function test(text){test(text)};<br/>text("hello word");');
            return false;
        }

        Data.minify.encode(type,content, function (res) {
            $('#viewer').text(res);
        })
    })
}());

