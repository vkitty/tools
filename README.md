#api-center教程


####测试地址：http://apicenter.daily.vdian.net/

##解决的问题
1. 接口系统化，解决接口难以管理及查找问题
2. 接口注释问题
3. 前后端分离后，前后端命名不一致、开发时间不同步
4. 数据模拟系统
5. chrome插件解决模拟接口与日常接口不一致问题
6. 请求数据schema认证

##项目管理
1. 增加项目
2. 项目列表
3. 编辑权限（所有的权限错误都是因为这里没有设置权限）

##接口列表
1. 增加接口
	* 只有给有权限的项目增加接口
	* 权限一旦设置并且详情记录，该接口的所属类目就不能修改。
2. 详情
	* 设置请求参数、相应数据格式（即schema）
	* 没有权限的用户能预览，有权限的用户可以修改该接口数据类型并且可以备注， get数据、post数据、响应数据必须是json格式（[严格模式](#JSON严格模式)），否者无法提交。
	* get接口只能设置get、response schema，post接口可以设置get、post、response schema
3. mock
	* 点击上<img src="http://wd.geilicdn.com/0b4b3498363c0301994e7e526af51a51.png"/>增加模拟数据
	* 模拟数据必须严格遵守接口详情schema，来设置数据，否者无法保存数据
	* mock数据必须使用json的严格模式编辑，否者无法提交。
3. 请求：会进行数据模拟，需要使用插件[插件使用](#插件使用)


<h3 id="JSON严格模式">JSON严格模式</h3>
 * 正常数据 {"name":1} {"name":"fudongguang"}
 * 常见错误模式 {name:1} {'name':1} {"name":'fudongguang'}


<h3 id="插件使用">插件使用</h3>
* <img src="http://wd.geilicdn.com/a76335bed9ba977d41e1b9dbe7536855.png"/>

 * 被替换的host：需要代理的接口主机，不要使用path、端口及参数
 * 替换的host：使用建议值(apicenter.daily.vdian.net/mock)
 * 点击开始才能立即使用
 * <a href="https://chrome.google.com/webstore/detail/koibcpgibjlkbgfknnjafadfoedljapp/publish-accepted">下载地址</a>
