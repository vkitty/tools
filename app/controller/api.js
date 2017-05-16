'use strict';
var Base = require('./base.js');
var pageSize = 20;


module.exports = class Index extends Base {
    constructor() {
        super();
    }

    /**
     * 列表页
     */
    * indexAction() {
        yield  this.init();

        //搜索
        var keyword = this.query.search_keyword,
            app_id = Number(this.query.search_app_id),
            page = this.query.page || 1,
            m_api_url = M('api_url');

        var where = ' 1=1 ';
        if(keyword){
            keyword = decodeURIComponent(keyword);
            where += " and (`api_url`.`url` like '%"+keyword+"%' or `api_url`.`desc` like '%"+keyword+"%')";
        }
        if(app_id){
            where += ' and `app_id`='+app_id;
        }

        var apiUrlRows =yield m_api_url.where(where)
            .field('api_url.id','api_url.creater','api_url.url','api_url.https','api_url.method','api_url.desc','api_url.create_time','api_url.app_id',['app.name',true,'APP_name'])
            .page(page,pageSize)
            .join(' left join app on `app`.`id`=`api_url`.`app_id`')
            .order(['id','DESC'])
            .select();


        //权限验证
        for(var i=0;i<apiUrlRows.length;i++){
            apiUrlRows[i].checkPower=yield this.checkPower(apiUrlRows[i].app_id);
        }

        var total = yield M('api_url').count().select();

        this.assign('apiUrlRows',apiUrlRows);
        this.assign('startItem',(page-1)*pageSize);


        this.assign('totalPages',this.getTotalPage(total,pageSize));
        this.assign('currentPage',page);
        this.display();
    }

    /**
     * 修改页
     */
    * editAction(){
        yield this.init();

        var m_api_history = M('api_history'),
            id = this.query.id;

        //如果已经有记录,禁止修改项目信息
        var count = yield m_api_history.count().where({api_url_id:id}).select();
        var appRows = yield M('app').select();

        this.assign('apps',appRows);

        var apiUrlRow = yield M('api_url').where({id:id}).find();

        this.assign('row',apiUrlRow);
        this.assign('hasHistory',count);

        this.display()
    }

    /**
     * 修改后上传页面
     * @returns {boolean}
     */
    * editsubmitAction(){
        yield  this.init();

        var id = Number(this.query.id);
        var post = yield this.post();

        //如果已经存在记录,只能修改接口描述
        var count = yield M('api_history').count().where({api_url_id:id}).select();

        if(post['url']){
            post['url'] = post['url'].trim().replace('http://','').replace('https://','');
        }

        if(count && post['app_id']){
            this.responseFailMsg(1,'已经有记录存在,无法修改类目','/public/msg/error');
            return false;
        }

        var apiUrlRow = yield M('api_url').where({id:id}).find();

        //判断权限
        var checkPower = yield this.checkPower(apiUrlRow.app_id);
        if(!checkPower){
            this.responseFailMsg(1,'你没有权限操作该项目','/public/msg/error');
            return false;
        }


        if(post['url']){
            apiUrlRow = yield M('api_url').where({url:post['url']}).find();
            if(apiUrlRow && apiUrlRow.id!==id){
                this.responseFailMsg(1,'已经有这条url','/public/msg/error');
                return false;
            }
        }


        yield  M('api_url').where({id:id}).update({desc:post['desc'],method:post['method'],https:post['https'],url:post['url']});
        this.redirectByMsg(decodeURIComponent(this.cookies.get('lastHref')));
    }

    /**
     * 增加api_url
     */
    * addAction(){
        yield this.init();

        var appRows = yield M('app').select();
        this.assign('apps',appRows);

        this.assign('row',{});
        this.assign('hasHistory',0);
        this.display("api/edit");
    }

    /**
     * 增加api_url后提交
     * @returns {boolean}
     */
    * addsubmitAction(){
        yield  this.init();

        var data = yield this.post();
        data['creater'] = this.getUserName();
        data['url'] = data['url'].trim().replace('http://','').replace('https://','');

        if(!data.url){
            this.redirectByMsg(decodeURIComponent(this.cookies.get('lastHref')));
            return false;
        }

        //判断权限
        var checkPower = yield this.checkPower(data.app_id);
        if(!checkPower){
            this.responseFailMsg(1,'你没有权限操作该项目','/public/msg/error');
            return false;
        }


        var count = yield M('api_url').count().where({url:data.url}).select();
        if(count){
            this.responseFailMsg(1,'已经有这条url','/public/msg/error');
            return false;
        }

        yield M('api_url').insert(data);
        this.redirectByMsg('/api');
    }

    /**
     * 删除页面
     */
    * delAction(){
        yield  this.init();

        //判断权限
        var apiUrlRow = yield M('api_url').where({id:this.query.id}).find();
        var checkPower = yield this.checkPower(apiUrlRow.app_id);
        if(!checkPower){
            this.responseFailMsg(1,'你没有权限操作该项目','/public/msg/error');
            return false;
        }

        yield M('api_url').where({id:this.query.id}).delete();
        this.redirectByMsg(decodeURIComponent(this.cookies.get('lastHref')));
    }

    /**
     * 详情页面
     */
    * detailAction(){
        yield this.init();

        var id = this.query.id;
        var history = yield M('api_history').where({api_url_id:id}).order(['id','DESC']).find();

        this.assign('id',id);
        this.assign('history',history?encodeURIComponent(JSON.stringify(history)) : '');

        var apiUrlRow = yield M('api_url').where({id:id}).find();

        if(apiUrlRow && apiUrlRow.desc){
            apiUrlRow.desc = apiUrlRow.desc.replace(/\n/g,'<br/>');
        }

        apiUrlRow.checkPower = yield this.checkPower(apiUrlRow['app_id']);

        this.assign('urlRow',apiUrlRow);
        this.display();
    }

    /**
     * 编辑参数
     */
    * editparamAction(){
        yield this.init();

        var id = this.query.id,
            type = this.query.type || 'response';

        var history = yield M('api_history').where({api_url_id:id}).order(['id','DESC']).find();

        var row ='{}',
            historyResponse = '""',
            historyRemark ='""';
        if(history){
            row = history;
            historyRemark = row[type+'_remark'] || '""';
            historyResponse = row[type] || '""';
        }

        this.assign('history',row);
        this.assign('historyResponse',encodeURIComponent(historyResponse));
        this.assign('historyRemark',encodeURIComponent(historyRemark));
        this.assign('id',encodeURIComponent(id));

        var typeDiff={
            query:{
                cn:'get数据'
            },
            post:{
                cn:'post数据'
            },
            response:{
                cn:'响应'
            }
        };

        this.assign('diff',typeDiff[type]);
        this.assign('type',type);

        this.display();
    }


    /**
     * 编辑参数后提交
     * @returns {boolean}
     */
    * editparamSubmitAction(){
        yield  this.init();

        var post = yield this.post(),
            id = this.query.id,
            type = this.query.type,
            data = {};

        var history = yield M('api_history').where({api_url_id:id}).order(['id','DESC']).find();
        history = history || {};

        data['response'] = history.response || '';
        data['response_remark'] = history.response_remark || '';
        data['query'] = history.query;
        data['query_remark'] = history.query_remark || '';
        data['post'] = history.post;
        data['post_remark'] = history.post_remark || '';

        var param = JSON.parse(post.param);

        data[type] = param.response;
        data[type+'_remark'] = param.remark;
        data.api_url_id = id;


        var apiUrlRow = yield M('api_url').where({id:id}).find();

        var checkPower = yield this.checkPower(apiUrlRow.app_id);
        if(!checkPower){
            this.responseFailMsg(1,'你没有权限操作','/public/msg/error');
            return false;
        }

        data.api_url=apiUrlRow.url;
        data.modifier = this.getUserName();

        yield M('api_history').insert(data);

        //最多保存30条记录,多余的删除
        var count = yield M('api_history').count().where({api_url_id:id}).select();
        if(count && count>30){
            yield M('api_history').where({api_url_id:id}).order('id').limit(1).delete();
        }

        this.redirectByMsg(decodeURIComponent(this.cookies.get('lastHref')));
    }
};