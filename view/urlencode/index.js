;(function () {
    $('.J_urlencodeinput').click(function () {
        var type = $(this).data('type'),
            content = $('#urlencodeinput').val().trim();

        if(!content){
            $('#viewer').text('hello word');
            return false;
        }

        if(type===1){
            $('#viewer').text(encodeURIComponent(content))
        }else{
            $('#viewer').text(decodeURIComponent(content))
        }
    })
}());

