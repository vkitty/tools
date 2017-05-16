;(function(){
    $('.J_del').click(function(){
        return confirm('确定要删除吗?');
    });

    /*记住最后点击 回跳使用*/
    $('body').on('click','.J_lastHref',function(){
        Kub.cookie('lastHref',window.location.href);
    });
}());