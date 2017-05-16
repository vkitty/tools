;(function () {
    $('.J_ico').click(function () {
        var type = $(this).data('type'),
            content = $('#icoinput').val().trim();

        if(!content){
            $('#viewer').text('');
            return false;
        }

        Data.ico.encode(type,content, function (res) {
            $('#viewer').text(res);
        })
    })
}());

