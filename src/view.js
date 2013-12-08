// # Strongerbone View #
// author: weilao
// @ https://github.com/weilao
(function (_window) {
    // 缓存节约模板编译时间。
    var _compiledTplCache = [];
    var S = _window.S = _window.S || {};

    S.View = Backbone.View.extend({
        // 视图模板
        template: '',
        // 可以选择 model 作为数据源，也可以选择 data 。
        // `如果都给的话，则只取 model ，但最好别这么做。`
        model: null,
        data: {},
        hidden: false,

        constructor: function (opts) {
            opts = opts || {};
            this.template = opts.template || this.template || '';
            this.model = opts.model || this.model || null;
            this.data = opts.data || this.data || {};
            this.hidden = opts.hidden || this.hidden || false;

            if (this.model) {
                this.data = this.model.attributes;
            } else {
                this.data = _.result(this, 'data');
                this.model = new Backbone.Model(this.data);
            }

            // 自动随 model 变化更新视图
            this.model.on('change', this.render, this);
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

        render: function () {
            _.result(this.beforeRender);
            this.trigger('beforeRender');

            var template, compiledTpl, html,
                $el = this.$el;

            template = this.getTemplate();
            compiledTpl = this.compileTemplate(template);
            html = this.applyTemplate(compiledTpl, this.model);
            $el.html(html);
            this.hidden && $el.hide();

            _.result(this.afterRender);
            this.trigger('afterRender');
            return this;
        },
        
        find: function (selector) {return this.$el.find(selector);},
        show: function () {this.$el.show();},
        hide: function () {this.$el.hide();}
    });
})(window);
