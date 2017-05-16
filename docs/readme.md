启动 supervisor production.js
supervisor --debug -e .html,.js,.less  -i node_modules,docs,log,static production.js
http://localhost:8080/

node --debug  production.js
node-inspector &


线上地址:
http://apicenter.daily.vdian.net/  (10.1.100.243:/home/www/api-center)



//代码规范
var m_api_history = M('api_history'); //注意是单例,不要一直使用
var apiHistoryRows = M('api_history').getAll();
var apiHistoryRow = M('api_history').getById(1);
