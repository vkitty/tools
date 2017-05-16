;(function () {
    $('.J_base64').click(function () {
        var type = $(this).data('type'),
            content = $('#base64input').val().trim();

        if(!content){
            $('#viewer').text('');
            return false;
        }

        Data.base64.encode(type,content, function (res) {
            $('#viewer').text(res);
        })
    })
}());

