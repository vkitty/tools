(function(){
    var row = JSON.parse(decodeURIComponent(_g.history));

    row.response && $('#viewContent').JSONView(row.response);
    row.query && $('#viewQuery').JSONView(row.query);
    row.post && $('#viewPost').JSONView(row.post);


    var setRemark = function(remarkData,viewId){
        remarkData = JSON.parse(remarkData);
        $(viewId+' .J_view-remark').each(function(){
            var key = $(this).data('key');
            if(remarkData[key]){
                $(this).html('//'+remarkData[key])
            }
        });

        $(viewId+' .J_view-remark').each(function () {
            var keyArr = $(this).parents('.collapsible').map(function () {
                var dataKey = $(this).next('.J_view-remark').data('key');

                if ($(this).hasClass('array') && dataKey) {
                    return dataKey + '.0.';
                } else if ($(this).hasClass('obj') && dataKey) {
                    return dataKey + '.'
                }
            });

            var keystr = '';
            for (var i = keyArr.length - 1; i >= 0; i--) {
                keystr += keyArr[i];
            }

            keystr += $(this).data('key');

            if (remarkData[keystr]) {
                $(this).html('//' + remarkData[keystr])
            }
        })
    };


    row.response_remark && setRemark(row.response_remark, '#viewContent');
    row.query_remark && setRemark(row.query_remark, '#viewQuery');
    row.post_remark && setRemark(row.post_remark, '#viewPost');
}());

