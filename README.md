Strongerbone
============

// # S.View 类 #
// # Strongerbone View #
// 扩展了 Backbone.View 的一些基本功能。
//
// ## 主要特性 ##
// 1. 渲染的时候自动使用模板引擎渲染。
// 2. model 改变，视图自动更新。
// 3. 添加 appendTo 配置项，可以指定要添加到哪个 Dom 下面。
// 4. 增加子类可以定义并在 afterRender 方法中进行 Dom 操作。
//
// ## 示例： ##
//
// ### 初始 html 页面 ###
// `<div id="header"></div>`
//
// ### js 脚本 ###
// var MyView = S.View.extend({
//    appendTo: '#header',
//    template: '<div>{{= it.name}}</div>',
// });
// var myView = new MyView({data: {name: "weilao"}});
// myView.render();
//
// ### 渲染结果 ###
// `<div id="header"><div>weilao</div></div>`
