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
(function (_window) {
    // 缓存节约模板编译时间。
    var _compiledTplCache = [];
    var S = _window.S = _window.S || {};

    S.View = Backbone.View.extend({
        // 视图模板
        template: '',
        // 指定 view 渲染完毕后要添加到哪个页面元素中。
        appendTo: '',
        // 可以选择 model 作为数据源，也可以选择 data 。
        // `如果都给的话，则只取 model ，但最好别这么做。`
        model: null,
        data: {},
        hidden: false,

        constructor: function (opts) {
            // opts.appendTo 和 this.appendTo 的差异
            // -------------------
            // XXView = BaseView.extend({
            //     appendTo: '#login' // 这里给出了 this.appendTo
            // });
            // new XXView({
            //     appendTo: 'body'  // 这里给出了 opts.appendTo
            // });
            //
            // 总结
            // -------------------
            // this.xx 是在定义视图类的时候给的
            // opts.xx 是在实例化的时候给的
            opts = opts || {};
            this.template = opts.template || this.template || '';
            this.model = opts.model || this.model || null;
            this.data = opts.data || this.data || {};
            this.hidden = opts.hidden || this.hidden || false;
            this.appendTo = opts.appendTo || this.appendTo || '';

            if (this.model) {
                this.data = this.model.attributes;
            } else {
                this.data = _.result(this, 'data');
                this.model = new Backbone.Model(this.data);
            }

            // 自动随 model 变化更新视图
            this.model.on('change', this.render, this);
            // appendToParent 只执行一次
            this.appendToParent = _.once(this.appendToParent);
            return Backbone.View.apply(this, arguments);
        },

        // 如果 templateUrl 给定，则从给定的 url 获取模板
        getTemplate: function () {
            return this.template
                || this.syncGetTemplate(this.templateUrl)
                || '';
        },

        syncGetTemplate: function (templateUrl) {
            return templateUrl && $.ajax({
                url: templateUrl,
                async: false
            }).responseText;
        },

        applyTemplate: function (compiledTpl, model) {
            return compiledTpl(model.toJSON());
        },

        compileTemplate: function (template) {
            return _compiledTplCache[template]
                || (_compiledTplCache[template] = _.template(template));
        },

        appendToParent: function () {
            if (!this.appendTo) return;

            var $parent = this.appendTo.append ?
                this.appendTo : $(this.appendTo);
            $parent.append(this.$el);
        },

        renderDom: function () {
            var template, compiledTpl, html,
                $el = this.$el;

            template = this.getTemplate();
            compiledTpl = this.compileTemplate(template);
            html = this.applyTemplate(compiledTpl, this.model);
            $el.html(html);
            this.hidden && $el.hide();
        },

        render: function () {
            _.result(this.beforeRender);
            this.trigger('beforeRender');

            this.renderDom();
            this.appendToParent();

            _.result(this.afterRender);
            this.trigger('afterRender');
            return this;
        },
        find: function (selector) {return this.$el.find(selector);},
        show: function () {this.$el.show();},
        hide: function () {this.$el.hide();}
    });
})(window);
